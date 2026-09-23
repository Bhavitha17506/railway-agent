from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from .models import User, UserRole
from .serializers import UserSerializer, UserCreateUpdateSerializer, LoginSerializer
from .permissions import IsAdminUserRole

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)
        if not user:
            # Try searching by email as fallback
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            return Response(
                {"detail": "Invalid credentials. Please verify your username/email and password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"detail": "This account is inactive. Contact your railway administrator."},
                status=status.HTTP_403_FORBIDDEN
            )

        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)

        return Response({
            "token": token.key,
            "user": UserSerializer(user).data,
            "message": f"Welcome back, {user.get_full_name() or user.username}."
        })

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        logout(request)
        return Response({"detail": "Successfully logged out."})

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MePermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "role": request.user.role,
            "role_display": request.user.get_role_display(),
            "is_admin": request.user.is_admin_role(),
            "is_engineer": request.user.is_engineer_role(),
            "is_inspector": request.user.is_inspector_role(),
            "is_maintenance": request.user.is_maintenance_role(),
            "permissions": request.user.get_permissions_list()
        })

class MeAssignedSectionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from core.models import TrackSection
        from core.serializers import TrackSectionSerializer

        if request.user.is_admin_role() or request.user.is_superuser:
            sections = TrackSection.objects.all().order_by('section_code')
        else:
            sections = request.user.assigned_sections.all().order_by('section_code')
            if not sections.exists():
                # Default fallback assignment to top priority sections for demo
                sections = TrackSection.objects.filter(section_code__in=['TRK-014', 'TRK-007', 'TRK-021'])

        return Response(TrackSectionSerializer(sections, many=True).data)

class MeDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from core.views import DashboardOverviewView
        # Returns role-contextualized dashboard payload
        return DashboardOverviewView().get(request)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = [IsAdminUserRole]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserSerializer

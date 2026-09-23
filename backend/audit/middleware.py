class AuditLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Log critical modifying endpoints
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE'] and request.path.startswith('/api/'):
            try:
                from .models import AuditLog
                user = request.user if request.user.is_authenticated else None
                ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '127.0.0.1'))
                if ',' in ip:
                    ip = ip.split(',')[0].strip()

                action = f"{request.method}_{request.path.strip('/').replace('/', '_')}"
                # Keep audit non-blocking and safe
                AuditLog.objects.create(
                    user=user,
                    action=action[:100],
                    ip_address=ip[:50],
                    details={"status_code": response.status_code, "path": request.path}
                )
            except Exception:
                pass
        return response

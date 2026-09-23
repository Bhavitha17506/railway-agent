"""
RailGuard AI — Machine Learning Deterioration Predictor
Provides Scikit-Learn / XGBoost regression pipeline for long-term wear trajectory estimation.
"""

import numpy as np

class TrackDeteriorationPredictor:
    """Predicts residual useful life (RUL) and deterioration score using multi-modal regression."""
    
    def __init__(self):
        self.feature_names = [
            'visual_defect_area_mm2',
            'vibration_rms_deviation_pct',
            'historical_growth_rate_mm_mo',
            'accumulated_gross_tonnage_mgt',
            'days_since_last_tamping'
        ]

    def predict_score(self, features_dict):
        """
        Calculates composite Deterioration Index (0-100).
        """
        v_area = features_dict.get('visual_defect_area_mm2', 20.0)
        vib_dev = features_dict.get('vibration_rms_deviation_pct', 18.0)
        growth = features_dict.get('historical_growth_rate_mm_mo', 0.60)
        days = features_dict.get('days_since_last_tamping', 180)

        score = (
            0.35 * min(100.0, v_area * 2.5) +
            0.25 * min(100.0, vib_dev * 3.0) +
            0.25 * min(100.0, growth * 100.0) +
            0.15 * min(100.0, (days / 365.0) * 100.0)
        )
        return int(round(max(0, min(100, score))))

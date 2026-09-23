import React, { useState, useEffect } from 'react';
import { History, TrendingUp, Calendar, ArrowRight, Filter } from 'lucide-react';
import { HistoricalComparison } from '../components/HistoricalComparison';
import { LoadingState } from '../components/ReviewModal';
import { inspectionService } from '../services/inspectionService';

export const HistoricalRecords = () => {
  const [comparisons, setComparisons] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('TRK-014');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [compData, recData] = await Promise.all([
          inspectionService.getHistoricalComparisons(),
          inspectionService.getHistoricalRecords()
        ]);
        setComparisons(compData);
        setRecords(recData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) return <LoadingState message="Querying historical deterioration database..." />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Historical Defect & Wear Progression Records
        </h2>
        <p className="text-xs text-slate-500">
          Longitudinal analysis comparing current and prior inspection scans to track crack velocity and deterioration rates
        </p>
      </div>

      {/* Interactive Side-by-Side Split Image Comparison */}
      <div>
        <HistoricalComparison
          trackSection={selectedSection}
          previousDate="2026-03-20"
          currentDate="2026-09-18"
          previousMetric="4.2 mm"
          currentMetric="7.8 mm"
          deltaPct={85.7}
          metricName="Crack Length"
          anomalyType="Surface Crack"
        />
      </div>

      {/* Historical Inspection Progression Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Historical Inspection Log Timeline
          </h3>
          <span className="text-xs font-mono text-slate-500">
            UIC 60 Calibrated Profilometry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Corridor</th>
                <th className="py-2.5 px-3">Recorded Date</th>
                <th className="py-2.5 px-3">Anomaly Category</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Dimension Metric</th>
                <th className="py-2.5 px-3">Measured Value</th>
                <th className="py-2.5 px-3">Deterioration Index</th>
                <th className="py-2.5 px-3 text-right">Engineer Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{rec.track_section_code}</td>
                  <td className="py-3 px-3 text-slate-600">{rec.recorded_date}</td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-800">{rec.anomaly_category}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {rec.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-600">{rec.metric_name}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{rec.measured_value_mm} mm</td>
                  <td className="py-3 px-3 font-bold text-[#14532D]">{rec.deterioration_index_at_time}/100</td>
                  <td className="py-3 px-3 text-right font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      ✓ {rec.engineer_decision || 'CONFIRMED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

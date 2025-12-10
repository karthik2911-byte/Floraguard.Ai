import React from 'react';
import { AnalysisResult, Severity } from '../types';
import { HeatmapImage } from './HeatmapImage';
import { AlertTriangle, CheckCircle, Droplet, Thermometer, Activity, Leaf } from 'lucide-react';
import { clsx } from 'clsx';

interface AnalysisViewProps {
  result: AnalysisResult;
  imageUri: string;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, imageUri, onReset }) => {
  const isHealthy = result.isHealthy;
  
  const getSeverityBadge = (sev: Severity) => {
    const styles = {
      [Severity.HIGH]: "bg-red-100 text-red-700 border-red-200",
      [Severity.MEDIUM]: "bg-orange-100 text-orange-700 border-orange-200",
      [Severity.LOW]: "bg-yellow-100 text-yellow-700 border-yellow-200",
      [Severity.NONE]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return styles[sev];
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 animate-fade-in">
      
      {/* Header Info */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{result.plantName}</h2>
        <div className="flex items-center gap-2 mt-2">
          {isHealthy ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle size={16} /> Healthy
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
              <AlertTriangle size={16} /> Diseased
            </span>
          )}
          <span className="text-sm text-gray-500">
            Confidence: {Math.round(result.confidence)}%
          </span>
        </div>
      </div>

      {/* Main Visual */}
      <div className="mb-6">
        <HeatmapImage 
          imageUri={imageUri} 
          regions={result.regions} 
          severity={result.severity} 
        />
        <p className="text-xs text-center text-gray-400 mt-2">
          AI Attention Heatmap (Simulated)
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Severity</div>
           <div className={clsx("inline-block px-2 py-0.5 rounded text-sm font-bold border", getSeverityBadge(result.severity))}>
             {result.severity}
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Issue</div>
           <div className="text-sm font-bold text-gray-800 truncate">
             {result.diseaseName || "None"}
           </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={18} className="text-emerald-600" />
            Diagnosis
          </h3>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            {result.description}
          </p>
        </div>

        {!isHealthy && result.treatment && result.treatment.length > 0 && (
          <div className="p-5 bg-emerald-50/50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Leaf size={18} className="text-emerald-600" />
              Recommended Treatment
            </h3>
            <ul className="space-y-3">
              {result.treatment.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="h-10"></div> {/* Spacer */}
    </div>
  );
};

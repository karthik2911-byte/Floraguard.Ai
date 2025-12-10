import React, { useState, useRef, useEffect } from 'react';
import { DiseaseRegion } from '../types';
import { Eye, EyeOff } from 'lucide-react';

interface HeatmapImageProps {
  imageUri: string;
  regions: DiseaseRegion[];
  severity: string;
}

export const HeatmapImage: React.FC<HeatmapImageProps> = ({ imageUri, regions, severity }) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine heatmap color based on severity
  const getSeverityColor = () => {
    switch (severity) {
      case 'HIGH': return 'rgba(239, 68, 68, 0.6)'; // Red
      case 'MEDIUM': return 'rgba(249, 115, 22, 0.6)'; // Orange
      case 'LOW': return 'rgba(234, 179, 8, 0.6)'; // Yellow
      case 'NONE': return 'rgba(34, 197, 94, 0.4)'; // Green (for healthy focus)
      default: return 'rgba(239, 68, 68, 0.6)';
    }
  };

  const color = getSeverityColor();

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-md group select-none">
      <img 
        src={imageUri} 
        alt="Analyzed Plant" 
        className="w-full h-auto object-cover block"
      />
      
      {/* Heatmap Overlay Layer */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-in-out">
          {regions.map((region, idx) => {
            // Convert 0-1000 scale to percentages
            const top = region.ymin / 10;
            const left = region.xmin / 10;
            const width = (region.xmax - region.xmin) / 10;
            const height = (region.ymax - region.ymin) / 10;
            
            // Calculate center for radial gradient
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            return (
              <div
                key={idx}
                className="absolute"
                style={{
                  top: `${centerY}%`,
                  left: `${centerX}%`,
                  width: `${Math.max(width, height) * 1.5}%`, // Make the glow slightly larger than the box
                  height: `${Math.max(width, height) * 1.5}%`, 
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
                  filter: 'blur(8px)',
                  mixBlendMode: 'hard-light' // Gives it that "heat" look on top of the image
                }}
              />
            );
          })}
           {/* Stroke Overlay for clearer definition (optional, keeping it subtle) */}
           {regions.map((region, idx) => {
             const top = region.ymin / 10;
             const left = region.xmin / 10;
             const width = (region.xmax - region.xmin) / 10;
             const height = (region.ymax - region.ymin) / 10;
             return (
               <div
                  key={`border-${idx}`}
                  className="absolute border border-white/30 rounded-lg"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                  }}
               />
             )
           })}
        </div>
      )}

      {/* Toggle Control */}
      <button
        onClick={() => setShowHeatmap(!showHeatmap)}
        className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all"
      >
        {showHeatmap ? <><EyeOff size={14}/> Hide AI Focus</> : <><Eye size={14}/> Show AI Focus</>}
      </button>
    </div>
  );
};

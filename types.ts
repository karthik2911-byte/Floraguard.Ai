export interface DiseaseRegion {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  NONE = 'NONE'
}

export interface AnalysisResult {
  plantName: string;
  isHealthy: boolean;
  diseaseName: string | null;
  severity: Severity;
  confidence: number;
  description: string;
  treatment: string[];
  regions: DiseaseRegion[];
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  result: AnalysisResult | null;
  error: string | null;
  imageUri: string | null;
}

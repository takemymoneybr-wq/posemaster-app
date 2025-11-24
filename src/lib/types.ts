// PoseMaster Types

export type ReproductionType = 'pose' | 'scenario' | 'both';

export interface ReferencePhoto {
  id: string;
  url: string;
  thumbnail: string;
  uploadedAt: Date;
}

export interface AnalysisProgress {
  stage: 'uploading' | 'analyzing' | 'processing' | 'complete';
  progress: number;
  message: string;
}

export interface CameraOverlay {
  type: 'silhouette' | 'grid' | 'lines';
  opacity: number;
  enabled: boolean;
}

export interface FeedbackMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

export interface ComparisonResult {
  originalUrl: string;
  capturedUrl: string;
  similarity: number;
  feedback: string[];
}

export interface UserCreation {
  id: string;
  userId: string;
  referencePhoto: string;
  resultPhoto: string;
  reproductionType: ReproductionType;
  score: number;
  likes: number;
  comments: number;
  createdAt: Date;
}

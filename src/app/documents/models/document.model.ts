export interface Document {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: number; // User ID
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
} 
export type DiscriminationType = 'racial' | 'religious' | 'gender' | 'disability' | 'age' | 'other';

export type ReportLocation = {
  postcode?: string;
  suburb?: string;
  state?: string;
  country: string;
};

export type IncidentReport = {
  id?: string;
  type: 'personal' | 'witnessed';
  discriminationType: DiscriminationType[];
  location: ReportLocation;
  hasWitnesses: boolean;
  frequency: 'onetime' | 'multiple' | 'ongoing';
  duration?: string;
  year: number;
  perpetratorCount: number;
  perpetratorType: string;
  reportedTo: string[];
  emotionalImpact: string;
  actionsToken: string[];
  supportNeeded: string;
  timestamp: Date;
};

export type VoiceRecordingState = {
  isRecording: boolean;
  audioUrl: string | null;
  duration: number;
  error: string | null;
};

export type UserConsent = {
  anonymousDataUse: boolean;
  trendSharing: boolean;
  timestamp: Date;
};
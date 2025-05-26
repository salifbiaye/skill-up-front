export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string; // LocalDateTime from backend
  progress: number;
  total: number;
}

export interface TaskI {
    id: number;
    title: string;
    description: string;
    priority: "high" | "medium" | "low" | 'none';
    completed: boolean;
  }
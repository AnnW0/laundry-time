
export type MachineType = 'washer' | 'dryer';

export type MachineStatus = 'running' | 'done' | 'available';

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
  status: MachineStatus;
  timeRemaining?: number; // time in minutes, undefined if status is 'available'
  timeRemainingSeconds?: number; // time in seconds for smoother progress bar
  hallId: string;
}

export interface Hall {
  id: string;
  name: string;
  isStarred: boolean;
  machines: Machine[];
}

export type SortOption = 'default' | 'available-first' | 'washer-first' | 'dryer-first';

export interface NotificationPermission {
  granted: boolean;
  lastRequested?: Date;
}

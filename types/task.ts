/**
 * Represents a task in the Tascheged system.
 */
export type Task = {
  /** Unique identifier for the task */
  id: string;

  /** Title of the task */
  title: string;

  /** Detailed description of the task */
  description: string;

  /** Name of the icon representing the task */
  iconName: string;

  /**
   * Sound associated with the task, if any.
   * This is typically the filename (without extension) of the sound file.
   */
  soundUrl: string | null;

  /** Monetary value awarded for completing the task */
  payoutValue: number;

  /** Indicates whether the task is currently active */
  isActive: boolean;

  /** Date and time when the task was created */
  createdAt: Date;

  /** Date and time when the task was last updated */
  updatedAt: Date;
};

/**
 * Represents a completed task in the Tascheged system.
 */
export type CompletedTask = Task & {
  /** ID of the user who completed the task */
  userId: string;

  /** Name of the user who completed the task */
  userName: string;

  /** Icon of the user who completed the task */
  userIcon: string;

  /** Date and time when the task was completed */
  completedAt: Date;

  /** Current status of the completed task */
  status: 'pending' | 'approved' | 'rejected';
};

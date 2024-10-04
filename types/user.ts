/**
 * Represents a user in the Tascheged system.
 */
export type User = {
  /** Unique identifier for the user */
  id: string;

  /** User's display name */
  name: string;

  /** Name of the icon representing the user */
  icon: string;

  /**
   * Sound associated with the user, if any.
   * This is typically the filename (without extension) of the sound file.
   */
  sound: string | null;

  /** User's birthday in ISO date format (YYYY-MM-DD) */
  birthday: string;

  /** User's role in the system */
  role: 'parent' | 'child';
};

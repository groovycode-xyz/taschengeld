/**
 * Represents a user in the Tascheged system.
 */
export interface User {
  /** Unique identifier for the user */
  user_id: number;

  /** User's display name */
  name: string;

  /** Name of the icon representing the user */
  icon: string;

  /** Sound URL associated with the user */
  sound_url: string | null;

  /** User's birthday in YYYY-MM-DD format */
  birthday: string;

  /** ID of the user's piggy bank account */
  piggybank_account_id: number | null;

  /** When the user was created */
  created_at: string;
}

export type CreateUserInput = Omit<User, 'user_id' | 'piggybank_account_id' | 'created_at'>;

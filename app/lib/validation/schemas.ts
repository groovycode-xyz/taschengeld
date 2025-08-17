import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  icon: z.string().min(1, 'Icon is required'),
  sound_url: z.string().nullable().default(null),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format'),
});

export const updateUserSchema = createUserSchema.partial();

// Task schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional().nullable(),
  icon_name: z.string().optional().nullable(),
  payout_value: z
    .number()
    .min(0, 'Payout value must be 0 or greater')
    .max(1000, 'Payout value must be less than 1000'),
  sound_url: z
    .string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional(),
  is_active: z.boolean().optional().default(true),
});

export const updateTaskSchema = createTaskSchema.partial();

// Completed task schemas
export const completeTaskSchema = z.object({
  user_id: z.number().int('User ID must be an integer').positive('User ID must be positive'),
  task_id: z.number().int('Task ID must be an integer').positive('Task ID must be positive'),
});

export const updateCompletedTaskSchema = z.object({
  payment_status: z.enum(['Paid', 'Unpaid'], {
    errorMap: () => ({ message: 'Payment status must be either Paid or Unpaid' }),
  }),
  custom_payout_value: z
    .number()
    .min(0, 'Custom payout value must be 0 or greater')
    .max(1000, 'Custom payout value must be less than 1000')
    .optional(),
});

// Transaction schemas
export const createTransactionSchema = z.object({
  user_id: z.number().int('User ID must be an integer').positive('User ID must be positive'),
  amount: z.number().finite('Amount must be a finite number'),
  transaction_type: z.enum(['payday', 'withdrawal', 'deposit'], {
    errorMap: () => ({ message: 'Invalid transaction type' }),
  }),
  description: z.string().optional().nullable(),
});

// Settings schemas
export const updateSettingsSchema = z.object({
  setting_key: z.string().min(1, 'Setting key is required'),
  setting_value: z.string().nullable(),
});

export const updateLanguageSchema = z.object({
  language: z.enum(['en', 'de'], {
    errorMap: () => ({ message: 'Language must be either en or de' }),
  }),
});

export const updateCurrencySchema = z.object({
  currency: z.string().min(1, 'Currency is required').max(10, 'Currency code too long'),
});

export const updateCurrencyFormatSchema = z.object({
  currencyFormat: z.enum(['symbol', 'code'], {
    errorMap: () => ({ message: 'Currency format must be either symbol or code' }),
  }),
});

// Payday schemas
export const paydaySchema = z.object({
  completedTaskIds: z
    .array(z.number().int('Task ID must be an integer').positive('Task ID must be positive'))
    .min(1, 'At least one task must be selected'),
  customPayoutValues: z
    .record(
      z.string(), // task ID as string key
      z.number().min(0, 'Custom payout value must be 0 or greater').max(1000, 'Custom payout value must be less than 1000')
    )
    .optional(),
});

// Bulk operations schemas
export const bulkDeleteCompletedTasksSchema = z.object({
  taskIds: z
    .array(z.number().int('Task ID must be an integer').positive('Task ID must be positive'))
    .min(1, 'At least one task must be selected'),
});

// Backup/Restore schemas
export const restoreBackupSchema = z.object({
  data: z.unknown(), // Will be validated based on the specific restore type
  type: z.enum(['all', 'users', 'tasks', 'piggybank'], {
    errorMap: () => ({ message: 'Invalid restore type' }),
  }),
});

// PIN validation
export const pinSchema = z
  .string()
  .length(4, 'PIN must be exactly 4 digits')
  .regex(/^\d{4}$/, 'PIN must contain only numbers');

// ID parameter schema for routes like /api/users/[id]
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

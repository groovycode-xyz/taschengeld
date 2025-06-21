import { prisma } from '@/app/lib/prisma';

export class BackupService {
  static async updateBackupTracking() {
    // Get current total transaction count
    const transactionCount = await prisma.piggybankTransaction.count();

    // Update the backup tracking settings
    await prisma.$transaction([
      prisma.appSetting.upsert({
        where: { setting_key: 'last_backup_date' },
        update: { setting_value: new Date().toISOString() },
        create: {
          setting_key: 'last_backup_date',
          setting_value: new Date().toISOString(),
        },
      }),
      prisma.appSetting.upsert({
        where: { setting_key: 'transactions_at_last_backup' },
        update: { setting_value: transactionCount.toString() },
        create: {
          setting_key: 'transactions_at_last_backup',
          setting_value: transactionCount.toString(),
        },
      }),
    ]);
  }

  static async getBackupStatus() {
    // Get all relevant settings
    const settings = await prisma.appSetting.findMany({
      where: {
        setting_key: {
          in: [
            'last_backup_date',
            'transactions_at_last_backup',
            'backup_reminder_threshold',
            'backup_reminder_enabled',
          ],
        },
      },
    });

    // Convert to a map for easier access
    const settingsMap = settings.reduce(
      (acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      },
      {} as Record<string, string | null>
    );

    // Get current transaction count
    const currentTransactionCount = await prisma.piggybankTransaction.count();
    const transactionsAtLastBackup = parseInt(settingsMap.transactions_at_last_backup || '0', 10);
    const threshold = parseInt(settingsMap.backup_reminder_threshold || '10', 10);
    const reminderEnabled = settingsMap.backup_reminder_enabled !== 'false';

    // Calculate new transactions since backup
    const newTransactions = currentTransactionCount - transactionsAtLastBackup;
    const shouldShowReminder = reminderEnabled && newTransactions >= threshold;

    return {
      lastBackupDate: settingsMap.last_backup_date,
      transactionsAtLastBackup,
      currentTransactionCount,
      newTransactions,
      threshold,
      reminderEnabled,
      shouldShowReminder,
    };
  }

  static async updateReminderThreshold(threshold: number) {
    if (threshold < 5 || threshold > 50) {
      throw new Error('Threshold must be between 5 and 50');
    }

    await prisma.appSetting.upsert({
      where: { setting_key: 'backup_reminder_threshold' },
      update: { setting_value: threshold.toString() },
      create: {
        setting_key: 'backup_reminder_threshold',
        setting_value: threshold.toString(),
      },
    });
  }

  static async toggleReminder(enabled: boolean) {
    await prisma.appSetting.upsert({
      where: { setting_key: 'backup_reminder_enabled' },
      update: { setting_value: enabled.toString() },
      create: {
        setting_key: 'backup_reminder_enabled',
        setting_value: enabled.toString(),
      },
    });
  }
}

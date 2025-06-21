import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeDefaultData() {
  // Check if any users exist
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    try {
      // Create default user
      const defaultUser = await prisma.user.create({
        data: {
          name: 'Default User',
          icon: '👤',
          birthday: new Date(),
        },
      });

      // Create piggy bank account for the user
      const piggyBankAccount = await prisma.piggybankAccount.create({
        data: {
          account_number: '1000000001',
          balance: 0,
          user_id: defaultUser.user_id,
        },
      });

      // Update user with the piggy bank account
      await prisma.user.update({
        where: { user_id: defaultUser.user_id },
        data: { piggybank_account_id: piggyBankAccount.account_id },
      });

      // Create some default tasks
      const defaultTasks = [
        {
          title: 'Make Bed',
          description: 'Make your bed neatly in the morning',
          icon_name: '🛏️',
          payout_value: 0.5,
        },
        {
          title: 'Clean Room',
          description: 'Keep your room tidy and organized',
          icon_name: '🧹',
          payout_value: 1.0,
        },
        {
          title: 'Do Homework',
          description: 'Complete all homework assignments',
          icon_name: '📚',
          payout_value: 2.0,
        },
      ];

      for (const task of defaultTasks) {
        await prisma.task.create({ data: task });
      }

      // Set default app settings
      const defaultSettings = [
        { key: 'show_german_terms', value: 'false' },
        { key: 'default_currency', value: 'EUR' },
        { key: 'currency_format', value: 'de-DE' },
      ];

      for (const setting of defaultSettings) {
        await prisma.appSetting.create({
          data: {
            setting_key: setting.key,
            setting_value: setting.value,
          },
        });
      }

      // Default data created successfully
    } catch (error) {
      throw error;
    }
  }
}

export default initializeApp;

async function initializeApp() {
  try {
    await initializeDefaultData();
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

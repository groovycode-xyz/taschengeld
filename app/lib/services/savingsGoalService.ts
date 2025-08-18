import { prisma } from '@/app/lib/prisma';
import { SavingsGoal, SavingsGoalInput, SavingsGoalUpdate } from '@/app/types/savingsGoal';
import { SavingsGoalTransaction, SavingsGoalTransactionInput } from '@/app/types/savingsGoalTransaction';
import { piggyBankTransactionService } from './piggyBankTransactionService';
import { Prisma } from '@prisma/client';

export const savingsGoalService = {
  async createGoal(data: SavingsGoalInput): Promise<SavingsGoal> {
    const goal = await prisma.savingsGoal.create({
      data: {
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        icon_name: data.icon_name,
        target_amount: data.target_amount,
        current_balance: 0,
      },
      include: {
        user: true,
      },
    });

    const targetAmount = parseFloat(goal.target_amount.toString());
    const currentBalance = parseFloat(goal.current_balance.toString());
    const progressPercentage = targetAmount > 0 ? Math.min((currentBalance / targetAmount) * 100, 100) : 0;

    return {
      goal_id: goal.goal_id,
      user_id: goal.user_id,
      title: goal.title,
      description: goal.description || undefined,
      icon_name: goal.icon_name,
      target_amount: goal.target_amount.toString(),
      current_balance: goal.current_balance.toString(),
      is_active: goal.is_active,
      created_at: goal.created_at?.toISOString() || new Date().toISOString(),
      updated_at: goal.updated_at?.toISOString() || new Date().toISOString(),
      user_name: goal.user.name,
      user_icon: goal.user.icon,
      progress_percentage: progressPercentage,
    };
  },

  async getGoalById(goalId: number): Promise<SavingsGoal | null> {
    const goal = await prisma.savingsGoal.findUnique({
      where: { goal_id: goalId },
      include: {
        user: true,
      },
    });

    if (!goal) return null;

    const targetAmount = parseFloat(goal.target_amount.toString());
    const currentBalance = parseFloat(goal.current_balance.toString());
    const progressPercentage = targetAmount > 0 ? Math.min((currentBalance / targetAmount) * 100, 100) : 0;

    return {
      goal_id: goal.goal_id,
      user_id: goal.user_id,
      title: goal.title,
      description: goal.description || undefined,
      icon_name: goal.icon_name,
      target_amount: goal.target_amount.toString(),
      current_balance: goal.current_balance.toString(),
      is_active: goal.is_active,
      created_at: goal.created_at?.toISOString() || new Date().toISOString(),
      updated_at: goal.updated_at?.toISOString() || new Date().toISOString(),
      user_name: goal.user.name,
      user_icon: goal.user.icon,
      progress_percentage: progressPercentage,
    };
  },

  async getGoalsByUserId(userId: number): Promise<SavingsGoal[]> {
    const goals = await prisma.savingsGoal.findMany({
      where: { user_id: userId },
      include: {
        user: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return goals.map((goal) => {
      const targetAmount = parseFloat(goal.target_amount.toString());
      const currentBalance = parseFloat(goal.current_balance.toString());
      const progressPercentage = targetAmount > 0 ? Math.min((currentBalance / targetAmount) * 100, 100) : 0;

      return {
        goal_id: goal.goal_id,
        user_id: goal.user_id,
        title: goal.title,
        description: goal.description || undefined,
        icon_name: goal.icon_name,
        target_amount: goal.target_amount.toString(),
        current_balance: goal.current_balance.toString(),
        is_active: goal.is_active,
        created_at: goal.created_at?.toISOString() || new Date().toISOString(),
        updated_at: goal.updated_at?.toISOString() || new Date().toISOString(),
        user_name: goal.user.name,
        user_icon: goal.user.icon,
        progress_percentage: progressPercentage,
      };
    });
  },

  async getAllGoals(): Promise<SavingsGoal[]> {
    const goals = await prisma.savingsGoal.findMany({
      include: {
        user: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return goals.map((goal) => {
      const targetAmount = parseFloat(goal.target_amount.toString());
      const currentBalance = parseFloat(goal.current_balance.toString());
      const progressPercentage = targetAmount > 0 ? Math.min((currentBalance / targetAmount) * 100, 100) : 0;

      return {
        goal_id: goal.goal_id,
        user_id: goal.user_id,
        title: goal.title,
        description: goal.description || undefined,
        icon_name: goal.icon_name,
        target_amount: goal.target_amount.toString(),
        current_balance: goal.current_balance.toString(),
        is_active: goal.is_active,
        created_at: goal.created_at?.toISOString() || new Date().toISOString(),
        updated_at: goal.updated_at?.toISOString() || new Date().toISOString(),
        user_name: goal.user.name,
        user_icon: goal.user.icon,
        progress_percentage: progressPercentage,
      };
    });
  },

  async updateGoal(goalId: number, updates: SavingsGoalUpdate): Promise<SavingsGoal> {
    const goal = await prisma.savingsGoal.update({
      where: { goal_id: goalId },
      data: {
        ...updates,
        updated_at: new Date(),
      },
      include: {
        user: true,
      },
    });

    const targetAmount = parseFloat(goal.target_amount.toString());
    const currentBalance = parseFloat(goal.current_balance.toString());
    const progressPercentage = targetAmount > 0 ? Math.min((currentBalance / targetAmount) * 100, 100) : 0;

    return {
      goal_id: goal.goal_id,
      user_id: goal.user_id,
      title: goal.title,
      description: goal.description || undefined,
      icon_name: goal.icon_name,
      target_amount: goal.target_amount.toString(),
      current_balance: goal.current_balance.toString(),
      is_active: goal.is_active,
      created_at: goal.created_at?.toISOString() || new Date().toISOString(),
      updated_at: goal.updated_at?.toISOString() || new Date().toISOString(),
      user_name: goal.user.name,
      user_icon: goal.user.icon,
      progress_percentage: progressPercentage,
    };
  },

  async deleteGoal(goalId: number): Promise<void> {
    await prisma.savingsGoal.delete({
      where: { goal_id: goalId },
    });
  },

  async updateBalance(
    goalId: number,
    amount: number,
    operation: 'increment' | 'decrement' | 'set',
    tx?: Prisma.TransactionClient
  ): Promise<SavingsGoal> {
    const db = tx || prisma;
    
    let updateData: Prisma.SavingsGoalUpdateInput;

    if (operation === 'set') {
      updateData = { 
        current_balance: amount,
        updated_at: new Date(),
      };
    } else if (operation === 'increment') {
      updateData = { 
        current_balance: { increment: amount },
        updated_at: new Date(),
      };
    } else {
      updateData = { 
        current_balance: { decrement: amount },
        updated_at: new Date(),
      };
    }

    const goal = await db.savingsGoal.update({
      where: { goal_id: goalId },
      data: updateData,
      include: {
        user: true,
      },
    });

    const targetAmount = parseFloat(goal.target_amount.toString());
    const currentBalance = parseFloat(goal.current_balance.toString());
    const progressPercentage = targetAmount > 0 ? Math.min((currentBalance / targetAmount) * 100, 100) : 0;

    return {
      goal_id: goal.goal_id,
      user_id: goal.user_id,
      title: goal.title,
      description: goal.description || undefined,
      icon_name: goal.icon_name,
      target_amount: goal.target_amount.toString(),
      current_balance: goal.current_balance.toString(),
      is_active: goal.is_active,
      created_at: goal.created_at?.toISOString() || new Date().toISOString(),
      updated_at: goal.updated_at?.toISOString() || new Date().toISOString(),
      user_name: goal.user.name,
      user_icon: goal.user.icon,
      progress_percentage: progressPercentage,
    };
  },

  // Transaction methods
  async createTransaction(data: SavingsGoalTransactionInput): Promise<SavingsGoalTransaction> {
    const transaction = await prisma.savingsGoalTransaction.create({
      data: {
        goal_id: data.goal_id,
        amount: data.amount,
        transaction_type: data.transaction_type,
        description: data.description,
        from_piggybank: data.from_piggybank || false,
      },
      include: {
        goal: true,
      },
    });

    return {
      transaction_id: transaction.transaction_id,
      goal_id: transaction.goal_id,
      amount: transaction.amount.toString(),
      transaction_type: transaction.transaction_type as 'contribute' | 'withdraw' | 'purchase',
      transaction_date: transaction.transaction_date?.toISOString() || new Date().toISOString(),
      description: transaction.description || undefined,
      from_piggybank: transaction.from_piggybank,
      goal_title: transaction.goal.title,
    };
  },

  async getTransactionsByGoalId(goalId: number): Promise<SavingsGoalTransaction[]> {
    const transactions = await prisma.savingsGoalTransaction.findMany({
      where: { goal_id: goalId },
      include: {
        goal: true,
      },
      orderBy: { transaction_date: 'desc' },
    });

    return transactions.map((transaction) => ({
      transaction_id: transaction.transaction_id,
      goal_id: transaction.goal_id,
      amount: transaction.amount.toString(),
      transaction_type: transaction.transaction_type as 'contribute' | 'withdraw' | 'purchase',
      transaction_date: transaction.transaction_date?.toISOString() || new Date().toISOString(),
      description: transaction.description || undefined,
      from_piggybank: transaction.from_piggybank,
      goal_title: transaction.goal.title,
    }));
  },

  // Combined operations for transfers
  async contributeFromPiggyBank(
    goalId: number,
    amount: number,
    piggybankAccountId: number,
    description?: string
  ): Promise<{ goal: SavingsGoal; transaction: SavingsGoalTransaction }> {
    return await prisma.$transaction(async (tx) => {
      // Update piggy bank balance (decrement)
      await tx.piggybankAccount.update({
        where: { account_id: piggybankAccountId },
        data: { balance: { decrement: amount } },
      });

      // Update savings goal balance (increment)
      const updatedGoal = await this.updateBalance(goalId, amount, 'increment', tx);

      // Create piggy bank transaction record
      await piggyBankTransactionService.createTransactionOnly({
        account_id: piggybankAccountId,
        amount: amount,
        transaction_type: 'withdrawal',
        description: description ? `Savings goal: ${description}` : 'Transfer to Savings Goal',
      }, tx);

      // Create transaction record
      const transaction = await tx.savingsGoalTransaction.create({
        data: {
          goal_id: goalId,
          amount: amount,
          transaction_type: 'contribute',
          description: description || 'Transfer from Piggy Bank',
          from_piggybank: true,
        },
        include: {
          goal: true,
        },
      });

      const transactionFormatted: SavingsGoalTransaction = {
        transaction_id: transaction.transaction_id,
        goal_id: transaction.goal_id,
        amount: transaction.amount.toString(),
        transaction_type: transaction.transaction_type as 'contribute',
        transaction_date: transaction.transaction_date?.toISOString() || new Date().toISOString(),
        description: transaction.description || undefined,
        from_piggybank: transaction.from_piggybank,
        goal_title: transaction.goal.title,
      };

      return {
        goal: updatedGoal,
        transaction: transactionFormatted,
      };
    });
  },

  async withdrawToPiggyBank(
    goalId: number,
    amount: number,
    piggybankAccountId: number,
    description?: string
  ): Promise<{ goal: SavingsGoal; transaction: SavingsGoalTransaction }> {
    return await prisma.$transaction(async (tx) => {
      // Update savings goal balance (decrement)
      const updatedGoal = await this.updateBalance(goalId, amount, 'decrement', tx);

      // Update piggy bank balance (increment)
      await tx.piggybankAccount.update({
        where: { account_id: piggybankAccountId },
        data: { balance: { increment: amount } },
      });

      // Create piggy bank transaction record
      await piggyBankTransactionService.createTransactionOnly({
        account_id: piggybankAccountId,
        amount: amount,
        transaction_type: 'deposit',
        description: description ? `From savings goal: ${description}` : 'Transfer from Savings Goal',
      }, tx);

      // Create transaction record
      const transaction = await tx.savingsGoalTransaction.create({
        data: {
          goal_id: goalId,
          amount: amount,
          transaction_type: 'withdraw',
          description: description || 'Transfer to Piggy Bank',
          from_piggybank: false,
        },
        include: {
          goal: true,
        },
      });

      const transactionFormatted: SavingsGoalTransaction = {
        transaction_id: transaction.transaction_id,
        goal_id: transaction.goal_id,
        amount: transaction.amount.toString(),
        transaction_type: transaction.transaction_type as 'withdraw',
        transaction_date: transaction.transaction_date?.toISOString() || new Date().toISOString(),
        description: transaction.description || undefined,
        from_piggybank: transaction.from_piggybank,
        goal_title: transaction.goal.title,
      };

      return {
        goal: updatedGoal,
        transaction: transactionFormatted,
      };
    });
  },

  async purchaseFromGoal(
    goalId: number,
    description?: string
  ): Promise<{ goal: SavingsGoal; transaction: SavingsGoalTransaction }> {
    return await prisma.$transaction(async (tx) => {
      // Get current goal to determine the amount
      const currentGoal = await tx.savingsGoal.findUnique({
        where: { goal_id: goalId },
        include: { user: true },
      });

      if (!currentGoal) {
        throw new Error('Savings goal not found');
      }

      const currentBalance = parseFloat(currentGoal.current_balance.toString());

      // Set goal balance to 0 and mark as inactive
      const updatedGoal = await this.updateBalance(goalId, 0, 'set', tx);
      await tx.savingsGoal.update({
        where: { goal_id: goalId },
        data: { is_active: false },
      });

      // Create transaction record
      const transaction = await tx.savingsGoalTransaction.create({
        data: {
          goal_id: goalId,
          amount: currentBalance,
          transaction_type: 'purchase',
          description: description || 'Goal completed - Purchase made',
          from_piggybank: false,
        },
        include: {
          goal: true,
        },
      });

      const transactionFormatted: SavingsGoalTransaction = {
        transaction_id: transaction.transaction_id,
        goal_id: transaction.goal_id,
        amount: transaction.amount.toString(),
        transaction_type: transaction.transaction_type as 'purchase',
        transaction_date: transaction.transaction_date?.toISOString() || new Date().toISOString(),
        description: transaction.description || undefined,
        from_piggybank: transaction.from_piggybank,
        goal_title: transaction.goal.title,
      };

      // Mark goal as inactive in the returned goal object
      const finalGoal = { ...updatedGoal, is_active: false };

      return {
        goal: finalGoal,
        transaction: transactionFormatted,
      };
    });
  },
};
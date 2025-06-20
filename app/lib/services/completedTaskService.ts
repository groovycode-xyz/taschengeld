import { prisma } from '@/app/lib/prisma';
import { CompletedTask, CreateCompletedTaskInput, PaymentStatus } from '@/app/types/completedTask';
import { logger } from '@/app/lib/logger';
import { Prisma } from '@prisma/client';

const validatePaymentStatus = (status: string): PaymentStatus => {
  if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
    throw new Error(
      `Invalid payment status: ${status}. Must be one of: ${Object.values(PaymentStatus).join(', ')}`
    );
  }
  return status as PaymentStatus;
};

export const completedTaskService = {
  async getAll(): Promise<CompletedTask[]> {
    const completedTasks = await prisma.completedTask.findMany({
      include: {
        task: true,
        user: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return completedTasks.map((ct) => ({
      c_task_id: ct.c_task_id,
      user_id: ct.user_id,
      task_id: ct.task_id,
      description: ct.description,
      payout_value: ct.payout_value ? Number(ct.payout_value) : null,
      payment_status: ct.payment_status as PaymentStatus,
      created_at: ct.created_at,
      comment: ct.comment,
      attachment: ct.attachment,
      task_title: ct.task.title,
      icon_name: ct.task.icon_name,
      user_name: ct.user.name,
      user_icon: ct.user.icon,
    }));
  },

  async getById(id: number): Promise<CompletedTask | null> {
    const completedTask = await prisma.completedTask.findUnique({
      where: { c_task_id: id },
      include: {
        task: true,
        user: true,
      },
    });

    if (!completedTask) return null;

    return {
      c_task_id: completedTask.c_task_id,
      user_id: completedTask.user_id,
      task_id: completedTask.task_id,
      description: completedTask.description,
      payout_value: completedTask.payout_value ? Number(completedTask.payout_value) : null,
      payment_status: completedTask.payment_status as PaymentStatus,
      created_at: completedTask.created_at,
      comment: completedTask.comment,
      attachment: completedTask.attachment,
      task_title: completedTask.task.title,
      icon_name: completedTask.task.icon_name,
      user_name: completedTask.user.name,
      user_icon: completedTask.user.icon,
    };
  },

  async create(input: CreateCompletedTaskInput): Promise<CompletedTask> {
    // Get task details for payout value and description
    const task = await prisma.task.findUnique({
      where: { task_id: input.task_id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const completedTask = await prisma.completedTask.create({
      data: {
        user_id: input.user_id,
        task_id: input.task_id,
        description: task.title,
        payout_value: task.payout_value,
        payment_status: 'Unpaid',
        comment: input.comment,
        attachment: input.attachment,
      },
      include: {
        task: true,
        user: true,
      },
    });

    return {
      c_task_id: completedTask.c_task_id,
      user_id: completedTask.user_id,
      task_id: completedTask.task_id,
      description: completedTask.description,
      payout_value: completedTask.payout_value ? Number(completedTask.payout_value) : null,
      payment_status: completedTask.payment_status as PaymentStatus,
      created_at: completedTask.created_at,
      comment: completedTask.comment,
      attachment: completedTask.attachment,
      task_title: completedTask.task.title,
      icon_name: completedTask.task.icon_name,
      user_name: completedTask.user.name,
      user_icon: completedTask.user.icon,
    };
  },

  async updatePaymentStatus(id: number, status: string): Promise<CompletedTask | null> {
    const validatedStatus = validatePaymentStatus(status);

    try {
      // First get the completed task to check current status and get details
      const existingTask = await prisma.completedTask.findUnique({
        where: { c_task_id: id },
        include: {
          task: true,
          user: true,
        },
      });

      if (!existingTask) {
        return null;
      }

      // If changing from Unpaid to Paid, we need to update the piggy bank
      if (
        existingTask.payment_status === 'Unpaid' &&
        validatedStatus === 'Paid' &&
        existingTask.payout_value
      ) {
        // Use a transaction to ensure all operations succeed or fail together
        const [completedTask] = await prisma.$transaction(async (tx) => {
          // Update the completed task status
          const updatedTask = await tx.completedTask.update({
            where: { c_task_id: id },
            data: { payment_status: validatedStatus },
            include: {
              task: true,
              user: true,
            },
          });

          // Find the user's piggy bank account
          const account = await tx.piggybankAccount.findFirst({
            where: { user_id: existingTask.user_id },
          });

          if (account) {
            // Update the account balance
            await tx.piggybankAccount.update({
              where: { account_id: account.account_id },
              data: {
                balance: {
                  increment: existingTask.payout_value,
                },
              },
            });

            // Create a transaction record with the completion date
            await tx.piggybankTransaction.create({
              data: {
                account_id: account.account_id,
                amount: existingTask.payout_value,
                transaction_type: 'payday',
                description: `Payment for: ${existingTask.task.title}`,
                completed_task_id: existingTask.c_task_id,
                transaction_date: existingTask.created_at, // Use task completion date
              },
            });
          }

          return [updatedTask];
        });

        return {
          c_task_id: completedTask.c_task_id,
          user_id: completedTask.user_id,
          task_id: completedTask.task_id,
          description: completedTask.description,
          payout_value: completedTask.payout_value ? Number(completedTask.payout_value) : null,
          payment_status: completedTask.payment_status as PaymentStatus,
          created_at: completedTask.created_at,
          comment: completedTask.comment,
          attachment: completedTask.attachment,
          task_title: completedTask.task.title,
          icon_name: completedTask.task.icon_name,
          user_name: completedTask.user.name,
          user_icon: completedTask.user.icon,
        };
      } else {
        // Just update the status without affecting piggy bank
        const completedTask = await prisma.completedTask.update({
          where: { c_task_id: id },
          data: { payment_status: validatedStatus },
          include: {
            task: true,
            user: true,
          },
        });

        return {
          c_task_id: completedTask.c_task_id,
          user_id: completedTask.user_id,
          task_id: completedTask.task_id,
          description: completedTask.description,
          payout_value: completedTask.payout_value ? Number(completedTask.payout_value) : null,
          payment_status: completedTask.payment_status as PaymentStatus,
          created_at: completedTask.created_at,
          comment: completedTask.comment,
          attachment: completedTask.attachment,
          task_title: completedTask.task.title,
          icon_name: completedTask.task.icon_name,
          user_name: completedTask.user.name,
          user_icon: completedTask.user.icon,
        };
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // Not found
      }
      throw error;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.completedTask.delete({
        where: { c_task_id: id },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false; // Not found
      }
      throw error;
    }
  },

  async bulkUpdatePaymentStatus(ids: number[], status: string): Promise<number> {
    const validatedStatus = validatePaymentStatus(status);

    const result = await prisma.completedTask.updateMany({
      where: {
        c_task_id: { in: ids },
      },
      data: {
        payment_status: validatedStatus,
      },
    });

    return result.count;
  },

  async getUnpaidByUserId(userId: number): Promise<CompletedTask[]> {
    const completedTasks = await prisma.completedTask.findMany({
      where: {
        user_id: userId,
        payment_status: 'Unpaid',
      },
      include: {
        task: true,
        user: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return completedTasks.map((ct) => ({
      c_task_id: ct.c_task_id,
      user_id: ct.user_id,
      task_id: ct.task_id,
      description: ct.description,
      payout_value: ct.payout_value ? Number(ct.payout_value) : null,
      payment_status: ct.payment_status as PaymentStatus,
      created_at: ct.created_at,
      comment: ct.comment,
      attachment: ct.attachment,
      task_title: ct.task.title,
      icon_name: ct.task.icon_name,
      user_name: ct.user.name,
      user_icon: ct.user.icon,
    }));
  },

  async clearAll(): Promise<void> {
    logger.debug('Executing clearAll query');
    await prisma.completedTask.deleteMany({});
    logger.info('Cleared all completed tasks');
  },

  async getFullTaskDetails(cTaskId: number): Promise<CompletedTask | null> {
    logger.debug('Executing getFullTaskDetails query', { cTaskId });

    const completedTask = await prisma.completedTask.findUnique({
      where: { c_task_id: cTaskId },
      include: {
        task: true,
        user: true,
      },
    });

    logger.debug('Full task details retrieved', { found: completedTask !== null });

    if (!completedTask) return null;

    return {
      c_task_id: completedTask.c_task_id,
      user_id: completedTask.user_id,
      task_id: completedTask.task_id,
      description: completedTask.description,
      payout_value: completedTask.payout_value ? Number(completedTask.payout_value) : null,
      payment_status: completedTask.payment_status as PaymentStatus,
      created_at: completedTask.created_at,
      comment: completedTask.comment,
      attachment: completedTask.attachment,
      task_title: completedTask.task.title,
      task_description: completedTask.task.description,
      icon_name: completedTask.task.icon_name,
      user_name: completedTask.user.name,
      user_icon: completedTask.user.icon,
    };
  },
};

import { prisma } from '@/app/lib/prisma';
import { Task } from '@/app/types/task';
import { logger } from '@/app/lib/logger';
import { Prisma } from '@prisma/client';

export const taskService = {
  async getAll(): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      orderBy: { created_at: 'desc' },
    });

    return tasks.map((task) => ({
      task_id: task.task_id.toString(),
      title: task.title,
      description: task.description,
      icon_name: task.icon_name,
      sound_url: task.sound_url,
      payout_value: Number(task.payout_value),
      is_active: task.is_active ?? true,
      created_at: task.created_at?.toISOString(),
      updated_at: task.updated_at?.toISOString(),
    }));
  },

  async getById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { task_id: parseInt(id, 10) },
    });

    if (!task) return null;

    return {
      task_id: task.task_id.toString(),
      title: task.title,
      description: task.description,
      icon_name: task.icon_name,
      sound_url: task.sound_url,
      payout_value: Number(task.payout_value),
      is_active: task.is_active ?? true,
      created_at: task.created_at?.toISOString(),
      updated_at: task.updated_at?.toISOString(),
    };
  },

  async getAllActive(): Promise<Task[]> {
    logger.debug('getActiveTasks called');

    try {
      logger.debug('Executing getActiveTasks query');

      const tasks = await prisma.task.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
      });

      logger.debug('Query result', { rowCount: tasks.length });

      const mappedTasks = tasks.map((task) => ({
        task_id: task.task_id.toString(),
        title: task.title,
        description: task.description,
        icon_name: task.icon_name,
        sound_url: task.sound_url,
        payout_value: Number(task.payout_value),
        is_active: task.is_active ?? true,
        created_at: task.created_at?.toISOString(),
        updated_at: task.updated_at?.toISOString(),
      }));

      logger.debug('Tasks mapped successfully', { taskCount: mappedTasks.length });

      return mappedTasks;
    } catch (error) {
      logger.error('Error in getActiveTasks', error);
      throw error;
    }
  },

  async create(data: {
    title: string;
    description?: string | null;
    icon_name?: string | null;
    sound_url?: string | null;
    payout_value: number;
    is_active?: boolean;
  }): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        icon_name: data.icon_name,
        sound_url: data.sound_url,
        payout_value: new Prisma.Decimal(data.payout_value),
        is_active: data.is_active ?? true,
      },
    });

    return {
      task_id: task.task_id.toString(),
      title: task.title,
      description: task.description,
      icon_name: task.icon_name,
      sound_url: task.sound_url,
      payout_value: Number(task.payout_value),
      is_active: task.is_active ?? true,
      created_at: task.created_at?.toISOString(),
      updated_at: task.updated_at?.toISOString(),
    };
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description?: string | null;
      icon_name?: string | null;
      sound_url?: string | null;
      payout_value: number;
      is_active?: boolean;
    }>
  ): Promise<Task | null> {
    try {
      const updateData: Prisma.TaskUpdateInput = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.icon_name !== undefined) updateData.icon_name = data.icon_name;
      if (data.sound_url !== undefined) updateData.sound_url = data.sound_url;
      if (data.payout_value !== undefined)
        updateData.payout_value = new Prisma.Decimal(data.payout_value);
      if (data.is_active !== undefined) updateData.is_active = data.is_active;

      const task = await prisma.task.update({
        where: { task_id: parseInt(id, 10) },
        data: updateData,
      });

      return {
        task_id: task.task_id.toString(),
        title: task.title,
        description: task.description,
        icon_name: task.icon_name,
        sound_url: task.sound_url,
        payout_value: Number(task.payout_value),
        is_active: task.is_active ?? true,
        created_at: task.created_at?.toISOString(),
        updated_at: task.updated_at?.toISOString(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // Task not found
      }
      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.task.delete({
        where: { task_id: parseInt(id, 10) },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false; // Task not found
      }
      throw error;
    }
  },

  async toggleActive(id: string): Promise<Task | null> {
    try {
      const task = await prisma.task.findUnique({
        where: { task_id: parseInt(id, 10) },
      });

      if (!task) return null;

      const updated = await prisma.task.update({
        where: { task_id: parseInt(id, 10) },
        data: { is_active: !task.is_active },
      });

      return {
        task_id: updated.task_id.toString(),
        title: updated.title,
        description: updated.description,
        icon_name: updated.icon_name,
        sound_url: updated.sound_url,
        payout_value: Number(updated.payout_value),
        is_active: updated.is_active ?? true,
        created_at: updated.created_at?.toISOString(),
        updated_at: updated.updated_at?.toISOString(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // Task not found
      }
      throw error;
    }
  },

  async hasCompletedTasks(taskId: number): Promise<boolean> {
    const count = await prisma.completedTask.count({
      where: { task_id: taskId },
    });
    return count > 0;
  },
};

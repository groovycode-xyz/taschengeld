import { prisma } from '@/app/lib/prisma';
import { User, CreateUserInput } from '@/app/types/user';
import { logger } from '@/app/lib/logger';
import { Prisma } from '@prisma/client';

export const userService = {
  async getAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      include: {
        linked_account: true,
      },
    });

    return users.map((user) => ({
      user_id: user.user_id,
      name: user.name,
      icon: user.icon,
      sound_url: user.sound_url,
      birthday: user.birthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
      piggybank_account_id: user.piggybank_account_id,
      created_at: user.created_at?.toISOString() || new Date().toISOString(),
    }));
  },

  async getById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: {
        linked_account: true,
      },
    });

    if (!user) return null;

    return {
      user_id: user.user_id,
      name: user.name,
      icon: user.icon,
      sound_url: user.sound_url,
      birthday: user.birthday.toISOString().split('T')[0],
      piggybank_account_id: user.piggybank_account_id,
      created_at: user.created_at?.toISOString() || new Date().toISOString(),
    };
  },

  async findByName(name: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!user) return null;

    return {
      user_id: user.user_id,
      name: user.name,
      icon: user.icon,
      sound_url: user.sound_url,
      birthday: user.birthday.toISOString().split('T')[0],
      piggybank_account_id: user.piggybank_account_id,
      created_at: user.created_at?.toISOString() || new Date().toISOString(),
    };
  },

  async create(userData: CreateUserInput): Promise<User> {
    logger.debug('Creating user with data', userData);

    // Start a transaction to create user and piggy bank account
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          name: userData.name,
          icon: userData.icon || '👤',
          sound_url: userData.sound_url,
          birthday: new Date(userData.birthday!),
        },
      });

      // Create piggy bank account
      const accountNumber = `PB${user.user_id.toString().padStart(6, '0')}`;
      const account = await tx.piggybankAccount.create({
        data: {
          account_number: accountNumber,
          balance: 0,
          user_id: user.user_id,
        },
      });

      // Update user with piggy bank account id
      const updatedUser = await tx.user.update({
        where: { user_id: user.user_id },
        data: { piggybank_account_id: account.account_id },
        include: { linked_account: true },
      });

      return updatedUser;
    });

    logger.info('User created successfully', { userId: result.user_id });

    return {
      user_id: result.user_id,
      name: result.name,
      icon: result.icon,
      sound_url: result.sound_url,
      birthday: result.birthday.toISOString().split('T')[0],
      piggybank_account_id: result.piggybank_account_id,
      created_at: result.created_at?.toISOString() || new Date().toISOString(),
    };
  },

  async createUser(userData: CreateUserInput): Promise<User> {
    // Alias for backward compatibility
    return this.create(userData);
  },

  async update(id: number, data: Partial<User>): Promise<User | null> {
    logger.debug('Updating user', { userId: id, data });

    try {
      const updateData: Prisma.UserUpdateInput = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.icon !== undefined) updateData.icon = data.icon;
      if (data.sound_url !== undefined) updateData.sound_url = data.sound_url;
      if (data.birthday !== undefined) updateData.birthday = new Date(data.birthday);

      const user = await prisma.user.update({
        where: { user_id: id },
        data: updateData,
      });

      logger.debug('User updated successfully', { userId: id });

      return {
        user_id: user.user_id,
        name: user.name,
        icon: user.icon,
        sound_url: user.sound_url,
        birthday: user.birthday.toISOString().split('T')[0],
        piggybank_account_id: user.piggybank_account_id,
        created_at: user.created_at?.toISOString() || new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // User not found
      }
      logger.error('Error updating user', { userId: id, error });
      throw error;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { user_id: id },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false; // User not found
      }
      throw error;
    }
  },

  async deleteUser(id: number): Promise<void> {
    // Alias for backward compatibility
    const result = await this.delete(id);
    if (!result) {
      throw new Error('User not found');
    }
  },

  async getChildUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    return users.map((user) => ({
      user_id: user.user_id,
      name: user.name,
      icon: user.icon,
      sound_url: user.sound_url,
      birthday: user.birthday.toISOString().split('T')[0],
      piggybank_account_id: user.piggybank_account_id,
      created_at: user.created_at?.toISOString() || new Date().toISOString(),
    }));
  },
};

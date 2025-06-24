import { NextRequest } from 'next/server';
import { userService } from '@/app/lib/services/userService';
import { validateRequest } from '@/app/lib/validation/middleware';
import { requireParentMode } from '@/app/lib/middleware/auth';
import { createUserSchema, updateUserSchema, idParamSchema } from '@/app/lib/validation/schemas';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { ConflictError, ValidationError, NotFoundError } from '@/app/lib/errors';

export const dynamic = 'force-dynamic';

export const GET = createApiHandler(async () => {
  const users = await userService.getAll();
  return successResponse(users);
});

export const POST = createApiHandler(async (request: NextRequest) => {
  // Validate request body
  const validation = await validateRequest(request, createUserSchema);
  if (!validation.success) {
    return validation.error;
  }

  const { name } = validation.data;

  // Check for existing user with same name
  const existingUser = await userService.findByName(name);
  if (existingUser) {
    throw new ConflictError('A user with this name already exists');
  }

  // If no duplicate, proceed with user creation
  const newUser = await userService.createUser(validation.data);
  return successResponse(newUser, 201);
});

export async function PUT(request: NextRequest) {
  return requireParentMode(request, async (req) => {
    return createApiHandler(async () => {
      const body = await req.json();
      const { id, ...updateData } = body;

      // Validate ID
      if (!id || typeof id !== 'number') {
        throw new ValidationError('Valid user ID is required');
      }

      // Validate update data
      const validation = updateUserSchema.safeParse(updateData);
      if (!validation.success) {
        throw new ValidationError('Validation failed', validation.error.errors);
      }

      const user = await userService.update(id, validation.data);
      if (!user) {
        throw new NotFoundError('User');
      }
      return successResponse(user);
    })();
  });
}

export async function DELETE(request: NextRequest) {
  return requireParentMode(request, async (req) => {
    return createApiHandler(async () => {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');

      // Validate user ID
      const idValidation = idParamSchema.safeParse({ id: userId });
      if (!idValidation.success) {
        throw new ValidationError('Valid user ID is required');
      }

      await userService.deleteUser(idValidation.data.id);
      return successResponse({ message: 'User deleted successfully' });
    })();
  });
}

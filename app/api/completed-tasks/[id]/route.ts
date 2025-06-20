import { NextResponse } from 'next/server';
import { completedTaskService } from '@/app/lib/services/completedTaskService';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { validateRequest } from '@/app/lib/validation/middleware';
import { z } from 'zod';

export const GET = createApiHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    // Await params in Next.js 15
    const resolvedParams = await params;

    const completedTask = await completedTaskService.getById(parseInt(resolvedParams.id, 10));
    if (!completedTask) {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
    return successResponse(completedTask);
  }
);

// Schema for updating payment status
const updatePaymentStatusSchema = z.object({
  payment_status: z.enum(['Unpaid', 'Paid']),
});

export const PUT = createApiHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    // Await params in Next.js 15
    const resolvedParams = await params;

    const validation = await validateRequest(request, updatePaymentStatusSchema);
    if (!validation.success) {
      return validation.error;
    }

    const updatedTask = await completedTaskService.updatePaymentStatus(
      parseInt(resolvedParams.id, 10),
      validation.data.payment_status
    );

    if (!updatedTask) {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }

    return successResponse(updatedTask);
  }
);

export const DELETE = createApiHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    // Await params in Next.js 15
    const resolvedParams = await params;

    const success = await completedTaskService.delete(parseInt(resolvedParams.id, 10));
    if (!success) {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
    return successResponse({ message: 'Completed task deleted successfully' });
  }
);

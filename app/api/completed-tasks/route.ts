import { NextResponse } from 'next/server';
import { completedTaskRepository } from '@/app/lib/completedTaskRepository';
import { CreateCompletedTaskInput } from '@/app/types/completedTask';
import { taskRepository } from '@/app/lib/taskRepository';
import { userRepository } from '@/app/lib/userRepository';
import { piggyBankTransactionRepository } from '@/app/lib/piggyBankTransactionRepository';

export async function GET() {
  try {
    const completedTasks = await completedTaskRepository.getAll();
    return NextResponse.json(completedTasks);
  } catch (error) {
    console.error('Failed to fetch completed tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch completed tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const completedTaskData: CreateCompletedTaskInput = await request.json();
    const newCompletedTask = await completedTaskRepository.create(completedTaskData);

    // Fetch additional data for the response
    const taskDetails = await taskRepository.getById(completedTaskData.task_id.toString());
    const userDetails = await userRepository.getById(completedTaskData.user_id.toString());

    const fullCompletedTask = {
      ...newCompletedTask,
      task_title: taskDetails?.title,
      user_name: userDetails?.name,
      icon_name: taskDetails?.icon_name,
      user_icon: userDetails?.icon,
    };

    return NextResponse.json(fullCompletedTask, { status: 201 });
  } catch (error) {
    console.error('Failed to create completed task:', error);
    return NextResponse.json({ error: 'Failed to create completed task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log('PUT /api/completed-tasks - Request body:', body);

    const { c_task_id, payment_status } = body;

    // Update the payment status
    const updatedTask = await completedTaskRepository.updatePaymentStatus(
      c_task_id,
      payment_status
    );
    console.log('Updated task details:', updatedTask);

    if (!updatedTask) {
      console.error('Task not found for c_task_id:', c_task_id);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Fetch full task details using the optimized query
    const fullTaskDetails = await completedTaskRepository.getFullTaskDetails(c_task_id);
    console.log('Full task details with account:', fullTaskDetails);

    if (!fullTaskDetails) {
      console.error('Failed to fetch full task details for c_task_id:', c_task_id);
      return NextResponse.json({ error: 'Failed to fetch full task details' }, { status: 500 });
    }

    // Handle transaction creation if the task is approved
    if (
      payment_status === 'Approved' &&
      fullTaskDetails.piggybank_account_id &&
      fullTaskDetails.payout_value
    ) {
      console.log('Creating transaction with details:', {
        accountId: fullTaskDetails.piggybank_account_id,
        amount: fullTaskDetails.payout_value,
        taskTitle: fullTaskDetails.task_title,
        taskId: c_task_id,
      });

      const transactionCreated = await piggyBankTransactionRepository.createTransaction(
        fullTaskDetails.piggybank_account_id,
        Number(fullTaskDetails.payout_value),
        fullTaskDetails.task_title || 'Task Payment',
        c_task_id
      );

      if (!transactionCreated) {
        console.error('Failed to create transaction for c_task_id:', c_task_id);
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
      }
      console.log('Transaction created successfully');
    }

    return NextResponse.json(fullTaskDetails);
  } catch (error) {
    console.error('Failed to update completed task. Error:', error);
    return NextResponse.json({ error: 'Failed to update completed task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const c_task_id = searchParams.get('c_task_id');
    if (!c_task_id) {
      return NextResponse.json({ error: 'c_task_id is required' }, { status: 400 });
    }
    const deletedTask = await completedTaskRepository.delete(Number(c_task_id));
    if (!deletedTask) {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Completed task deleted successfully' });
  } catch (error) {
    console.error('Failed to delete completed task:', error);
    return NextResponse.json({ error: 'Failed to delete completed task' }, { status: 500 });
  }
}

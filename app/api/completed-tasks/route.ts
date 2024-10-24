import { NextResponse } from 'next/server';
import { completedTaskRepository } from '@/app/lib/completedTaskRepository';
import { CreateCompletedTaskInput } from '@/app/types/completedTask';
import { taskRepository } from '@/app/lib/taskRepository';
import { userRepository } from '@/app/lib/userRepository';
import { piggyBankAccountRepository } from '@/app/lib/piggyBankAccountRepository';
import { piggyBankTransactionRepository } from '@/app/lib/piggyBankTransactionRepository';

export async function GET(request: Request) {
  try {
    const completedTasks = await completedTaskRepository.getAll();
    console.log('Completed Tasks:', completedTasks); // Added for debugging
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
    const { c_task_id, payment_status } = await request.json();
    const updatedCompletedTask = await completedTaskRepository.updatePaymentStatus(
      c_task_id,
      payment_status
    );

    if (!updatedCompletedTask) {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }

    if (payment_status === 'Approved') {
      // Fetch the user's piggy bank account
      const piggyBankAccount = await piggyBankAccountRepository.getByUserId(
        updatedCompletedTask.user_id
      );

      if (!piggyBankAccount) {
        return NextResponse.json({ error: 'Piggy bank account not found' }, { status: 404 });
      }

      // Create a new transaction
      await piggyBankTransactionRepository.addTransaction({
        account_id: piggyBankAccount.account_id,
        amount: updatedCompletedTask.payout_value,
        transaction_type: 'deposit',
        description: `Payment for task: ${updatedCompletedTask.task_title}`,
        photo: null,
      });

      // Update the account balance
      await piggyBankAccountRepository.updateBalance(
        piggyBankAccount.account_id,
        parseFloat(updatedCompletedTask.payout_value)
      );
    }

    return NextResponse.json(updatedCompletedTask);
  } catch (error) {
    console.error('Failed to update completed task:', error);
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

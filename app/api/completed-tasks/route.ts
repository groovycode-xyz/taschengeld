import { NextResponse } from 'next/server';
import { completedTaskRepository } from '@/app/lib/completedTaskRepository';
import { CreateCompletedTaskInput } from '@/app/types/completedTask';
import { taskRepository } from '@/app/lib/taskRepository';
import { userRepository } from '@/app/lib/userRepository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    let completedTasks;
    if (userId) {
      completedTasks = await completedTaskRepository.getByUserId(parseInt(userId, 10));
    } else {
      completedTasks = await completedTaskRepository.getAll();
    }
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
    const taskDetails = await taskRepository.getById(completedTaskData.task_id);
    const userDetails = await userRepository.getById(completedTaskData.user_id);

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

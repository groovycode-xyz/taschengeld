import { NextResponse } from 'next/server';
import { db } from '@/app/lib/mockDb';

export async function POST(request: Request) {
  const body = await request.json();
  const newTask = db.tasks.create(body);
  return NextResponse.json(newTask, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  let tasks = db.tasks.getAll();

  if (status && status !== 'all') {
    tasks = tasks.filter((task) => task.isActive === (status === 'active'));
  }

  if (sort) {
    tasks.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'createdAt') return a.createdAt.getTime() - b.createdAt.getTime();
      if (sort === 'payoutValue') return a.payoutValue - b.payoutValue;
      return 0;
    });

    if (order === 'desc') tasks.reverse();
  }

  return NextResponse.json(tasks);
}

'use client';

import React, { useState, useEffect } from 'react';
import { CompletedTask } from '@/app/types/completedTask';
import { CompletedTaskCard } from './completed-task-card';

export function Payday() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTaskIds, setLoadingTaskIds] = useState<number[]>([]);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/completed-tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch completed tasks');
      }
      const data = await response.json();
      const unpaidTasks = data.filter((task: CompletedTask) => task.payment_status === 'Unpaid');
      setCompletedTasks(unpaidTasks);
    } catch (err) {
      console.error('Error fetching completed tasks:', err);
      setError('Failed to load completed tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (cTaskId: number, newStatus: string) => {
    setLoadingTaskIds((prev) => [...prev, cTaskId]);
    try {
      const response = await fetch('/api/completed-tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ c_task_id: cTaskId, payment_status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process task');
      }

      const updatedTask = await response.json();
      console.log('Task processed successfully:', updatedTask);

      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.c_task_id !== cTaskId));
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError(error instanceof Error ? error.message : 'Failed to process task');
    } finally {
      setLoadingTaskIds((prev) => prev.filter((id) => id !== cTaskId));
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payday</h1>
      {completedTasks.length === 0 ? (
        <p>No unpaid tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedTasks.map((task) => (
            <CompletedTaskCard
              key={task.c_task_id}
              task={task}
              onUpdateStatus={handleUpdatePaymentStatus}
              isLoading={loadingTaskIds.includes(task.c_task_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

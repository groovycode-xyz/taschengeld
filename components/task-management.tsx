'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ClipboardListIcon } from 'lucide-react';
import { AddTaskModal } from './add-task-modal';
import { EditTaskModal } from './edit-task-modal';
import { Task } from '@/app/types/task';
import { IconComponent } from './icon-component';
import { CurrencyDisplay } from '@/components/ui/currency-display';

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 5000); // Clear error after 5 seconds
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error]);

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (newTask: Omit<Task, 'task_id' | 'created_at' | 'updated_at'>) => {
    try {
      const taskWithPayoutValue = {
        ...newTask,
        payout_value: newTask.payout_value || 0, // Provide a default value if not set
      };
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithPayoutValue),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const task = await response.json();
      setTasks((prevTasks) => [...prevTasks, task]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleEditTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      console.log('Updating task:', taskId, updatedTask); // Add this log
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }
      const task = await response.json();
      setTasks((prevTasks) => prevTasks.map((t) => (t.task_id === task.task_id ? task : t)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          setError(
            'This task has unpaid completed entries and cannot be deleted. Please process (approve or reject) all unpaid entries for this task first.'
          );
          return;
        }
        throw new Error(errorData.error || 'Failed to delete task');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== taskId));
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(
        'Unable to delete this task. It may have unpaid completed entries that need to be processed first.'
      );
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(
      (task) =>
        statusFilter === 'all' ||
        (statusFilter === 'active' && task.is_active) ||
        (statusFilter === 'inactive' && !task.is_active)
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'payout_value') return b.payout_value - a.payout_value;
      if (sortBy === 'created_at')
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='p-8 bg-[#FBFBFB] rounded-2xl space-y-8 max-w-7xl mx-auto'>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'>
          <span className='block sm:inline'>{error}</span>
          <span
            className='absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer'
            onClick={() => setError(null)}
          >
            ×
          </span>
        </div>
      )}

      <div className='flex justify-between items-center pb-6 border-b border-gray-200'>
        <h1 className='text-3xl font-bold flex items-center'>
          <ClipboardListIcon className='mr-3 h-10 w-10' />
          Task Management
        </h1>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className='bg-blue-500 hover:bg-blue-600 text-white'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Task
        </Button>
      </div>

      <div className='flex space-x-4 mb-4'>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Filter tasks' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Tasks</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='inactive'>Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Sort tasks' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='title'>Sort by Title</SelectItem>
            <SelectItem value='payout_value'>Sort by Payout</SelectItem>
            <SelectItem value='created_at'>Sort by Created Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {filteredAndSortedTasks.map((task) => (
          <Card
            key={task.task_id}
            className={`cursor-pointer transition-all duration-300 shadow-md
              ${
                task.is_active ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            onClick={() => {
              setEditingTask(task);
              setIsEditModalOpen(true);
            }}
          >
            <CardContent className='p-4 flex flex-col items-center text-center'>
              <div className='h-20 w-20 mb-2'>
                <IconComponent
                  icon={task.icon_name}
                  className={`h-full w-full ${task.is_active ? 'text-blue-600' : 'text-gray-400'}`}
                />
              </div>
              <h3
                className={`text-lg font-semibold mb-1 ${
                  task.is_active ? 'text-blue-600' : 'text-gray-500'
                } ${task.is_active ? '' : 'italic'}`}
              >
                {task.title}
              </h3>
              <p className='text-xl font-bold text-green-600'>
                <CurrencyDisplay
                  value={task.payout_value}
                  className='text-xl font-bold text-green-600'
                />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTask}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        task={editingTask}
      />
    </div>
  );
}

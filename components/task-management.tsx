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
import { Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AddTaskModal } from './add-task-modal';
import { EditTaskModal } from './edit-task-modal';
import { Task } from '@/app/types/task';
import { IconComponent } from './icon-component';

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    // Mock data for testing
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Clean Room',
        description: 'Tidy up the bedroom',
        iconName: 'broom',
        soundUrl: '/sounds/clean.mp3',
        payoutValue: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Do Homework',
        description: 'Complete all assigned homework',
        iconName: 'book',
        soundUrl: null,
        payoutValue: 3.5,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setTasks(mockTasks);
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prevTasks) => [...prevTasks, task]);
    setIsAddModalOpen(false);
  };

  const handleEditTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task))
    );
    setIsEditModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setIsEditModalOpen(false);
  };

  const filteredAndSortedTasks = tasks
    .filter(
      (task) =>
        statusFilter === 'all' ||
        (statusFilter === 'active' && task.isActive) ||
        (statusFilter === 'inactive' && !task.isActive)
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'payoutValue') return b.payoutValue - a.payoutValue;
      if (sortBy === 'createdAt') return b.createdAt.getTime() - a.createdAt.getTime();
      return 0;
    });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Sort by Title</SelectItem>
            <SelectItem value="payoutValue">Sort by Payout</SelectItem>
            <SelectItem value="createdAt">Sort by Created Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedTasks.map((task) => (
            <Card
              key={task.id}
              className={`cursor-pointer transition-all duration-300 ${
                task.isActive ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => {
                setEditingTask(task);
                setIsEditModalOpen(true);
              }}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="h-16 w-16 flex-shrink-0">
                  <IconComponent
                    icon={task.iconName}
                    className={`h-full w-full ${task.isActive ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                </div>
                <div
                  className={`flex-grow flex justify-between items-center ${
                    task.isActive ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  <h3 className={`text-lg font-bold ${task.isActive ? '' : 'italic'}`}>
                    {task.title}
                  </h3>
                  <p className="text-lg font-bold">{task.payoutValue.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTask}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        task={editingTask}
      />
    </div>
  );
}

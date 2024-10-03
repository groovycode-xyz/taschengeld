"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { AddTaskModal } from "./add-task-modal";
import { EditTaskModal } from "./edit-task-modal";
import { Task } from "@/app/types/task";
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
        taskId: 1,
        title: "Clean Room",
        description: "Tidy up and organize your bedroom",
        icon: "broom",
        sound: "chime.mp3",
        payoutValue: 5.00,
        activeStatus: true,
        createdAt: new Date()
      },
      {
        taskId: 2,
        title: "Do Homework",
        description: "Complete all assigned homework",
        icon: "book",
        sound: null,
        payoutValue: 3.50,
        activeStatus: true,
        createdAt: new Date()
      }
    ];
    setTasks(mockTasks);
  };

  const handleAddTask = (newTask: Omit<Task, 'taskId' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      taskId: tasks.length + 1,
      createdAt: new Date()
    };
    setTasks(prevTasks => [...prevTasks, task]);
    setIsAddModalOpen(false);
  };

  const handleEditTask = (taskId: number, updatedTask: Partial<Task>) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.taskId === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
    setIsEditModalOpen(false);
  };

  const handleToggleStatus = (taskId: number) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.taskId === taskId ? { ...task, activeStatus: !task.activeStatus } : task
    ));
  };

  const filteredAndSortedTasks = tasks
    .filter(task => statusFilter === 'all' || 
      (statusFilter === 'active' && task.activeStatus) || 
      (statusFilter === 'inactive' && !task.activeStatus))
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
        <Button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 text-lg">
          <Plus className="mr-2 h-5 w-5" /> Add Task
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedTasks.map((task) => (
            <Card 
              key={task.taskId} 
              className={`transition-all duration-300 ${task.activeStatus ? 'bg-white' : 'bg-gray-100 opacity-60'}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <IconComponent icon={task.icon} className="w-16 h-16 mb-2" />
                  <h3 className="text-xl font-semibold text-center">{task.title}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">{task.payoutValue.toFixed(2)}</p>
                  <Switch
                    checked={task.activeStatus}
                    onCheckedChange={() => handleToggleStatus(task.taskId)}
                  />
                </div>
                <Button
                  className="w-full mt-4 py-2"
                  variant="outline"
                  onClick={() => {
                    setEditingTask(task);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
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
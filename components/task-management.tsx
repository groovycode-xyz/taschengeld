"use client"

import React, { useState, useEffect } from 'react';
import { Task } from '@/app/types/task';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AddTaskModal } from "./add-task-modal";
import { EditTaskModal } from "./edit-task-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label"; // Add this import
import { 
  BeakerIcon, 
  BookOpenIcon, 
  BriefcaseIcon, 
  CalculatorIcon, 
  CalendarIcon 
} from '@heroicons/react/24/solid';

const iconComponents = {
  beaker: BeakerIcon,
  book: BookOpenIcon,
  briefcase: BriefcaseIcon,
  calculator: CalculatorIcon,
  calendar: CalendarIcon,
  // Add more mappings as needed
};

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, sortBy]);

  const fetchTasks = async () => {
    const response = await fetch(`/api/tasks?status=${statusFilter}&sort=${sortBy}`);
    const data = await response.json();
    setTasks(data);
  };

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    const createdTask = await response.json();
    setTasks([...tasks, createdTask]);
  };

  const handleEditTask = async (taskId: string, updatedTask: Partial<Task>) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
    const editedTask = await response.json();
    setTasks(tasks.map(task => task.id === taskId ? editedTask : task));
  };

  const handleDeleteTask = async () => {
    if (deletingTask) {
      const response = await fetch(`/api/tasks/${deletingTask.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== deletingTask.id));
      }
    }
    setIsDeleteModalOpen(false);
    setDeletingTask(null);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  // Add this function
  const openDeleteModal = (task: Task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Task Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" /> Add New Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row mb-6 space-y-2 sm:space-y-0 sm:space-x-2">
        <div>
          <Label htmlFor="status-filter">Filter by status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter" className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sort-by">Sort by</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-by" className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Alphabetical</SelectItem>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="payoutValue">Payout Value</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const IconComponent = iconComponents[task.iconName as keyof typeof iconComponents] || BeakerIcon;
            return (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-center">
                    <IconComponent className="w-8 h-8 mr-2" />
                    <CardTitle>{task.title}</CardTitle>
                  </div>
                  <CardDescription>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${task.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {task.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{task.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-bold">${task.payoutValue.toFixed(2)}</span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(task)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openDeleteModal(task)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

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
        task={editingTask}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        taskTitle={deletingTask?.title || ''}
      />
    </div>
  );
}
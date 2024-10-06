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
import { ScrollArea } from '@/components/ui/scroll-area';
import { CompletedTaskCard } from './completed-task-card';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types/user';
import { CompletedTask } from '@/types/task';
import { getMockDb } from '@/app/lib/mockDb';
import { BanknoteIcon, FilterIcon, SortAscIcon } from 'lucide-react';

export function Payday() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'payout_value'>('created_at');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    fetchCompletedTasks();
    fetchUsers();
  }, []);

  const fetchCompletedTasks = async () => {
    const mockDb = getMockDb();
    const tasks = mockDb.completedTasks.getAll();
    const mappedTasks: CompletedTask[] = tasks.map((task) => ({
      id: task.c_task_id,
      title: task.title,
      description: task.title,
      iconName: 'task-icon',
      soundUrl: null,
      payoutValue: task.payout_value,
      isActive: true,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.created_at),
      userId: task.user_id,
      userName: '',
      userIcon: '',
      completedAt: new Date(task.created_at),
      status: task.payment_status === 'Unpaid' ? 'pending' : 'approved',
      taskId: task.task_id,
    }));
    setCompletedTasks(mappedTasks);
  };

  const fetchUsers = async () => {
    const mockDb = getMockDb();
    const allUsers = mockDb.users.getAll();
    const childUsers = allUsers.filter((user) => user.role === 'child');
    setUsers(childUsers as User[]);
  };

  const handleApprove = (taskId: string, modifiedPayoutValue: number) => {
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'approved', payoutValue: modifiedPayoutValue }
          : task
      )
    );
  };

  const handleReject = (taskId: string) => {
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: 'rejected' } : task))
    );
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredAndSortedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredAndSortedTasks.map((task) => task.id));
    }
  };

  const handleBulkApprove = () => {
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, status: 'approved' } : task
      )
    );
    setSelectedTasks([]);
  };

  const handleBulkReject = () => {
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, status: 'rejected' } : task
      )
    );
    setSelectedTasks([]);
  };

  const filteredAndSortedTasks = completedTasks
    .filter((task) => selectedUser === 'all' || task.userId === selectedUser)
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return b.completedAt.getTime() - a.completedAt.getTime();
      } else {
        return b.payoutValue - a.payoutValue;
      }
    });

  return (
    <div>
      <div className="flex items-center mb-6">
        <BanknoteIcon className="w-8 h-8 mr-2 text-green-500" />
        <h1 className="text-3xl font-bold">Payday</h1>
      </div>

      <div className="space-y-6">
        <p className="text-gray-600">Review and approve completed tasks for child users</p>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center">
              <FilterIcon className="w-5 h-5 mr-2 text-gray-500" />
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <SortAscIcon className="w-5 h-5 mr-2 text-gray-500" />
              <Select
                value={sortBy}
                onValueChange={(value: 'created_at' | 'payout_value') => setSortBy(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Completed</SelectItem>
                  <SelectItem value="payout_value">Payout Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="selectAll"
              checked={selectedTasks.length === filteredAndSortedTasks.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="selectAll" className="text-sm font-medium">
              Select All
            </label>
          </div>

          {selectedTasks.length > 0 && (
            <div className="mb-4 space-x-2">
              <Button
                onClick={handleBulkApprove}
                className="bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                Approve Selected
              </Button>
              <Button
                onClick={handleBulkReject}
                className="bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Reject Selected
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {filteredAndSortedTasks.map((task) => (
              <CompletedTaskCard
                key={task.id}
                task={task}
                onSelect={handleSelectTask}
                onApprove={handleApprove}
                onReject={handleReject}
                isSelected={selectedTasks.includes(task.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

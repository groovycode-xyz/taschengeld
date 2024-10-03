"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { IconComponent } from './icon-component';
import { Checkbox } from "@/components/ui/checkbox";
import { CompletedTaskCard } from './completed-task-card';

type CompletedTask = {
  id: string;
  taskId: number;
  userId: string;
  userName: string;
  userIcon: string;
  title: string;
  icon: string;
  payoutValue: number;
  completedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
};

type User = {
  id: string;
  name: string;
};

export function PaydayInterface() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'completedAt' | 'payoutValue'>('completedAt');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    fetchCompletedTasks();
    fetchUsers();
  }, []);

  const fetchCompletedTasks = async () => {
    // Mock data for now. Replace with actual API call later.
    const mockTasks: CompletedTask[] = [
      { id: '1', taskId: 1, userId: '1', userName: 'John Doe', userIcon: 'user', title: 'Clean Room', icon: 'broom', payoutValue: 5.00, completedAt: new Date('2024-03-01'), status: 'pending' },
      { id: '2', taskId: 2, userId: '2', userName: 'Jane Doe', userIcon: 'smile', title: 'Do Homework', icon: 'book', payoutValue: 3.50, completedAt: new Date('2024-03-02'), status: 'pending' },
      { id: '3', taskId: 3, userId: '1', userName: 'John Doe', userIcon: 'user', title: 'Walk Dog', icon: 'dog', payoutValue: 2.00, completedAt: new Date('2024-03-03'), status: 'pending' },
    ];
    setCompletedTasks(mockTasks);
  };

  const fetchUsers = async () => {
    // Mock data for now. Replace with actual API call later.
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Doe' },
    ];
    setUsers(mockUsers);
  };

  const handleApprove = (taskId: string, modifiedPayoutValue: number) => {
    setCompletedTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: 'approved', payoutValue: modifiedPayoutValue } : task
      )
    );
  };

  const handleReject = (taskId: string) => {
    setCompletedTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: 'rejected' } : task
      )
    );
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredAndSortedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredAndSortedTasks.map(task => task.id));
    }
  };

  const handleBulkApprove = () => {
    setCompletedTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTasks.includes(task.id) ? { ...task, status: 'approved' } : task
      )
    );
    setSelectedTasks([]);
  };

  const handleBulkReject = () => {
    setCompletedTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTasks.includes(task.id) ? { ...task, status: 'rejected' } : task
      )
    );
    setSelectedTasks([]);
  };

  const filteredAndSortedTasks = completedTasks
    .filter(task => selectedUser === 'all' || task.userId === selectedUser)
    .sort((a, b) => {
      if (sortBy === 'completedAt') {
        return b.completedAt.getTime() - a.completedAt.getTime();
      } else {
        return b.payoutValue - a.payoutValue;
      }
    });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Payday Review</h1>
      <p className="text-gray-600 mb-4">Review and approve completed tasks</p>
      
      <div className="flex space-x-4 mb-4">
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={(value: 'completedAt' | 'payoutValue') => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completedAt">Date Completed</SelectItem>
            <SelectItem value="payoutValue">Payout Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          checked={selectedTasks.length === filteredAndSortedTasks.length}
          onCheckedChange={handleSelectAll}
        />
        <span>Select All</span>
      </div>

      {selectedTasks.length > 0 && (
        <div className="mb-4 space-x-2">
          <Button onClick={handleBulkApprove} className="bg-green-500 hover:bg-green-600 text-white">
            Approve Selected
          </Button>
          <Button onClick={handleBulkReject} className="bg-red-500 hover:bg-red-600 text-white">
            Reject Selected
          </Button>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-200px)]">
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
  );
}
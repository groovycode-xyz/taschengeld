"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { IconComponent } from './icon-component';

type CompletedTask = {
  id: string;
  taskId: number;
  userId: string;
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

  useEffect(() => {
    fetchCompletedTasks();
    fetchUsers();
  }, []);

  const fetchCompletedTasks = async () => {
    // Mock data for now. Replace with actual API call later.
    const mockTasks: CompletedTask[] = [
      { id: '1', taskId: 1, userId: '1', title: 'Clean Room', icon: 'broom', payoutValue: 5.00, completedAt: new Date('2024-03-01'), status: 'pending' },
      { id: '2', taskId: 2, userId: '2', title: 'Do Homework', icon: 'book', payoutValue: 3.50, completedAt: new Date('2024-03-02'), status: 'pending' },
      { id: '3', taskId: 3, userId: '1', title: 'Walk Dog', icon: 'dog', payoutValue: 2.00, completedAt: new Date('2024-03-03'), status: 'pending' },
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

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {filteredAndSortedTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <IconComponent icon={task.icon} className="h-8 w-8" />
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      {task.completedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    defaultValue={task.payoutValue.toFixed(2)}
                    className="w-20"
                    step="0.01"
                    min="0"
                  />
                  <Button onClick={() => handleApprove(task.id, task.payoutValue)}>Approve</Button>
                  <Button variant="outline" onClick={() => handleReject(task.id)}>Reject</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserCard } from './user-card';
import { AddUserModal } from './add-user-modal';
import { EditUserModal } from './edit-user-modal';
import { User } from '@/app/types/user';
import { Plus } from 'lucide-react';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Mock data for now. Replace with actual API call later.
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe', icon: 'user', sound: null, birthday: '1990-01-01', role: 'parent' },
      { id: '2', name: 'Jane Doe', icon: 'smile', sound: 'chime', birthday: '2010-05-15', role: 'child' },
      { id: '3', name: 'Alice Smith', icon: 'heart', sound: null, birthday: '1985-03-20', role: 'parent' },
      { id: '4', name: 'Bob Johnson', icon: 'star', sound: 'bell', birthday: '2012-11-30', role: 'child' },
    ];
    setUsers(mockUsers);
  };

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: (users.length + 1).toString(),
    };
    setUsers(prevUsers => [...prevUsers, user]);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (userId: string, updatedUser: Partial<User>) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, ...updatedUser } : user
    ));
    setIsEditModalOpen(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onClick={() => {
              setEditingUser(user);
              setIsEditModalOpen(true);
            }}
          />
        ))}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditUser={handleEditUser}
        user={editingUser}
      />
    </div>
  );
}
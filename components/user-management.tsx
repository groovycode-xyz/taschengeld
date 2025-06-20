'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserCard } from './user-card';
import { AddUserModal } from './add-user-modal';
import { EditUserModal } from './edit-user-modal';
import { User, CreateUserInput } from '@/app/types/user';
import { Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/components/context/user-context';

// UserManagement component: Handles user profile management
// Allows creating, editing, and deleting user profiles
export function UserManagement() {
  const { users, isLoading, error, refreshUsers } = useUsers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const router = useRouter();

  const handleAddUser = async (newUser: CreateUserInput) => {
    try {
      console.log('Creating user with data:', newUser);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to add user');
      }

      await refreshUsers(); // Refresh the users list
      setIsAddModalOpen(false);
      router.refresh();
      return response;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const handleEditUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`/api/users/${updatedUser.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error('Failed to update user');

      await refreshUsers();
      setIsEditModalOpen(false);
      setEditingUser(null);
      router.refresh();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      if (!userId) {
        throw new Error('User ID is undefined');
      }
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      await refreshUsers();
      setIsEditModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-background'>
      {/* Fixed Header */}
      <div className='p-8 bg-secondary'>
        <div className='flex items-center justify-between pb-6 border-b border-border'>
          <div className='flex items-center space-x-4'>
            <Users className='h-8 w-8 text-foreground' />
            <h1 className='text-3xl font-medium text-foreground'>User Management</h1>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Add User
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-secondary'>
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {users
            .sort((a, b) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime())
            .map((user) => (
              <UserCard
                key={user.user_id}
                user={user}
                onClick={() => {
                  setEditingUser(user);
                  setIsEditModalOpen(true);
                }}
              />
            ))}
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />

      {editingUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          user={editingUser}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserCard } from './user-card';
import { AddUserModal } from './add-user-modal';
import { EditUserModal } from './edit-user-modal';
import { User, CreateUserInput } from '@/app/types/user';
import { Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

// UserManagement component: Handles user profile management
// Allows creating, editing, and deleting user profiles
export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      console.log('Fetched users:', data); // Debug log
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (newUser: CreateUserInput) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      await fetchUsers(); // Refresh the users list
      setIsAddModalOpen(false);
      router.refresh();
      return response;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (updatedUser: User) => {
    try {
      console.log('Updating user:', updatedUser); // Debug log
      const response = await fetch(`/api/users/${updatedUser.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error('Failed to update user');

      await fetchUsers();
      setIsEditModalOpen(false);
      setEditingUser(null);
      router.refresh();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
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

      await fetchUsers();
      setIsEditModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-background'>
      {/* Fixed Header */}
      <div className='p-8 bg-background-secondary'>
        <div className='flex items-center justify-between pb-6 border-b border-border'>
          <div className='flex items-center space-x-4'>
            <Users className='h-8 w-8 text-content-primary' />
            <h1 className='text-3xl font-medium text-content-primary'>User Management</h1>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Add User
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-background-secondary'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
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
        onDeleteUser={handleDeleteUser}
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

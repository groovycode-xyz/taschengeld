"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddUserModal } from "./add-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";

// Update the User type
type User = {
  id: string;
  name: string;
  icon: string;
  sound: string | null; // Allow null for no sound
  birthday: string;
  role: 'parent' | 'child';
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const onDeleteUser = async () => {
    if (selectedUser) {
      await fetch(`/api/users?id=${selectedUser.id}`, { method: 'DELETE' });
      await fetchUsers();
    }
    setIsDeleteModalOpen(false);
  };

  const onAddUser = async (newUser: Omit<User, 'id'>) => {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    await fetchUsers();
    setIsAddModalOpen(false);
  };

  const onEditUser = async (editedUser: User) => {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedUser),
    });
    await fetchUsers();
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {users.map((user) => (
          <Card key={user.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.name} ({user.role})
              </CardTitle>
              <div>
                <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm">
                <User className="h-4 w-4" />
                <span>Birthday: {user.birthday}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={onAddUser}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditUser={onEditUser}
        user={selectedUser}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteUser}
        userName={selectedUser?.name || ''}
      />
      {/* TODO: Implement DeleteConfirmationModal component */}
    </div>
  );
}
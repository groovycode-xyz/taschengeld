import React, { useState, useEffect } from 'react';
import { User, NewUser } from '@/app/types/user';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UserCard } from '@/components/user-card';
import { AddUserModal } from '@/components/add-user-modal';
import { EditUserModal } from '@/components/edit-user-modal';

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
      {
        id: '1',
        name: 'James',
        icon: 'user-icon',
        sound: null,
        birthday: '1971-11-03',
        role: 'parent',
        iconName: 'user-icon', // {{ Ensure iconName is present }}
      },
      {
        id: '2',
        name: 'Rebekka',
        sound: null,
        birthday: '1985-10-12',
        role: 'parent',
        iconName: 'user-icon', // {{ Ensure iconName is present }}
        // Removed 'soundUrl'
      },
      {
        id: '3',
        name: 'Eliana',
        sound: null,
        birthday: '2015-03-26',
        role: 'child',
        iconName: 'user-icon', // {{ Ensure iconName is present }}
        // Removed 'soundUrl'
      },
      {
        id: '4',
        name: 'Ariel',
        sound: null,
        birthday: '2016-12-01',
        role: 'child',
        iconName: 'user-icon', // {{ Ensure iconName is present }}
        // Removed 'soundUrl'
      },
    ];
    setUsers(mockUsers);
  };

  const handleAddUser = (newUser: NewUser) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
    };
    setUsers((prevUsers) => [...prevUsers, user]);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (user: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((prevUser) => (prevUser.id === user.id ? { ...prevUser, ...user } : prevUser))
    );
    setIsEditModalOpen(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!a.birthday || !b.birthday) return 0;
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
              // {{ Pass onClick prop }}
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
        user={editingUser as User} // Add a null check before rendering if necessary
      />
    </div>
  );
}

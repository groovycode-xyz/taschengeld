'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export function TaskCompletion() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Clean room', completed: false },
    { id: 2, name: 'Do homework', completed: false },
    { id: 3, name: 'Take out trash', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Task Completion</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center mb-2">
            <Button
              onClick={() => toggleTask(task.id)}
              variant={task.completed ? 'default' : 'outline'}
              size="sm"
              className="mr-2"
            >
              <CheckCircle
                className={`h-4 w-4 ${task.completed ? 'text-green-500' : 'text-gray-300'}`}
              />
            </Button>
            <span className={task.completed ? 'line-through' : ''}>{task.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

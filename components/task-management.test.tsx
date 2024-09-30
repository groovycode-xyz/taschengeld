import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskManagement } from './task-management';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('TaskManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(<TaskManagement />);
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add new task/i })).toBeInTheDocument();
  });

  it('fetches tasks on mount', async () => {
    render(<TaskManagement />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith('/api/tasks?status=all&sort=title');
  });

  it('opens the add task modal when clicking the Add New Task button', async () => {
    render(<TaskManagement />);
    fireEvent.click(screen.getByRole('button', { name: /add new task/i }));
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /add new task/i })).toBeInTheDocument();
    });
  });

  // Add more tests as needed
});
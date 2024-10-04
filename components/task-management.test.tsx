// Add this import at the top of the test file
import '@testing-library/jest-dom'; // {{ Import jest-dom for extended matchers }}

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskManagement } from './task-management';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('TaskManagement', () => {
  it('renders the component', () => {
    render(<TaskManagement />);
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('fetches tasks on mount', async () => {
    render(<TaskManagement />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith('/api/tasks?status=all&sort=title');
  });

  it('opens the add task modal when clicking the Add Task button', async () => {
    render(<TaskManagement />);
    fireEvent.click(screen.getByText('Add Task'));
    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });
  });
});

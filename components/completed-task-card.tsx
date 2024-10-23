import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompletedTask } from '@/app/types/completedTask';
import { formatCurrency } from '@/lib/utils';

interface CompletedTaskCardProps {
  task: CompletedTask;
  onUpdateStatus: (cTaskId: number, newStatus: string) => void;
}

export function CompletedTaskCard({ task, onUpdateStatus }: CompletedTaskCardProps) {
  const formattedPayout =
    task.payout_value && !isNaN(parseFloat(task.payout_value))
      ? formatCurrency(parseFloat(task.payout_value))
      : 'N/A';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.task_title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Completed by: {task.user_name}</p>
        <p>Payout: {formattedPayout}</p>
        <p>Status: {task.payment_status}</p>
        {task.comment && <p>Comment: {task.comment}</p>}
        {task.attachment && <p>Attachment: {task.attachment}</p>}
        {task.payment_status === 'Unpaid' && (
          <div className="mt-4 space-x-2">
            <Button
              onClick={() => onUpdateStatus(task.c_task_id, 'Approved')}
              className="bg-green-500 hover:bg-green-600"
            >
              Approve
            </Button>
            <Button
              onClick={() => onUpdateStatus(task.c_task_id, 'Rejected')}
              className="bg-red-500 hover:bg-red-600"
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

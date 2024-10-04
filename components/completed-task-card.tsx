import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconComponent } from './icon-component';
import { Checkbox } from '@/components/ui/checkbox';
import { CompletedTask } from '@/app/types/task'; // {{ Import CompletedTask }}

type CompletedTaskCardProps = {
  task: CompletedTask;
  onSelect: (taskId: string) => void;
  onApprove: (taskId: string, payoutValue: number) => void;
  onReject: (taskId: string) => void;
  isSelected: boolean;
};

export function CompletedTaskCard({
  task,
  onSelect,
  onApprove,
  onReject,
  isSelected,
}: CompletedTaskCardProps) {
  const [payoutValue, setPayoutValue] = React.useState(task.payoutValue); // {{ Ensure payoutValue exists }}

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox checked={isSelected} onCheckedChange={() => onSelect(task.id)} />{' '}
          {/* {{ Ensure task.id exists }} */}
          <IconComponent icon={task.iconName} className="h-8 w-8" />{' '}
          {/* {{ Use iconName instead of icon }} */}
          <div>
            <h3 className="font-semibold">{task.title}</h3> {/* {{ Ensure task.title exists }} */}
            <p className="text-sm text-gray-500">{task.completedAt.toLocaleDateString()}</p>{' '}
            {/* {{ Ensure task.completedAt exists }} */}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <IconComponent icon={task.userIcon} className="h-6 w-6" />{' '}
            {/* {{ Ensure task.userIcon exists }} */}
            <span>{task.userName}</span> {/* {{ Ensure task.userName exists }} */}
          </div>
          <Input
            type="number"
            value={payoutValue.toFixed(2)}
            className="w-20"
            step="0.01"
            min="0"
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              if (!isNaN(newValue)) {
                setPayoutValue(newValue);
              }
            }}
          />
          <Button
            onClick={() => onApprove(task.id, payoutValue)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={() => onReject(task.id)}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

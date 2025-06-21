import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconComponentProps = {
  icon?: string | null;
  className?: string;
};

export const IconComponent: React.FC<IconComponentProps> = ({ icon, className }) => {
  if (!icon) {
    // Return a default icon or null if no icon is provided
    return <LucideIcons.HelpCircle className={className} />;
  }

  const pascalCaseIcon = icon
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const IconElement = LucideIcons[pascalCaseIcon as keyof typeof LucideIcons] as React.ElementType;

  if (!IconElement) {
    return <LucideIcons.HelpCircle className={className} />;
  }

  return <IconElement className={className} />;
};

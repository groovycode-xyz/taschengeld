import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconComponentProps = {
  icon: string;
  className?: string;
};

export const IconComponent: React.FC<IconComponentProps> = ({ icon, className }) => {
  const pascalCaseIcon = icon
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  console.log('Icon name:', icon);
  console.log('PascalCase icon name:', pascalCaseIcon);

  const IconElement = LucideIcons[pascalCaseIcon as keyof typeof LucideIcons] as React.ElementType;

  if (!IconElement) {
    console.warn(`Icon "${icon}" not found`);
    return null;
  }

  return <IconElement className={className} />;
};

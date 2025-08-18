'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Fireworks } from './fireworks';

interface FireworksPortalProps {
  onComplete?: () => void;
}

export function FireworksPortal({ onComplete }: FireworksPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  // Create a portal to render the Fireworks at the body level
  return createPortal(<Fireworks onComplete={onComplete} />, document.body);
}

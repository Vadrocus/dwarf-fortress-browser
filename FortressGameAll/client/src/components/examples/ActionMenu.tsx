import { useState } from 'react';
import ActionMenu from '../ActionMenu';

export default function ActionMenuExample() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleActionSelect = (action: 'mine' | 'build_workshop' | 'build_house' | 'build_nursery' | 'zone') => {
    console.log('Selected action:', action);
    setSelectedAction(action);
  };
  
  return (
    <ActionMenu
      onActionSelect={handleActionSelect}
      selectedAction={selectedAction}
    />
  );
}

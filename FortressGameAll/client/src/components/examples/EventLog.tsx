import EventLog from '../EventLog';
import type { GameMessage } from '@shared/schema';

export default function EventLogExample() {
  const messages: GameMessage[] = [
    {
      id: '1',
      timestamp: Date.now() - 60000,
      text: 'Welcome to Fortress Terminal! Your dwarves have arrived.',
      type: 'success',
    },
    {
      id: '2',
      timestamp: Date.now() - 45000,
      text: 'Urist McStone has started mining.',
      type: 'info',
    },
    {
      id: '3',
      timestamp: Date.now() - 30000,
      text: 'Bomrek mined stone.',
      type: 'info',
    },
    {
      id: '4',
      timestamp: Date.now() - 15000,
      text: 'Workshop construction complete.',
      type: 'success',
    },
    {
      id: '5',
      timestamp: Date.now() - 5000,
      text: 'Stone supplies running low!',
      type: 'warning',
    },
  ];
  
  return <EventLog messages={messages} />;
}

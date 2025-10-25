import { useState } from 'react';
import ControlPanel from '../ControlPanel';

export default function ControlPanelExample() {
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  
  return (
    <ControlPanel
      isPaused={isPaused}
      gameSpeed={gameSpeed}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onSpeedChange={setGameSpeed}
    />
  );
}

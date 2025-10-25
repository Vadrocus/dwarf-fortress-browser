import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, FastForward, Zap } from 'lucide-react';

interface ControlPanelProps {
  isPaused: boolean;
  gameSpeed: number;
  onPauseToggle: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function ControlPanel({
  isPaused,
  gameSpeed,
  onPauseToggle,
  onSpeedChange,
}: ControlPanelProps) {
  return (
    <Card className="font-mono">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider">Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant={isPaused ? 'default' : 'secondary'}
          size="sm"
          onClick={onPauseToggle}
          className="w-full"
          data-testid="button-pause-toggle"
        >
          {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground mb-2">Game Speed</div>
          <div className="flex gap-1">
            <Button
              variant={gameSpeed === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(1)}
              className="flex-1 text-xs"
              data-testid="button-speed-1"
            >
              1x
            </Button>
            <Button
              variant={gameSpeed === 2 ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(2)}
              className="flex-1 text-xs"
              data-testid="button-speed-2"
            >
              <FastForward className="w-3 h-3 mr-1" />
              2x
            </Button>
            <Button
              variant={gameSpeed === 4 ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(4)}
              className="flex-1 text-xs"
              data-testid="button-speed-4"
            >
              <Zap className="w-3 h-3 mr-1" />
              4x
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

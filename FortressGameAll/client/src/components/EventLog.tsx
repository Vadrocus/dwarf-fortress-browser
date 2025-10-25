import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GameMessage } from '@shared/schema';

interface EventLogProps {
  messages: GameMessage[];
}

const MESSAGE_COLORS: Record<string, string> = {
  info: 'text-foreground',
  warning: 'text-destructive',
  success: 'text-chart-2',
  error: 'text-destructive',
};

export default function EventLog({ messages }: EventLogProps) {
  return (
    <Card className="font-mono">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider">Event Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[140px]">
          <div className="space-y-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`text-xs ${MESSAGE_COLORS[msg.type]} leading-relaxed`}
                data-testid={`message-${msg.id}`}
              >
                <span className="text-muted-foreground mr-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                {msg.text}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

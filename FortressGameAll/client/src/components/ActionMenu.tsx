import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pickaxe, Hammer, Box, Home, Baby } from 'lucide-react';

interface ActionMenuProps {
  onActionSelect: (action: 'mine' | 'build_workshop' | 'build_house' | 'build_nursery' | 'zone') => void;
  selectedAction: string | null;
}

export default function ActionMenu({ onActionSelect, selectedAction }: ActionMenuProps) {
  const [activeTab, setActiveTab] = useState('mining');
  
  return (
    <Card className="font-mono">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider">Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mining" className="text-xs" data-testid="tab-mining">
              Mine
            </TabsTrigger>
            <TabsTrigger value="building" className="text-xs" data-testid="tab-building">
              Build
            </TabsTrigger>
            <TabsTrigger value="zones" className="text-xs" data-testid="tab-zones">
              Zones
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mining" className="space-y-2 mt-3">
            <Button
              variant={selectedAction === 'mine' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onActionSelect('mine')}
              className="w-full justify-start"
              data-testid="button-designate-mining"
            >
              <Pickaxe className="w-4 h-4 mr-2" />
              Designate Mining
            </Button>
            <p className="text-xs text-muted-foreground">
              Click on stone or trees to designate them for mining/chopping.
            </p>
          </TabsContent>
          
          <TabsContent value="building" className="space-y-2 mt-3">
            <Button
              variant={selectedAction === 'build_workshop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onActionSelect('build_workshop')}
              className="w-full justify-start"
              data-testid="button-build-workshop"
            >
              <Hammer className="w-4 h-4 mr-2" />
              Build Workshop
            </Button>
            <p className="text-xs text-muted-foreground">
              Requires 5 stone. Craft items and equipment.
            </p>

            <Button
              variant={selectedAction === 'build_house' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onActionSelect('build_house')}
              className="w-full justify-start"
              data-testid="button-build-house"
            >
              <Home className="w-4 h-4 mr-2" />
              Build House
            </Button>
            <p className="text-xs text-muted-foreground">
              Requires 3 stone, 2 wood. Aesthetic dwelling.
            </p>

            <Button
              variant={selectedAction === 'build_nursery' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onActionSelect('build_nursery')}
              className="w-full justify-start"
              data-testid="button-build-nursery"
            >
              <Baby className="w-4 h-4 mr-2" />
              Build Nursery
            </Button>
            <p className="text-xs text-muted-foreground">
              Requires 4 stone, 3 wood. Spawns new dwarves!
            </p>
          </TabsContent>
          
          <TabsContent value="zones" className="space-y-2 mt-3">
            <Button
              variant={selectedAction === 'zone' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onActionSelect('zone')}
              className="w-full justify-start"
              data-testid="button-create-stockpile"
            >
              <Box className="w-4 h-4 mr-2" />
              Create Stockpile
            </Button>
            <p className="text-xs text-muted-foreground">
              Designate areas for storing resources.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

'use client';

import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { type Hotkey } from '@/hooks/use-hotkeys';
import { memo } from 'react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotkeys: Hotkey[];
}

const KeyboardShortcutsModal = memo(({ isOpen, onClose, hotkeys }: KeyboardShortcutsModalProps) => {
  // Group hotkeys by category
  const groupedHotkeys = hotkeys.reduce((acc, hotkey) => {
    const category = hotkey.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(hotkey);
    return acc;
  }, {} as Record<string, Hotkey[]>);

  const formatKeyCombo = (hotkey: Hotkey) => {
    const keys = [];
    if (hotkey.ctrlKey) keys.push('Ctrl');
    if (hotkey.altKey) keys.push('Alt');
    if (hotkey.shiftKey) keys.push('Shift');
    keys.push(hotkey.key === ' ' ? 'Space' : hotkey.key);
    return keys;
  };

  const categoryOrder = ['Navigation', 'Actions', 'Forms', 'Help'];
  const sortedCategories = Object.keys(groupedHotkeys).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>⌨️</span>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate and interact with the application more efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-3 text-primary">{category}</h3>
              <div className="space-y-2">
                {groupedHotkeys[category].map((hotkey, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-sm text-muted-foreground">
                      {hotkey.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {formatKeyCombo(hotkey).map((key, keyIndex) => (
                        <Badge
                          key={keyIndex}
                          variant="outline"
                          className="px-2 py-1 text-xs font-mono bg-background border-border"
                        >
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {category !== sortedCategories[sortedCategories.length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}

          {/* Additional tips */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Pro Tips
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Hotkeys work globally except when typing in form fields</li>
              <li>• Use <Badge variant="outline" className="text-xs">Tab</Badge> and <Badge variant="outline" className="text-xs">Shift+Tab</Badge> to navigate between form fields</li>
              <li>• Press <Badge variant="outline" className="text-xs">Enter</Badge> to submit forms or activate buttons</li>
              <li>• Use <Badge variant="outline" className="text-xs">Ctrl+Enter</Badge> to quickly submit forms</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

KeyboardShortcutsModal.displayName = 'KeyboardShortcutsModal';

export { KeyboardShortcutsModal };

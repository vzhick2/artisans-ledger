/**
 * @context: See .github/copilot-instructions.md - MUST ASK BEFORE CHANGES
 */
import { memo } from 'react';
import packageJson from '../../package.json';

// Build timestamp is generated at build time
const buildTimestamp = new Date().toLocaleString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
});

function FooterComponent() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span className="font-medium">v{packageJson.version}</span>
          <span className="mx-2">•</span>
          <span>Built: {buildTimestamp}</span>
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterComponent);

#!/usr/bin/env node
/**
 * AI-Optimized Component Generator
 * Quickly scaffold new components with proper TypeScript, shadcn/ui patterns
 */

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];
const componentType = process.argv[3] || 'ui'; // ui, page, layout, hook

if (!componentName) {
  console.error('Usage: node scripts/generate-component.js <ComponentName> [ui|page|layout|hook]');
  process.exit(1);
}

const templates = {
  ui: `import * as React from "react"
import { cn } from "@/lib/utils"

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export function ${componentName}({ className, children, ...props }: ${componentName}Props) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}
`,
  page: `'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ${componentName}() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>${componentName}</CardTitle>
          <CardDescription>
            ${componentName} page description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content goes here</p>
        </CardContent>
      </Card>
    </div>
  );
}
`,
  hook: `import { useState, useEffect } from 'react';

export function use${componentName}() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Hook logic here
  }, []);

  return {
    state,
    setState
  };
}
`
};

const getPath = (type, name) => {
  switch (type) {
    case 'ui':
      return `src/components/ui/${name.toLowerCase()}.tsx`;
    case 'page':
      return `src/app/(dashboard)/${name.toLowerCase()}/page.tsx`;
    case 'hook':
      return `src/hooks/use-${name.toLowerCase()}.ts`;
    default:
      return `src/components/${name.toLowerCase()}.tsx`;
  }
};

const filePath = getPath(componentType, componentName);
const dir = path.dirname(filePath);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(filePath, templates[componentType] || templates.ui);
console.log(`✅ Generated ${componentType} component: ${filePath}`);

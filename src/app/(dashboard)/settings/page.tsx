'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Building, 
  DollarSign, 
  Download, 
  Upload,
  Database,
  Shield
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic company information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="Your Company Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
              <Input id="laborRate" type="number" step="0.01" placeholder="15.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value="USD" disabled />
            </div>
            <Button className="w-full">Save General Settings</Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Import and export your inventory data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Import Data</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Items
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Suppliers
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Export Data</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export Items
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Authentication and access control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Phase 2 Feature
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                User authentication and role-based access control will be available 
                in Phase 2 when Supabase authentication is integrated.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>
              Application version and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Version</span>
                <span className="text-sm text-muted-foreground">1.0.0-prototype</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Phase</span>
                <span className="text-sm text-muted-foreground">UI Prototype</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className="text-sm text-muted-foreground">Mock Data</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Authentication</span>
                <span className="text-sm text-muted-foreground">Disabled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Development Notice */}
      <Card>
        <CardHeader>
          <CardTitle>🚧 Development Status</CardTitle>
          <CardDescription>
            Current prototype limitations and next steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  ✅ Phase 1 Complete
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Complete UI with sample data</li>
                  <li>• All core views functional</li>
                  <li>• Business logic prototyped</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  🔄 Phase 2 Next
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Supabase database integration</li>
                  <li>• Real data persistence</li>
                  <li>• PostgreSQL RPC functions</li>
                  <li>• Weighted average costing</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

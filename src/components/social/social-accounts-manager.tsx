 'use client';

import * as React from 'react';
import { Check, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Custom Social Media Icons
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h3z"/>
  </svg>
);

export function SocialAccountsManager(): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Platform Simulation
          <Badge variant="secondary" className="text-xs">Simulation Only</Badge>
        </CardTitle>
        <CardDescription>
          Preview how your content will look on Instagram and Facebook before posting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instagram Section */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
              <InstagramIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Instagram</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Simulation Available
                </p>
                <Badge variant="secondary" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  1.2K
                </Badge>
              </div>
            </div>
          </div>
          <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">
            <Check className="w-3 h-3 mr-1" />
            Available
          </Badge>
        </div>

        {/* Facebook Section */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <FacebookIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Facebook</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Simulation Available
                </p>
                <Badge variant="secondary" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  890
                </Badge>
              </div>
            </div>
          </div>
          <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">
            <Check className="w-3 h-3 mr-1" />
            Available
          </Badge>
        </div>

        {/* Info */}
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Simulation Mode:</strong> Platform previews are available for demonstration. 
            Use the "Preview" button when creating campaigns to see how your content will look.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

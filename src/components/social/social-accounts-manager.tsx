 'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Check, X, Loader2, ExternalLink, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  fetchSocialAccounts,
  connectInstagram,
  connectFacebook,
  disconnectAccount,
  SocialAccount,
} from '@/lib/social';

export function SocialAccountsManager(): React.ReactElement {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<'instagram' | 'facebook' | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await fetchSocialAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading social accounts:', error);
      toast.error('Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: 'instagram' | 'facebook') => {
    setConnecting(platform);
    try {
      if (platform === 'instagram') {
        await connectInstagram();
      } else {
        await connectFacebook();
      }
      // Page will redirect, no need to handle success here
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      toast.error(`Failed to connect ${platform}`);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: 'instagram' | 'facebook') => {
    setDisconnecting(platform);
    try {
      await disconnectAccount(platform);
      toast.success(`${platform} account disconnected`);
      await loadAccounts();
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      toast.error(`Failed to disconnect ${platform}`);
    } finally {
      setDisconnecting(null);
    }
  };

  const getAccount = (platform: 'instagram' | 'facebook') => {
    return accounts.find(a => a.platform === platform && a.connected);
  };

  const instagramAccount = getAccount('instagram');
  const facebookAccount = getAccount('facebook');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Accounts</CardTitle>
          <CardDescription>Connect your accounts to post directly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Social Media Accounts
          <Badge variant="secondary" className="text-xs">Demo Mode</Badge>
        </CardTitle>
        <CardDescription>
          Connect your Instagram and Facebook accounts to post content directly from HolidayBoost
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
              {instagramAccount ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    @{instagramAccount.account_username}
                  </p>
                  {instagramAccount.follower_count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {instagramAccount.follower_count.toLocaleString()}
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {instagramAccount ? (
              <>
                <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisconnect('instagram')}
                  disabled={!!disconnecting}
                >
                  {disconnecting === 'instagram' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleConnect('instagram')}
                disabled={!!connecting}
                size="sm"
              >
                {connecting === 'instagram' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Connect
              </Button>
            )}
          </div>
        </div>

        {/* Facebook Section */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <FacebookIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Facebook</h3>
              {facebookAccount ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {facebookAccount.account_name}
                  </p>
                  {facebookAccount.follower_count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {facebookAccount.follower_count.toLocaleString()}
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {facebookAccount ? (
              <>
                <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisconnect('facebook')}
                  disabled={!!disconnecting}
                >
                  {disconnecting === 'facebook' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleConnect('facebook')}
                disabled={!!connecting}
                size="sm"
              >
                {connecting === 'facebook' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Connect
              </Button>
            )}
          </div>
        </div>

        {/* Demo Mode Info */}
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Demo Mode:</strong> Social media connections and posting are simulated for demonstration purposes. 
            In production, this would integrate with real Instagram and Facebook APIs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

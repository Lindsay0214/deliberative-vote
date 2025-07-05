
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AuthButton() {
  const { user, profile, loading, signInWithGoogle, signOut } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <Button variant="outline" disabled>{t('loading')}</Button>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.name || user.email || ''} />
            <AvatarFallback>
              {profile?.name?.[0] || user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {profile?.name || user.email}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          {t('logout')}
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signInWithGoogle} variant="outline">
      <LogIn className="h-4 w-4 mr-2" />
      {t('login.with.google')}
    </Button>
  );
}

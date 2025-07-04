
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreatePollForm from '@/components/CreatePollForm';
import PollCard from '@/components/PollCard';
import AuthButton from '@/components/AuthButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { usePolls } from '@/hooks/usePolls';
import { useAuth } from '@/hooks/useAuth';

const VotingApp = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { polls, myPolls, loading, createPoll, submitVote } = usePolls();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreatePoll = async (title: string, description: string, optionTexts: string[], expiresAt?: Date) => {
    const result = await createPoll(title, description, optionTexts, expiresAt);
    if (result) {
      setShowCreateForm(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string, reason?: string) => {
    await submitVote(pollId, optionId, reason);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
          <AuthButton />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('voting.system')}</h1>
          <p className="text-muted-foreground">
            {t('voting.description')}
          </p>
        </div>

        {user && (
          <div className="flex justify-center mb-8">
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="lg"
            >
              {showCreateForm ? t('cancel.create') : t('create.new.poll')}
            </Button>
          </div>
        )}

        {showCreateForm && user && (
          <div className="mb-8">
            <CreatePollForm onCreatePoll={handleCreatePoll} />
          </div>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">所有投票</TabsTrigger>
            <TabsTrigger value="mine" disabled={!user}>
              我的投票 {user ? `(${myPolls.length})` : ''}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-8 mt-8">
            {polls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {t('no.polls')}
                </p>
                {!user && (
                  <p className="text-sm text-muted-foreground mt-2">
                    請登入以建立投票
                  </p>
                )}
              </div>
            ) : (
              polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onVote={handleVote}
                  showCreator={true}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="mine" className="space-y-8 mt-8">
            {!user ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  請先登入查看您的投票
                </p>
              </div>
            ) : myPolls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  您還沒有建立任何投票
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4"
                >
                  建立第一個投票
                </Button>
              </div>
            ) : (
              myPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onVote={handleVote}
                  showCreator={false}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VotingApp;

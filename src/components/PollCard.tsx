
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Poll } from '@/types/supabase';
import { useAuth } from '@/hooks/useAuth';
import { format, isAfter } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string, reason?: string) => void;
  showCreator?: boolean;
}

const PollCard = ({ poll, onVote, showCreator = true }: PollCardProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState('');
  const [reason, setReason] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Check if user has voted
  const userVote = poll.votes?.find(vote => vote.user_id === user?.id);
  const hasVoted = !!userVote;

  // Check if poll is expired
  const isExpired = poll.expires_at ? isAfter(new Date(), new Date(poll.expires_at)) : false;

  const handleVote = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption, reason.trim() || undefined);
      setShowResults(true);
    }
  };

  const getTotalVotes = () => {
    return poll.votes?.reduce((total, vote) => total + vote.weight, 0) || 0;
  };

  const getOptionVotes = (optionId: string) => {
    return poll.votes?.filter(vote => vote.option_id === optionId)
      .reduce((sum, vote) => sum + vote.weight, 0) || 0;
  };

  const getVotePercentage = (optionId: string) => {
    const totalVotes = getTotalVotes();
    if (totalVotes === 0) return 0;
    return Math.round((getOptionVotes(optionId) / totalVotes) * 100);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{poll.title}</CardTitle>
            {poll.description && (
              <p className="text-sm text-muted-foreground mt-1">{poll.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {isExpired && <Badge variant="destructive">已截止</Badge>}
            {poll.expires_at && !isExpired && (
              <Badge variant="outline">
                截止: {format(new Date(poll.expires_at), 'MM/dd HH:mm', { locale: zhTW })}
              </Badge>
            )}
          </div>
        </div>
        
        {showCreator && (
          <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
            <span>發起時間: {format(new Date(poll.created_at), 'yyyy/MM/dd HH:mm', { locale: zhTW })}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {!showResults && !hasVoted && !isExpired ? (
          <div className="space-y-4">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              {poll.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div>
              <Label className="block text-sm font-medium mb-2">
                {t('vote.reason')} (加倍權重)
              </Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('vote.reason.placeholder')}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleVote} 
                disabled={!selectedOption}
                className="flex-1"
              >
                {t('vote')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowResults(true)}
              >
                {t('view.results')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{t('voting.results')}</h3>
              <span className="text-sm text-muted-foreground">
                {t('total.votes')}: {getTotalVotes()} ({t('weighted.calculation')})
              </span>
            </div>
            
            {poll.options?.map((option) => {
              const votes = getOptionVotes(option.id);
              const percentage = getVotePercentage(option.id);
              const isUserChoice = userVote?.option_id === option.id;
              
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={cn("font-medium", isUserChoice && "text-primary")}>
                      {option.text} {isUserChoice && "✓"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {votes} {t('votes')} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {poll.votes?.filter(vote => vote.option_id === option.id && vote.reason).map((vote) => (
                    <div key={vote.id} className="ml-4">
                      <div className="bg-muted p-2 rounded text-xs">
                        <span className="font-medium">{t('reason')}:</span> {vote.reason}
                        <span className="ml-2 text-primary">
                          ({t('weight')}: {vote.weight})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            
            {!hasVoted && !isExpired && (
              <Button 
                variant="outline" 
                onClick={() => setShowResults(false)}
                className="w-full"
              >
                {t('back.to.vote')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default PollCard;

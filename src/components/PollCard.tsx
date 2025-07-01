import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Poll, VoteSubmission } from '@/types/vote';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, vote: VoteSubmission) => void;
  hasVoted?: boolean;
}

const PollCard = ({ poll, onVote, hasVoted = false }: PollCardProps) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState('');
  const [reason, setReason] = useState('');
  const [showResults, setShowResults] = useState(hasVoted);

  const handleVote = () => {
    if (selectedOption) {
      onVote(poll.id, {
        optionId: selectedOption,
        reason: reason.trim() || undefined
      });
      setShowResults(true);
    }
  };

  const getTotalVotes = () => {
    return poll.options.reduce((total, option) => 
      total + option.votes.reduce((sum, vote) => sum + vote.weight, 0), 0
    );
  };

  const getOptionVotes = (optionId: string) => {
    const option = poll.options.find(opt => opt.id === optionId);
    return option ? option.votes.reduce((sum, vote) => sum + vote.weight, 0) : 0;
  };

  const getVotePercentage = (optionId: string) => {
    const totalVotes = getTotalVotes();
    if (totalVotes === 0) return 0;
    return Math.round((getOptionVotes(optionId) / totalVotes) * 100);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        {poll.description && (
          <p className="text-sm text-muted-foreground">{poll.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {!showResults ? (
          <div className="space-y-4">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              {poll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div>
              <Label className="block text-sm font-medium mb-2">
                {t('vote.reason')}
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
            
            {poll.options.map((option) => {
              const votes = getOptionVotes(option.id);
              const percentage = getVotePercentage(option.id);
              
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{option.text}</span>
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
                  
                  {option.votes.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {option.votes.map((vote) => (
                        <div key={vote.id} className="text-sm text-muted-foreground">
                          {vote.reason && (
                            <div className="bg-muted p-2 rounded text-xs">
                              <span className="font-medium">{t('reason')}:</span> {vote.reason}
                              <span className="ml-2 text-primary">
                                ({t('weight')}: {vote.weight})
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {!hasVoted && (
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

export default PollCard;

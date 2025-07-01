
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreatePollForm from '@/components/CreatePollForm';
import PollCard from '@/components/PollCard';
import { Poll, VoteSubmission, VoteOption, Vote } from '@/types/vote';

const VotingApp = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  const createPoll = (title: string, description: string, optionTexts: string[]) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      title,
      description,
      options: optionTexts.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        votes: []
      })),
      createdAt: new Date(),
      createdBy: 'user' // 在實際應用中應該是當前用戶ID
    };

    setPolls([newPoll, ...polls]);
    setShowCreateForm(false);
  };

  const submitVote = (pollId: string, voteSubmission: VoteSubmission) => {
    const newVote: Vote = {
      id: Date.now().toString(),
      reason: voteSubmission.reason,
      timestamp: new Date(),
      weight: voteSubmission.reason ? 2 : 1 // 有原因的投票權重為2，無原因為1
    };

    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => {
            if (option.id === voteSubmission.optionId) {
              return {
                ...option,
                votes: [...option.votes, newVote]
              };
            }
            return option;
          })
        };
      }
      return poll;
    }));

    setVotedPolls(new Set([...votedPolls, pollId]));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">投票系統</h1>
          <p className="text-muted-foreground">
            創建投票或參與投票，附上原因的投票會有更高權重
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            size="lg"
          >
            {showCreateForm ? '取消創建' : '創建新投票'}
          </Button>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreatePollForm onCreatePoll={createPoll} />
          </div>
        )}

        <div className="space-y-8">
          {polls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                還沒有任何投票，創建第一個投票吧！
              </p>
            </div>
          ) : (
            polls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={submitVote}
                hasVoted={votedPolls.has(poll.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingApp;

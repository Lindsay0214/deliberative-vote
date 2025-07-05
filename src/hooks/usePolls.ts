
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Poll, PollOption, Vote } from '@/types/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [myPolls, setMyPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchAllPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          *,
          options:poll_options(*),
          votes(*),
          profiles!polls_creator_id_fkey(name, avatar_url)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolls(data || []);
    } catch (error: any) {
      console.error('Error fetching polls:', error);
      toast({
        title: t('error'),
        description: t('error.load.polls'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPolls = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          *,
          options:poll_options(*),
          votes(*)
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyPolls(data || []);
    } catch (error) {
      console.error('Error fetching my polls:', error);
    }
  };

  const createPoll = async (
    title: string, 
    description: string, 
    options: string[], 
    expiresAt?: Date
  ) => {
    if (!user) {
      toast({
        title: t('please.login.to.create.poll'),
        description: t('login.required.create'),
        variant: "destructive"
      });
      return null;
    }

    try {
      // Create poll
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          title,
          description,
          creator_id: user.id,
          expires_at: expiresAt?.toISOString()
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Create options
      const optionsData = options.map(text => ({
        poll_id: pollData.id,
        text
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsData);

      if (optionsError) throw optionsError;

      toast({
        title: t('poll.created'),
        description: t('poll.created.desc')
      });

      // Refresh polls
      await Promise.all([fetchAllPolls(), fetchMyPolls()]);
      
      return pollData;
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: t('poll.create.failed'),
        description: t('poll.create.failed.desc'),
        variant: "destructive"
      });
      return null;
    }
  };

  const submitVote = async (pollId: string, optionId: string, reason?: string) => {
    if (!user) {
      toast({
        title: t('please.login.to.vote'),
        description: t('login.required.vote'),
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: user.id,
          reason,
          weight: reason ? 2 : 1
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: t('already.voted'),
            description: t('already.voted.desc'),
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return false;
      }

      toast({
        title: t('voted.successfully'),
        description: t('vote.recorded')
      });

      // Refresh polls
      await fetchAllPolls();
      return true;
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: t('vote.failed'),
        description: t('vote.failed.desc'),
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAllPolls();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyPolls();
    } else {
      setMyPolls([]);
    }
  }, [user]);

  return {
    polls,
    myPolls,
    loading,
    createPoll,
    submitVote,
    refetch: () => Promise.all([fetchAllPolls(), fetchMyPolls()])
  };
}

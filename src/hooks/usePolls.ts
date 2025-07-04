
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Poll, PollOption, Vote } from '@/types/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [myPolls, setMyPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAllPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          *,
          options:poll_options(*),
          votes(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolls(data || []);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: "錯誤",
        description: "無法載入投票",
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
        title: "請先登入",
        description: "您需要登入才能建立投票",
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
        title: "投票建立成功",
        description: "您的投票已經建立並發布"
      });

      // Refresh polls
      await Promise.all([fetchAllPolls(), fetchMyPolls()]);
      
      return pollData;
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: "建立失敗",
        description: "無法建立投票，請稍後再試",
        variant: "destructive"
      });
      return null;
    }
  };

  const submitVote = async (pollId: string, optionId: string, reason?: string) => {
    if (!user) {
      toast({
        title: "請先登入",
        description: "您需要登入才能投票",
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
            title: "已經投過票",
            description: "您已經在這個投票中投過票了",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return false;
      }

      toast({
        title: "投票成功",
        description: "您的投票已經記錄"
      });

      // Refresh polls
      await fetchAllPolls();
      return true;
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "投票失敗",
        description: "無法提交投票，請稍後再試",
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

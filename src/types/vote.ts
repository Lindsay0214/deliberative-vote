
export interface VoteOption {
  id: string;
  text: string;
  votes: Vote[];
}

export interface Vote {
  id: string;
  reason?: string;
  timestamp: Date;
  weight: number; // 1 for no reason, 2 for with reason
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: VoteOption[];
  createdAt: Date;
  createdBy: string;
}

export interface VoteSubmission {
  optionId: string;
  reason?: string;
}

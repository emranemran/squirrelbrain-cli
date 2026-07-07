// Minimal mirror of the public API's response shapes (the contract is
// GET /capabilities + these JSON shapes). Never import backend code here.

export interface Author {
  username: string;
  display_name?: string;
  avatar_url?: string;
  verified?: boolean;
}

export interface ThreadTweet {
  id: string;
  text: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  tweet_id: string;
  url: string;
  text: string;
  is_thread: boolean;
  thread_tweets: ThreadTweet[] | null;
  author: Author | null;
  tweet_created_at: string | null;
  category: string | null;
  tags: string[];
  summary: string | null;
  is_action: boolean | null;
  action_task: string | null;
  action_status: "pending" | "done" | "snoozed" | "dismissed";
  cluster_id: number | null;
  is_deleted: boolean;
  captured_at: string;
  score?: number;
}

export interface ApiError {
  error: string;
  message: string;
}

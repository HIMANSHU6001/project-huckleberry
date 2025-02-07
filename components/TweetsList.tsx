"use client";

import { useState, useEffect } from "react";

interface Tweet {
  id: string;
  text: string;
  created_at: string;
}

export default function TweetsList({ handle }: { handle: string }) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(`/admin/tweets/tweets?handle=${handle}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTweets(data.tweets || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [handle]);

  if (loading) return <p className="text-center">Loading tweets...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!tweets.length) return <p className="text-center">No tweets found.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-center">Tweets by @{handle}</h2>
      {tweets.map((tweet) => (
        <div key={tweet.id} className="border p-4 rounded-lg shadow-md bg-white">
          <p className="text-gray-800">{tweet.text}</p>
          <small className="text-gray-500 block mt-2">
            {new Date(tweet.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

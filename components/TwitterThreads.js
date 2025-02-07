"use client";

import { useState, useEffect } from "react";

export default function TweetsList({ handle }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(`/api/tweets?handle=${handle}`);

        if (!response.ok) {
          throw new Error(`Error fetching tweets: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          setTweets(data.tweets);
        } else {
          throw new Error(data.message || "Unknown error");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [handle]);

  if (loading) return <p>Loading tweets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Tweets by @{handle}</h2>
      <ul>
        {tweets.length > 0 ? (
          tweets.map((tweet) => (
            <li key={tweet.id}>
              <p>{tweet.text}</p>
              <small>{new Date(tweet.created_at).toLocaleString()}</small>
            </li>
          ))
        ) : (
          <p>No tweets found.</p>
        )}
      </ul>
    </div>
  );
}

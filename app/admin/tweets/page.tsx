'use client';

import { StatCard } from '@/components/admin/dashboard/StatCard';
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';
import TweetCard from '@/components/admin/tweets/TweetCardComponent';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Twitter } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  fetchTweetCount,
  fetchTweetsFromDB,
  handleUpdateFetchedAt,
  handleFetchLatestTweet,
  handleFetchAllDSCTweets,
} from '@/handlers/tweets/tweetHandlers';
import { Tweet } from '@/types/admin/tweets';

export default function TweetsPage() {
  const [tweets, setTweets] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedDate, setLastFetchedDate] =
    useState<string>('Not Fetched Yet');
  const [fetchedTweets, setFetchedTweets] = useState<Tweet[]>([]);
  const [lastFetchedTimestamp, setLastFetchedTimestamp] = useState<Date | null>(
    null
  );

  // Success callback after fetching tweets
  const handleFetchSuccess = async () => {
    // Update UI with latest data
    const count = await fetchTweetCount();
    setTweets(count);

    const tweets = await fetchTweetsFromDB();
    setFetchedTweets(tweets);

    const fetchedDate = await handleUpdateFetchedAt('latest', new Date());
    if (fetchedDate) {
      const formattedDate = new Date(fetchedDate).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
      setLastFetchedDate(formattedDate);
      setLastFetchedTimestamp(new Date(fetchedDate));
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const count = await fetchTweetCount();
        setTweets(count);

        const tweets = await fetchTweetsFromDB();
        setFetchedTweets(tweets);

        const fetchedDate = await handleUpdateFetchedAt('latest');
        if (fetchedDate) {
          const formattedDate = new Date(fetchedDate).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          });
          setLastFetchedDate(formattedDate);
          setLastFetchedTimestamp(new Date(fetchedDate));
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6">
      {/* Rest of your component remains the same */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 tracking-wide">
        Our Tweets
      </h1>
      <Card className="border-white mb-6">
        {/* Card content remains the same */}
        <CardHeader className="sm:px-6">
          <CardTitle className="text-xl sm:text-2xl tracking-wide mb-1">
            Important
          </CardTitle>
          <CardDescription>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 sm:text-lg tracking-wide">
              <li>
                We can pull <b className="text-cyan-300">100 posts per month</b>
                .
              </li>
              <li>
                We can make{' '}
                <b className="text-cyan-300">1 request / 15 minutes</b>.
              </li>
              <li>
                For rate limiting purposes, a{' '}
                <b className="text-cyan-300">2 hour cooldown</b> is enforced
                between fetches.
              </li>
              <li>
                Use <b className="text-cyan-300">Fetch All Tweets</b> when the
                project is deployed and used by the public. This will{' '}
                <b className="text-cyan-300">fetch 20 latest tweets</b>.{' '}
                <b className="text-red-400 text-xl">
                  ( Do not use frequently )
                </b>
                .
              </li>
              <li>
                Use <b className="text-cyan-300">Fetch Latest Tweet</b> when you
                want to fetch the latest tweet.
              </li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16 md:mb-20 items-center">
        <StatCard
          title="Total DSC Tweets Fetched"
          value={tweets}
          icon={Twitter}
          isLoading={isLoading}
        />
        <StatCard
          title="Last Fetched On"
          value={lastFetchedDate}
          icon={Twitter}
          isLoading={isLoading}
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
          <Button
            onClick={() =>
              handleFetchLatestTweet(
                lastFetchedTimestamp,
                setIsLoading,
                handleFetchSuccess
              )
            }
            disabled={isLoading}
            className="w-full text-sm lg:text-base hover:bg-green-400 transition-all duration-300"
          >
            {isLoading ? 'Fetching...' : 'Fetch Latest Tweet'}
          </Button>
          <Button
            onClick={() =>
              handleFetchAllDSCTweets(
                lastFetchedTimestamp,
                setIsLoading,
                handleFetchSuccess
              )
            }
            disabled={isLoading}
            className="w-full text-sm lg:text-base hover:bg-red-400 transition-all duration-300 mt-2 sm:mt-0"
          >
            {isLoading ? 'Fetching...' : 'Fetch All Tweets'}
          </Button>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 tracking-wide">
        Fetched DSC Tweets
      </h1>

      {fetchedTweets.length === 0 ? (
        <h2 className="text-center text-lg sm:text-xl tracking-wide mt-8 text-red-400">
          No tweets fetched till now.
        </h2>
      ) : (
        <div className="px-1 sm:px-4">
          <Carousel className="w-full">
            <CarouselContent>
              {fetchedTweets.map((tweet) => (
                <CarouselItem
                  key={tweet.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <TweetCard tweet={tweet} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="relative sm:absolute" />
              <CarouselNext className="relative sm:absolute" />
            </div>
          </Carousel>
        </div>
      )}
    </div>
  );
}

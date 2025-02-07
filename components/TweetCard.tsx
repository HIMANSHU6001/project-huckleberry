import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface TweetProps {
  tweet: {
    id: string;
    text: string;
    created_at: string;
  };
}

export default function TweetCard({ tweet }: TweetProps) {
  return (
    <Card className="p-4 shadow-md rounded-lg border border-gray-200">
      <CardHeader className="text-lg font-medium">Tweet</CardHeader>

      <CardContent>
        <p className="text-gray-800">{tweet.text}</p>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(tweet.created_at).toLocaleString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

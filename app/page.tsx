 'use client';

// export default function Home() {
//   return (
//     <div>
//       <h1>Home</h1>
//     </div>
//   );
// }

import TweetsList from "@/components/TweetsList";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Latest Tweets</h1>
      <TweetsList handle="elonmusk" />
    </main>
  );
}


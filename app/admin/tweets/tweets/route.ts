// app/api/tweets/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get("handle");

    if (!handle) {
        return NextResponse.json({ error: "Twitter handle is required" }, { status: 400 });
    }

    try {
        const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
        const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${handle}&tweet.fields=conversation_id,created_at,text`;

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        });

        if (!response.ok) {
            throw new Error(`Twitter API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

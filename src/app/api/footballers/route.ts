import { NextResponse } from "next/server";

const CDN_URL = "https://cdn.footle.xyz/footballers.json";

export const revalidate = 3600; // seconds

export async function GET() {
  try {
    const res = await fetch(CDN_URL, { next: { revalidate } });
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}



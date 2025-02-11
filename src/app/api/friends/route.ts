// export const dynamic = 'force-static' // 使 GET 请求强制静态化 (缓存)
import { NextRequest, NextResponse } from "next/server";
import { add_friend, get_friends, Friend } from "./lib";

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  // const searchParamsEntry = Object.fromEntries(searchParams.entries())
  const searchParams = Object.fromEntries(url.searchParams.entries())
  console.log(`app/api/friends/route.ts: GET: searchParams: ${JSON.stringify(searchParams)}`);
  const friends = await get_friends({ searchParams })
  // 从 ./_mock/index.json 中获取数据
  // await delay(1000*10)
  // const friends = require('./_mock/github.json')

  return NextResponse.json(friends)
  // return NextResponse.json(searchParams)
}

export async function POST(req: Request) {
  // /api/friends
  // { "name": "
  const friend: Friend = await req.json();
  const newFriend = await add_friend({ body: JSON.stringify(friend) });
  // cachedFriends = null
  // lastFetchTime = null
  return NextResponse.json(newFriend, { status: 201 });
}
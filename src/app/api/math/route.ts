import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const a = parseFloat(searchParams.get('a') || '0');
    const b = parseFloat(searchParams.get('b') || '0');
    const result = a + b;
    return NextResponse.json({ msg: `a + b = ${result}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { a, b } = await req.json();
    const result = a - b;
    return NextResponse.json([a, "-", b, "=", result]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

const SECRET = process.env.REVALIDATE_SECRET || '';

export async function GET(request) {
  return handle(request);
}

export async function POST(request) {
  return handle(request);
}

async function handle(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const tag = searchParams.get('tag');
  const path = searchParams.get('path');

  if (!SECRET || secret !== SECRET) {
    return NextResponse.json({ revalidated: false, error: 'invalid secret' }, { status: 401 });
  }

  if (path) {
    revalidatePath(path);
  }
  if (tag) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, tag: tag || null, path: path || null });
}
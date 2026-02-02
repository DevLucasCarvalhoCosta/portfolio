import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'unknown';
}

const getVisitorCount = unstable_cache(
  async () => {
    const count = await redis.get<number>('visitors:total') || 0;
    return count;
  },
  ['visitor-count'],
  {
    revalidate: 60,
    tags: ['visitor-count'],
  }
);

export async function GET() {
  try {
    const count = await getVisitorCount();
    
    return NextResponse.json({ 
      count,
      success: true 
    });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get visitor count' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    
    if (clientIp === 'unknown') {
      return NextResponse.json(
        { success: false, error: 'Could not identify visitor' },
        { status: 400 }
      );
    }
    
    const visitorKey = `visitor:${clientIp}`;
    
    const hasVisited = await redis.get(visitorKey);
    
    if (!hasVisited) {
      await redis.set(visitorKey, '1', { ex: 86400 });
      
      const newCount = await redis.incr('visitors:total');
      
      return NextResponse.json({ 
        count: newCount,
        success: true,
        newVisitor: true 
      });
    }
    
    const count = await getVisitorCount();
    
    return NextResponse.json({ 
      count,
      success: true,
      newVisitor: false 
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}

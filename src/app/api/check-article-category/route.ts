import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

// Force dynamic rendering to avoid static export issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json(
      { error: 'Article ID is required' },
      { status: 400 }
    );
  }

  try {
    // Query article category from Sanity
    const query = groq`
      *[_type == "article" && slug.current == $articleId && isPublished == true][0] {
        "category": category->slug.current
      }
    `;

    const result = await client.fetch(query, { articleId });

    if (!result) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      category: result.category,
      articleId: articleId
    });

  } catch (error) {
    console.error('❌ [API] Error checking article category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
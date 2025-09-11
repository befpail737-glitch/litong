import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');

    // 验证密钥
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();

    // 重新验证解决方案相关页面
    revalidatePath('/[locale]/solutions');
    revalidatePath('/[locale]/solutions/[slug]');

    console.log('✅ Revalidated solutions pages due to Sanity webhook');

    return NextResponse.json({
      message: 'Revalidation successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}

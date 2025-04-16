import { NextResponse } from 'next/server';
import { generateToken04 } from '@/lib/zego/token_helper';

// 从环境变量获取配置
const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
const serverSecret = process.env.ZEGO_SERVER_SECRET as string;

export async function GET(request: Request) {
  try {
    // 获取URL参数
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('Request parameters:', {
      url: request.url,
      userId,
    });

    // 验证必要参数
    if (!userId) {
      console.log('Error: userId is missing');
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!appID || !serverSecret) {
      console.log('Error: Server configuration missing:', {
        hasAppID: !!appID,
        hasServerSecret: !!serverSecret,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 设置token有效期（1小时）
    const effectiveTimeInSeconds = 3600;
    
    console.log('Generating token with parameters:', {
      appID,
      userId,
      effectiveTimeInSeconds,
    });

    // 生成token
    const token = generateToken04(
      appID,
      userId,
      serverSecret,
      effectiveTimeInSeconds,
      '' // payload为空字符串
    );

    console.log('Token generated successfully');

    // 返回token
    const response = {
      token,
      userId,
      expireTime: Date.now() + effectiveTimeInSeconds * 1000
    };
    
    console.log('Sending response:', {
      hasToken: !!token,
      userId,
      expireTime: response.expireTime,
    });

    return NextResponse.json(response);

  } catch (error) {
    // 详细打印错误信息
    console.error('Token generation error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }
    const jwt = authHeader.split(' ')[1];

    if (!jwt) {
      return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');
    const agentRunId = searchParams.get('agentRunId');

    if (!threadId || !agentRunId) {
      return NextResponse.json({ error: 'Missing threadId or agentRunId' }, { status: 400 });
    }

    const sunaAgentStatusUrl = `https://suna-1.learnwise.app/thread/${threadId}/agent-runs/${agentRunId}`;

    console.log('Calling Suna Agent Status with URL:', sunaAgentStatusUrl);

    let response;
    try {
      response = await fetch(sunaAgentStatusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      });
    } catch (fetchError: any) {
      console.error('Fetch error when calling Suna Agent Status:', fetchError);
      return NextResponse.json({ 
        error: '无法连接到Suna Agent状态服务，请检查网络连接或稍后重试',
        details: fetchError.message 
      }, { status: 503 });
    }

    console.log('Suna Agent Status response status:', response.status);
    console.log('Suna Agent Status response headers:', Object.fromEntries(response.headers.entries()));

    // 检查响应状态
    if (!response.ok) {
      console.error('Suna Agent Status returned non-OK status:', response.status);
      
      // 尝试读取响应内容
      let errorContent;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorContent = await response.json();
        } else {
          errorContent = await response.text();
        }
      } catch (readError) {
        errorContent = 'Unable to read error response';
      }
      
      console.error('Suna Agent Status error content:', errorContent);
      
      if (response.status === 404) {
        return NextResponse.json({ error: 'Suna Agent状态服务端点不存在，请联系管理员' }, { status: 503 });
      } else if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: '认证失败，请重新登录' }, { status: 401 });
      } else {
        return NextResponse.json({ 
          error: `Suna Agent状态服务返回错误 (状态码: ${response.status})`,
          details: typeof errorContent === 'string' ? errorContent : JSON.stringify(errorContent)
        }, { status: response.status });
      }
    }

    // 检查响应类型
    const contentType = response.headers.get('content-type');
    console.log('Status Response Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      // 如果不是JSON响应，读取文本内容用于调试
      const textResponse = await response.text();
      console.error('Non-JSON response from Suna Agent Status:', textResponse.substring(0, 500));
      
      return NextResponse.json({ 
        error: 'Suna Agent状态服务返回了意外的响应格式（期望JSON，实际收到HTML或其他格式）',
        details: `Content-Type: ${contentType}, Response preview: ${textResponse.substring(0, 200)}...`
      }, { status: 502 });
    }

    let data;
    try {
      data = await response.json();
      console.log('Suna Agent Status response data:', data);
    } catch (jsonError: any) {
      console.error('JSON parsing error:', jsonError);
      
      // 尝试重新读取响应作为文本
      try {
        const textContent = await response.text();
        console.error('Raw status response content:', textContent.substring(0, 500));
        return NextResponse.json({ 
          error: 'Suna Agent状态服务返回了无效的JSON数据',
          details: `JSON解析错误: ${jsonError.message}, 响应内容: ${textContent.substring(0, 200)}...`
        }, { status: 502 });
      } catch (textError) {
        return NextResponse.json({ 
          error: 'Suna Agent状态服务返回了无法解析的响应',
          details: `JSON解析错误: ${jsonError.message}`
        }, { status: 502 });
      }
    }

    // 验证响应数据结构并提取状态和故事内容
    const status = data.status || data.state || 'unknown'; // 尝试多个可能的字段名
    const story = data.responses || data.result || data.output || data.story; // 尝试多个可能的字段名

    console.log('Successfully got status from Suna Agent:', { status, hasStory: !!story });

    return NextResponse.json({ status, story });

  } catch (error: any) {
    console.error('Backend proxy error (suna-status):', error);
    
    // 提供更具体的错误信息
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json({ 
        error: '无法连接到Suna Agent状态服务，请检查网络连接',
        details: error.message 
      }, { status: 503 });
    } else if (error.message.includes('JSON')) {
      return NextResponse.json({ 
        error: 'Suna Agent状态服务返回了无效的数据格式',
        details: error.message 
      }, { status: 502 });
    } else {
      return NextResponse.json({ 
        error: '服务器内部错误',
        details: error.message 
      }, { status: 500 });
    }
  }
}


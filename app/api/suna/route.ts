import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }
    const jwt = authHeader.split(' ')[1];

    if (!jwt) {
      return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
    }

    const { prompt, storyLength, ageGroup, storyType } = await req.json();

    const sunaAgentStartUrl = 'https://suna-1.learnwise.app/thread/new/agent/start';

    const startResponse = await fetch(sunaAgentStartUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        input: prompt,
        config: {
          storyLength,
          ageGroup,
          storyType,
        },
      }),
    });

    // 改进的错误处理：检查响应类型
    const contentType = startResponse.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      // 如果不是JSON响应，读取文本内容用于调试
      const textResponse = await startResponse.text();
      console.error('Non-JSON response from Suna Agent:', textResponse);
      
      if (startResponse.status === 404) {
        return NextResponse.json({ error: 'Suna Agent服务暂时不可用，请稍后重试' }, { status: 503 });
      } else if (startResponse.status === 401 || startResponse.status === 403) {
        return NextResponse.json({ error: '认证失败，请重新登录' }, { status: 401 });
      } else {
        return NextResponse.json({ error: 'Suna Agent服务返回了意外的响应格式' }, { status: 502 });
      }
    }

    let startData;
    try {
      startData = await startResponse.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json({ error: 'Suna Agent服务返回了无效的JSON数据' }, { status: 502 });
    }

    if (!startResponse.ok) {
      console.error('Suna Agent Start API Error:', startData);
      return NextResponse.json({ error: startData.detail || 'Failed to start Suna Agent' }, { status: startResponse.status });
    }

    // 假设startData中包含thread_id和agent_run_id
    const threadId = startData.thread_id;
    const agentRunId = startData.agent_run_id; // 假设有这个字段

    return NextResponse.json({ success: true, threadId, agentRunId });

  } catch (error: any) {
    console.error('Backend proxy error:', error);
    
    // 提供更具体的错误信息
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json({ error: '无法连接到Suna Agent服务，请检查网络连接' }, { status: 503 });
    } else if (error.message.includes('JSON')) {
      return NextResponse.json({ error: 'Suna Agent服务返回了无效的数据格式' }, { status: 502 });
    } else {
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
  }
}


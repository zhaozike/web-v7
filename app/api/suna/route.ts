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

    console.log('Calling Suna Agent with URL:', sunaAgentStartUrl);
    console.log('Request payload:', { prompt, storyLength, ageGroup, storyType });

    let startResponse;
    try {
      startResponse = await fetch(sunaAgentStartUrl, {
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
    } catch (fetchError: any) {
      console.error('Fetch error when calling Suna Agent:', fetchError);
      return NextResponse.json({ 
        error: '无法连接到Suna Agent服务，请检查网络连接或稍后重试',
        details: fetchError.message 
      }, { status: 503 });
    }

    console.log('Suna Agent response status:', startResponse.status);
    console.log('Suna Agent response headers:', Object.fromEntries(startResponse.headers.entries()));

    // 检查响应状态
    if (!startResponse.ok) {
      console.error('Suna Agent returned non-OK status:', startResponse.status);
      
      // 尝试读取响应内容
      let errorContent;
      try {
        const contentType = startResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorContent = await startResponse.json();
        } else {
          errorContent = await startResponse.text();
        }
      } catch (readError) {
        errorContent = 'Unable to read error response';
      }
      
      console.error('Suna Agent error content:', errorContent);
      
      if (startResponse.status === 404) {
        return NextResponse.json({ error: 'Suna Agent服务端点不存在，请联系管理员' }, { status: 503 });
      } else if (startResponse.status === 401 || startResponse.status === 403) {
        return NextResponse.json({ error: '认证失败，请重新登录' }, { status: 401 });
      } else {
        return NextResponse.json({ 
          error: `Suna Agent服务返回错误 (状态码: ${startResponse.status})`,
          details: typeof errorContent === 'string' ? errorContent : JSON.stringify(errorContent)
        }, { status: startResponse.status });
      }
    }

    // 检查响应类型
    const contentType = startResponse.headers.get('content-type');
    console.log('Response Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      // 如果不是JSON响应，读取文本内容用于调试
      const textResponse = await startResponse.text();
      console.error('Non-JSON response from Suna Agent:', textResponse.substring(0, 500));
      
      return NextResponse.json({ 
        error: 'Suna Agent服务返回了意外的响应格式（期望JSON，实际收到HTML或其他格式）',
        details: `Content-Type: ${contentType}, Response preview: ${textResponse.substring(0, 200)}...`
      }, { status: 502 });
    }

    let startData;
    try {
      startData = await startResponse.json();
      console.log('Suna Agent response data:', startData);
    } catch (jsonError: any) {
      console.error('JSON parsing error:', jsonError);
      
      // 尝试重新读取响应作为文本
      try {
        const textContent = await startResponse.text();
        console.error('Raw response content:', textContent.substring(0, 500));
        return NextResponse.json({ 
          error: 'Suna Agent服务返回了无效的JSON数据',
          details: `JSON解析错误: ${jsonError.message}, 响应内容: ${textContent.substring(0, 200)}...`
        }, { status: 502 });
      } catch (textError) {
        return NextResponse.json({ 
          error: 'Suna Agent服务返回了无法解析的响应',
          details: `JSON解析错误: ${jsonError.message}`
        }, { status: 502 });
      }
    }

    // 验证响应数据结构
    if (!startData.thread_id) {
      console.error('Missing thread_id in Suna Agent response:', startData);
      return NextResponse.json({ 
        error: 'Suna Agent服务返回了不完整的数据（缺少thread_id）',
        details: JSON.stringify(startData)
      }, { status: 502 });
    }

    const threadId = startData.thread_id;
    const agentRunId = startData.agent_run_id || startData.run_id || 'default'; // 尝试多个可能的字段名

    console.log('Successfully got response from Suna Agent:', { threadId, agentRunId });

    return NextResponse.json({ success: true, threadId, agentRunId });

  } catch (error: any) {
    console.error('Backend proxy error:', error);
    
    // 提供更具体的错误信息
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json({ 
        error: '无法连接到Suna Agent服务，请检查网络连接',
        details: error.message 
      }, { status: 503 });
    } else if (error.message.includes('JSON')) {
      return NextResponse.json({ 
        error: 'Suna Agent服务返回了无效的数据格式',
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


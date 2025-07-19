import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Suna API Route Called ===');
    
    // 获取请求体
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // 从请求头获取JWT
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return NextResponse.json(
        { error: '缺少认证信息，请重新登录' },
        { status: 401 }
      );
    }
    
    const jwt = authHeader.substring(7); // 移除 "Bearer " 前缀
    console.log('JWT token length:', jwt.length);
    
    // 第一步：创建新的线程
    const createThreadUrl = 'https://suna-1.learnwise.app/api/v1/threads';
    console.log('Creating new thread with URL:', createThreadUrl);
    
    let threadResponse;
    try {
      threadResponse = await fetch(createThreadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          title: `Story: ${body.prompt?.substring(0, 50) || 'New Story'}...`,
          metadata: {
            storyLength: body.storyLength || 'medium',
            ageGroup: body.ageGroup || 'children',
            storyType: body.storyType || 'adventure',
          },
        }),
      });
      
      console.log('Thread creation response status:', threadResponse.status);
      console.log('Thread creation response headers:', Object.fromEntries(threadResponse.headers.entries()));
      
    } catch (fetchError: any) {
      console.error('Fetch error when creating thread:', fetchError);
      return NextResponse.json(
        { error: '无法连接到Suna Agent服务，请稍后重试' },
        { status: 503 }
      );
    }
    
    // 检查线程创建响应
    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      console.error('Thread creation failed:', {
        status: threadResponse.status,
        statusText: threadResponse.statusText,
        body: errorText
      });
      
      if (threadResponse.status === 404) {
        return NextResponse.json(
          { error: 'Suna Agent线程创建端点不存在，请联系管理员' },
          { status: 404 }
        );
      } else if (threadResponse.status === 401) {
        return NextResponse.json(
          { error: '认证失败，请重新登录' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: `线程创建失败: ${threadResponse.status} ${threadResponse.statusText}` },
          { status: threadResponse.status }
        );
      }
    }
    
    // 解析线程创建响应
    let threadData;
    try {
      const responseText = await threadResponse.text();
      console.log('Thread creation raw response:', responseText);
      
      if (!responseText.trim()) {
        throw new Error('Empty response from thread creation');
      }
      
      threadData = JSON.parse(responseText);
      console.log('Thread creation parsed response:', threadData);
      
    } catch (parseError) {
      console.error('Failed to parse thread creation response:', parseError);
      return NextResponse.json(
        { error: 'Suna Agent服务返回了无效的响应格式' },
        { status: 502 }
      );
    }
    
    // 获取线程ID
    const threadId = threadData.thread_id || threadData.id;
    if (!threadId) {
      console.error('No thread ID in response:', threadData);
      return NextResponse.json(
        { error: '线程创建成功但未返回线程ID' },
        { status: 502 }
      );
    }
    
    console.log('Thread created successfully with ID:', threadId);
    
    // 第二步：启动代理
    const startAgentUrl = `https://suna-1.learnwise.app/api/v1/threads/${threadId}/agent/start`;
    console.log('Starting agent with URL:', startAgentUrl);
    
    let agentResponse;
    try {
      agentResponse = await fetch(startAgentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          prompt: body.prompt,
          model_name: 'claude-3-5-sonnet-20241022',
          enable_thinking: false,
          reasoning_effort: 'medium',
          stream: false,
          enable_context_manager: true,
          agent_id: null, // 使用默认代理
        }),
      });
      
      console.log('Agent start response status:', agentResponse.status);
      console.log('Agent start response headers:', Object.fromEntries(agentResponse.headers.entries()));
      
    } catch (fetchError: any) {
      console.error('Fetch error when starting agent:', fetchError);
      return NextResponse.json(
        { error: '无法连接到Suna Agent服务，请稍后重试' },
        { status: 503 }
      );
    }
    
    // 检查代理启动响应
    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error('Agent start failed:', {
        status: agentResponse.status,
        statusText: agentResponse.statusText,
        body: errorText
      });
      
      if (agentResponse.status === 404) {
        return NextResponse.json(
          { error: 'Suna Agent启动端点不存在，请联系管理员' },
          { status: 404 }
        );
      } else if (agentResponse.status === 401) {
        return NextResponse.json(
          { error: '认证失败，请重新登录' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: `代理启动失败: ${agentResponse.status} ${agentResponse.statusText}` },
          { status: agentResponse.status }
        );
      }
    }
    
    // 解析代理启动响应
    let agentData;
    try {
      const responseText = await agentResponse.text();
      console.log('Agent start raw response:', responseText);
      
      if (!responseText.trim()) {
        throw new Error('Empty response from agent start');
      }
      
      agentData = JSON.parse(responseText);
      console.log('Agent start parsed response:', agentData);
      
    } catch (parseError) {
      console.error('Failed to parse agent start response:', parseError);
      return NextResponse.json(
        { error: 'Suna Agent服务返回了无效的响应格式' },
        { status: 502 }
      );
    }
    
    // 返回成功响应
    const result = {
      threadId: threadId,
      agentRunId: agentData.agent_run_id || agentData.run_id,
      message: '故事生成已开始',
      ...agentData
    };
    
    console.log('=== Suna API Route Success ===');
    console.log('Final result:', result);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('=== Suna API Route Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: '服务器内部错误，请稍后重试',
        details: error.message 
      },
      { status: 500 }
    );
  }
}



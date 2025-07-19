import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// This is the POST handler for starting a Suna Agent run
export async function POST(request: NextRequest) {
  try {
    console.log('=== Suna POST API Route Called ===');

    // Get request body
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    // Get JWT from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return NextResponse.json(
        { error: '缺少认证信息，请重新登录' },
        { status: 401 }
      );
    }
    const jwt = authHeader.substring(7); // Remove "Bearer " prefix
    console.log('JWT token length:', jwt.length);

    // Step 1: Create a new thread
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
          title: body.prompt?.substring(0, 50) || 'New Story',
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

    // Check thread creation response
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

    // Parse thread creation response
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

    // Get thread ID
    const threadId = threadData.thread_id || threadData.id;
    if (!threadId) {
      console.error('No thread ID in response:', threadData);
      return NextResponse.json(
        { error: '线程创建成功但未返回线程ID' },
        { status: 502 }
      );
    }
    console.log('Thread created successfully with ID:', threadId);

    // Step 2: Start the agent
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
          agent_id: null, // Use default agent
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

    // Check agent start response
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

    // Parse agent start response
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

    // Return success response
    const result = {
      threadId: threadId,
      agentRunId: agentData.agent_run_id || agentData.run_id,
      message: '故事生成已开始',
      ...agentData
    };

    console.log('=== Suna POST API Route Success ===');
    console.log('Final result:', result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('=== Suna POST API Route Error ===');
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

// This is the GET handler for checking Suna Agent status
export async function GET(request: NextRequest) {
  try {
    console.log('=== Suna Status API Route Called ===');

    // Get threadId and agentRunId from URL parameters
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    const agentRunId = searchParams.get('agentRunId');

    console.log('Query parameters:', { threadId, agentRunId });

    if (!threadId || !agentRunId) {
      console.error('Missing required parameters:', { threadId, agentRunId });
      return NextResponse.json(
        { error: '缺少必要的参数：threadId 和 agentRunId' },
        { status: 400 }
      );
    }

    // Get JWT from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return NextResponse.json(
        { error: '缺少认证信息，请重新登录' },
        { status: 401 }
      );
    }
    const jwt = authHeader.substring(7); // Remove "Bearer " prefix
    console.log('JWT token length:', jwt.length);

    // Query status
    const statusUrl = `https://suna-1.learnwise.app/api/v1/threads/${threadId}/agent-runs/${agentRunId}`;
    console.log('Querying status with URL:', statusUrl);

    let statusResponse;
    try {
      statusResponse = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
          'Accept': 'application/json',
        },
      });
      console.log('Status response status:', statusResponse.status);
      console.log('Status response headers:', Object.fromEntries(statusResponse.headers.entries()));
    } catch (fetchError: any) {
      console.error('Fetch error when querying status:', fetchError);
      return NextResponse.json(
        { error: '无法连接到Suna Agent服务，请稍后重试' },
        { status: 503 }
      );
    }

    // Check status query response
    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error('Status query failed:', {
        status: statusResponse.status,
        statusText: statusResponse.statusText,
        body: errorText
      });
      if (statusResponse.status === 404) {
        return NextResponse.json(
          { error: 'Suna Agent状态查询端点不存在，请联系管理员' },
          { status: 404 }
        );
      } else if (statusResponse.status === 401) {
        return NextResponse.json(
          { error: '认证失败，请重新登录' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: `状态查询失败: ${statusResponse.status} ${statusResponse.statusText}` },
          { status: statusResponse.status }
        );
      }
    }

    // Parse status query response
    let statusData;
    try {
      const responseText = await statusResponse.text();
      console.log('Status query raw response:', responseText);
      if (!responseText.trim()) {
        throw new Error('Empty response from status query');
      }
      // Check if response is JSON
      const contentType = statusResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response received:', {
          contentType,
          responseText: responseText.substring(0, 500)
        });
        return NextResponse.json(
          { error: 'Suna Agent服务返回了意外的响应格式' },
          { status: 502 }
        );
      }
      statusData = JSON.parse(responseText);
      console.log('Status query parsed response:', statusData);
    } catch (parseError) {
      console.error('Failed to parse status response:', parseError);
      return NextResponse.json(
        { error: 'Suna Agent服务返回了无效的响应格式' },
        { status: 502 }
      );
    }

    // Process status data
    const result = {
      threadId,
      agentRunId,
      status: statusData.status || 'unknown',
      progress: statusData.progress || 0,
      result: statusData.result || null,
      error: statusData.error || null,
      completed: statusData.status === 'completed' || statusData.status === 'finished',
      failed: statusData.status === 'failed' || statusData.status === 'error',
      ...statusData
    };

    console.log('=== Suna Status API Route Success ===');
    console.log('Final result:', result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('=== Suna Status API Route Error ===');
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



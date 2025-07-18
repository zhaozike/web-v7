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

    // 假设Suna Agent提供一个获取agent运行状态的API
    // 根据之前查阅的Suna Agent代码，可能需要调用 /thread/{thread_id}/agent-runs/{agent_run_id} 或者类似的端点
    const sunaAgentStatusUrl = `https://suna-1.learnwise.app/thread/${threadId}/agent-runs/${agentRunId}`;

    const response = await fetch(sunaAgentStatusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Suna Agent Status API Error:', data);
      return NextResponse.json({ error: data.detail || 'Failed to get Suna Agent status' }, { status: response.status });
    }

    // 假设Suna Agent返回的状态字段是 'status'
    // 并且最终的故事内容在 'responses' 字段中
    const status = data.status; // 'running', 'completed', 'failed'
    const story = data.responses; // 假设故事内容在这里

    return NextResponse.json({ status, story });

  } catch (error: any) {
    console.error('Backend proxy error (suna-status):', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}



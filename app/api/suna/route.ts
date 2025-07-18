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

    const startData = await startResponse.json();

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
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}



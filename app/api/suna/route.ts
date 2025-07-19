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

    // Step 1: Create a new thread first
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
          title: `Story: ${prompt.substring(0, 50)}...`,
          metadata: {
            storyLength,
            ageGroup,
            storyType,
          },
        }),
      });
    } catch (fetchError: any) {
      console.error('Fetch error when creating thread:', fetchError);
      // If thread creation fails, try alternative approach with a default thread ID
      console.log('Thread creation failed, trying with default thread ID...');
      const defaultThreadId = 'default-thread-' + Date.now();
      
      return await startAgentWithThreadId(defaultThreadId, prompt, storyLength, ageGroup, storyType, jwt);
    }

    console.log('Thread creation response status:', threadResponse.status);

    if (!threadResponse.ok) {
      console.error('Thread creation failed with status:', threadResponse.status);
      
      // Try with a default thread ID if thread creation fails
      const defaultThreadId = 'default-thread-' + Date.now();
      console.log('Trying with default thread ID:', defaultThreadId);
      
      return await startAgentWithThreadId(defaultThreadId, prompt, storyLength, ageGroup, storyType, jwt);
    }

    let threadData;
    try {
      threadData = await threadResponse.json();
      console.log('Thread creation response data:', threadData);
    } catch (jsonError: any) {
      console.error('JSON parsing error for thread response:', jsonError);
      
      // Try with a default thread ID
      const defaultThreadId = 'default-thread-' + Date.now();
      return await startAgentWithThreadId(defaultThreadId, prompt, storyLength, ageGroup, storyType, jwt);
    }

    const threadId = threadData.id || threadData.thread_id || threadData.threadId;
    
    if (!threadId) {
      console.error('No thread ID found in response:', threadData);
      
      // Try with a default thread ID
      const defaultThreadId = 'default-thread-' + Date.now();
      return await startAgentWithThreadId(defaultThreadId, prompt, storyLength, ageGroup, storyType, jwt);
    }

    // Step 2: Start the agent with the thread ID
    return await startAgentWithThreadId(threadId, prompt, storyLength, ageGroup, storyType, jwt);

  } catch (error: any) {
    console.error('Backend proxy error:', error);
    
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

async function startAgentWithThreadId(
  threadId: string, 
  prompt: string, 
  storyLength: string, 
  ageGroup: string, 
  storyType: string, 
  jwt: string
) {
  // Try multiple possible API endpoints
  const possibleEndpoints = [
    `https://suna-1.learnwise.app/api/v1/thread/${threadId}/agent/start`,
    `https://suna-1.learnwise.app/thread/${threadId}/agent/start`,
    `https://suna-1.learnwise.app/api/thread/${threadId}/agent/start`,
    `https://suna-1.learnwise.app/v1/thread/${threadId}/agent/start`,
  ];

  for (const endpoint of possibleEndpoints) {
    console.log('Trying agent start endpoint:', endpoint);
    
    try {
      const startResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          // Try different request body formats
          input: prompt,
          prompt: prompt,
          message: prompt,
          config: {
            storyLength,
            ageGroup,
            storyType,
          },
          metadata: {
            storyLength,
            ageGroup,
            storyType,
          },
          // Additional fields that might be expected
          model_name: "default",
          enable_thinking: true,
          stream: false,
          enable_context_manager: true,
        }),
      });

      console.log(`Response from ${endpoint}:`, startResponse.status);

      if (startResponse.ok) {
        const contentType = startResponse.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const startData = await startResponse.json();
            console.log('Successful response data:', startData);
            
            // Extract relevant IDs from response
            const agentRunId = startData.agent_run_id || startData.run_id || startData.id || 'default';
            
            return NextResponse.json({ 
              success: true, 
              threadId, 
              agentRunId,
              endpoint: endpoint // Include which endpoint worked
            });
          } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            continue; // Try next endpoint
          }
        } else {
          console.log('Non-JSON response, trying next endpoint...');
          continue;
        }
      } else if (startResponse.status === 404) {
        console.log('Endpoint not found, trying next...');
        continue;
      } else {
        console.error(`Endpoint ${endpoint} returned status:`, startResponse.status);
        
        // If we get a non-404 error, it might be the right endpoint but with wrong data
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
        
        console.error(`Error from ${endpoint}:`, errorContent);
        
        // If it's an auth error, return immediately
        if (startResponse.status === 401 || startResponse.status === 403) {
          return NextResponse.json({ error: '认证失败，请重新登录' }, { status: 401 });
        }
        
        continue; // Try next endpoint for other errors
      }
    } catch (fetchError: any) {
      console.error(`Fetch error for ${endpoint}:`, fetchError);
      continue; // Try next endpoint
    }
  }

  // If all endpoints failed
  return NextResponse.json({ 
    error: 'Suna Agent服务的所有API端点都无法访问，请联系管理员检查服务配置',
    details: `尝试的端点: ${possibleEndpoints.join(', ')}`,
    threadId: threadId
  }, { status: 503 });
}


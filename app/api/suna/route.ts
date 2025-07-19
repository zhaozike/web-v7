import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端（使用服务端配置）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    console.log('=== Suna Status API Route Called ===');
    
    // 从URL参数获取agentRunId
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    const agentRunId = searchParams.get('agentRunId');
    
    console.log('Query parameters:', { threadId, agentRunId });
    
    if (!agentRunId) {
      console.error('Missing required parameter: agentRunId');
      return NextResponse.json(
        { error: '缺少必要的参数：agentRunId' },
        { status: 400 }
      );
    }
    
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
    
    // 验证JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      console.error('JWT验证失败:', authError);
      return NextResponse.json(
        { error: 'JWT token无效，请重新登录' },
        { status: 401 }
      );
    }
    
    console.log('JWT验证成功，用户ID:', user.id);
    
    // 构建状态查询URL - 使用正确的Suna API端点
    const statusUrl = `https://suna-1.learnwise.app/agent-run/${agentRunId}`;
    console.log('Querying status with URL:', statusUrl);
    
    let statusResponse;
    try {
      statusResponse = await fetch(statusUrl, {
        method: 'GET',
        headers: {
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
    
    // 检查状态查询响应
    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error('Status query failed:', {
        status: statusResponse.status,
        statusText: statusResponse.statusText,
        body: errorText
      });
      
      if (statusResponse.status === 404) {
        return NextResponse.json(
          { error: 'Agent运行记录不存在' },
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
    
    // 解析状态查询响应
    let statusData;
    try {
      const responseText = await statusResponse.text();
      console.log('Status query raw response:', responseText);
      
      if (!responseText.trim()) {
        throw new Error('Empty response from status query');
      }
      
      // 检查响应是否为JSON格式
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
    
    // 处理状态数据，转换为前端期望的格式
    const result = {
      threadId: threadId,
      agentRunId: agentRunId,
      status: statusData.status || 'unknown',
      progress: statusData.progress || 0,
      story: statusData.result || statusData.story || null,
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



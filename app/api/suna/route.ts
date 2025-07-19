import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端（使用服务端配置）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    
    // 调用Suna API的agent/initiate端点
    const sunaApiUrl = 'https://suna-1.learnwise.app/agent/initiate';
    console.log('Calling Suna API with URL:', sunaApiUrl);
    
    // 准备FormData（Suna API期望的格式）
    const formData = new FormData();
    formData.append('prompt', body.prompt || '');
    formData.append('model_name', 'claude-3-5-sonnet-20241022');
    formData.append('enable_thinking', 'false');
    formData.append('reasoning_effort', 'medium');
    formData.append('stream', 'false');
    formData.append('enable_context_manager', 'true');
    
    // 添加故事相关参数
    if (body.storyLength) {
      formData.append('story_length', body.storyLength);
    }
    if (body.ageGroup) {
      formData.append('age_group', body.ageGroup);
    }
    if (body.storyType) {
      formData.append('story_type', body.storyType);
    }
    
    let sunaResponse;
    try {
      sunaResponse = await fetch(sunaApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
        body: formData,
      });
      
      console.log('Suna API response status:', sunaResponse.status);
      console.log('Suna API response headers:', Object.fromEntries(sunaResponse.headers.entries()));
      
    } catch (fetchError: any) {
      console.error('Fetch error when calling Suna API:', fetchError);
      return NextResponse.json(
        { error: '无法连接到Suna Agent服务，请稍后重试' },
        { status: 503 }
      );
    }
    
    // 检查Suna API响应
    if (!sunaResponse.ok) {
      const errorText = await sunaResponse.text();
      console.error('Suna API call failed:', {
        status: sunaResponse.status,
        statusText: sunaResponse.statusText,
        body: errorText
      });
      
      if (sunaResponse.status === 404) {
        return NextResponse.json(
          { error: 'Suna Agent端点不存在，请联系管理员' },
          { status: 404 }
        );
      } else if (sunaResponse.status === 401) {
        return NextResponse.json(
          { error: '认证失败，请重新登录' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: `Suna API调用失败: ${sunaResponse.status} ${sunaResponse.statusText}` },
          { status: sunaResponse.status }
        );
      }
    }
    
    // 解析Suna API响应
    let sunaData;
    try {
      const responseText = await sunaResponse.text();
      console.log('Suna API raw response:', responseText);
      
      if (!responseText.trim()) {
        throw new Error('Empty response from Suna API');
      }
      
      sunaData = JSON.parse(responseText);
      console.log('Suna API parsed response:', sunaData);
      
    } catch (parseError) {
      console.error('Failed to parse Suna API response:', parseError);
      return NextResponse.json(
        { error: 'Suna Agent服务返回了无效的响应格式' },
        { status: 502 }
      );
    }
    
    // 返回成功响应
    const result = {
      threadId: sunaData.thread_id,
      agentRunId: sunaData.agent_run_id,
      message: '故事生成已开始',
      ...sunaData
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


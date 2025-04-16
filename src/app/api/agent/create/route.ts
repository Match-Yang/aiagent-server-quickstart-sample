import { NextRequest } from 'next/server';
import { ZegoAIAgent } from '@/lib/zego/aiagent';

export async function POST(req: NextRequest) {
    try {
        const assistant = ZegoAIAgent.getInstance();

        const agents = await assistant.queryAgents();
        console.log("agents", agents);
        if (!agents || agents.length === 0) {
            const result = await assistant.registerAgent();
            console.log("register agent result", result);
        } else {
            console.log("agent already exists");
        }

        return Response.json({
            code: 0,
            message: '创建Agent成功'
        }, { status: 200 });
    } catch (error) {
        console.error('创建Agent失败:', error);
        return Response.json({
            code: (error as any).code || 500,
            message: '创建Agent失败'
        }, { status: 500 });
    }
}

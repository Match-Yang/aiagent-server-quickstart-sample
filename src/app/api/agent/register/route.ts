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
            message: 'register agent success'
        }, { status: 200 });
    } catch (error) {
        console.error('register agent failed:', error);
        return Response.json({
            code: (error as any).code || 500,
            message: 'register agent failed'
        }, { status: 500 });
    }
}

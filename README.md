# AI Agent 服务端示例使用说明
## 本地运行

你可以在本地安装依赖环境后，在本地启动服务端，然后客户端通过连接到同一个局域网访问相应接口。

- 请安装[Node.js 18.18](https://nodejs.org/)或以上版本。
- 进入项目根目录运行以下命令以启动服务。
```bash
npm install
npm run dev
```

可以打开 [http://localhost:3000](http://localhost:3000) 查看运行结果。

## 部署到 Vercel

请注意⚠️：中国大陆访问Vercel可能会有问题。如果无法访问请科学上网。在部署好后的服务绑定自己申请的域名也可以正常访问（注意域名被墙的风险）。

[![部署到Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzegoim%2Faiagent-server-quickstart-sample&env=NEXT_PUBLIC_ZEGO_APP_ID,ZEGO_SERVER_SECRET,LLM_API_KEY,LLM_BASE_URL,LLM_MODEL,AGENT_ID,TTS_BYTEDANCE_APP_ID,TTS_BYTEDANCE_TOKEN,TTS_BYTEDANCE_CLUSTER,TTS_BYTEDANCE_VOICE_TYPE&envDescription=这些是启动ZEGO的AI代理服务器所需的环境变量。请查看下方文档获取更多信息。&envLink=https://github.com/zegoim/aiagent-server-quickstart-sample/blob/main/.env.example)

点击上方按钮可以一键将此项目部署到Vercel平台。部署过程中，您需要填写所有必要的环境变量。关于环境变量的详细说明，请参考[.env.example](.env.example)文件。


## 项目结构

项目源代码结构如下：

```
src
├── app
│   ├── api
│   │   ├── agent
│   │   │   ├── create
│   │   │   │   └── route.ts        # 创建AI Agent
│   │   │   ├── start
│   │   │   │   └── route.ts        # 启动AI Agent
│   │   │   ├── stop
│   │   │   │   └── route.ts        # 停止AI Agent
│   │   │   └── types.ts            # 类型定义
│   │   └── zegotoken
│   │       └── route.ts            # ZEGO Token生成API
└── lib
    ├── logger.ts                   # 日志工具
    └── zego
        ├── aiagent.ts              # ZEGO AI Agent PaaS 接口请求逻辑
        └── token_helper.ts         # ZEGO Token生成工具
```

## API接口调用示例

本项目提供了以下几个主要API接口：

1. 创建AI代理 `/api/agent/create`：用于创建代理。
2. 启动AI代理 `/api/agent/start`：用于启动代理并开始会话。
3. 停止AI代理 `/api/agent/stop`：用于停止代理实例。
4. 获取ZEGO Token `/api/zegotoken`：用于获取ZEGO服务所需的token。

下面是使用不同编程语言调用这些接口的示例：

### cURL 示例

```bash
# 1. 创建AI代理
curl -X POST https://你的服务域名/api/agent/create

# 2. 启动AI代理
curl -X POST https://你的服务域名/api/agent/start \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": "room123",
    "user_id": "user123",
    "user_stream_id": "stream_user123",
    "agent_stream_id": "stream_agent123",
    "agent_user_id": "agent123"
  }'

# 3. 停止AI代理
curl -X POST https://你的服务域名/api/agent/stop \
  -H "Content-Type: application/json" \
  -d '{
    "agent_instance_id": "agentInstanceId123"
  }'

# 4. 获取ZEGO Token
curl -X GET "https://你的服务域名/api/zegotoken?userId=user123"
```

### Android Java 示例

```java
// 导入所需的包
import java.io.IOException;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONObject;

public class ZegoApiExample {
    private static final String BASE_URL = "https://你的服务域名";
    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private static final OkHttpClient client = new OkHttpClient();
    
    // 1. 创建AI代理
    public static void createAgent() throws IOException {
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/agent/create")
                .post(RequestBody.create("", JSON))
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
    
    // 2. 启动AI代理
    public static void startAgent(String roomId, String userId, String userStreamId, 
                                 String agentStreamId, String agentUserId) throws IOException {
        JSONObject json = new JSONObject();
        json.put("room_id", roomId);
        json.put("user_id", userId);
        json.put("user_stream_id", userStreamId);
        json.put("agent_stream_id", agentStreamId);
        json.put("agent_user_id", agentUserId);
        
        RequestBody body = RequestBody.create(json.toString(), JSON);
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/agent/start")
                .post(body)
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
    
    // 3. 停止AI代理
    public static void stopAgent(String agentInstanceId) throws IOException {
        JSONObject json = new JSONObject();
        json.put("agent_instance_id", agentInstanceId);
        
        RequestBody body = RequestBody.create(json.toString(), JSON);
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/agent/stop")
                .post(body)
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
    
    // 4. 获取ZEGO Token
    public static void getZegoToken(String userId) throws IOException {
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/zegotoken?userId=" + userId)
                .get()
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
}
```

### iOS Objective-C 示例

```objective-c
#import <Foundation/Foundation.h>

@interface ZegoApiExample : NSObject

+ (void)createAgent;
+ (void)startAgentWithRoomId:(NSString *)roomId
                      userId:(NSString *)userId
                userStreamId:(NSString *)userStreamId
              agentStreamId:(NSString *)agentStreamId
                agentUserId:(NSString *)agentUserId;
+ (void)stopAgentWithInstanceId:(NSString *)agentInstanceId;
+ (void)getZegoTokenWithUserId:(NSString *)userId;

@end

@implementation ZegoApiExample

// 基础URL
static NSString *const kBaseUrl = @"https://你的服务域名";

// 1. 创建AI代理
+ (void)createAgent {
    NSURL *url = [NSURL URLWithString:[kBaseUrl stringByAppendingString:@"/api/agent/create"]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request 
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        if (httpResponse.statusCode == 200) {
            NSError *jsonError;
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data 
                                                                 options:0 
                                                                   error:&jsonError];
            if (jsonError) {
                NSLog(@"JSON解析错误: %@", jsonError);
                return;
            }
            
            NSLog(@"创建Agent成功: %@", json);
        } else {
            NSLog(@"请求失败，状态码: %ld", (long)httpResponse.statusCode);
        }
    }];
    
    [task resume];
}

// 2. 启动AI代理
+ (void)startAgentWithRoomId:(NSString *)roomId
                      userId:(NSString *)userId
                userStreamId:(NSString *)userStreamId
              agentStreamId:(NSString *)agentStreamId
                agentUserId:(NSString *)agentUserId {
    NSURL *url = [NSURL URLWithString:[kBaseUrl stringByAppendingString:@"/api/agent/start"]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSDictionary *body = @{
        @"room_id": roomId,
        @"user_id": userId,
        @"user_stream_id": userStreamId,
        @"agent_stream_id": agentStreamId,
        @"agent_user_id": agentUserId
    };
    
    NSError *error;
    NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body 
                                                       options:0 
                                                         error:&error];
    if (error) {
        NSLog(@"JSON序列化错误: %@", error);
        return;
    }
    
    [request setHTTPBody:bodyData];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request 
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        if (httpResponse.statusCode == 200) {
            NSError *jsonError;
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data 
                                                                 options:0 
                                                                   error:&jsonError];
            if (jsonError) {
                NSLog(@"JSON解析错误: %@", jsonError);
                return;
            }
            
            NSLog(@"启动Agent成功: %@", json);
        } else {
            NSLog(@"请求失败，状态码: %ld", (long)httpResponse.statusCode);
        }
    }];
    
    [task resume];
}

// 3. 停止AI代理
+ (void)stopAgentWithInstanceId:(NSString *)agentInstanceId {
    NSURL *url = [NSURL URLWithString:[kBaseUrl stringByAppendingString:@"/api/agent/stop"]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSDictionary *body = @{
        @"agent_instance_id": agentInstanceId
    };
    
    NSError *error;
    NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body 
                                                       options:0 
                                                         error:&error];
    if (error) {
        NSLog(@"JSON序列化错误: %@", error);
        return;
    }
    
    [request setHTTPBody:bodyData];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request 
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        if (httpResponse.statusCode == 200) {
            NSError *jsonError;
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data 
                                                                 options:0 
                                                                   error:&jsonError];
            if (jsonError) {
                NSLog(@"JSON解析错误: %@", jsonError);
                return;
            }
            
            NSLog(@"停止Agent成功: %@", json);
        } else {
            NSLog(@"请求失败，状态码: %ld", (long)httpResponse.statusCode);
        }
    }];
    
    [task resume];
}

// 4. 获取ZEGO Token
+ (void)getZegoTokenWithUserId:(NSString *)userId {
    NSString *urlString = [NSString stringWithFormat:@"%@/api/zegotoken?userId=%@", kBaseUrl, userId];
    NSURL *url = [NSURL URLWithString:urlString];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"GET"];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request 
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        if (httpResponse.statusCode == 200) {
            NSError *jsonError;
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data 
                                                                 options:0 
                                                                   error:&jsonError];
            if (jsonError) {
                NSLog(@"JSON解析错误: %@", jsonError);
                return;
            }
            
            NSLog(@"获取Token成功: %@", json);
        } else {
            NSLog(@"请求失败，状态码: %ld", (long)httpResponse.statusCode);
        }
    }];
    
    [task resume];
}

@end
```

### JavaScript/TypeScript 示例

```javascript
// 基础URL
const BASE_URL = 'https://你的服务域名';

// 1. 创建AI代理
async function createAgent() {
  try {
    const response = await fetch(`${BASE_URL}/api/agent/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    console.log('创建AI代理结果:', data);
    return data;
  } catch (error) {
    console.error('创建AI代理失败:', error);
    throw error;
  }
}

// 2. 启动AI代理
async function startAgent(roomId, userId, userStreamId, agentStreamId, agentUserId, messages = []) {
  try {
    const response = await fetch(`${BASE_URL}/api/agent/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room_id: roomId,
        user_id: userId,
        user_stream_id: userStreamId,
        agent_stream_id: agentStreamId,
        agent_user_id: agentUserId,
        messages: messages
      }),
    });
    
    const data = await response.json();
    console.log('启动AI代理结果:', data);
    return data;
  } catch (error) {
    console.error('启动AI代理失败:', error);
    throw error;
  }
}

// 3. 停止AI代理
async function stopAgent(agentInstanceId) {
  try {
    const response = await fetch(`${BASE_URL}/api/agent/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_instance_id: agentInstanceId
      }),
    });
    
    const data = await response.json();
    console.log('停止AI代理结果:', data);
    return data;
  } catch (error) {
    console.error('停止AI代理失败:', error);
    throw error;
  }
}

// 4. 获取ZEGO Token
async function getZegoToken(userId) {
  try {
    const response = await fetch(`${BASE_URL}/api/zegotoken?userId=${userId}`, {
      method: 'GET',
    });
    
    const data = await response.json();
    console.log('获取ZEGO Token结果:', data);
    return data;
  } catch (error) {
    console.error('获取ZEGO Token失败:', error);
    throw error;
  }
}

// 使用示例
async function example() {
  try {
    // 1. 创建AI代理
    await createAgent();
    
    // 2. 启动AI代理
    const startResponse = await startAgent(
      'room123',
      'user123',
      'stream_user123',
      'stream_agent123',
      'agent123'
    );
    
    const agentInstanceId = startResponse.agentInstanceId;
    
    // 这里可以进行与AI代理的交互...
    
    // 3. 停止AI代理
    await stopAgent(agentInstanceId);
    
    // 4. 获取ZEGO Token
    const tokenData = await getZegoToken('user123');
    console.log('Token:', tokenData.token);
  } catch (error) {
    console.error('示例执行失败:', error);
  }
}

// 执行示例
// example();
```

请根据您的实际情况修改以上示例中的`BASE_URL`和相关参数。在实际开发中，您可能还需要添加错误处理、重试机制、授权验证等功能，以确保API调用的可靠性和安全性。

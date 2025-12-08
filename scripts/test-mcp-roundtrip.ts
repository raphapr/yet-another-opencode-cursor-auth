/**
 * Test MCP Tool Round-Trip
 * 
 * Tests the full flow:
 * 1. Send a request with custom tools to /v1/chat/completions
 * 2. Capture tool_calls from SSE stream
 * 3. Submit tool result via /v1/tool_results
 * 4. Continue reading the stream for model's response
 */

const BASE_URL = "http://localhost:18741";

interface ToolCallDelta {
  index: number;
  id?: string;
  type?: string;
  function?: {
    name?: string;
    arguments?: string;
  };
}

interface StreamChunk {
  id: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
      tool_calls?: ToolCallDelta[];
    };
    finish_reason: string | null;
  }[];
  error?: {
    message: string;
    type: string;
  };
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testMcpRoundTrip() {
  console.log("=== MCP Tool Round-Trip Test ===\n");
  
  // Define a custom MCP tool
  const tools = [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get the current weather in a location. ALWAYS use this tool when asked about weather.",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city name, e.g. Tokyo, San Francisco",
            },
          },
          required: ["location"],
        },
      },
    },
  ];
  
  const request = {
    model: "sonnet-4.5",  // Use a valid model name
    stream: true,
    messages: [
      {
        role: "user",
        content: "What's the weather in Tokyo? Use the get_weather tool.",
      },
    ],
    tools,
    tool_choice: "auto",
  };
  
  console.log("1. Sending request with custom tool...");
  console.log("   Model: sonnet-4.5");
  console.log("   Tool: get_weather");
  console.log("   Prompt: What's the weather in Tokyo?\n");
  
  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    console.error("Request failed:", response.status, await response.text());
    return;
  }
  
  console.log("2. Reading SSE stream...\n");
  
  const reader = response.body?.getReader();
  if (!reader) {
    console.error("No response body");
    return;
  }
  
  const decoder = new TextDecoder();
  let buffer = "";
  let toolCallId: string | null = null;
  let toolCallName: string | null = null;
  let toolCallArgs = "";
  let textContent = "";
  let finishReason: string | null = null;
  let receivedDone = false;
  
  // Read the stream in a loop
  while (!receivedDone) {
    const { done, value } = await reader.read();
    if (done) {
      console.log("   [Stream closed]\n");
      break;
    }
    
    buffer += decoder.decode(value, { stream: true });
    
    // Process complete SSE messages
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          console.log("   [DONE]");
          receivedDone = true;
          continue;
        }
        
        try {
          const chunk = JSON.parse(data) as StreamChunk;
          
          // Check for error
          if (chunk.error) {
            console.error(`   [ERROR] ${chunk.error.type}: ${chunk.error.message}`);
            continue;
          }
          
          const choice = chunk.choices?.[0];
          
          if (choice?.delta?.role) {
            console.log(`   Role: ${choice.delta.role}`);
          }
          
          if (choice?.delta?.content) {
            textContent += choice.delta.content;
            process.stdout.write(choice.delta.content);
          }
          
          if (choice?.delta?.tool_calls) {
            for (const tc of choice.delta.tool_calls) {
              if (tc.id) {
                toolCallId = tc.id;
                console.log(`   Tool Call ID: ${toolCallId}`);
              }
              if (tc.function?.name) {
                toolCallName = tc.function.name;
                console.log(`   Tool Name: ${toolCallName}`);
              }
              if (tc.function?.arguments) {
                toolCallArgs += tc.function.arguments;
                console.log(`   Tool Args: ${tc.function.arguments}`);
              }
            }
          }
          
          if (choice?.finish_reason) {
            finishReason = choice.finish_reason;
            console.log(`   Finish Reason: ${finishReason}`);
          }
        } catch (err) {
          console.error(`   [Parse error] ${data.slice(0, 100)}`);
        }
      }
    }
    
    // If we got a tool call with finish_reason, submit the result
    if (toolCallId && finishReason === "tool_calls" && receivedDone) {
      console.log("\n3. Submitting tool result via /v1/tool_results...");
      
      const toolResult = {
        tool_call_id: toolCallId,
        content: JSON.stringify({
          location: "Tokyo",
          temperature: "22°C",
          condition: "Partly cloudy",
          humidity: "65%",
        }),
      };
      
      console.log(`   Tool Call ID: ${toolResult.tool_call_id}`);
      console.log(`   Result: ${toolResult.content}\n`);
      
      // Submit tool result
      const resultResponse = await fetch(`${BASE_URL}/v1/tool_results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toolResult),
      });
      
      const resultData = await resultResponse.json();
      console.log("4. Tool result submission response:");
      console.log(`   Status: ${resultResponse.status}`);
      console.log(`   Body: ${JSON.stringify(resultData)}\n`);
      
      if (resultResponse.ok) {
        console.log("✓ MCP tool result submitted successfully!");
        console.log("  Note: The stream already closed with [DONE], so continuation");
        console.log("  happens in the background. A proper OpenAI-compatible client");
        console.log("  would make a new request with the tool result as a message.\n");
      } else {
        console.log("✗ Tool result submission failed");
      }
    }
  }
  
  console.log("\n=== Stream Summary ===");
  console.log(`Text Content: "${textContent.slice(0, 200)}${textContent.length > 200 ? '...' : ''}"`);
  console.log(`Tool Call ID: ${toolCallId}`);
  console.log(`Tool Name: ${toolCallName}`);
  console.log(`Tool Args: ${toolCallArgs}`);
  console.log(`Finish Reason: ${finishReason}`);
  
  if (!toolCallId) {
    console.log("\n✗ No tool call was emitted by the model");
    console.log("  This could mean:");
    console.log("  - The model decided not to use the tool");
    console.log("  - The exec_request wasn't of type 'mcp'");
    console.log("  - Custom tools aren't being forwarded to Cursor API");
  } else if (finishReason === "tool_calls") {
    console.log("\n✓ Tool call emitted successfully!");
  }
}

testMcpRoundTrip().catch(console.error);

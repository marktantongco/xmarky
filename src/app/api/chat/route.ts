import { NextRequest } from 'next/server';

const LONGCAT_API_URL = 'https://api.longcat.chat/openai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, systemPrompt } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.LONGCAT_API_KEY;
    if (!apiKey) {
      console.error('LONGCAT_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ error: 'LongCat API key is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = process.env.LONGCAT_MODEL || 'LongCat-2.0-Preview';

    // Build messages array with optional system prompt
    const chatMessages: { role: string; content: string }[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: 'system', content: systemPrompt });
    }

    for (const msg of messages) {
      chatMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    const response = await fetch(LONGCAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model,
        messages: chatMessages,
        max_tokens: 32000,
        temperature: 0.7,
        top_p: 0.9,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LongCat API error:', response.status, errorText);

      let errorMessage = `LongCat API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch {
        // use default error message
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse OpenAI-compatible SSE stream and forward simplified events
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();

            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;

              if (delta?.content) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'delta', content: delta.content })}\n\n`)
                );
              }

              if (parsed.choices?.[0]?.finish_reason) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
                );
              }

              // Forward usage info if available
              if (parsed.usage) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'usage', usage: parsed.usage })}\n\n`)
                );
              }
            } catch {
              // Skip unparseable lines
            }
          }
        }
      },
    });

    const readableStream = response.body?.pipeThrough(transformStream) as ReadableStream;

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

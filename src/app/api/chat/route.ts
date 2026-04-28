import { NextRequest } from 'next/server';

const LONGCAT_API_URL = 'https://api.longcat.chat/openai/v1/chat/completions';
const RETRY_AFTER_HEADER = 'Retry-After';

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

    // Validate each message has role and content
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response(
          JSON.stringify({ error: 'Each message must have role and content' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: `Invalid role: ${msg.role}. Must be user, assistant, or system.` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
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
      chatMessages.push({ role: msg.role, content: msg.content });
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
      signal: request.signal,
    });

    // Handle rate limiting with Retry-After header
    if (response.status === 429) {
      const retryAfter = response.headers.get(RETRY_AFTER_HEADER);
      const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : 60;
      console.warn(`LongCat rate limit hit. Retry after ${retrySeconds}s`);
      return new Response(
        JSON.stringify({
          error: `Rate limit exceeded. Please wait ${retrySeconds} seconds before trying again.`,
          retry_after: retrySeconds,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            [RETRY_AFTER_HEADER]: String(retrySeconds),
          },
        }
      );
    }

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

    if (!response.body) {
      return new Response(
        JSON.stringify({ error: 'No response body from upstream' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse OpenAI-compatible SSE stream with robust buffering
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const data = trimmed.slice(5).trim(); // Remove 'data:' prefix

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

            if (delta?.role) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'role', role: delta.role })}\n\n`)
              );
            }

            if (parsed.choices?.[0]?.finish_reason) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'done', reason: parsed.choices[0].finish_reason })}\n\n`)
              );
            }

            // Forward usage info if available (usually in final chunk)
            if (parsed.usage) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'usage', usage: parsed.usage })}\n\n`)
              );
            }
          } catch {
            // Skip unparseable lines — could be partial JSON from chunk boundary
          }
        }
      },
      flush(controller) {
        // Ensure [DONE] is sent if stream ends without it
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      },
    });

    const readableStream = response.body.pipeThrough(transformStream) as ReadableStream;

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: unknown) {
    // Handle client abort
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(
        JSON.stringify({ error: 'Request cancelled' }),
        { status: 499, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

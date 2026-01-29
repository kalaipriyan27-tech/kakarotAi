type ServeHandler = (req: Request) => Response | Promise<Response>;

// Use the built-in Deno runtime serve in Supabase Edge Functions without requiring
// TypeScript URL-import resolution in the editor.
const serve = (handler: ServeHandler) => {
  const denoServe: ((handler: ServeHandler) => unknown) | undefined = (
    globalThis as unknown as { Deno?: { serve?: (handler: ServeHandler) => unknown } }
  )?.Deno?.serve;

  if (!denoServe) {
    throw new Error("Deno.serve is not available in this runtime.");
  }

  return denoServe(handler);
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  baseUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const denoEnvGet: ((key: string) => string | undefined) | undefined = (
      globalThis as unknown as { Deno?: { env?: { get?: (key: string) => string | undefined } } }
    )?.Deno?.env?.get;

    const rawKey = denoEnvGet?.("LLM_API_KEY");
    if (!rawKey) {
      console.error("LLM_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "LLM_API_KEY is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Common misconfiguration: users paste keys with surrounding quotes or whitespace.
    // Normalize without ever logging the key.
    let LLM_API_KEY = rawKey.trim();
    if (
      (LLM_API_KEY.startsWith('"') && LLM_API_KEY.endsWith('"')) ||
      (LLM_API_KEY.startsWith("'") && LLM_API_KEY.endsWith("'"))
    ) {
      LLM_API_KEY = LLM_API_KEY.slice(1, -1).trim();
    }
    console.log(`LLM_API_KEY loaded (length=${LLM_API_KEY.length})`);

    const { messages, model, baseUrl }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Default to HuggingFace Router API, but allow custom base URL
    const apiUrl = baseUrl || "https://router.huggingface.co/v1/chat/completions";
    // Default model - can be changed to any model supported by your provider
    const selectedModel = model || "deepseek-ai/DeepSeek-R1-0528";

    console.log(`Calling ${apiUrl} with model: ${selectedModel}`);
    console.log(`Messages count: ${messages.length}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
        // OpenRouter-specific headers (ignored by other providers)
        "HTTP-Referer": denoEnvGet?.("SUPABASE_URL") || "",
        "X-Title": "Kakarot Ai",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Be concise and helpful.",
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LLM API error: ${response.status} - ${errorText}`);

      // Try to surface provider message (safe, no secrets) for easier debugging.
      let providerMessage: string | undefined;
      try {
        const parsed = JSON.parse(errorText);
        providerMessage =
          parsed?.error?.message || parsed?.message || parsed?.error || undefined;
      } catch {
        // ignore
      }

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({
            error:
              providerMessage
                ? `LLM provider auth failed: ${providerMessage}`
                : "Invalid API key. Please check your LLM_API_KEY.",
          }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: `LLM API error: ${response.status}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

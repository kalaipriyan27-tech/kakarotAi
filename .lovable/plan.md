

# Plan: Custom LLM Edge Function with Your Own API Key

## Overview
Create a secure Supabase edge function that connects to your preferred LLM provider (OpenRouter, OpenAI, etc.) using your own API key and model selection.

## What You'll Get
- A backend edge function that keeps your API key secure (never exposed to browser)
- Ability to choose any model from your provider
- Streaming responses for real-time AI text generation
- Easy model switching without code changes

---

## Implementation Steps

### Step 1: Add Your API Key as a Secret
Before coding, you'll be prompted to securely add your API key:
- **Secret name**: `LLM_API_KEY`
- **Value**: Your OpenRouter, OpenAI, or other provider's API key

### Step 2: Create Edge Function
Create `supabase/functions/chat/index.ts`:
- Accepts messages array and model parameter from frontend
- Reads `LLM_API_KEY` from environment secrets
- Calls your chosen LLM provider's API
- Streams response back to the client
- Handles errors gracefully (rate limits, auth failures)

### Step 3: Configure Supabase
Create `supabase/config.toml`:
- Register the chat function
- Set `verify_jwt = false` for public access (or add auth if needed)

### Step 4: Update Frontend Chat Service
Modify `src/lib/chatService.ts`:
- Replace mocked `getAIResponse` with real edge function call
- Add streaming support with token-by-token rendering
- Pass model parameter (configurable)

### Step 5: Update Chat Container
Modify `src/components/chat/ChatContainer.tsx`:
- Integrate streaming response handling
- Update assistant message progressively as tokens arrive

---

## Technical Details

### Edge Function API
```text
POST /functions/v1/chat
Body: { messages: [...], model: "openai/gpt-4o" }
Response: SSE stream of tokens
```

### Supported Providers
The edge function will be configured for OpenRouter format (compatible with most providers):
- OpenRouter: `https://openrouter.ai/api/v1/chat/completions`
- OpenAI: `https://api.openai.com/v1/chat/completions`

You can specify which provider's base URL to use.

### Default Model
Will default to a common model (e.g., `openai/gpt-4o-mini`) but you can change it in the code or make it configurable via the UI later.

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/config.toml` | Create - Register edge function |
| `supabase/functions/chat/index.ts` | Create - Main edge function |
| `src/lib/chatService.ts` | Modify - Call edge function with streaming |
| `src/components/chat/ChatContainer.tsx` | Modify - Handle streaming responses |

---

## Security Notes
- Your API key is stored as an encrypted Supabase secret
- Never exposed to the browser or frontend code
- All API calls happen server-side in the edge function


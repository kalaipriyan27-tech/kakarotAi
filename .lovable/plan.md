
# Switch LLM Model to DeepSeek

## Overview
Change the default LLM model from Qwen/Qwen2.5-7B-Instruct to a DeepSeek model. Since you're using HuggingFace Router, we'll use DeepSeek models available through that service.

## Changes Required

### 1. Update Frontend Configuration
**File:** `src/lib/chatService.ts`
- Change `DEFAULT_MODEL` from `"Qwen/Qwen2.5-7B-Instruct"` to `"deepseek-ai/DeepSeek-R1-0528"`
- The base URL stays the same (HuggingFace Router)

### 2. Update Edge Function Default
**File:** `supabase/functions/chat/index.ts`
- Change the fallback model from `"Qwen/Qwen2.5-7B-Instruct"` to `"deepseek-ai/DeepSeek-R1-0528"`

## Available DeepSeek Models on HuggingFace
- `deepseek-ai/DeepSeek-R1-0528` - Latest reasoning model
- `deepseek-ai/DeepSeek-V3-0324` - Latest general model
- `deepseek-ai/DeepSeek-R1` - Reasoning-focused model
- `deepseek-ai/DeepSeek-V2.5` - Previous generation

## Technical Details

The changes are minimal since the architecture already supports model switching:

```text
┌─────────────────────────────────────────────────────────┐
│  chatService.ts                                         │
│  DEFAULT_MODEL = "deepseek-ai/DeepSeek-R1-0528"        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Edge Function (chat/index.ts)                          │
│  Forwards model to HuggingFace Router                   │
│  fallback: "deepseek-ai/DeepSeek-R1-0528"              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  HuggingFace Router API                                 │
│  https://router.huggingface.co/v1/chat/completions     │
└─────────────────────────────────────────────────────────┘
```

## Files to Modify
1. `src/lib/chatService.ts` - Line 22
2. `supabase/functions/chat/index.ts` - Line 65

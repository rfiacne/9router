// Auto-generated from CommandCode CLI 1.54.0 model metadata (yr/Tr/Pr maps).
// Full provider-specific caps keyed by canonical + alias model ids.
export const COMMANDCODE_MODEL_CAPABILITIES = {
  // DeepSeek V4 Pro
  "deepseek/deepseek-v4-pro": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["high", "max"], contextWindow: 1000000, vision: false },
  // DeepSeek V4 Flash
  "deepseek/deepseek-v4-flash": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["high", "max"], contextWindow: 1000000, vision: false },
  // DeepSeek V4 Flash Vision Exp
  "deepseek/deepseek-v4-flash-vision-exp": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["high", "max"], contextWindow: 1000000, vision: true },
  // DeepSeek V4 Flash Fast
  "deepseek/deepseek-v4-flash-fast": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "high", "max"], contextWindow: 1000000, vision: false },
  // DeepSeek V4.1 Flash
  "deepseek/deepseek-v4.1-flash": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "high", "max"], contextWindow: 1000000, vision: true },
  // Kimi K3
  "moonshotai/Kimi-K3": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "high", "max"], contextWindow: 1000000, vision: true },
  // Kimi K2.7 Code
  "moonshotai/Kimi-K2.7-Code": { reasoning: false, contextWindow: 256000, vision: true },
  // Kimi K2.7 Code Highspeed
  "moonshotai/Kimi-K2.7-Code-Highspeed": { reasoning: false, contextWindow: 262000, vision: true },
  // Kimi K2.6
  "moonshotai/Kimi-K2.6": { reasoning: false, contextWindow: 256000, vision: true },
  // Kimi K2.5
  "moonshotai/Kimi-K2.5": { reasoning: false, contextWindow: 256000, vision: true },
  // GLM 5.3 Flash
  "z-ai/glm-5.3-flash": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "high", "max"], contextWindow: 1048576, vision: true },
  // GLM 5.3
  "zai-org/GLM-5.3": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "high", "max"], contextWindow: 1000000, vision: false },
  // GLM 5.2
  "zai-org/GLM-5.2": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["high", "max"], contextWindow: 1000000, vision: false },
  // GLM 5.2 Fast
  "zai-org/GLM-5.2-Fast": { reasoning: false, contextWindow: 1000000, vision: false },
  // GLM 5.1
  "zai-org/GLM-5.1": { reasoning: false, contextWindow: 200000, vision: false },
  // GLM 5
  "zai-org/GLM-5": { reasoning: false, contextWindow: 200000, vision: false },
  // MiniMax M3
  "MiniMaxAI/MiniMax-M3": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 1000000, vision: true },
  // MiniMax M2.7
  "MiniMaxAI/MiniMax-M2.7": { reasoning: false, contextWindow: 200000, vision: false },
  // MiniMax M2.5
  "MiniMaxAI/MiniMax-M2.5": { reasoning: false, contextWindow: 200000, vision: false },
  // MiMo V2.5 Pro
  "xiaomi/mimo-v2.5-pro": { reasoning: false, contextWindow: 1000000, vision: false },
  // MiMo V2.5
  "xiaomi/mimo-v2.5": { reasoning: false, contextWindow: 1000000, vision: true },
  // Qwen3.8 Max 0902
  "Qwen/Qwen3.8-Max-0902": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "xhigh"], contextWindow: 1000000, vision: true },
  // Qwen3.8 Max
  "Qwen/Qwen3.8-Max": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "xhigh"], contextWindow: 1000000, vision: true },
  // Qwen3.8 27B
  "Qwen/Qwen3.8-27B": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "xhigh"], contextWindow: 262144, vision: true },
  // Qwen3.8 Flash
  "Qwen/Qwen3.8-Flash": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "xhigh"], contextWindow: 1000000, vision: true },
  // Qwen3.7 Max
  "Qwen/Qwen3.7-Max": { reasoning: false, contextWindow: 1000000, vision: false },
  // Qwen3.7 Plus
  "Qwen/Qwen3.7-Plus": { reasoning: false, contextWindow: 1000000, vision: true },
  // Qwen3.7 Flash
  "Qwen/Qwen3.7-Flash": { reasoning: false, contextWindow: 1000000, vision: true },
  // Qwen3.6 Max Preview
  "Qwen/Qwen3.6-Max-Preview": { reasoning: false, contextWindow: 200000, vision: false },
  // Qwen3.6 Plus
  "Qwen/Qwen3.6-Plus": { reasoning: false, contextWindow: 200000, vision: true },
  // LongCat 2.0 (Free)
  "meituan/LongCat-2.0:free": { reasoning: false, contextWindow: 1048576, vision: false },
  // Step 3.7 Flash
  "stepfun/Step-3.7-Flash": { reasoning: false, contextWindow: 256000, vision: true },
  // Step 3.5 Flash
  "stepfun/Step-3.5-Flash": { reasoning: false, contextWindow: 1000000, vision: false },
  // Hy3 Paid
  "tencent/hy3-paid": { reasoning: false, contextWindow: 262144, vision: false },
  // Hy4 Preview
  "tencent/hy4-preview": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 1048576, vision: false },
  // Nemotron 3 Ultra 550B A55B
  "nvidia/nemotron-3-ultra-550b-a55b": { reasoning: false, contextWindow: 1000000, vision: false },
  // Inkling
  "thinkingmachines/inkling": { reasoning: false, contextWindow: 256000, vision: true },
  // Inkling Small
  "thinkingmachines/inkling-small": { reasoning: false, contextWindow: 1000000, vision: true },
  // Laguna S 2.1 Free
  "poolside/laguna-s-2.1-free": { reasoning: false, contextWindow: 256000, vision: false },
  // Ling 3.0 Flash Sante (Free)
  "inclusionai/ling-3.0-flash-sante:free": { reasoning: false, contextWindow: 262144, vision: false },
  // Claude Sonnet 5
  "claude-sonnet-5": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1000000, vision: true },
  // Claude Sonnet 4.6
  "claude-sonnet-4-6": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1000000, vision: true },
  // Claude Fable 5.1
  "claude-fable-5-1": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1000000, vision: true },
  // Claude Fable 5
  "claude-fable-5": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1000000, vision: true },
  // Claude Opus 5
  "claude-opus-5": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1000000, vision: true },
  // Claude Opus 4.8
  "claude-opus-4-8": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1000000, vision: true },
  // Claude Opus 4.7
  "claude-opus-4-7": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1000000, vision: true },
  // Claude Haiku 4.5 20251001
  "claude-haiku-4-5-20251001": { reasoning: false, contextWindow: 200000, vision: true },
  // GPT 6 Astra
  "gpt-6-astra": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1050000, vision: true },
  // GPT 5.6 Sol
  "gpt-5.6-sol": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1050000, vision: true },
  // GPT 5.6 Terra
  "gpt-5.6-terra": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1050000, vision: true },
  // GPT 5.6 Luna
  "gpt-5.6-luna": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1050000, vision: true },
  // GPT 5.5
  "gpt-5.5": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh"], contextWindow: 400000, vision: true },
  // GPT 5.4
  "gpt-5.4": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh"], contextWindow: 400000, vision: true },
  // GPT 5.3 Codex
  "gpt-5.3-codex": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh"], contextWindow: 400000, vision: true },
  // GPT 5.4 Mini
  "gpt-5.4-mini": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 400000, vision: true },
  // Gemini 3.8 Flash
  "google/gemini-3.8-flash": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 1000000, vision: true },
  // Gemini 3.7 Flash
  "google/gemini-3.7-flash": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 1048576, vision: true },
  // Gemini 3.6 Flash
  "google/gemini-3.6-flash": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 1000000, vision: true },
  // Gemini 3.5 Flash
  "google/gemini-3.5-flash": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 1000000, vision: true },
  // Gemini 3.5 Flash Lite
  "google/gemini-3.5-flash-lite": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 1000000, vision: true },
  // Gemini 3.1 Flash Lite
  "google/gemini-3.1-flash-lite": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 1000000, vision: true },
  // Fugu Ultra
  "sakana/fugu-ultra": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["high", "xhigh"], contextWindow: 1000000, vision: true },
  // Muse Spark 1.1
  "meta/muse-spark-1.1": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh"], contextWindow: 1048576, vision: true, maxOutput: 32768 },
  // Muse Spark 1.2
  "meta/muse-spark-1.2": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh"], contextWindow: 1048576, vision: true, maxOutput: 32768 },
  // Muse Spark 1.2 Contributor
  "meta/muse-spark-1.2-contributor": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh"], contextWindow: 1048576, vision: true, maxOutput: 32768 },
  // Muse Spark 1.3
  "meta/muse-spark-1.3": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh", "max"], contextWindow: 1048576, vision: true, maxOutput: 32768 },
  // Muse Spark 1.3 Contributor
  "meta/muse-spark-1.3-contributor": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh"], contextWindow: 1048576, vision: true, maxOutput: 32768 },
  // Grok 4.5
  "xai/grok-4.5": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high"], contextWindow: 500000, vision: true },
  // Grok 4.6
  "xai/grok-4.6": { reasoning: true, thinkingFormat: "commandcode", reasoningEfforts: ["low", "medium", "high", "xhigh"], contextWindow: 500000, vision: true },
  // Claude Haiku 4.5
  "claude-haiku-4-5": { reasoning: false, contextWindow: 200000, vision: true },
};

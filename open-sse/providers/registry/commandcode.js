export default {
  id: "commandcode",
  priority: 100,
  alias: "commandcode",
  aliases: [
    "cmc",
  ],
  uiAlias: "cmc",
  display: {
    name: "Command Code",
    icon: "smart_toy",
    color: "#000000",
    textIcon: "CC",
    website: "https://commandcode.ai",
    notice: {
      text: "Use your CommandCode CLI API key (starts with user_...) from ~/.commandcode/auth.json or commandcode.ai/studio.",
      apiKeyUrl: "https://commandcode.ai/studio",
    },
  },
  category: "apikey",
  transport: {
    baseUrl: "https://api.commandcode.ai/alpha/generate",
    format: "commandcode",
    // CommandCode's alpha envelope carries thinking effort at params.reasoning_effort,
    // not at the top level. Keep all CommandCode models on this wire format even when
    // their upstream model family (deepseek/kimi/glm/qwen/...) has its own vendor format.
    thinkingFormat: "commandcode",
    forceStream: true,
    headers: {
      "x-command-code-version": "0.25.7",
      "x-cli-environment": "cli",
    },
  },
  features: {
    usage: true,
    usageApikey: true,
  },
  models: [
    { id: "deepseek/deepseek-v4-pro", name: "DeepSeek V4 Pro" },
    { id: "deepseek/deepseek-v4-flash", name: "DeepSeek V4 Flash" },
    { id: "moonshotai/Kimi-K2.6", name: "Kimi K2.6" },
    { id: "moonshotai/Kimi-K2.5", name: "Kimi K2.5" },
    { id: "zai-org/GLM-5.1", name: "GLM 5.1" },
    { id: "zai-org/GLM-5", name: "GLM 5" },
    { id: "MiniMaxAI/MiniMax-M2.7", name: "MiniMax M2.7" },
    { id: "MiniMaxAI/MiniMax-M2.5", name: "MiniMax M2.5" },
    { id: "Qwen/Qwen3.6-Max-Preview", name: "Qwen 3.6 Max Preview" },
    { id: "Qwen/Qwen3.6-Plus", name: "Qwen 3.6 Plus" },
    { id: "stepfun/Step-3.5-Flash", name: "Step 3.5 Flash" },
  ],
};

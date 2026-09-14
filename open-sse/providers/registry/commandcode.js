import { COMMANDCODE_MODELS } from "../commandcodeModels.js";

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
      "x-command-code-version": "1.54.0",
      "x-cli-environment": "cli",
    },
  },
  features: {
    usage: true,
    usageApikey: true,
  },
  models: COMMANDCODE_MODELS,
};

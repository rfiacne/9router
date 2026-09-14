// CommandCode catalogue/capability sync with CLI 1.54.0.
import { describe, expect, it } from "vitest";
import { PROVIDER_MODELS, isValidModel, getModelUpstreamId } from "../../open-sse/config/providerModels.js";
import { getCapabilitiesForModel } from "../../open-sse/providers/capabilities.js";
import { getThinkingLevels } from "../../open-sse/providers/thinkingLevels.js";

describe("CommandCode model catalogue", () => {
  it("includes the current CLI catalogue entries", () => {
    const ids = new Set(PROVIDER_MODELS.commandcode.map((m) => m.id));
    expect(ids.has("deepseek/deepseek-v4-pro")).toBe(true);
    expect(ids.has("deepseek/deepseek-v4.1-flash")).toBe(true);
    expect(ids.has("moonshotai/kimi-k3")).toBe(true);
    expect(ids.has("qwen/qwen3.8-27b")).toBe(true);
    expect(ids.has("meta/muse-spark-1.2-contributor")).toBe(true);
    expect(ids.has("claude-sonnet-5")).toBe(true);
    expect(ids.has("gpt-5.6-sol")).toBe(true);
  });

  it("resolves model ids case-insensitively", () => {
    expect(isValidModel("commandcode", "Qwen/Qwen3.8-27B")).toBe(true);
    expect(getModelUpstreamId("commandcode", "Qwen/Qwen3.8-27B")).toBe("qwen/qwen3.8-27b");
  });

  it("applies the official per-model effort enum and context window", () => {
    const deepseek = getCapabilitiesForModel("commandcode", "deepseek/deepseek-v4-pro");
    expect(deepseek).toMatchObject({
      reasoning: true,
      thinkingFormat: "commandcode",
      contextWindow: 1000000,
      vision: false,
    });
    expect(getThinkingLevels("commandcode", "deepseek/deepseek-v4-pro")).toEqual(["high", "max"]);

    const qwen = getCapabilitiesForModel("commandcode", "qwen/qwen3.8-max");
    expect(qwen.reasoning).toBe(true);
    expect(getThinkingLevels("commandcode", "qwen/qwen3.8-max")).toEqual(["low", "medium", "xhigh"]);

    const muse = getCapabilitiesForModel("commandcode", "meta/muse-spark-1.2-contributor");
    expect(muse).toMatchObject({
      reasoning: true,
      vision: true,
      contextWindow: 1048576,
      maxOutput: 32768,
    });
    expect(getThinkingLevels("commandcode", "meta/muse-spark-1.2-contributor")).toEqual([
      "low", "medium", "high", "xhigh",
    ]);
  });

  it("marks text-only catalogue models as non-vision", () => {
    expect(getCapabilitiesForModel("commandcode", "deepseek/deepseek-v4-pro").vision).toBe(false);
    expect(getCapabilitiesForModel("commandcode", "qwen/qwen3.6-plus").vision).toBe(false);
  });
});

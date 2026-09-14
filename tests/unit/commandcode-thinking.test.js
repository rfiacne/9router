// CommandCode alpha envelope: reasoning effort must land in params.reasoning_effort.
// The official CLI catalogue also publishes the exact per-model effort enum, so we
// verify both the wire placement and the level filtering.
import { describe, expect, it } from "vitest";
import "../translator/registerAll.js";
import { translateRequest } from "../../open-sse/translator/index.js";
import { FORMATS } from "../../open-sse/translator/formats.js";

const HIGH_SUPPORTED_MODELS = [
  "deepseek/deepseek-v4-pro",
  "deepseek/deepseek-v4-flash",
  "moonshotai/kimi-k3",
  "z-ai/glm-5.3-flash",
  "zai-org/glm-5.2",
  "minimaxai/minimax-m3",
  "claude-sonnet-5",
  "gpt-5.6-sol",
  "meta/muse-spark-1.2-contributor",
];

function run(model, body) {
  return translateRequest(
    FORMATS.OPENAI,
    FORMATS.COMMANDCODE,
    model,
    { messages: [{ role: "user", content: "hello" }], ...body },
    true,
    null,
    "commandcode"
  );
}

describe("CommandCode reasoning effort", () => {
  it.each(HIGH_SUPPORTED_MODELS)("forwards reasoning_effort=high into params for %s", (model) => {
    const out = run(model, { reasoning_effort: "high" });
    expect(out.params.reasoning_effort).toBe("high");
    expect(out.reasoning_effort).toBeUndefined();
    expect(out.thinking).toBeUndefined();
  });

  it("preserves levels declared by the official CLI metadata", () => {
    expect(run("claude-sonnet-5", { reasoning_effort: "xhigh" }).params.reasoning_effort).toBe("xhigh");
    expect(run("claude-sonnet-5", { reasoning_effort: "max" }).params.reasoning_effort).toBe("max");
    expect(run("qwen/qwen3.8-max", { reasoning_effort: "xhigh" }).params.reasoning_effort).toBe("xhigh");
  });

  it("drops levels the model does not declare", () => {
    // DeepSeek V4 only exposes high|max.
    expect(run("deepseek/deepseek-v4-pro", { reasoning_effort: "low" }).params.reasoning_effort).toBeUndefined();
    // Qwen 3.8 Max exposes low|medium|xhigh (not high).
    expect(run("qwen/qwen3.8-max", { reasoning_effort: "high" }).params.reasoning_effort).toBeUndefined();
  });

  it("accepts the OpenAI Responses reasoning.effort shape", () => {
    const out = run("google/gemini-3.8-flash", { reasoning: { effort: "medium" } });
    expect(out.params.reasoning_effort).toBe("medium");
  });

  it("folds minimal to low and omits auto/none", () => {
    expect(run("moonshotai/kimi-k3", { reasoning_effort: "minimal" }).params.reasoning_effort).toBe("low");
    expect(run("moonshotai/kimi-k3", { reasoning_effort: "auto" }).params.reasoning_effort).toBeUndefined();
    expect(run("moonshotai/kimi-k3", { reasoning_effort: "none" }).params.reasoning_effort).toBeUndefined();
  });

  it("consumes a model(level) suffix without leaking it upstream", () => {
    const out = run("deepseek/deepseek-v4-pro(max)", {});
    expect(out.params.model).toBe("deepseek/deepseek-v4-pro");
    expect(out.params.reasoning_effort).toBe("max");
  });
});

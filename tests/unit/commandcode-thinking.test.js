// CommandCode alpha envelope: reasoning effort must land in params.reasoning_effort
// regardless of the upstream model family. The wire accepts exactly
// low|medium|high|xhigh|max; auto/none omit the field.
import { describe, expect, it } from "vitest";
import "../translator/registerAll.js";
import { translateRequest } from "../../open-sse/translator/index.js";
import { FORMATS } from "../../open-sse/translator/formats.js";

const MODELS = [
  "deepseek/deepseek-v4-pro",
  "deepseek/deepseek-v4-flash",
  "moonshotai/Kimi-K2.6",
  "zai-org/GLM-5.1",
  "MiniMaxAI/MiniMax-M2.7",
  "Qwen/Qwen3.6-Plus",
  "stepfun/Step-3.5-Flash",
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
  it.each(MODELS)("forwards reasoning_effort=high into params for %s", (model) => {
    const out = run(model, { reasoning_effort: "high" });
    expect(out.params.reasoning_effort).toBe("high");
    expect(out.reasoning_effort).toBeUndefined();
    expect(out.thinking).toBeUndefined();
  });

  it.each(["xhigh", "max"])("preserves native level %s unchanged", (level) => {
    const out = run("deepseek/deepseek-v4-pro", { reasoning_effort: level });
    expect(out.params.reasoning_effort).toBe(level);
  });

  it("accepts the OpenAI Responses reasoning.effort shape", () => {
    const out = run("moonshotai/Kimi-K2.6", { reasoning: { effort: "medium" } });
    expect(out.params.reasoning_effort).toBe("medium");
  });

  it("folds minimal to low and omits auto/none", () => {
    expect(run("zai-org/GLM-5.1", { reasoning_effort: "minimal" }).params.reasoning_effort).toBe("low");
    expect(run("zai-org/GLM-5.1", { reasoning_effort: "auto" }).params.reasoning_effort).toBeUndefined();
    expect(run("zai-org/GLM-5.1", { reasoning_effort: "none" }).params.reasoning_effort).toBeUndefined();
  });

  it("consumes a model(level) suffix without leaking it upstream", () => {
    const out = run("deepseek/deepseek-v4-pro(max)", {});
    expect(out.params.model).toBe("deepseek/deepseek-v4-pro");
    expect(out.params.reasoning_effort).toBe("max");
  });
});

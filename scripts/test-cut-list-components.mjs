import assert from "node:assert/strict";
import { componentModels } from "./cut-list-component-data.mjs";
import { evaluateCutListExpression } from "./cut-list-expression.mjs";

function variablesFor(model, overrides = {}) {
  return {
    ...Object.fromEntries(model.inputs.map((input) => [input.id, input.default])),
    ...overrides,
  };
}

function evaluatedParts(model, overrides = {}) {
  const variables = variablesFor(model, overrides);
  return model.parts.map((part) => ({
    name: part.name,
    quantity: evaluateCutListExpression(part.quantity, variables, `${model.slug} quantity`),
    thickness: evaluateCutListExpression(part.thickness, variables, `${model.slug} thickness`),
    width: evaluateCutListExpression(part.width, variables, `${model.slug} width`),
    length: evaluateCutListExpression(part.length, variables, `${model.slug} length`),
  }));
}

assert.equal(evaluateCutListExpression("1 + 2 * 3", {}), 7);
assert.equal(evaluateCutListExpression("(1 + 2) * 3", {}), 9);
assert.equal(evaluateCutListExpression("-2 + 5", {}), 3);
assert.equal(evaluateCutListExpression("ceil(width / 3)", { width: 10 }), 4);
assert.equal(evaluateCutListExpression("max(0, count - 1)", { count: 1 }), 0);
assert.throws(
  () => evaluateCutListExpression("missing + 1", {}),
  /unknown input/i,
);
assert.throws(
  () => evaluateCutListExpression("1 / 0", {}),
  /divide by zero/i,
);
assert.throws(
  () => evaluateCutListExpression("globalThis.process", {}),
  /unsupported character/i,
);

assert.equal(componentModels.length, 12);
for (const model of componentModels) {
  const parts = evaluatedParts(model);
  for (const part of parts) {
    assert.ok(Number.isInteger(part.quantity) && part.quantity > 0, `${model.slug} ${part.name} default quantity`);
    assert.ok(part.thickness > 0, `${model.slug} ${part.name} default thickness`);
    assert.ok(part.width > 0, `${model.slug} ${part.name} default width`);
    assert.ok(part.length > 0, `${model.slug} ${part.name} default length`);
  }
}

const faceFrame = componentModels.find((model) => model.slug === "face-frame-cut-list-calculator");
const faceFrameSingleOpening = evaluatedParts(faceFrame, {
  openingCount: 1,
  middleRailCount: 0,
});
assert.equal(
  faceFrameSingleOpening.find((part) => part.name === "Intermediate stile").quantity,
  0,
);
assert.equal(
  faceFrameSingleOpening.find((part) => part.name === "Intermediate rail").quantity,
  0,
);

const toeKick = componentModels.find((model) => model.slug === "toe-kick-platform-cut-list-calculator");
const narrowToeKick = evaluatedParts(toeKick, {
  cabinetWidth: 18,
  sideSetback: 0.75,
  supportSpacing: 24,
});
assert.equal(
  narrowToeKick.find((part) => part.name === "Intermediate sleeper").quantity,
  0,
);

const invalidFaceFrame = evaluatedParts(faceFrame, {
  cabinetWidth: 6,
  stileWidth: 3,
});
assert.equal(
  invalidFaceFrame.find((part) => part.name === "Top and bottom rail").length,
  0,
);

console.log(
  `Cut List Component tests passed for ${componentModels.length} models and the safe expression parser.`,
);


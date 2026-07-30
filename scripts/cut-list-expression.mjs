const expressionFunctions = Object.freeze({
  ceil: { minimumArgs: 1, maximumArgs: 1, apply: Math.ceil },
  floor: { minimumArgs: 1, maximumArgs: 1, apply: Math.floor },
  round: { minimumArgs: 1, maximumArgs: 1, apply: Math.round },
  max: { minimumArgs: 1, maximumArgs: Number.POSITIVE_INFINITY, apply: Math.max },
  min: { minimumArgs: 1, maximumArgs: Number.POSITIVE_INFINITY, apply: Math.min },
});

export const cutListExpressionFunctionNames = Object.freeze(
  Object.keys(expressionFunctions),
);

function finiteNumber(value, label) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`${label} must be a finite number.`);
  }
  return number;
}

function tokenize(expression) {
  const source = String(expression ?? "");
  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const character = source[index];
    if (/\s/u.test(character)) {
      index += 1;
      continue;
    }

    const remainder = source.slice(index);
    const numberMatch = remainder.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/u);
    if (numberMatch) {
      tokens.push({
        type: "number",
        value: finiteNumber(numberMatch[0], "Expression number"),
      });
      index += numberMatch[0].length;
      continue;
    }

    const identifierMatch = remainder.match(/^[A-Za-z_][A-Za-z0-9_]*/u);
    if (identifierMatch) {
      tokens.push({ type: "identifier", value: identifierMatch[0] });
      index += identifierMatch[0].length;
      continue;
    }

    if ("+-*/(),".includes(character)) {
      tokens.push({ type: character, value: character });
      index += 1;
      continue;
    }

    throw new Error(`Expression contains an unsupported character: ${character}`);
  }

  tokens.push({ type: "end", value: "" });
  return tokens;
}

export function evaluateCutListExpression(expression, variables, label = "Expression") {
  if (typeof expression === "number") {
    return finiteNumber(expression, `${label} result`);
  }
  if (typeof expression !== "string" || !expression.trim()) {
    throw new Error(`${label} is missing.`);
  }
  if (!variables || typeof variables !== "object" || Array.isArray(variables)) {
    throw new Error(`${label} variables must be an object.`);
  }

  const tokens = tokenize(expression);
  let position = 0;

  function current() {
    return tokens[position];
  }

  function consume(type) {
    const token = current();
    if (token.type !== type) {
      throw new Error(`${label} expected "${type}" but found "${token.value || token.type}".`);
    }
    position += 1;
    return token;
  }

  function parsePrimary() {
    const token = current();
    if (token.type === "number") {
      position += 1;
      return token.value;
    }

    if (token.type === "identifier") {
      position += 1;
      const identifier = token.value;
      if (current().type !== "(") {
        if (!Object.prototype.hasOwnProperty.call(variables, identifier)) {
          throw new Error(`${label} references unknown input "${identifier}".`);
        }
        return finiteNumber(variables[identifier], `${label} input ${identifier}`);
      }

      if (!Object.prototype.hasOwnProperty.call(expressionFunctions, identifier)) {
        throw new Error(`${label} uses unsupported function "${identifier}".`);
      }
      const definition = expressionFunctions[identifier];
      consume("(");
      const args = [];
      if (current().type !== ")") {
        args.push(parseAddSubtract());
        while (current().type === ",") {
          consume(",");
          args.push(parseAddSubtract());
        }
      }
      consume(")");
      if (args.length < definition.minimumArgs || args.length > definition.maximumArgs) {
        const expected = definition.minimumArgs === definition.maximumArgs
          ? String(definition.minimumArgs)
          : `${definition.minimumArgs} or more`;
        throw new Error(`${label} function ${identifier}() expects ${expected} argument(s).`);
      }
      return finiteNumber(definition.apply(...args), `${label} ${identifier}() result`);
    }

    if (token.type === "(") {
      consume("(");
      const value = parseAddSubtract();
      consume(")");
      return value;
    }

    throw new Error(`${label} contains unexpected token "${token.value || token.type}".`);
  }

  function parseUnary() {
    if (current().type === "+") {
      consume("+");
      return parseUnary();
    }
    if (current().type === "-") {
      consume("-");
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parseMultiplyDivide() {
    let value = parseUnary();
    while (current().type === "*" || current().type === "/") {
      const operator = current().type;
      position += 1;
      const right = parseUnary();
      if (operator === "/" && right === 0) {
        throw new Error(`${label} cannot divide by zero.`);
      }
      value = operator === "*" ? value * right : value / right;
      value = finiteNumber(value, `${label} result`);
    }
    return value;
  }

  function parseAddSubtract() {
    let value = parseMultiplyDivide();
    while (current().type === "+" || current().type === "-") {
      const operator = current().type;
      position += 1;
      const right = parseMultiplyDivide();
      value = operator === "+" ? value + right : value - right;
      value = finiteNumber(value, `${label} result`);
    }
    return value;
  }

  const result = parseAddSubtract();
  if (current().type !== "end") {
    throw new Error(`${label} contains unexpected token "${current().value || current().type}".`);
  }
  return finiteNumber(result, `${label} result`);
}

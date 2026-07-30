(function componentBuilderRuntime(global) {
  "use strict";

  const STORAGE_KEY = "woodcuttool-component-project-v1";
  const STORAGE_VERSION = 1;
  const CHANGE_EVENT = "woodcuttool:component-project-changed";
  const INCH_TO_MM = 25.4;
  const EXPRESSION_FUNCTIONS = Object.freeze({
    ceil: { minimumArgs: 1, maximumArgs: 1, apply: Math.ceil },
    floor: { minimumArgs: 1, maximumArgs: 1, apply: Math.floor },
    round: { minimumArgs: 1, maximumArgs: 1, apply: Math.round },
    max: { minimumArgs: 1, maximumArgs: Infinity, apply: Math.max },
    min: { minimumArgs: 1, maximumArgs: Infinity, apply: Math.min },
  });
  let fallbackIdCounter = 0;

  function cleanText(value, fallback = "") {
    const text = value == null ? "" : String(value).trim();
    return text || fallback;
  }

  function finiteNumber(value, label) {
    const number = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(number)) {
      throw new Error(`${label} must be a finite number.`);
    }
    return number;
  }

  function nonnegativeNumber(value, label) {
    const number = finiteNumber(value, label);
    if (number < 0) {
      throw new Error(`${label} cannot be negative.`);
    }
    return number;
  }

  function positiveNumber(value, label) {
    const number = finiteNumber(value, label);
    if (number <= 0) {
      throw new Error(`${label} must be greater than zero. Check the related clearances and counts.`);
    }
    return number;
  }

  function quantityNumber(value, label = "Quantity") {
    const number = nonnegativeNumber(value, label);
    if (!Number.isInteger(number)) {
      throw new Error(`${label} must be a whole number.`);
    }
    return number;
  }

  function tokenizeExpression(expression) {
    const source = String(expression);
    const tokens = [];
    let index = 0;

    while (index < source.length) {
      const character = source[index];
      if (/\s/.test(character)) {
        index += 1;
        continue;
      }

      const remainder = source.slice(index);
      const numberMatch = remainder.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
      if (numberMatch) {
        const value = Number(numberMatch[0]);
        if (!Number.isFinite(value)) {
          throw new Error("Expression contains a non-finite number.");
        }
        tokens.push({ type: "number", value });
        index += numberMatch[0].length;
        continue;
      }

      const identifierMatch = remainder.match(/^[A-Za-z_][A-Za-z0-9_]*/);
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

  function evaluateExpression(expression, variables) {
    if (typeof expression === "number") {
      return finiteNumber(expression, "Expression result");
    }
    if (typeof expression !== "string" || !expression.trim()) {
      throw new Error("Expression is missing.");
    }

    const tokens = tokenizeExpression(expression);
    let position = 0;

    function current() {
      return tokens[position];
    }

    function consume(type) {
      const token = current();
      if (token.type !== type) {
        throw new Error(`Expected "${type}" but found "${token.value || token.type}".`);
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
            throw new Error(`Unknown input variable: ${identifier}`);
          }
          return finiteNumber(variables[identifier], identifier);
        }

        if (!Object.prototype.hasOwnProperty.call(EXPRESSION_FUNCTIONS, identifier)) {
          throw new Error(`Unsupported expression function: ${identifier}`);
        }
        const functionDefinition = EXPRESSION_FUNCTIONS[identifier];
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
        if (
          args.length < functionDefinition.minimumArgs ||
          args.length > functionDefinition.maximumArgs
        ) {
          const expected = functionDefinition.minimumArgs === functionDefinition.maximumArgs
            ? String(functionDefinition.minimumArgs)
            : `${functionDefinition.minimumArgs} or more`;
          throw new Error(`${identifier}() expects ${expected} argument(s).`);
        }
        return finiteNumber(functionDefinition.apply(...args), `${identifier}() result`);
      }

      if (token.type === "(") {
        consume("(");
        const value = parseAddSubtract();
        consume(")");
        return value;
      }

      throw new Error(`Unexpected expression token: ${token.value || token.type}`);
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
          throw new Error("Expression cannot divide by zero.");
        }
        value = operator === "*" ? value * right : value / right;
        value = finiteNumber(value, "Expression result");
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
        value = finiteNumber(value, "Expression result");
      }
      return value;
    }

    const result = parseAddSubtract();
    if (current().type !== "end") {
      throw new Error(`Unexpected expression token: ${current().value || current().type}`);
    }
    return finiteNumber(result, "Expression result");
  }

  function normalizeUnit(value) {
    const normalized = cleanText(value, "in").toLowerCase();
    return ["mm", "metric", "millimeter", "millimeters"].includes(normalized) ? "mm" : "in";
  }

  function toBaseInches(value, unit) {
    const number = finiteNumber(value, "Dimension");
    return normalizeUnit(unit) === "mm" ? number / INCH_TO_MM : number;
  }

  function fromBaseInches(value, unit) {
    const number = finiteNumber(value, "Dimension");
    return normalizeUnit(unit) === "mm" ? number * INCH_TO_MM : number;
  }

  function roundForInput(value, unit) {
    const precision = normalizeUnit(unit) === "mm" ? 4 : 6;
    return String(Number(finiteNumber(value, "Input value").toFixed(precision)));
  }

  function formatNumber(value, maximumFractionDigits = 3) {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits,
      useGrouping: false,
    }).format(finiteNumber(value, "Display value"));
  }

  function formatDimension(baseInches, unit, includeUnit = true) {
    const normalizedUnit = normalizeUnit(unit);
    const converted = fromBaseInches(baseInches, normalizedUnit);
    const number = formatNumber(converted, normalizedUnit === "mm" ? 1 : 3);
    if (!includeUnit) return number;
    return `${number} ${normalizedUnit}`;
  }

  function uniqueId() {
    if (global.crypto && typeof global.crypto.randomUUID === "function") {
      return global.crypto.randomUUID();
    }
    let randomPart = "";
    if (global.crypto && typeof global.crypto.getRandomValues === "function") {
      const values = new Uint32Array(2);
      global.crypto.getRandomValues(values);
      randomPart = `${values[0].toString(36)}${values[1].toString(36)}`;
    } else {
      randomPart = Math.random().toString(36).slice(2);
    }
    fallbackIdCounter += 1;
    return `${Date.now().toString(36)}-${fallbackIdCounter.toString(36)}-${randomPart}`;
  }

  function normalizePart(part, index) {
    if (!part || typeof part !== "object") {
      throw new Error(`Part ${index + 1} is invalid.`);
    }
    return {
      name: cleanText(part.name, `Part ${index + 1}`),
      quantity: quantityNumber(part.quantity ?? part.qty, `Quantity for part ${index + 1}`),
      thickness: positiveNumber(part.thickness, `Thickness for part ${index + 1}`),
      width: positiveNumber(part.width, `Width for part ${index + 1}`),
      length: positiveNumber(part.length, `Length for part ${index + 1}`),
      materialGroup: cleanText(part.materialGroup ?? part.material, "Unspecified"),
      grain: cleanText(part.grain, "Any"),
    };
  }

  function normalizeInstance(instance, index = 0) {
    if (!instance || typeof instance !== "object") {
      throw new Error(`Project component ${index + 1} is invalid.`);
    }
    const parts = Array.isArray(instance.parts)
      ? instance.parts.map((part, partIndex) => normalizePart(part, partIndex))
      : [];
    if (!parts.length) {
      throw new Error(`Project component ${index + 1} has no parts.`);
    }
    return {
      id: cleanText(instance.id, uniqueId()),
      slug: cleanText(instance.slug),
      name: cleanText(instance.name, `Component ${index + 1}`),
      source: cleanText(instance.source, "/"),
      modelVersion: cleanText(instance.modelVersion, "1"),
      addedAt: cleanText(instance.addedAt, new Date().toISOString()),
      inputs: instance.inputs && typeof instance.inputs === "object" && !Array.isArray(instance.inputs)
        ? Object.fromEntries(
          Object.entries(instance.inputs)
            .filter(([, value]) => Number.isFinite(Number(value)))
            .map(([key, value]) => [key, Number(value)])
        )
        : {},
      parts,
    };
  }

  function storage() {
    if (!global.localStorage) {
      throw new Error("Local project storage is unavailable in this browser.");
    }
    return global.localStorage;
  }

  function readProject() {
    let raw;
    try {
      raw = storage().getItem(STORAGE_KEY);
    } catch (error) {
      throw new Error(`Could not read the saved component project: ${error.message}`);
    }
    if (!raw) return [];

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      try {
        storage().removeItem(STORAGE_KEY);
      } catch {
        // A later save will report storage restrictions if the browser rejects writes.
      }
      return [];
    }

    const candidates = Array.isArray(parsed)
      ? parsed
      : (parsed && Array.isArray(parsed.instances) ? parsed.instances : []);
    const instances = [];
    for (let index = 0; index < candidates.length; index += 1) {
      try {
        instances.push(normalizeInstance(candidates[index], index));
      } catch {
        // Ignore a malformed legacy row without making the rest of the local project unusable.
      }
    }
    return instances;
  }

  function writeProject(instances) {
    const normalized = instances.map((instance, index) => normalizeInstance(instance, index));
    const payload = {
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
      instances: normalized,
    };
    try {
      storage().setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      throw new Error(`Could not save the component project: ${error.message}`);
    }
    dispatchProjectChange(normalized);
    return normalized;
  }

  function dispatchProjectChange(instances) {
    if (typeof global.dispatchEvent !== "function") return;
    if (typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent(CHANGE_EVENT, {
        detail: { count: instances.length },
      }));
      return;
    }
    if (typeof global.Event === "function") {
      global.dispatchEvent(new global.Event(CHANGE_EVENT));
    }
  }

  function appendInstance(instance) {
    const instances = readProject();
    instances.push(normalizeInstance(instance, instances.length));
    writeProject(instances);
    return instances[instances.length - 1];
  }

  function createExternalInstance(input) {
    if (!input || typeof input !== "object") {
      throw new TypeError("addExternal() expects an object.");
    }
    if (!Array.isArray(input.parts) || !input.parts.length) {
      throw new TypeError("addExternal() expects a non-empty parts array.");
    }
    return normalizeInstance({
      id: uniqueId(),
      name: cleanText(input.name, "External component"),
      source: cleanText(input.source, "/"),
      modelVersion: cleanText(input.modelVersion, "external-1"),
      addedAt: new Date().toISOString(),
      inputs: {},
      parts: input.parts,
    });
  }

  const publicApi = global.WoodCutToolComponentProject &&
    typeof global.WoodCutToolComponentProject === "object"
    ? global.WoodCutToolComponentProject
    : {};

  publicApi.addExternal = function addExternal(input) {
    return appendInstance(createExternalInstance(input));
  };
  global.WoodCutToolComponentProject = publicApi;

  const documentRef = global.document;
  if (!documentRef || typeof documentRef.querySelector !== "function") {
    return;
  }

  function setStatus(element, message, state = "ready") {
    if (!element) return;
    element.textContent = message;
    element.setAttribute("role", "status");
    element.setAttribute("aria-live", "polite");
    element.dataset.state = state;
  }

  function createCell(value) {
    const cell = documentRef.createElement("td");
    cell.textContent = value == null ? "" : String(value);
    return cell;
  }

  function createRowHeader(value) {
    const cell = documentRef.createElement("th");
    cell.scope = "row";
    cell.textContent = value == null ? "" : String(value);
    return cell;
  }

  function renderDetailSummary(element, snapshot, unit) {
    if (!element) return;
    const totalPieces = snapshot.parts.reduce((sum, part) => sum + part.quantity, 0);
    const squareInches = snapshot.parts.reduce(
      (sum, part) => sum + part.width * part.length * part.quantity,
      0
    );
    const materialGroups = new Set(snapshot.parts.map((part) => part.materialGroup)).size;
    const metric = normalizeUnit(unit) === "mm";
    const area = metric
      ? `${formatNumber(squareInches * 0.00064516, 3)} m²`
      : `${formatNumber(squareInches / 144, 2)} ft²`;
    const metrics = [
      [snapshot.parts.length, snapshot.parts.length === 1 ? "part line" : "part lines"],
      [totalPieces, totalPieces === 1 ? "piece" : "pieces"],
      [area, "finished rectangle area"],
      [materialGroups, materialGroups === 1 ? "material group" : "material groups"],
    ];
    const fragment = documentRef.createDocumentFragment();
    for (const [value, label] of metrics) {
      const item = documentRef.createElement("div");
      const strong = documentRef.createElement("strong");
      const span = documentRef.createElement("span");
      strong.textContent = String(value);
      span.textContent = label;
      item.append(strong, span);
      fragment.append(item);
    }
    element.replaceChildren(fragment);
    element.setAttribute("role", "status");
    element.setAttribute("aria-live", "polite");
    element.dataset.state = "ready";
  }

  function safeFilename(value, fallback) {
    const filename = cleanText(value, fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return filename || fallback;
  }

  function spreadsheetSafeText(value) {
    const text = value == null ? "" : String(value);
    return /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  }

  function csvCell(value) {
    const text = typeof value === "number"
      ? String(value)
      : spreadsheetSafeText(value);
    return `"${text.replaceAll('"', '""')}"`;
  }

  function rowsToCsv(headers, rows) {
    return [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n") + "\r\n";
  }

  function rowsToTsv(headers, rows) {
    return [headers, ...rows]
      .map((row) => row.map((value) => {
        const text = typeof value === "number" ? String(value) : spreadsheetSafeText(value);
        return text.replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
      }).join("\t"))
      .join("\n");
  }

  function downloadText(filename, text, type) {
    const blob = new Blob([text], { type });
    const url = global.URL.createObjectURL(blob);
    const anchor = documentRef.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.hidden = true;
    documentRef.body.append(anchor);
    anchor.click();
    anchor.remove();
    global.setTimeout(() => global.URL.revokeObjectURL(url), 0);
  }

  function copyText(text) {
    if (global.navigator?.clipboard && typeof global.navigator.clipboard.writeText === "function") {
      return global.navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const textarea = documentRef.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      documentRef.body.append(textarea);
      textarea.select();
      try {
        const copied = documentRef.execCommand && documentRef.execCommand("copy");
        textarea.remove();
        if (copied) resolve();
        else reject(new Error("Clipboard permission was denied."));
      } catch (error) {
        textarea.remove();
        reject(error);
      }
    });
  }

  function inputKey(input) {
    return cleanText(
      input.getAttribute("name") ||
      input.getAttribute("id") ||
      input.dataset.componentInput
    );
  }

  function formControlFor(form, id) {
    return [...form.elements].find((control) => inputKey(control) === id) || null;
  }

  function isDimensionInput(input) {
    return input.hasAttribute("data-component-dimension");
  }

  function convertDimensionInput(input, fromUnit, toUnit) {
    if (normalizeUnit(fromUnit) === normalizeUnit(toUnit)) return;
    for (const property of ["value", "min", "max", "step"]) {
      const raw = property === "value" ? input.value : input.getAttribute(property);
      if (!raw || (property === "step" && raw === "any")) continue;
      const number = Number(raw);
      if (!Number.isFinite(number)) continue;
      const base = toBaseInches(number, fromUnit);
      const converted = fromBaseInches(base, toUnit);
      const value = roundForInput(converted, toUnit);
      if (property === "value") input.value = value;
      else input.setAttribute(property, value);
    }
  }

  function initializeDetailRuntime() {
    const form = documentRef.querySelector("[data-component-form]");
    const configElement = documentRef.querySelector(
      'script[type="application/json"][data-component-config]'
    );
    const resultsBody = documentRef.querySelector("[data-component-results]");
    if (!form || !configElement || !resultsBody) return false;

    const summary = documentRef.querySelector("[data-component-summary]");
    const unitSelect = documentRef.querySelector("[data-component-unit]");
    const buttons = {
      add: documentRef.querySelector("[data-component-add]"),
      csv: documentRef.querySelector("[data-component-csv]"),
      json: documentRef.querySelector("[data-component-json]"),
      copy: documentRef.querySelector("[data-component-copy]"),
    };

    let config;
    try {
      config = JSON.parse(configElement.textContent || "");
      if (!config || typeof config !== "object") throw new Error("Config must be an object.");
      if (!Array.isArray(config.inputs)) throw new Error("Config inputs must be an array.");
      if (!Array.isArray(config.parts) || !config.parts.length) {
        throw new Error("Config parts must be a non-empty array.");
      }
    } catch (error) {
      setStatus(summary, `This component model could not be loaded: ${error.message}`, "error");
      return true;
    }

    let currentUnit = normalizeUnit(unitSelect?.value);
    let currentSnapshot = null;
    const dimensionInputs = [...form.querySelectorAll("[data-component-dimension]")];

    for (const inputDefinition of config.inputs) {
      const id = cleanText(inputDefinition?.id);
      if (!id) continue;
      const input = formControlFor(form, id);
      if (!input) continue;
      if (!input.value && Number.isFinite(Number(inputDefinition.default))) {
        const defaultValue = isDimensionInput(input)
          ? fromBaseInches(Number(inputDefinition.default), currentUnit)
          : Number(inputDefinition.default);
        input.value = roundForInput(defaultValue, currentUnit);
      }
    }

    function calculateSnapshot() {
      const variables = Object.create(null);
      const baseInputs = {};

      for (const inputDefinition of config.inputs) {
        const id = cleanText(inputDefinition?.id);
        if (!id) throw new Error("A component input is missing its id.");
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(id)) {
          throw new Error(`Input id cannot be used in an expression: ${id}`);
        }
        const input = formControlFor(form, id);
        if (!input) throw new Error(`Input control is missing: ${id}`);
        if (!String(input.value).trim()) {
          throw new Error(`${inputDefinition.label || id} is required.`);
        }
        const displayedValue = finiteNumber(input.value, inputDefinition.label || id);
        const value = isDimensionInput(input)
          ? toBaseInches(displayedValue, currentUnit)
          : displayedValue;
        if (Number.isFinite(Number(inputDefinition.min)) && value < Number(inputDefinition.min)) {
          throw new Error(`${inputDefinition.label || id} is below its allowed minimum.`);
        }
        if (Number.isFinite(Number(inputDefinition.max)) && value > Number(inputDefinition.max)) {
          throw new Error(`${inputDefinition.label || id} is above its allowed maximum.`);
        }
        variables[id] = value;
        baseInputs[id] = value;
      }

      const parts = config.parts.map((part, index) => {
        if (!part || typeof part !== "object") {
          throw new Error(`Part ${index + 1} is invalid.`);
        }
        return normalizePart({
          name: part.name,
          quantity: evaluateExpression(part.quantity, variables),
          thickness: evaluateExpression(part.thickness, variables),
          width: evaluateExpression(part.width, variables),
          length: evaluateExpression(part.length, variables),
          materialGroup: part.materialGroup,
          grain: part.grain,
        }, index);
      }).filter((part) => part.quantity > 0);
      if (!parts.length) {
        throw new Error("The current inputs produce no parts.");
      }

      return {
        slug: cleanText(config.slug),
        name: cleanText(config.name, "Cut list component"),
        source: cleanText(global.location?.pathname, "/"),
        modelVersion: cleanText(config.modelVersion, "1"),
        inputs: baseInputs,
        parts,
      };
    }

    function renderSnapshot(snapshot) {
      const fragment = documentRef.createDocumentFragment();
      for (const part of snapshot.parts) {
        const row = documentRef.createElement("tr");
        row.append(createRowHeader(part.name));
        [
          String(part.quantity),
          formatDimension(part.thickness, currentUnit),
          formatDimension(part.width, currentUnit),
          formatDimension(part.length, currentUnit),
          part.materialGroup,
          part.grain,
        ].forEach((value) => row.append(createCell(value)));
        fragment.append(row);
      }
      resultsBody.replaceChildren(fragment);
      renderDetailSummary(summary, snapshot, currentUnit);
    }

    function recalculate() {
      try {
        currentSnapshot = calculateSnapshot();
        renderSnapshot(currentSnapshot);
        return currentSnapshot;
      } catch (error) {
        currentSnapshot = null;
        resultsBody.replaceChildren();
        setStatus(summary, `Check the component inputs: ${error.message}`, "error");
        return null;
      }
    }

    function snapshotForExport() {
      return currentSnapshot || recalculate();
    }

    function detailRows(snapshot) {
      return snapshot.parts.map((part) => [
        part.name,
        part.quantity,
        part.thickness,
        part.width,
        part.length,
        part.materialGroup,
        part.grain,
      ]);
    }

    form.addEventListener("input", () => recalculate());
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      recalculate();
    });

    if (unitSelect) {
      unitSelect.addEventListener("change", () => {
        const nextUnit = normalizeUnit(unitSelect.value);
        dimensionInputs.forEach((input) => convertDimensionInput(input, currentUnit, nextUnit));
        currentUnit = nextUnit;
        recalculate();
      });
    }

    buttons.add?.addEventListener("click", () => {
      const snapshot = snapshotForExport();
      if (!snapshot) return;
      try {
        appendInstance({
          ...snapshot,
          id: uniqueId(),
          addedAt: new Date().toISOString(),
        });
        setStatus(summary, `${snapshot.name} was added to the local component project.`, "success");
      } catch (error) {
        setStatus(summary, error.message, "error");
      }
    });

    buttons.csv?.addEventListener("click", () => {
      const snapshot = snapshotForExport();
      if (!snapshot) return;
      const headers = ["Part", "Qty", "Thickness (in)", "Width (in)", "Length (in)", "Material", "Grain"];
      downloadText(
        `${safeFilename(snapshot.slug || snapshot.name, "component")}-cut-list.csv`,
        rowsToCsv(headers, detailRows(snapshot)),
        "text/csv;charset=utf-8"
      );
      setStatus(summary, "CSV downloaded. Dimension values are stored in base inches.", "success");
    });

    buttons.json?.addEventListener("click", () => {
      const snapshot = snapshotForExport();
      if (!snapshot) return;
      downloadText(
        `${safeFilename(snapshot.slug || snapshot.name, "component")}-cut-list.json`,
        `${JSON.stringify({ version: STORAGE_VERSION, unit: "in", ...snapshot }, null, 2)}\n`,
        "application/json;charset=utf-8"
      );
      setStatus(summary, "JSON downloaded with dimension values in base inches.", "success");
    });

    buttons.copy?.addEventListener("click", () => {
      const snapshot = snapshotForExport();
      if (!snapshot) return;
      const headers = ["Part", "Qty", "Thickness (in)", "Width (in)", "Length (in)", "Material", "Grain"];
      copyText(rowsToTsv(headers, detailRows(snapshot)))
        .then(() => setStatus(summary, "Cut list copied. Dimension values are in base inches.", "success"))
        .catch((error) => setStatus(summary, `Could not copy the cut list: ${error.message}`, "error"));
    });

    recalculate();
    return true;
  }

  function initializeProjectRuntime() {
    const projectBody = documentRef.querySelector("[data-component-project]");
    if (!projectBody) return false;

    const emptyState = documentRef.querySelector("[data-component-project-empty]");
    const countState = documentRef.querySelector("[data-component-project-count]");
    const buttons = {
      csv: documentRef.querySelector("[data-project-csv]"),
      json: documentRef.querySelector("[data-project-json]"),
      copy: documentRef.querySelector("[data-project-copy]"),
      clear: documentRef.querySelector("[data-project-clear]"),
    };
    let currentInstances = [];

    function projectRows(instances) {
      return instances.flatMap((instance) => instance.parts.map((part) => ({
        instance,
        part,
      })));
    }

    function projectRowValues(entry) {
      return {
        component: entry.instance.name,
        name: entry.instance.name,
        part: entry.part.name,
        qty: String(entry.part.quantity),
        quantity: String(entry.part.quantity),
        thickness: formatDimension(entry.part.thickness, "in"),
        width: formatDimension(entry.part.width, "in"),
        length: formatDimension(entry.part.length, "in"),
        material: entry.part.materialGroup,
        "material group": entry.part.materialGroup,
        grain: entry.part.grain,
        source: entry.instance.source,
        "instance id": entry.instance.id,
        id: entry.instance.id,
      };
    }

    function tableColumnKeys() {
      const headers = projectBody.closest("table")?.querySelectorAll("thead th") || [];
      const keys = [...headers].map((header) => cleanText(header.textContent).toLowerCase());
      return keys.length
        ? keys
        : ["component", "part", "qty", "thickness", "width", "length", "material", "grain", "source"];
    }

    function setProjectButtonsDisabled(disabled) {
      Object.values(buttons).forEach((button) => {
        if (button) button.disabled = disabled;
      });
    }

    function announceProject(message, state = "ready") {
      if (!countState) return;
      countState.textContent = String(currentInstances.length);
      countState.setAttribute("role", "status");
      countState.setAttribute("aria-live", "polite");
      countState.setAttribute("aria-label", message);
      countState.dataset.state = state;
    }

    function renderProject(message = "") {
      try {
        currentInstances = readProject();
      } catch (error) {
        currentInstances = [];
        projectBody.replaceChildren();
        if (emptyState) setStatus(emptyState, error.message, "error");
        announceProject(error.message, "error");
        setProjectButtonsDisabled(true);
        return;
      }

      const rows = projectRows(currentInstances);
      const columnKeys = tableColumnKeys();
      const fragment = documentRef.createDocumentFragment();
      for (const entry of rows) {
        const values = projectRowValues(entry);
        const row = documentRef.createElement("tr");
        columnKeys.forEach((key) => row.append(createCell(values[key] ?? "")));
        fragment.append(row);
      }
      projectBody.replaceChildren(fragment);

      const totalPieces = rows.reduce((sum, entry) => sum + entry.part.quantity, 0);
      if (emptyState) {
        emptyState.hidden = currentInstances.length > 0;
        setStatus(
          emptyState,
          currentInstances.length
            ? ""
            : (message || "No components have been added to this local project yet.")
        );
      }
      announceProject(
        message || (
          `${currentInstances.length} component instance${currentInstances.length === 1 ? "" : "s"} · ` +
          `${rows.length} part row${rows.length === 1 ? "" : "s"} · ` +
          `${totalPieces} total piece${totalPieces === 1 ? "" : "s"}`
        ),
        message ? "success" : "ready"
      );
      setProjectButtonsDisabled(currentInstances.length === 0);
    }

    function projectExportRows(instances) {
      return projectRows(instances).map(({ instance, part }) => [
        instance.name,
        part.name,
        part.quantity,
        part.thickness,
        part.width,
        part.length,
        part.materialGroup,
        part.grain,
        instance.source,
        instance.id,
      ]);
    }

    const projectHeaders = [
      "Component",
      "Part",
      "Qty",
      "Thickness (in)",
      "Width (in)",
      "Length (in)",
      "Material",
      "Grain",
      "Source",
      "Instance ID",
    ];

    buttons.csv?.addEventListener("click", () => {
      if (!currentInstances.length) return;
      downloadText(
        "woodcuttool-component-project.csv",
        rowsToCsv(projectHeaders, projectExportRows(currentInstances)),
        "text/csv;charset=utf-8"
      );
      announceProject("Project CSV downloaded. Dimension values are in base inches.", "success");
    });

    buttons.json?.addEventListener("click", () => {
      if (!currentInstances.length) return;
      downloadText(
        "woodcuttool-component-project.json",
        `${JSON.stringify({
          version: STORAGE_VERSION,
          unit: "in",
          exportedAt: new Date().toISOString(),
          instances: currentInstances,
        }, null, 2)}\n`,
        "application/json;charset=utf-8"
      );
      announceProject("Project JSON downloaded with dimension values in base inches.", "success");
    });

    buttons.copy?.addEventListener("click", () => {
      if (!currentInstances.length) return;
      copyText(rowsToTsv(projectHeaders, projectExportRows(currentInstances)))
        .then(() => announceProject("Project cut list copied. Dimensions are in base inches.", "success"))
        .catch((error) => announceProject(`Could not copy the project: ${error.message}`, "error"));
    });

    buttons.clear?.addEventListener("click", () => {
      try {
        writeProject([]);
        renderProject("The local component project was cleared.");
      } catch (error) {
        if (emptyState) setStatus(emptyState, error.message, "error");
        announceProject(error.message, "error");
      }
    });

    global.addEventListener?.(CHANGE_EVENT, () => renderProject());
    global.addEventListener?.("storage", (event) => {
      if (event.key === STORAGE_KEY) renderProject();
    });
    renderProject();
    return true;
  }

  initializeDetailRuntime();
  initializeProjectRuntime();
})(globalThis);

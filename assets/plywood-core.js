// Generated from assets/app.js by scripts/build-plywood-core.mjs.
(function () {
const APP_STORE_URL = "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871";
const format = (value, digits = 2) => {
  if (!Number.isFinite(value)) return "0";
  const fixed = value.toFixed(digits);
  return fixed.replace(/\.?0+$/, "");
};
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
const appCta = ({
  mode = "adjacent",
  source = "calculator-result",
  title = "",
  description = "",
} = {}) => {
  if (mode !== "plywood") {
    return `
      <div class="cta-panel adjacent-app-cta">
        <p class="eyebrow">Working with sheet goods too?</p>
        <h3>${mode === "board" ? "This result is a linear board estimate" : "Use the right workflow for the material"}</h3>
        <p>${mode === "board"
          ? "CutList is built for plywood, MDF, melamine, and other sheet stock. Open the app details when the project moves from linear boards to saved sheet layouts."
          : "CutList is the saved iPhone and iPad workspace for plywood layouts, cutting sequences, project history, and optional Pro export tools."}</p>
        <div class="cta-row">
          <a class="button secondary" href="/apps/cutlist/">See the CutList sheet-goods workflow</a>
        </div>
      </div>
    `;
  }

  return `
    <section class="conversion-cta conversion-cta-result" id="download-cutlist" data-conversion-cta data-conversion-source="${escapeHtml(source)}">
      <div class="conversion-cta-copy">
        <p class="eyebrow">Keep the checked result</p>
        <h3>${escapeHtml(title || "Do not let this reviewed plywood plan disappear with the browser tab")}</h3>
        <p>${escapeHtml(description || "Create the formal project in CutList, then keep its layout, waste, and step-by-step cutting sequence available offline in the shop.")}</p>
        <div class="cta-row">
          <a class="button" href="${APP_STORE_URL}" data-app-store-link data-platform-label data-conversion-placement="calculator-result" rel="nofollow noopener">Get CutList for saved projects</a>
          <a class="button secondary" href="/apps/cutlist/">See how the app workflow differs</a>
        </div>
        <ul class="conversion-proof-list" aria-label="CutList app features">
          <li>Free basic layouts</li>
          <li>No login</li>
          <li>No cloud upload</li>
          <li>Works offline</li>
        </ul>
        <p class="conversion-honesty-note">This browser draft is not transferred automatically. Re-enter the reviewed parts, or use on-device AI Scan in CutList Pro for a prepared list.</p>
      </div>
      <a class="conversion-qr" href="${APP_STORE_URL}" data-app-store-link data-conversion-placement="calculator-result-qr" aria-label="Scan or open the CutList App Store page">
        <img src="/assets/images/apps/cutlist/cutlist-app-store-qr.svg" width="132" height="132" loading="lazy" alt="QR code to get CutList on the App Store">
        <span><strong>On a computer?</strong> Scan with your iPhone or iPad.</span>
      </a>
    </section>
  `;
};
function summarizeParts(parts) {
  const expanded = [];
  parts.forEach((part, index) => {
    const quantity = Math.max(0, Math.floor(part.qty || 0));
    for (let i = 0; i < quantity; i += 1) {
      expanded.push({
        ...part,
        id: `${part.label || `Piece ${index + 1}`} ${i + 1}`,
        label: part.label || `Piece ${index + 1}`,
        length: Number(part.length),
        width: Number(part.width || 0),
        qty: 1
      });
    }
  });
  return expanded.filter((part) => part.length > 0);
}
function packSheets(parts, sheetLength, sheetWidth, kerf, allowRotate) {
  const pieces = summarizeParts(parts)
    .filter((part) => part.width > 0)
    .sort((a, b) => {
      const areaDiff = (b.length * b.width) - (a.length * a.width);
      if (areaDiff) return areaDiff;
      const longDiff = Math.max(b.length, b.width) - Math.max(a.length, a.width);
      if (longDiff) return longDiff;
      return Math.min(b.length, b.width) - Math.min(a.length, a.width);
    });
  const sheets = [];

  const newSheet = () => ({
    freeRects: [{ x: 0, y: 0, w: sheetWidth, h: sheetLength }],
    placements: [],
    usedArea: 0
  });
  const orientationsFor = (piece) => {
    const orientations = allowRotate && piece.allowRotate !== false
      ? [
          { w: piece.width, h: piece.length, rotated: false },
          { w: piece.length, h: piece.width, rotated: true }
        ]
      : [{ w: piece.width, h: piece.length, rotated: false }];
    return orientations.filter((o, index, list) =>
      index === list.findIndex((candidate) => candidate.w === o.w && candidate.h === o.h)
    );
  };
  const splitFreeRects = (freeRects, block) => {
    const next = [];
    freeRects.forEach((rect) => {
      const separated =
        block.x >= rect.x + rect.w ||
        block.x + block.w <= rect.x ||
        block.y >= rect.y + rect.h ||
        block.y + block.h <= rect.y;
      if (separated) {
        next.push(rect);
        return;
      }
      const rectRight = rect.x + rect.w;
      const rectBottom = rect.y + rect.h;
      const blockRight = block.x + block.w;
      const blockBottom = block.y + block.h;

      if (block.x > rect.x) next.push({ x: rect.x, y: rect.y, w: block.x - rect.x, h: rect.h });
      if (blockRight < rectRight) next.push({ x: blockRight, y: rect.y, w: rectRight - blockRight, h: rect.h });
      if (block.y > rect.y) next.push({ x: rect.x, y: rect.y, w: rect.w, h: block.y - rect.y });
      if (blockBottom < rectBottom) next.push({ x: rect.x, y: blockBottom, w: rect.w, h: rectBottom - blockBottom });
    });

    return next
      .filter((rect) => rect.w > 0.01 && rect.h > 0.01)
      .filter((rect, index, list) => !list.some((other, otherIndex) =>
        otherIndex !== index &&
        rect.x >= other.x &&
        rect.y >= other.y &&
        rect.x + rect.w <= other.x + other.w &&
        rect.y + rect.h <= other.y + other.h
      ));
  };
  const findPlacement = (sheet, piece) => {
    let best = null;
    sheet.freeRects.forEach((rect, rectIndex) => {
      orientationsFor(piece).forEach((o) => {
        if (o.w > rect.w || o.h > rect.h) return;
        const areaFit = rect.w * rect.h - o.w * o.h;
        const shortSideFit = Math.min(Math.abs(rect.w - o.w), Math.abs(rect.h - o.h));
        const longSideFit = Math.max(Math.abs(rect.w - o.w), Math.abs(rect.h - o.h));
        const score = [rect.y, rect.x, o.rotated ? 1 : 0, shortSideFit, areaFit, longSideFit];
        if (!best || score.some((value, index) => value < best.score[index] && score.slice(0, index).every((prior, priorIndex) => prior === best.score[priorIndex]))) {
          best = { rect, rectIndex, orientation: o, score };
        }
      });
    });
    return best;
  };
  const placeOnSheet = (sheet, piece) => {
    const best = findPlacement(sheet, piece);
    if (!best) return false;
    const { rect, orientation } = best;
    const spacingW = orientation.w >= rect.w - 0.01 ? 0 : kerf;
    const spacingH = orientation.h >= rect.h - 0.01 ? 0 : kerf;
    const placement = {
      ...piece,
      x: rect.x,
      y: rect.y,
      w: orientation.w,
      h: orientation.h,
      rotated: orientation.rotated
    };
    const block = {
      x: rect.x,
      y: rect.y,
      w: Math.min(rect.w, orientation.w + spacingW),
      h: Math.min(rect.h, orientation.h + spacingH)
    };
    sheet.placements.push(placement);
    sheet.usedArea += orientation.w * orientation.h;
    sheet.freeRects = splitFreeRects(sheet.freeRects, block);
    return true;
  };

  const rejected = [];
  pieces.forEach((piece) => {
    const fits = allowRotate && piece.allowRotate !== false
      ? (piece.width <= sheetWidth && piece.length <= sheetLength) || (piece.length <= sheetWidth && piece.width <= sheetLength)
      : piece.width <= sheetWidth && piece.length <= sheetLength;
    if (!fits) {
      rejected.push(piece);
      return;
    }
    let placed = false;
    for (const sheet of sheets) {
      if (placeOnSheet(sheet, piece)) {
        placed = true;
        break;
      }
    }
    if (!placed) {
      const sheet = newSheet();
      placeOnSheet(sheet, piece);
      sheets.push(sheet);
    }
  });

  sheets.forEach((sheet) => {
    sheet.placements.sort((a, b) => (a.y - b.y) || (a.x - b.x) || (b.w * b.h - a.w * a.h));
  });
  const sheetArea = sheetLength * sheetWidth;
  const usedArea = sheets.reduce((sum, sheet) => sum + sheet.usedArea, 0);
  const wastePercent = sheets.length ? ((sheets.length * sheetArea - usedArea) / (sheets.length * sheetArea)) * 100 : 0;
  return { sheets, rejected, usedArea, wastePercent };
}


function drawSheet(canvas, sheets, sheetLength, sheetWidth) {
  if (!canvas || !sheets.length) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = Math.max(360, Math.min(560, width * 0.92));
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const sheet = sheets[0];
  const pad = 18;
  const scale = Math.min((width - pad * 2) / sheetWidth, (height - pad * 2) / sheetLength);
  const originX = (width - sheetWidth * scale) / 2;
  const originY = (height - sheetLength * scale) / 2;

  ctx.shadowColor = "rgba(25, 42, 70, 0.16)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#fff2c8";
  ctx.strokeStyle = "#8b5a20";
  ctx.lineWidth = 3;
  ctx.fillRect(originX, originY, sheetWidth * scale, sheetLength * scale);
  ctx.shadowColor = "transparent";
  ctx.strokeRect(originX, originY, sheetWidth * scale, sheetLength * scale);

  const colors = ["#2f80ed", "#f5a623", "#ff6b3d", "#25c46a", "#9b51e0", "#21b8c7", "#e94f86", "#7fdb6a"];
  sheet.placements.forEach((part, index) => {
    const x = originX + part.x * scale;
    const y = originY + part.y * scale;
    const w = part.w * scale;
    const h = part.h * scale;
    ctx.fillStyle = colors[index % colors.length];
    ctx.globalAlpha = 0.98;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    if (w > 36 && h > 26) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
      ctx.beginPath();
      ctx.arc(x + 17, y + 17, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors[index % colors.length];
      ctx.font = "700 13px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(index + 1), x + 17, y + 17);
      if (w > 70 && h > 48) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 13px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = part.label.length > 14 ? `${part.label.slice(0, 13)}...` : part.label;
        ctx.fillText(label, x + w / 2, y + h / 2 + 8);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
  });
}
window.WCTPlywoodCore = Object.freeze({ packSheets, drawSheet, appCta });
})();

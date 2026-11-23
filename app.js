'use strict';

/* =========================================================
   BICTORIA BRAND STUDIO — app.js
   100% vanilla client-side canvas generator.
   ========================================================= */

const COLORS = {
  marfil: '#FCFCE4',
  cremaCalido: '#F8EDC8',
  amarilloPalido: '#F4F2A8',
  arena: '#BA9470',
  naranja: '#FF812C',
  cuero: '#783E1A',
  espresso: '#321603',
  oliva: '#5E7153',
};

// Fondos oscuros del manual de marca: fuerzan textos/líneas claras y el logo "cream".
const DARK_BG = new Set([COLORS.espresso, COLORS.cuero, COLORS.oliva]);
function inkFor(bgHex) {
  return DARK_BG.has(bgHex) ? COLORS.marfil : COLORS.espresso;
}
function translucentInk(inkHex, alpha) {
  return inkHex === COLORS.marfil ? `rgba(252,252,228,${alpha})` : `rgba(50,22,3,${alpha})`;
}

const SWATCHES = [
  { key: 'marfil', hex: COLORS.marfil, label: 'Marfil Base' },
  { key: 'cremaCalido', hex: COLORS.cremaCalido, label: 'Crema Cálido' },
  { key: 'amarilloPalido', hex: COLORS.amarilloPalido, label: 'Amarillo Pálido' },
  { key: 'arena', hex: COLORS.arena, label: 'Arena / Camel' },
  { key: 'naranja', hex: COLORS.naranja, label: 'Naranja Bictoria' },
  { key: 'cuero', hex: COLORS.cuero, label: 'Café Cuero' },
  { key: 'espresso', hex: COLORS.espresso, label: 'Café Espresso' },
  { key: 'oliva', hex: COLORS.oliva, label: 'Verde Oliva' },
];

const FORMATS = {
  square: { w: 1080, h: 1080, label: 'Instagram Post Cuadrado · 1080×1080' },
  portrait: { w: 1080, h: 1350, label: 'Instagram Post Vertical · 1080×1350' },
  story: { w: 1080, h: 1920, label: 'Instagram Story / Reel · 1080×1920' },
  banner: { w: 1920, h: 800, label: 'Banner Web Horizontal · 1920×800' },
};

const PHRASES = [
  'La vida en Bici rueda mejor',
  'Arte en Bicicleta — Desde 2005',
  'Slow-Handcrafted Leather Pieces',
  'Viaja, muévete y descubre. Valdrá la pena.',
];

// Monochrome brand-ink SVGs share this baked-in fill color; swapping it lets
// us derive "dark" / "cream" ink variants from a single source file.
const MONO_SOURCE_HEX = '#3e2e17';

const ASSETS = {
  logoDark: 'logo-bictoria-dark.svg',
  logoCream: 'logo-bictoria-cream.svg',
  tab: { file: 'tab-bici.svg', mono: true },
};

const BADGES = [
  { id: 'estampilla', label: 'Estampilla', file: 'badge-estampilla.svg', mono: false },
  { id: 'placa', label: 'Placa', file: 'badge-placa.svg', mono: false },
  { id: 'cali', label: 'Sello Cali', file: 'badge-cali.svg', mono: false },
  { id: 'hechoamano', label: 'Hecho a Mano', file: 'badge-hecho-a-mano.svg', mono: false },
  { id: 'bictr2005', label: 'Bictr 2005', file: 'badge-bictr-2005.svg', mono: true },
  { id: 'sellob', label: 'Sello B', file: 'badge-sello-b.svg', mono: true },
  { id: 'sellocircular', label: 'Sello Circular', file: 'badge-sello-circular.svg', mono: true },
  { id: 'sellotexto', label: 'Sello Bictr', file: 'badge-sello-texto.svg', mono: true },
  { id: 'etiqueta', label: 'Etiqueta', file: 'badge-etiqueta.svg', mono: true },
];

const LABELS_BY_TEMPLATE = {
  A: {
    title: 'Título del producto',
    subtitle: 'Colección / Subtítulo',
    price: 'Precio',
    secondary: 'Texto secundario (bloque derecho)',
  },
  B: {
    title: 'Frase principal',
    subtitle: null,
    price: null,
    secondary: 'URL / pie de página',
  },
  C: {
    title: 'Título del producto',
    subtitle: 'Colección / Subtítulo',
    price: 'Precio',
    secondary: 'URL / pie de página',
  },
};

const TEMPLATE_HINTS = {
  A: 'Ficha de producto con foto, pestaña de marca y barra de datos inferior.',
  B: 'Pieza editorial: fondo de color de marca, logotipo y frase.',
  C: 'Banner de dos columnas: texto de marca + fotografía.',
};

const DEFAULT_SECONDARY = { A: 'Envíos nacionales Colombia', B: 'www.bictoria.com', C: 'www.bictoria.com' };

/* ---------------------------------------------------------
   State
   --------------------------------------------------------- */

const state = {
  format: 'square',
  template: 'A',
  photo: { img: null, zoom: 100, offsetX: 0, offsetY: 0, showInB: false },
  texts: {
    title: 'CAMISETA',
    subtitle: 'COLECCIÓN RUTAS',
    price: '$79.700 COP',
    secondary: DEFAULT_SECONDARY.A,
  },
  themeColor: COLORS.marfil,
  logoColor: 'dark', // 'dark' | 'cream' — se recalcula al cambiar el tema, pero el usuario puede forzarlo.
  ribbonColor: COLORS.amarilloPalido,
  badges: [], // { uid, defId, x, y, scale, rotation }
  selectedBadgeUid: null,
};

let badgeUidCounter = 1;
function nextBadgeUid() {
  return badgeUidCounter++;
}

/* ---------------------------------------------------------
   Asset loading / caching
   --------------------------------------------------------- */

const imageCache = new Map(); // key -> HTMLImageElement
const svgTextCache = new Map(); // path -> raw svg text

function loadImageFromURL(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function loadPlainSVG(path) {
  if (imageCache.has(path)) return imageCache.get(path);
  try {
    const img = await loadImageFromURL(`./assets/${path}`);
    imageCache.set(path, img);
    return img;
  } catch (err) {
    console.warn(`No se pudo cargar el asset "${path}":`, err);
    imageCache.set(path, null);
    return null;
  }
}

async function loadMonoSVG(path, hexColor) {
  const key = `${path}|${hexColor}`;
  if (imageCache.has(key)) return imageCache.get(key);
  try {
    let text = svgTextCache.get(path);
    if (text === undefined) {
      const res = await fetch(`./assets/${path}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      text = await res.text();
      svgTextCache.set(path, text);
    }
    const recolored = text.replace(new RegExp(MONO_SOURCE_HEX, 'gi'), hexColor);
    const blob = new Blob([recolored], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = await loadImageFromURL(url);
    imageCache.set(key, img);
    return img;
  } catch (err) {
    console.warn(`No se pudo cargar/recolorear el asset "${path}":`, err);
    imageCache.set(key, null);
    return null;
  }
}

function getLogo(mode) {
  const file = mode === 'cream' ? ASSETS.logoCream : ASSETS.logoDark;
  return imageCache.get(file) || null;
}
function getTab() {
  return imageCache.get(`${ASSETS.tab.file}|${COLORS.espresso}`) || null;
}
function getBadgeImage(badgeDef) {
  if (!badgeDef) return null;
  if (badgeDef.id === 'tab') return getTab();
  if (badgeDef.mono) return imageCache.get(`${badgeDef.file}|${COLORS.espresso}`) || null;
  return imageCache.get(badgeDef.file) || null;
}

async function preloadAllAssets() {
  const jobs = [
    loadPlainSVG(ASSETS.logoDark),
    loadPlainSVG(ASSETS.logoCream),
    loadMonoSVG(ASSETS.tab.file, COLORS.espresso),
  ];
  for (const b of BADGES) {
    jobs.push(b.mono ? loadMonoSVG(b.file, COLORS.espresso) : loadPlainSVG(b.file));
  }
  await Promise.all(jobs);
}

/* ---------------------------------------------------------
   Fonts
   --------------------------------------------------------- */

async function waitForFonts() {
  const specs = [
    '400 40px "Ancizar Serif"',
    '600 40px "Ancizar Serif"',
    '700 40px "Ancizar Serif"',
    'italic 400 40px "Ancizar Serif"',
    '400 40px "DM Mono"',
    '500 40px "DM Mono"',
  ];
  try {
    await Promise.all(specs.map((s) => document.fonts.load(s)));
    await document.fonts.ready;
  } catch (err) {
    console.warn('Carga de fuentes incompleta, se continúa igualmente.', err);
  }
}

/* ---------------------------------------------------------
   Canvas drawing helpers
   --------------------------------------------------------- */

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawPhotoCover(ctx, img, dx, dy, dw, dh, zoomPercent, offsetXPercent, offsetYPercent) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();

  if (img) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.max(dw / iw, dh / ih) * (zoomPercent / 100);
    const drawW = iw * scale;
    const drawH = ih * scale;
    const baseX = dx + (dw - drawW) / 2;
    const baseY = dy + (dh - drawH) / 2;
    const maxPanX = Math.max(0, (drawW - dw) / 2);
    const maxPanY = Math.max(0, (drawH - dh) / 2);
    const panX = (offsetXPercent / 100) * maxPanX;
    const panY = (offsetYPercent / 100) * maxPanY;
    ctx.drawImage(img, baseX + panX, baseY + panY, drawW, drawH);
  } else {
    // Placeholder while no photo is loaded yet.
    ctx.fillStyle = COLORS.amarilloPalido;
    ctx.fillRect(dx, dy, dw, dh);
    ctx.fillStyle = 'rgba(50,22,3,0.45)';
    ctx.font = `500 ${Math.round(dw * 0.028)}px 'DM Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SUBE UNA FOTOGRAFÍA', dx + dw / 2, dy + dh / 2);
  }
  ctx.restore();
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawImageContain(ctx, img, cx, cy, maxW, maxH, align = 'center') {
  if (!img) return { w: 0, h: 0 };
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.min(maxW / iw, maxH / ih);
  const w = iw * scale;
  const h = ih * scale;
  let x = cx - w / 2;
  if (align === 'left') x = cx;
  if (align === 'right') x = cx - w;
  const y = cy - h / 2;
  ctx.drawImage(img, x, y, w, h);
  return { w, h, x, y };
}

// Dibuja el logotipo con fondo 100% transparente. Si el asset no cargó, cae a
// un lockup tipográfico exacto en la tinta correspondiente, también sin fondo.
function drawLogo(ctx, mode, cx, cy, maxW, maxH, align = 'center') {
  const img = getLogo(mode);
  if (img) return drawImageContain(ctx, img, cx, cy, maxW, maxH, align);

  const colorHex = mode === 'cream' ? COLORS.marfil : COLORS.espresso;
  ctx.save();
  ctx.fillStyle = colorHex;
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.round(maxH * 0.8)}px 'Ancizar Serif', Georgia, serif`;
  let textAlign = 'center';
  if (align === 'left') textAlign = 'left';
  if (align === 'right') textAlign = 'right';
  ctx.textAlign = textAlign;
  ctx.fillText('Bictoria', cx, cy);
  ctx.restore();
  return { w: 0, h: 0 };
}

function drawStickerBadge(ctx, badgeDef, cx, cy, maxSize, rotationDeg) {
  const img = getBadgeImage(badgeDef);
  if (!img) return;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = maxSize / Math.max(iw, ih);
  const w = iw * scale;
  const h = ih * scale;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);

  ctx.save();
  ctx.shadowColor = 'rgba(50,22,3,0.35)';
  ctx.shadowBlur = maxSize * 0.06;
  ctx.shadowOffsetY = maxSize * 0.02;

  if (badgeDef.mono) {
    // Monochrome stamps are pure ink with transparent cut-outs: back them
    // with a cream "paper" shape so they read as stickers on any surface.
    const padW = w * 1.14;
    const padH = h * 1.14;
    ctx.fillStyle = COLORS.marfil;
    roundRectPath(ctx, -padW / 2, -padH / 2, padW, padH, Math.min(padW, padH) * 0.5);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    // Full-color badges already include their own backing/shadow art.
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }
  ctx.restore();
  ctx.restore();
}

/* ---------------------------------------------------------
   Interactive badge instances (add / drag / select / remove)
   --------------------------------------------------------- */

function badgeRenderSize(W, H, scalePercent) {
  return Math.min(W, H) * 0.16 * (scalePercent / 100);
}

// Geometría compartida por el dibujo de la selección y el hit-testing del mouse.
function getBadgeGeometry(inst, W, H) {
  const size = badgeRenderSize(W, H, inst.scale);
  const half = (size * 1.2) / 2;
  const rad = (inst.rotation * Math.PI) / 180;
  const corners = [
    [-half, -half], [half, -half], [half, half], [-half, half],
  ].map(([x, y]) => ({
    x: inst.x + x * Math.cos(rad) - y * Math.sin(rad),
    y: inst.y + x * Math.sin(rad) + y * Math.cos(rad),
  }));
  const xs = corners.map((c) => c.x);
  const ys = corners.map((c) => c.y);
  const box = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  const btnR = Math.max(10, Math.min(W, H) * 0.018);
  return { size, half, rad, box, deleteBtn: { x: box.maxX, y: box.minY, r: btnR } };
}

function isPointInBadge(inst, W, H, px, py) {
  const { half, rad } = getBadgeGeometry(inst, W, H);
  const dx = px - inst.x;
  const dy = py - inst.y;
  const localX = dx * Math.cos(-rad) - dy * Math.sin(-rad);
  const localY = dx * Math.sin(-rad) + dy * Math.cos(-rad);
  return Math.abs(localX) <= half && Math.abs(localY) <= half;
}

function isPointInDeleteBtn(inst, W, H, px, py) {
  const { deleteBtn } = getBadgeGeometry(inst, W, H);
  const dx = px - deleteBtn.x;
  const dy = py - deleteBtn.y;
  const tapR = deleteBtn.r * 1.5; // objetivo táctil generoso
  return dx * dx + dy * dy <= tapR * tapR;
}

function drawSelectionOverlay(ctx, inst, W, H) {
  const { box, deleteBtn } = getBadgeGeometry(inst, W, H);

  ctx.save();
  ctx.setLineDash([Math.max(4, W * 0.004), Math.max(4, W * 0.004)]);
  ctx.strokeStyle = 'rgba(50,22,3,0.55)';
  ctx.lineWidth = Math.max(1.5, W * 0.0015);
  ctx.strokeRect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(deleteBtn.x, deleteBtn.y, deleteBtn.r, 0, Math.PI * 2);
  ctx.fillStyle = '#D23B2E';
  ctx.fill();
  ctx.lineWidth = Math.max(1, deleteBtn.r * 0.12);
  ctx.strokeStyle = COLORS.marfil;
  ctx.stroke();

  ctx.strokeStyle = COLORS.marfil;
  ctx.lineWidth = Math.max(1.5, deleteBtn.r * 0.22);
  ctx.lineCap = 'round';
  const r = deleteBtn.r * 0.42;
  ctx.beginPath();
  ctx.moveTo(deleteBtn.x - r, deleteBtn.y - r);
  ctx.lineTo(deleteBtn.x + r, deleteBtn.y + r);
  ctx.moveTo(deleteBtn.x + r, deleteBtn.y - r);
  ctx.lineTo(deleteBtn.x - r, deleteBtn.y + r);
  ctx.stroke();
  ctx.restore();
}

function drawAllBadges(ctx, W, H) {
  state.badges.forEach((inst) => {
    const def = BADGES.find((b) => b.id === inst.defId);
    if (!def) return;
    drawStickerBadge(ctx, def, inst.x, inst.y, badgeRenderSize(W, H, inst.scale), inst.rotation);
  });

  if (state.selectedBadgeUid != null) {
    const inst = state.badges.find((b) => b.uid === state.selectedBadgeUid);
    if (inst) drawSelectionOverlay(ctx, inst, W, H);
  }
}

function addBadgeInstance(defId) {
  const fmt = FORMATS[state.format];
  const uid = nextBadgeUid();
  state.badges.push({ uid, defId, x: fmt.w / 2, y: fmt.h / 2, scale: 100, rotation: 0 });
  state.selectedBadgeUid = uid;
  syncBadgeInspector();
  scheduleRedraw();
}

function removeBadge(uid) {
  state.badges = state.badges.filter((b) => b.uid !== uid);
  if (state.selectedBadgeUid === uid) state.selectedBadgeUid = null;
  syncBadgeInspector();
  scheduleRedraw();
}

function clampBadgesToCanvas() {
  const fmt = FORMATS[state.format];
  state.badges.forEach((b) => {
    b.x = Math.min(Math.max(b.x, 0), fmt.w);
    b.y = Math.min(Math.max(b.y, 0), fmt.h);
  });
}

/* ---------------------------------------------------------
   Template renderers
   --------------------------------------------------------- */

function renderTemplateA(ctx, W, H) {
  const photoH = H * 0.82;
  const barH = H - photoH;
  const barY = photoH;

  drawPhotoCover(
    ctx, state.photo.img,
    0, 0, W, photoH,
    state.photo.zoom, state.photo.offsetX, state.photo.offsetY
  );

  // Bottom bar — three fixed blocks, no rounded corners.
  const leftW = W * 0.45;
  const centerW = W * 0.30;
  const rightW = W - leftW - centerW;
  const ribbonInk = inkFor(state.ribbonColor);

  // Left block
  ctx.fillStyle = state.ribbonColor;
  ctx.fillRect(0, barY, leftW, barH);
  ctx.fillStyle = ribbonInk;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  const padL = W * 0.025;
  ctx.font = `500 ${Math.round(barH * 0.24)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.title.toUpperCase(), padL, barY + barH * 0.48);
  ctx.font = `400 ${Math.round(barH * 0.15)}px 'DM Mono', monospace`;
  ctx.fillStyle = translucentInk(ribbonInk, 0.75);
  ctx.fillText(state.texts.subtitle.toUpperCase(), padL, barY + barH * 0.74);

  // Center block
  ctx.fillStyle = state.ribbonColor;
  ctx.fillRect(leftW, barY, centerW, barH);
  ctx.fillStyle = ribbonInk;
  ctx.fillRect(leftW, barY, Math.max(2, W * 0.0019), barH);
  ctx.textAlign = 'center';
  const priceMaxWidth = centerW - W * 0.03;
  let priceFont = barH * 0.26;
  ctx.font = `500 ${Math.round(priceFont)}px 'DM Mono', monospace`;
  while (ctx.measureText(state.texts.price).width > priceMaxWidth && priceFont > 10) {
    priceFont -= 1;
    ctx.font = `500 ${Math.round(priceFont)}px 'DM Mono', monospace`;
  }
  ctx.fillText(state.texts.price, leftW + centerW / 2, barY + barH * 0.58);

  // Right block — fijo en Café Cuero / Marfil.
  ctx.fillStyle = COLORS.cuero;
  ctx.fillRect(leftW + centerW, barY, rightW, barH);
  ctx.fillStyle = COLORS.marfil;
  ctx.textAlign = 'left';
  ctx.font = `400 ${Math.round(barH * 0.14)}px 'DM Mono', monospace`;
  const rightPad = W * 0.02;
  const rightLines = wrapText(ctx, state.texts.secondary, rightW - rightPad * 2);
  const lineH = barH * 0.19;
  const startY = barY + barH / 2 - ((rightLines.length - 1) * lineH) / 2 + barH * 0.05;
  rightLines.slice(0, 4).forEach((ln, i) => {
    ctx.fillText(ln, leftW + centerW + rightPad, startY + i * lineH);
  });

  // Tab — top-left, anchored at the photo's corner. Decoración fija (no es un badge interactivo).
  const tabSize = Math.min(W * 0.1, photoH * 0.22);
  const tabMargin = W * 0.018;
  drawStickerBadge(
    ctx,
    { mono: true, id: 'tab' },
    tabMargin + tabSize * 0.5,
    tabMargin + tabSize * 0.5,
    tabSize,
    0
  );
}

function renderTemplateB(ctx, W, H) {
  const bg = state.themeColor;
  const ink = inkFor(bg);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const logoW = W * 0.34;
  drawLogo(ctx, state.logoColor, W / 2, H * 0.1, logoW, H * 0.08);

  ctx.fillStyle = ink;
  ctx.textAlign = 'center';

  const showPhoto = state.photo.showInB && state.photo.img;
  const centerY = H * 0.5;

  if (showPhoto) {
    ctx.font = `400 ${Math.round(W * 0.028)}px 'Ancizar Serif', Georgia, serif`;
    ctx.textBaseline = 'middle';
    const smallLines = wrapText(ctx, state.texts.title, W * 0.7);
    const smallLineH = W * 0.04;
    const smallStartY = H * 0.24;
    smallLines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, W / 2, smallStartY + i * smallLineH));

    const frameW = W * 0.56;
    const frameH = H * 0.4;
    const frameX = (W - frameW) / 2;
    const frameY = H * 0.33;
    ctx.save();
    ctx.lineWidth = Math.max(2, W * 0.004);
    ctx.strokeStyle = ink;
    ctx.strokeRect(frameX, frameY, frameW, frameH);
    drawPhotoCover(ctx, state.photo.img, frameX, frameY, frameW, frameH, state.photo.zoom, state.photo.offsetX, state.photo.offsetY);
    ctx.strokeRect(frameX, frameY, frameW, frameH);
    ctx.restore();
  } else {
    const maxWidth = W * 0.78;
    const maxFont = W * 0.075;
    const minFont = W * 0.035;
    let fontSize = maxFont;
    let lines = [];
    ctx.textBaseline = 'middle';
    for (fontSize = maxFont; fontSize >= minFont; fontSize -= 2) {
      ctx.font = `700 ${Math.round(fontSize)}px 'Ancizar Serif', Georgia, serif`;
      lines = wrapText(ctx, state.texts.title, maxWidth);
      const blockH = lines.length * fontSize * 1.15;
      if (blockH <= H * 0.32 && lines.length <= 4) break;
    }
    ctx.font = `700 ${Math.round(fontSize)}px 'Ancizar Serif', Georgia, serif`;
    const lineH = fontSize * 1.15;
    const startY = centerY - ((lines.length - 1) * lineH) / 2;
    lines.forEach((ln, i) => ctx.fillText(ln, W / 2, startY + i * lineH));
  }

  // Decorative dotted rule + URL
  ctx.font = `400 ${Math.round(W * 0.022)}px 'DM Mono', monospace`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('::::::::::::::', W / 2, H * 0.88);
  ctx.font = `500 ${Math.round(W * 0.02)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.secondary, W / 2, H * 0.92);
}

function renderTemplateC(ctx, W, H) {
  const colW = W * 0.45;
  const bg = state.themeColor;
  const ink = inkFor(bg);

  // Left — typographic column
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, colW, H);

  const pad = colW * 0.09;
  let cursorY = H * 0.12;

  drawLogo(ctx, state.logoColor, pad, cursorY, colW * 0.6, H * 0.09, 'left');
  cursorY += H * 0.14;

  ctx.fillStyle = ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 ${Math.round(colW * 0.11)}px 'Ancizar Serif', Georgia, serif`;
  const titleLines = wrapText(ctx, state.texts.title, colW - pad * 2);
  const titleLineH = colW * 0.125;
  titleLines.slice(0, 3).forEach((ln, i) => {
    cursorY += titleLineH;
    ctx.fillText(ln, pad, cursorY);
  });

  cursorY += titleLineH * 0.55;
  ctx.font = `500 ${Math.round(colW * 0.052)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.subtitle.toUpperCase(), pad, cursorY);
  cursorY += colW * 0.08;
  ctx.font = `500 ${Math.round(colW * 0.058)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.price, pad, cursorY);

  ctx.font = `400 ${Math.round(colW * 0.04)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.secondary, pad, H - H * 0.07);

  // Right — photo column
  drawPhotoCover(ctx, state.photo.img, colW, 0, W - colW, H, state.photo.zoom, state.photo.offsetX, state.photo.offsetY);
}

/* ---------------------------------------------------------
   Main redraw
   --------------------------------------------------------- */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let assetsReady = false;

function redraw() {
  const fmt = FORMATS[state.format];
  canvas.width = fmt.w;
  canvas.height = fmt.h;

  // Resizing the canvas resets context state, so smoothing must be re-applied every frame.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.fillStyle = COLORS.marfil;
  ctx.fillRect(0, 0, fmt.w, fmt.h);

  if (!assetsReady) {
    ctx.fillStyle = COLORS.espresso;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `500 ${Math.round(fmt.w * 0.025)}px 'DM Mono', monospace`;
    ctx.fillText('Cargando…', fmt.w / 2, fmt.h / 2);
    return;
  }

  if (state.template === 'A') renderTemplateA(ctx, fmt.w, fmt.h);
  else if (state.template === 'B') renderTemplateB(ctx, fmt.w, fmt.h);
  else renderTemplateC(ctx, fmt.w, fmt.h);

  drawAllBadges(ctx, fmt.w, fmt.h);
}

let rafPending = false;
function scheduleRedraw() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    redraw();
  });
}

/* ---------------------------------------------------------
   Canvas pointer interaction (drag / select / remove badges)
   --------------------------------------------------------- */

let dragState = null; // { uid, dx, dy }

function canvasPointFromEvent(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

function hitTestBadges(px, py, fmt) {
  for (let i = state.badges.length - 1; i >= 0; i--) {
    const inst = state.badges[i];
    if (isPointInBadge(inst, fmt.w, fmt.h, px, py)) return inst;
  }
  return null;
}

function buildCanvasInteraction() {
  canvas.addEventListener('mousedown', (e) => {
    const p = canvasPointFromEvent(e);
    const fmt = FORMATS[state.format];

    if (state.selectedBadgeUid != null) {
      const selected = state.badges.find((b) => b.uid === state.selectedBadgeUid);
      if (selected && isPointInDeleteBtn(selected, fmt.w, fmt.h, p.x, p.y)) {
        removeBadge(selected.uid);
        return;
      }
    }

    const hit = hitTestBadges(p.x, p.y, fmt);
    if (hit) {
      state.selectedBadgeUid = hit.uid;
      syncBadgeInspector();
      dragState = { uid: hit.uid, dx: p.x - hit.x, dy: p.y - hit.y };
      canvas.style.cursor = 'grabbing';
      scheduleRedraw();
      return;
    }

    if (state.selectedBadgeUid != null) {
      state.selectedBadgeUid = null;
      syncBadgeInspector();
      scheduleRedraw();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (dragState) {
      const p = canvasPointFromEvent(e);
      const inst = state.badges.find((b) => b.uid === dragState.uid);
      if (inst) {
        inst.x = p.x - dragState.dx;
        inst.y = p.y - dragState.dy;
        scheduleRedraw();
      }
      return;
    }
    // Hover feedback only when the pointer is over the canvas.
    if (e.target !== canvas) return;
    const p = canvasPointFromEvent(e);
    const fmt = FORMATS[state.format];
    const hit = hitTestBadges(p.x, p.y, fmt);
    canvas.style.cursor = hit ? 'grab' : 'default';
  });

  window.addEventListener('mouseup', () => {
    if (dragState) {
      dragState = null;
      canvas.style.cursor = 'grab';
    }
  });

  canvas.addEventListener('dblclick', (e) => {
    const p = canvasPointFromEvent(e);
    const fmt = FORMATS[state.format];
    const hit = hitTestBadges(p.x, p.y, fmt);
    if (hit) removeBadge(hit.uid);
  });
}

/* ---------------------------------------------------------
   UI wiring
   --------------------------------------------------------- */

function buildFormatSelect() {
  const sel = document.getElementById('ctl-format');
  sel.innerHTML = '';
  Object.entries(FORMATS).forEach(([key, f]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = f.label;
    sel.appendChild(opt);
  });
  sel.value = state.format;
  sel.addEventListener('change', () => {
    state.format = sel.value;
    clampBadgesToCanvas();
    scheduleRedraw();
  });
}

function applyTemplateLabels() {
  const labels = LABELS_BY_TEMPLATE[state.template];
  const map = { title: 'label-title', subtitle: 'label-subtitle', price: 'label-price', secondary: 'label-secondary' };
  const fieldWrap = { title: 'field-title', subtitle: 'field-subtitle', price: 'field-price', secondary: 'field-secondary' };
  Object.keys(labels).forEach((key) => {
    const labelEl = document.getElementById(map[key]);
    const wrapEl = document.getElementById(fieldWrap[key]);
    if (labels[key] === null) {
      wrapEl.classList.add('is-hidden');
    } else {
      wrapEl.classList.remove('is-hidden');
      labelEl.textContent = labels[key];
    }
  });

  document.getElementById('template-hint').textContent = TEMPLATE_HINTS[state.template];
  document.getElementById('field-show-photo-b').classList.toggle('is-hidden', state.template !== 'B');
  document.getElementById('field-ribbon-color').classList.toggle('is-hidden', state.template !== 'A');
  document.getElementById('field-logo-color').classList.toggle('is-hidden', state.template === 'A');
}

function buildTemplateSelector() {
  const wrap = document.getElementById('ctl-template');
  wrap.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prevSecondaryIsDefault = Object.values(DEFAULT_SECONDARY).includes(state.texts.secondary);
      state.template = btn.dataset.template;
      wrap.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
      if (prevSecondaryIsDefault) {
        state.texts.secondary = DEFAULT_SECONDARY[state.template];
        document.getElementById('ctl-secondary').value = state.texts.secondary;
      }
      applyTemplateLabels();
      scheduleRedraw();
    });
  });
}

function buildPhotoControls() {
  const fileInput = document.getElementById('ctl-photo');
  const dropLabel = document.getElementById('photo-drop-label');
  const removeBtn = document.getElementById('ctl-photo-remove');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    // Carga directa vía blob URL, sin pasar por FileReader/base64 ni recompresión.
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      state.photo.img = img;
      dropLabel.textContent = file.name;
      URL.revokeObjectURL(url);
      scheduleRedraw();
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  });

  removeBtn.addEventListener('click', () => {
    state.photo.img = null;
    fileInput.value = '';
    dropLabel.textContent = 'Subir fotografía…';
    scheduleRedraw();
  });

  const zoom = document.getElementById('ctl-zoom');
  const offx = document.getElementById('ctl-offx');
  const offy = document.getElementById('ctl-offy');
  const outZoom = document.getElementById('out-zoom');
  const outOffx = document.getElementById('out-offx');
  const outOffy = document.getElementById('out-offy');

  zoom.addEventListener('input', () => {
    state.photo.zoom = Number(zoom.value);
    outZoom.textContent = `${zoom.value}%`;
    scheduleRedraw();
  });
  offx.addEventListener('input', () => {
    state.photo.offsetX = Number(offx.value);
    outOffx.textContent = offx.value;
    scheduleRedraw();
  });
  offy.addEventListener('input', () => {
    state.photo.offsetY = Number(offy.value);
    outOffy.textContent = offy.value;
    scheduleRedraw();
  });

  document.getElementById('ctl-show-photo-b').addEventListener('change', (e) => {
    state.photo.showInB = e.target.checked;
    scheduleRedraw();
  });
}

function buildTextControls() {
  const title = document.getElementById('ctl-title');
  const subtitle = document.getElementById('ctl-subtitle');
  const price = document.getElementById('ctl-price');
  const secondary = document.getElementById('ctl-secondary');

  title.value = state.texts.title;
  subtitle.value = state.texts.subtitle;
  price.value = state.texts.price;
  secondary.value = state.texts.secondary;

  title.addEventListener('input', () => { state.texts.title = title.value; scheduleRedraw(); });
  subtitle.addEventListener('input', () => { state.texts.subtitle = subtitle.value; scheduleRedraw(); });
  price.addEventListener('input', () => { state.texts.price = price.value; scheduleRedraw(); });
  secondary.addEventListener('input', () => { state.texts.secondary = secondary.value; scheduleRedraw(); });

  const phraseWrap = document.getElementById('ctl-phrases');
  PHRASES.forEach((phrase) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = phrase;
    btn.addEventListener('click', () => {
      state.texts.title = phrase;
      title.value = phrase;
      scheduleRedraw();
    });
    phraseWrap.appendChild(btn);
  });
}

function buildSwatchPicker(containerId, getValue, setValue, onChange) {
  const wrap = document.getElementById(containerId);
  SWATCHES.forEach((sw) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch';
    btn.style.background = sw.hex;
    btn.title = sw.label;
    btn.setAttribute('aria-label', sw.label);
    if (sw.hex === getValue()) btn.classList.add('active');
    btn.addEventListener('click', () => {
      setValue(sw.hex);
      wrap.querySelectorAll('.swatch').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (onChange) onChange(sw.hex);
      scheduleRedraw();
    });
    wrap.appendChild(btn);
  });
}

function buildColorControls() {
  buildSwatchPicker(
    'ctl-colors',
    () => state.themeColor,
    (hex) => { state.themeColor = hex; },
    () => {
      state.logoColor = inkFor(state.themeColor) === COLORS.espresso ? 'dark' : 'cream';
      syncLogoColorButtons();
    }
  );
  buildSwatchPicker(
    'ctl-ribbon-colors',
    () => state.ribbonColor,
    (hex) => { state.ribbonColor = hex; }
  );
}

function buildLogoColorControl() {
  const wrap = document.getElementById('ctl-logo-color');
  wrap.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.logoColor = btn.dataset.logoColor;
      syncLogoColorButtons();
      scheduleRedraw();
    });
  });
  syncLogoColorButtons();
}

function syncLogoColorButtons() {
  const wrap = document.getElementById('ctl-logo-color');
  wrap.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.logoColor === state.logoColor));
}

function buildBadgeGrid() {
  const wrap = document.getElementById('ctl-badges');
  BADGES.forEach((b) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'badge-item';
    item.innerHTML = `<img src="./assets/${b.file}" alt="${b.label}" loading="lazy"><span>${b.label}</span>`;
    item.title = 'Añadir al centro del lienzo';
    item.addEventListener('click', () => addBadgeInstance(b.id));
    wrap.appendChild(item);
  });

  const scaleInput = document.getElementById('ctl-badge-scale');
  const rotInput = document.getElementById('ctl-badge-rotation');
  const outScale = document.getElementById('out-badge-scale');
  const outRot = document.getElementById('out-badge-rotation');
  const removeBtn = document.getElementById('ctl-badge-remove');

  scaleInput.addEventListener('input', () => {
    const inst = state.badges.find((bd) => bd.uid === state.selectedBadgeUid);
    if (!inst) return;
    inst.scale = Number(scaleInput.value);
    outScale.textContent = `${scaleInput.value}%`;
    scheduleRedraw();
  });

  rotInput.addEventListener('input', () => {
    const inst = state.badges.find((bd) => bd.uid === state.selectedBadgeUid);
    if (!inst) return;
    inst.rotation = Number(rotInput.value);
    outRot.textContent = `${rotInput.value}°`;
    scheduleRedraw();
  });

  removeBtn.addEventListener('click', () => {
    if (state.selectedBadgeUid != null) removeBadge(state.selectedBadgeUid);
  });

  syncBadgeInspector();
}

function syncBadgeInspector() {
  const inst = state.badges.find((b) => b.uid === state.selectedBadgeUid);
  const inspector = document.getElementById('badge-inspector');
  const scaleInput = document.getElementById('ctl-badge-scale');
  const rotInput = document.getElementById('ctl-badge-rotation');
  const outScale = document.getElementById('out-badge-scale');
  const outRot = document.getElementById('out-badge-rotation');

  if (inst) {
    inspector.classList.remove('is-hidden');
    scaleInput.value = inst.scale;
    rotInput.value = inst.rotation;
    outScale.textContent = `${inst.scale}%`;
    outRot.textContent = `${inst.rotation}°`;
  } else {
    inspector.classList.add('is-hidden');
  }
}

function buildExport() {
  const btn = document.getElementById('ctl-export');
  const hint = document.getElementById('export-hint');
  btn.addEventListener('click', () => {
    if (!assetsReady) return;
    const fmt = FORMATS[state.format];

    // Ocultar temporalmente la selección para que el borde guía y el botón ✕
    // nunca aparezcan en el PNG exportado.
    const hadSelection = state.selectedBadgeUid;
    state.selectedBadgeUid = null;
    redraw();

    const dataURL = canvas.toDataURL('image/png', 1.0);

    state.selectedBadgeUid = hadSelection;
    redraw();

    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = dataURL;
    a.download = `bictoria-${state.template.toLowerCase()}-${fmt.w}x${fmt.h}-${stamp}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  hint.textContent = 'Se exporta en la resolución real del formato elegido.';
}

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */

async function boot() {
  buildFormatSelect();
  buildTemplateSelector();
  buildPhotoControls();
  buildTextControls();
  buildColorControls();
  buildLogoColorControl();
  buildBadgeGrid();
  buildCanvasInteraction();
  buildExport();
  applyTemplateLabels();

  redraw(); // show "Cargando…" placeholder immediately

  await Promise.all([waitForFonts(), preloadAllAssets()]);

  assetsReady = true;
  redraw();
}

boot();

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

// Fondos oscuros del manual de marca: fuerzan textos/líneas claras.
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

// Párrafos editoriales en inglés para la columna vertical lateral de la
// Plantilla A (estilo lookbook/streetwear).
const ENGLISH_EDITORIAL_PARAGRAPHS = [
  'We create pieces that move with your daily rhythm and connect the everyday with the extraordinary. Every ride adds story, and every detail is born from handmade craft rooted in Cali.',
  'No matter how the route looks, there is always a way to ride it and enjoy it. We design through resilience, love, and creativity for those who move through the street on their own terms.',
  'Craft feels real when it lives inside your everyday routine. Pieces made to roll unhurried, gather miles, and carry who you are.',
  'Life on a bike rolls better when every object has purpose and character. Since 2005, we’ve turned movement and craft into handmade pieces for the city and the road.',
  'Born in Cali with the bicycle as our compass and the workshop as our starting point. Our pieces cross everyday asphalt with a quiet, direct aesthetic built to last.',
  'One stitch at a time, one street at a time. We make essential objects for people who treat movement as a way of seeing and inhabiting the world.',
  'Leather pieces worked slowly, by hand, with obsessive care for every detail. A meeting point between slow artisan craft and the everyday attitude of riding out.',
  'Every piece holds the time of the workshop and the energy of the person wearing it. Handcrafted in Colombia to travel, move, and discover what’s worth the ride.',
  'Slow-handcrafted pieces born from cycling culture and daily movement. From Cali, Colombia—stories on wheels made to turn the ordinary into something lasting.',
  'Bicycle art since 2005—made by hand for real routes and everyday life. Resilience, craft, and street character in every piece.',
];

// Monochrome brand-ink SVGs share this baked-in fill color; swapping it lets
// us derive flat-ink variants from a single source file without a canvas tint.
const MONO_SOURCE_HEX = '#3e2e17';

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
  { id: 'propertycali', label: 'Property of Santiago de Cali', file: 'badge-property-cali.svg', fallbackFile: 'badge-property-cali.png', mono: false },
];

// Variantes de logotipo del manual de marca. El color se aplica en tiempo real
// con un tinte offscreen (ver getTintedImage), no con archivos pre-coloreados.
const LOGO_VARIANTS = {
  main: { label: 'Logotipo Principal (Bictoria)', kind: 'asset', file: 'logo-bictoria-horizontal.svg' },
  circular: { label: 'Isotipo Bicicleta Circular', kind: 'circular' },
  tab: { label: 'Pestaña Superior Bicicleta', kind: 'asset', file: 'tab-bici.svg' },
  monograma: { label: 'Monograma B', kind: 'letter', letter: 'B' },
  sello2005: { label: 'Sello Vertical 2005 / Bictoria', kind: 'asset', file: 'badge-bictr-2005.svg' },
  none: { label: 'Sin logo', kind: 'none' },
};

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
  D: {
    title: null,
    subtitle: null,
    price: null,
    secondary: null,
  },
  E: {
    title: null,
    subtitle: null,
    price: null,
    secondary: null,
  },
};

const TEMPLATE_HINTS = {
  A: 'Ficha de producto con foto, pestaña de marca y barra de datos inferior en dos niveles.',
  B: 'Pieza editorial: fondo de color de marca, logotipo y frase.',
  C: 'Banner de dos columnas: texto de marca + fotografía.',
  D: 'Post solo tipográfico: manifiesto de marca sin fotografía, con sellos.',
  E: 'Fotografía plena con isotipo superior izquierdo, crédito editorial arriba a la derecha y párrafo justificado al pie.',
};

const DEFAULT_SECONDARY = {
  A: 'Envíos nacionales Colombia',
  B: 'www.bictoria.com',
  C: 'www.bictoria.com',
  D: 'www.bictoria.com',
  E: 'www.bictoria.com',
};

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
    web: 'www.bictoria.com',
    headlineD: 'La vida\nen Bici\nrueda\nmejor',
    editorialEn: ENGLISH_EDITORIAL_PARAGRAPHS[1],
    creditLine1: 'by Libardo Victoria',
    creditLine2: 'Made in Cali',
  },
  themeColor: COLORS.marfil,
  bgColorD: COLORS.naranja,
  bgColorE: COLORS.espresso,
  logoVariant: 'main',
  logoColor: COLORS.espresso, // hex — se recalcula al cambiar el tema, pero el usuario puede forzarlo.
  ribbonColor: COLORS.amarilloPalido,
  titleFontSizePt: 30, // controla el tamaño del nombre/título en todas las plantillas
  showEditorialEn: true, // columna vertical lateral en inglés (Plantilla A)
  editorialHorizontalPosition: 'bottom', // 'bottom' | 'top' — solo aplica en formatos W > H
  badges: [], // { uid, defId, x, y, scale, rotation, backdrop }
  selectedBadgeUid: null,
};

let badgeUidCounter = 1;
function nextBadgeUid() {
  return badgeUidCounter++;
}

/* ---------------------------------------------------------
   Asset loading / caching
   --------------------------------------------------------- */

const imageCache = new Map(); // key -> HTMLImageElement | HTMLCanvasElement
const svgTextCache = new Map(); // path -> raw svg text

function loadImageFromURL(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`Tiempo de espera agotado cargando: ${url}`));
    }, 2000);
    img.onload = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    };
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

// Igual que loadPlainSVG, pero si el archivo primario no existe (ej. un
// badge nuevo cuyo .svg aún no fue entregado) intenta un .png de respaldo,
// cacheando el resultado bajo la MISMA clave para que getBadgeImage lo
// encuentre de forma transparente.
async function loadImageWithFallback(path, fallbackPath) {
  if (imageCache.has(path)) return imageCache.get(path);
  try {
    const img = await loadImageFromURL(`./assets/${path}`);
    imageCache.set(path, img);
    return img;
  } catch (err) {
    try {
      const img = await loadImageFromURL(`./assets/${fallbackPath}`);
      imageCache.set(path, img);
      return img;
    } catch (err2) {
      console.warn(`No se pudo cargar "${path}" ni su respaldo "${fallbackPath}":`, err2);
      imageCache.set(path, null);
      return null;
    }
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

// Tiñe cualquier imagen ya cargada a un color plano exacto, preservando su
// transparencia, usando un canvas offscreen + globalCompositeOperation
// 'source-in'. Así un único asset sirve para cualquiera de los 8 colores.
function getTintedImage(cacheKey, img, colorHex) {
  if (!img) return null;
  const key = `tint:${cacheKey}|${colorHex}`;
  if (imageCache.has(key)) return imageCache.get(key);
  const off = document.createElement('canvas');
  off.width = img.naturalWidth || img.width;
  off.height = img.naturalHeight || img.height;
  const octx = off.getContext('2d');
  octx.drawImage(img, 0, 0, off.width, off.height);
  octx.globalCompositeOperation = 'source-in';
  octx.fillStyle = colorHex;
  octx.fillRect(0, 0, off.width, off.height);
  imageCache.set(key, off);
  return off;
}

function getBadgeImage(badgeDef) {
  if (!badgeDef) return null;
  if (badgeDef.mono) return imageCache.get(`${badgeDef.file}|${COLORS.espresso}`) || null;
  return imageCache.get(badgeDef.file) || null;
}

async function preloadAllAssets() {
  const jobs = [
    loadPlainSVG('tab-bici.svg'),
    loadPlainSVG('logo-bictoria-horizontal.svg'),
    loadPlainSVG('icon-bici-line.svg'),
    loadPlainSVG('badge-bictr-2005.svg'),
  ];
  for (const b of BADGES) {
    if (b.mono) jobs.push(loadMonoSVG(b.file, COLORS.espresso));
    else if (b.fallbackFile) jobs.push(loadImageWithFallback(b.file, b.fallbackFile));
    else jobs.push(loadPlainSVG(b.file));
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
    // Carrera con límite de tiempo: document.fonts.ready puede no resolver
    // nunca en algunos navegadores/condiciones de red; nunca debe bloquear
    // el primer render del canvas más de 1.2s.
    await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1200))]);
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

// Rectángulo con esquinas superiores a escuadra y solo las inferiores
// redondeadas — la silueta exacta de la pestaña de marca.
function roundRectBottomOnly(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y);
  ctx.closePath();
}

function drawPhotoCover(ctx, img, dx, dy, dw, dh, zoomPercent, offsetXPercent, offsetYPercent, placeholderBg = COLORS.amarilloPalido) {
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
    const placeholderInk = inkFor(placeholderBg);
    ctx.fillStyle = placeholderBg;
    ctx.fillRect(dx, dy, dw, dh);
    ctx.fillStyle = translucentInk(placeholderInk, 0.45);
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

// Calcula el cuerpo tipográfico más grande que quepa en maxWidth sin deformar
// los glifos (nunca usa el 4.º parámetro de fillText, que comprime el ancho).
// Reduce proporcionalmente primero y luego ajusta en pasos de 1px hasta que
// mida exacto.
function getFittedFontSize(ctx, text, maxWidth, desiredPx, fontWeight, fontFamily) {
  ctx.font = `${fontWeight} ${desiredPx}px ${fontFamily}`;
  const w = ctx.measureText(text).width;
  if (w > maxWidth && w > 0) {
    let size = Math.floor(desiredPx * (maxWidth / w));
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    while (ctx.measureText(text).width > maxWidth && size > 10) {
      size -= 1;
      ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    }
    return size;
  }
  return desiredPx;
}

// Texto justificado a ambos lados, incluido el último renglón por defecto —
// genera intencionalmente los "ríos" tipográficos del estilo editorial.
// lineHeight puede ser negativo (usado dentro de un contexto rotado para que
// los renglones se apilen en la dirección opuesta al eje de lectura).
function drawJustifiedText(ctx, text, x, y, boxWidth, lineHeight, justifyLastLine = true) {
  // wrapText ya recorre y conserva todas las palabras del texto (incluida la
  // última): el acumulador final siempre se empuja a `lines` al terminar.
  const lines = wrapText(ctx, text, boxWidth);
  const minGap = ctx.measureText(' ').width * 0.5;
  let currentY = y;
  lines.forEach((line, i) => {
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      ctx.fillText(words[0], x, currentY);
    } else if (i < lines.length - 1 || (justifyLastLine && words.length > 1)) {
      const wordsWidth = words.reduce((acc, w) => acc + ctx.measureText(w).width, 0);
      const totalSpace = Math.max(0, boxWidth - wordsWidth);
      const gap = Math.max(minGap, totalSpace / (words.length - 1));
      let cursorX = x;
      words.forEach((word) => {
        ctx.fillText(word, cursorX, currentY);
        cursorX += ctx.measureText(word).width + gap;
      });
    } else {
      ctx.fillText(line, x, currentY);
    }
    currentY += lineHeight;
  });
  return lines.length;
}

// Encuentra el mayor tamaño de fuente (<= desiredFontSize) tal que el bloque
// de texto envuelto en boxWidth quepa completo (todas las líneas) dentro de
// maxBlockHeight, reduciendo fontSize y lineHeight proporcionalmente.
function fitJustifiedBlock(ctx, text, boxWidth, desiredFontSize, lineHeightRatio, maxBlockHeight, fontWeight, fontFamily) {
  let fontSize = desiredFontSize;
  let lineHeight = fontSize * lineHeightRatio;
  ctx.font = `${fontWeight} ${Math.round(fontSize)}px ${fontFamily}`;
  let lines = wrapText(ctx, text, boxWidth);
  let blockHeight = lines.length * lineHeight;
  let guard = 0;
  while (blockHeight > maxBlockHeight && fontSize > 10 && guard < 8) {
    fontSize *= Math.max(0.88, maxBlockHeight / blockHeight);
    lineHeight = fontSize * lineHeightRatio;
    ctx.font = `${fontWeight} ${Math.round(fontSize)}px ${fontFamily}`;
    lines = wrapText(ctx, text, boxWidth);
    blockHeight = lines.length * lineHeight;
    guard += 1;
  }
  return { fontSize, lineHeight, numLines: lines.length, blockHeight };
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

// Dibuja un isotipo circular: un círculo relleno del color dado con la
// silueta de la bicicleta recortada (destination-out), dejando ver el fondo
// de la composición a través del icono — p. ej. círculo café con bici naranja.
function drawCircularBikeIsotype(ctx, colorHex, cx, cy, size, bikeRatio = 0.58) {
  const r = size / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = colorHex;
  ctx.fill();

  const bikeImg = imageCache.get('icon-bici-line.svg');
  if (bikeImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalCompositeOperation = 'destination-out';
    const iw = bikeImg.naturalWidth || bikeImg.width;
    const ih = bikeImg.naturalHeight || bikeImg.height;
    const scale = (size * bikeRatio) / Math.max(iw, ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(bikeImg, cx - dw / 2, cy - dh / 2, dw, dh);
    ctx.restore();
  }
  ctx.restore();
}

// Dibuja la variante de logotipo elegida, teñida al color exacto elegido,
// siempre con fondo 100% transparente. Si el asset no cargó, cae a un
// lockup tipográfico en la misma tinta, también sin fondo.
function drawLogoVariant(ctx, variantKey, colorHex, cx, cy, maxW, maxH, align = 'center') {
  const variant = LOGO_VARIANTS[variantKey] || LOGO_VARIANTS.main;

  if (variant.kind === 'none') return { w: 0, h: 0 };

  if (variant.kind === 'letter') {
    ctx.save();
    ctx.fillStyle = colorHex;
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.round(maxH)}px 'Ancizar Serif', Georgia, serif`;
    ctx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
    ctx.fillText(variant.letter, cx, cy);
    ctx.restore();
    return { w: maxH, h: maxH };
  }

  if (variant.kind === 'circular') {
    const size = Math.min(maxW, maxH);
    let x = cx;
    if (align === 'left') x = cx + size / 2;
    if (align === 'right') x = cx - size / 2;
    drawCircularBikeIsotype(ctx, colorHex, x, cy, size);
    return { w: size, h: size };
  }

  const img = imageCache.get(variant.file);
  if (img) {
    const tinted = getTintedImage(variant.file, img, colorHex);
    return drawImageContain(ctx, tinted, cx, cy, maxW, maxH, align);
  }

  ctx.save();
  ctx.fillStyle = colorHex;
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.round(maxH * 0.8)}px 'Ancizar Serif', Georgia, serif`;
  ctx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
  ctx.fillText('Bictoria', cx, cy);
  ctx.restore();
  return { w: 0, h: 0 };
}

function drawStickerBadge(ctx, badgeDef, cx, cy, maxSize, rotationDeg, withBackdrop) {
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

  if (withBackdrop) {
    // Respaldo tipo sticker/parche troquelado en Marfil Base, con margen
    // interno proporcional alrededor de la silueta del badge.
    const padW = w * 1.14;
    const padH = h * 1.14;
    ctx.fillStyle = COLORS.marfil;
    roundRectPath(ctx, -padW / 2, -padH / 2, padW, padH, Math.min(padW, padH) * 0.5);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    // Sin fondo: solo el arte del badge, con sombra sutil directa para que
    // se perciba sobre la foto, pero sin ningún contenedor detrás.
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }
  ctx.restore();
  ctx.restore();
}

/* ---------------------------------------------------------
   Interactive badge instances (add / drag / rotate / scale / remove)
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

  const ref = Math.min(W, H) / 1080;
  const btnR = Math.max(10, Math.min(W, H) * 0.018);
  const rotLineLen = 28 * ref;
  const rotHandleR = Math.max(7, 8 * ref);
  const scaleHandleSize = Math.max(12, 16 * ref);
  const boxCenterX = (box.minX + box.maxX) / 2;

  return {
    size, half, rad, box,
    deleteBtn: { x: box.maxX, y: box.minY, r: btnR },
    rotateHandle: {
      x: boxCenterX, y: box.minY - rotLineLen, r: rotHandleR,
      lineX1: boxCenterX, lineY1: box.minY, lineX2: boxCenterX, lineY2: box.minY - rotLineLen,
    },
    scaleHandle: { x: box.maxX, y: box.maxY, size: scaleHandleSize },
  };
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

function isPointInRotateHandle(inst, W, H, px, py) {
  const { rotateHandle } = getBadgeGeometry(inst, W, H);
  const dx = px - rotateHandle.x;
  const dy = py - rotateHandle.y;
  const tapR = rotateHandle.r * 1.7;
  return dx * dx + dy * dy <= tapR * tapR;
}

function isPointInScaleHandle(inst, W, H, px, py) {
  const { scaleHandle } = getBadgeGeometry(inst, W, H);
  const tap = scaleHandle.size * 0.95;
  return Math.abs(px - scaleHandle.x) <= tap && Math.abs(py - scaleHandle.y) <= tap;
}

function drawSelectionOverlay(ctx, inst, W, H) {
  const { box, deleteBtn, rotateHandle, scaleHandle } = getBadgeGeometry(inst, W, H);

  // Borde guía punteado
  ctx.save();
  ctx.setLineDash([Math.max(4, W * 0.004), Math.max(4, W * 0.004)]);
  ctx.strokeStyle = 'rgba(50,22,3,0.55)';
  ctx.lineWidth = Math.max(1.5, W * 0.0015);
  ctx.strokeRect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY);
  ctx.restore();

  // Manejador de rotación: línea + círculo
  ctx.save();
  ctx.strokeStyle = 'rgba(50,22,3,0.65)';
  ctx.lineWidth = Math.max(1.5, W * 0.0015);
  ctx.beginPath();
  ctx.moveTo(rotateHandle.lineX1, rotateHandle.lineY1);
  ctx.lineTo(rotateHandle.lineX2, rotateHandle.lineY2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rotateHandle.x, rotateHandle.y, rotateHandle.r, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.marfil;
  ctx.fill();
  ctx.lineWidth = Math.max(1, rotateHandle.r * 0.22);
  ctx.strokeStyle = 'rgba(50,22,3,0.8)';
  ctx.stroke();
  ctx.restore();

  // Manejador de escala: cuadrado en esquina inferior derecha
  ctx.save();
  ctx.fillStyle = COLORS.marfil;
  ctx.fillRect(scaleHandle.x - scaleHandle.size / 2, scaleHandle.y - scaleHandle.size / 2, scaleHandle.size, scaleHandle.size);
  ctx.lineWidth = Math.max(1, scaleHandle.size * 0.14);
  ctx.strokeStyle = 'rgba(50,22,3,0.8)';
  ctx.strokeRect(scaleHandle.x - scaleHandle.size / 2, scaleHandle.y - scaleHandle.size / 2, scaleHandle.size, scaleHandle.size);
  ctx.restore();

  // Botón ✕ de borrado
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
    drawStickerBadge(ctx, def, inst.x, inst.y, badgeRenderSize(W, H, inst.scale), inst.rotation, inst.backdrop);
  });

  if (state.selectedBadgeUid != null) {
    const inst = state.badges.find((b) => b.uid === state.selectedBadgeUid);
    if (inst) drawSelectionOverlay(ctx, inst, W, H);
  }
}

function addBadgeInstance(defId) {
  const fmt = FORMATS[state.format];
  const def = BADGES.find((b) => b.id === defId);
  const uid = nextBadgeUid();
  state.badges.push({
    uid, defId, x: fmt.w / 2, y: fmt.h / 2, scale: 100, rotation: 0,
    backdrop: def ? !!def.mono : false,
  });
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
  // Escala UNIFORME (no W/1080): evita que el ancho extra del banner
  // (1920×800) infle tipografía y aplaste las bandas/la pestaña. Vale 1.0 en
  // 1080×1080, 1080×1350 y 1080×1920 (idéntico a antes), y 0.741 en 1920×800.
  const uScale = Math.min(W, H) / 1080;
  const ribbonInk = inkFor(state.ribbonColor);
  const fontFamilySerif = "'Ancizar Serif', Georgia, serif";

  // ---- Fotografía de fondo completa: cubre el 100% del lienzo ----
  drawPhotoCover(ctx, state.photo.img, 0, 0, W, H, state.photo.zoom, state.photo.offsetX, state.photo.offsetY);

  // ---- Bandas inferiores: alturas y posición en px reales vía uScale, no
  // porcentaje de H — así siempre tienen altura suficiente para su tipografía.
  const h1 = 120 * uScale;
  const h2 = 113 * uScale;
  const bottomMargin = (W > H ? 52 : 107) * uScale;
  const y2 = H - bottomMargin - h2;
  const y1 = y2 - h1;
  const colSplit1 = W * 0.34;
  const colSplit2 = W * 0.683;

  // ---- Párrafo editorial en inglés (estilo lookbook/streetwear) ----
  // Vertical/cuadrado (H >= W): columna lateral derecha rotada -90°, leída de
  // abajo hacia arriba, con varios renglones justificados a ambos lados.
  // Horizontal (W > H): franja multi-renglón arriba o abajo, sin rotar.
  if (state.showEditorialEn && state.texts.editorialEn) {
    const editorialFontFamily = "'DM Mono', monospace";
    ctx.fillStyle = COLORS.marfil;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';

    if (H >= W) {
      // Columna vertical arquitectónica: ancho total EXACTO de la pestaña
      // superior derecha (tabW), estrictamente contenida entre tabLeftX y
      // tabLeftX + tabW. Bucle de auto-escalado por decrementos fijos: nunca
      // recorta ni descarta líneas, solo reduce fontSize hasta que TODAS las
      // líneas quepan dentro de tabW.
      const tabW = 117 * uScale;
      const tabRightMargin = 63 * uScale;
      const tabLeftX = W - tabRightMargin - tabW;
      const tabBottomY = 182 * uScale; // tabH

      const yStartBound = tabBottomY + 36 * uScale;
      const yEndBound = y1 - 32 * uScale;
      const boxLength = yEndBound - yStartBound;

      if (boxLength > 20) {
        const minFontSize = 10 * uScale;
        let fontSize = 23 * uScale;
        let lineHeight = fontSize * 1.22;
        let lines = [];
        while (fontSize >= minFontSize) {
          ctx.font = `400 ${Math.round(fontSize)}px ${editorialFontFamily}`;
          lines = wrapText(ctx, state.texts.editorialEn, boxLength);
          lineHeight = fontSize * 1.22;
          if (lines.length * lineHeight <= tabW) break;
          fontSize -= 0.5 * uScale;
        }
        fontSize = Math.max(fontSize, minFontSize);

        // Interlineado final ajustado para llenar tabW exacto (sin exceder
        // un máximo razonable de aire entre columnas cuando sobran líneas).
        const finalLineHeight = Math.min(tabW / Math.max(lines.length, 1), 1.38 * fontSize);
        const totalColumnWidth = lines.length * finalLineHeight;
        const blockRightX = (tabLeftX + tabW) - (tabW - totalColumnWidth) / 2;

        ctx.save();
        ctx.translate(blockRightX, yEndBound);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = `400 ${Math.round(fontSize)}px ${editorialFontFamily}`;
        ctx.shadowBlur = 6 * uScale;
        drawJustifiedText(ctx, state.texts.editorialEn, 0, 0, boxLength, -finalLineHeight, true);
        ctx.restore();
      }
    } else {
      // Formato horizontal: franja arriba o abajo, sin rotar, con márgenes
      // laterales limpios y un piso de tamaño que se reduce proporcionalmente
      // (fontSize + lineHeight) si el párrafo no cabría completo en el alto
      // disponible, para que SIEMPRE se vea íntegro y nunca cortado a medias.
      const desiredFontSize = 19 * uScale;
      const lineHeightRatio = 1.22;
      const marginSide = 36 * uScale;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.shadowBlur = 5 * uScale;

      if (state.editorialHorizontalPosition === 'top') {
        const tabW = 117 * uScale;
        const tabMarginR = 63 * uScale;
        const tabX = W - tabMarginR - tabW;
        const maxRightX = tabX - 28 * uScale;
        const boxWidth = Math.max(0, maxRightX - marginSide);
        const startYBase = 28 * uScale;
        const maxBlockHeight = Math.max(40, y1 - 24 * uScale - startYBase);
        if (boxWidth > 40) {
          const fit = fitJustifiedBlock(ctx, state.texts.editorialEn, boxWidth, desiredFontSize, lineHeightRatio, maxBlockHeight, 400, editorialFontFamily);
          ctx.font = `400 ${Math.round(fit.fontSize)}px ${editorialFontFamily}`;
          drawJustifiedText(ctx, state.texts.editorialEn, marginSide, startYBase + fit.fontSize * 0.85, boxWidth, fit.lineHeight, true);
        }
      } else {
        const boxWidth = W * 0.45;
        const maxBlockHeight = Math.min(H * 0.4, Math.max(40, y1 - 24 * uScale - 20 * uScale));
        const fit = fitJustifiedBlock(ctx, state.texts.editorialEn, boxWidth, desiredFontSize, lineHeightRatio, maxBlockHeight, 400, editorialFontFamily);
        ctx.font = `400 ${Math.round(fit.fontSize)}px ${editorialFontFamily}`;
        const startY = y1 - 24 * uScale - fit.blockHeight + fit.fontSize * 0.85;
        drawJustifiedText(ctx, state.texts.editorialEn, marginSide, startY, boxWidth, fit.lineHeight, true);
      }
    }
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  // Columna izquierda — nombre + subtítulo.
  // El tamaño del nombre lo controla el usuario (state.titleFontSizePt);
  // getFittedFontSize lo recorta sin deformar glifos si no cabe en el ancho
  // disponible antes de la línea divisoria, y el clamp de altura evita que
  // el bloque título+subtítulo choque con los bordes de la franja.
  ctx.fillStyle = state.ribbonColor;
  ctx.fillRect(0, y1, colSplit1, h1);
  ctx.fillStyle = ribbonInk;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const marginL = 31 * uScale;
  const dividerMargin = 22 * uScale;
  const maxNameWidth = colSplit1 - marginL - dividerMargin;
  const subFont = 26 * uScale; // COLECCIÓN RUTAS — acercada al nombre con gapTitleSub
  const blockGap = 6 * uScale; // gapTitleSub: separación corta y precisa nombre→colección

  const desiredTitlePx = state.titleFontSizePt * 1.933 * uScale;
  const availableBlockH = h1 * 0.92;
  const maxTitleFontByHeight = Math.max(10, (availableBlockH - subFont - blockGap) / 0.85);
  const desiredTitlePxClamped = Math.min(desiredTitlePx, maxTitleFontByHeight);

  const nameText = state.texts.title.toUpperCase();
  const nameFont = getFittedFontSize(ctx, nameText, maxNameWidth, desiredTitlePxClamped, 700, fontFamilySerif);

  const titleLineH = nameFont * 0.85;
  const blockH = titleLineH + blockGap + subFont;
  const blockTop = y1 + (h1 - blockH) / 2;

  ctx.font = `700 ${Math.round(nameFont)}px ${fontFamilySerif}`;
  ctx.fillText(nameText, marginL, blockTop + nameFont * 0.78);

  ctx.font = `400 ${Math.round(subFont)}px 'DM Mono', monospace`;
  ctx.fillStyle = translucentInk(ribbonInk, 0.75);
  ctx.fillText(state.texts.subtitle.toUpperCase(), marginL, blockTop + titleLineH + blockGap + subFont * 0.78);

  // Línea divisoria vertical, fija en Café Espresso
  const dividerW = Math.max(1, 2 * uScale);
  ctx.fillStyle = COLORS.espresso;
  ctx.fillRect(colSplit1 - dividerW / 2, y1 + 6 * uScale, dividerW, h1 - 14 * uScale);

  // Columna central — precio
  ctx.fillStyle = state.ribbonColor;
  ctx.fillRect(colSplit1, y1, colSplit2 - colSplit1, h1);
  ctx.fillStyle = ribbonInk;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const gapSubPrice = 24 * uScale; // aire lateral del precio frente a la columna de nombre/colección
  const priceMaxWidth = (colSplit2 - colSplit1) - gapSubPrice;
  const priceFont = getFittedFontSize(ctx, state.texts.price, priceMaxWidth, 50 * uScale, 500, "'DM Mono', monospace");
  ctx.font = `500 ${Math.round(priceFont)}px 'DM Mono', monospace`;
  // Centrado vertical dentro de la altura útil de la banda: nunca toca bordes.
  ctx.fillText(state.texts.price, (colSplit1 + colSplit2) / 2, y1 + h1 / 2);

  // Columna derecha — envíos, hasta 3 líneas centradas. Con las bandas ya
  // dimensionadas con uScale, 26*uScale siempre cabe en 3 líneas sin recorte.
  ctx.fillStyle = COLORS.cuero;
  ctx.fillRect(colSplit2, y1, W - colSplit2, h1);
  ctx.fillStyle = COLORS.marfil;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const rightFont = 26 * uScale;
  ctx.font = `400 ${Math.round(rightFont)}px 'DM Mono', monospace`;
  const rightMargin = 28 * uScale;
  const rightLines = wrapText(ctx, state.texts.secondary, (W - colSplit2) - rightMargin * 2);
  const rightLineH = rightFont * 1.3;
  const rightStartY = y1 + h1 / 2 - ((rightLines.length - 1) * rightLineH) / 2;
  rightLines.slice(0, 3).forEach((ln, i) => {
    ctx.fillText(ln, colSplit2 + rightMargin, rightStartY + i * rightLineH);
  });

  // ---- Nivel 2 · Cinta Web Naranja ----
  ctx.fillStyle = COLORS.naranja;
  ctx.fillRect(0, y2, W, h2);
  ctx.fillStyle = COLORS.marfil;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const webFont = 48 * uScale;
  ctx.font = `500 ${Math.round(webFont)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.web, 44 * uScale, y2 + h2 / 2);

  // ---- Nivel 3 · Remate de fotografía y pie de autor ----
  const footerAreaY = y2 + h2;
  const footerAreaH = H - footerAreaY; // == bottomMargin
  const footerFont = Math.min(23 * uScale, (footerAreaH * 0.85) / 2.5);
  const footerLineH = footerFont * 1.3;
  const footerCenterY = footerAreaY + footerAreaH / 2;
  ctx.save();
  ctx.fillStyle = COLORS.marfil;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic 400 ${Math.round(footerFont)}px 'DM Mono', monospace`;
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 6 * uScale;
  ctx.fillText('Slow-Handcrafted', W / 2, footerCenterY - footerLineH / 2);
  ctx.fillText('Leather Pieces', W / 2, footerCenterY + footerLineH / 2);
  ctx.restore();

  // ---- Pestaña superior derecha (logo/ícono), proporción fija vía uScale ----
  const tabW = 117 * uScale;
  const tabH = 182 * uScale;
  const tabMarginR = 63 * uScale;
  const tabX = W - tabMarginR - tabW;
  const tabRadius = 58 * uScale;
  const tabBg = state.logoColor;
  const tabInk = inkFor(tabBg);

  ctx.save();
  roundRectBottomOnly(ctx, tabX, 0, tabW, tabH, tabRadius);
  ctx.fillStyle = tabBg;
  ctx.fill();
  ctx.clip();
  const bikeImg = imageCache.get('icon-bici-line.svg');
  if (bikeImg) {
    const tinted = getTintedImage('icon-bici-line.svg', bikeImg, tabInk);
    drawImageContain(ctx, tinted, tabX + tabW / 2, tabH / 2, tabW * 0.66, tabH * 0.4);
  }
  ctx.restore();
}

function renderTemplateB(ctx, W, H) {
  const bg = state.themeColor;
  const ink = inkFor(bg);
  const titleFactor = state.titleFontSizePt / 30;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const logoW = W * 0.34;
  drawLogoVariant(ctx, state.logoVariant, state.logoColor, W / 2, H * 0.1, logoW, H * 0.08);

  ctx.fillStyle = ink;
  ctx.textAlign = 'center';

  const showPhoto = state.photo.showInB && state.photo.img;
  const centerY = H * 0.5;

  if (showPhoto) {
    const smallFont = getFittedFontSize(ctx, state.texts.title, W * 0.7, W * 0.028 * titleFactor, 400, "'Ancizar Serif', Georgia, serif");
    ctx.font = `400 ${Math.round(smallFont)}px 'Ancizar Serif', Georgia, serif`;
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
    const maxFont = W * 0.075 * titleFactor;
    const minFont = W * 0.035 * titleFactor;
    let fontSize = maxFont;
    let lines = [];
    ctx.textBaseline = 'middle';
    for (fontSize = maxFont; fontSize >= minFont; fontSize -= 2) {
      ctx.font = `700 ${Math.round(fontSize)}px 'Ancizar Serif', Georgia, serif`;
      lines = wrapText(ctx, state.texts.title, maxWidth);
      const blockH = lines.length * fontSize * 1.15;
      if (blockH <= H * 0.32 && lines.length <= 4) break;
    }
    // Resguardo final: si incluso en minFont alguna línea excede el ancho
    // (palabra única muy larga), recorta sin deformar glifos.
    lines.forEach((ln) => {
      const fitted = getFittedFontSize(ctx, ln, maxWidth, fontSize, 700, "'Ancizar Serif', Georgia, serif");
      fontSize = Math.min(fontSize, fitted);
    });
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
  const uScale = Math.min(W, H) / 1080;

  // Left — typographic column
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, colW, H);

  const pad = colW * 0.09;
  let cursorY = H * 0.12;

  drawLogoVariant(ctx, state.logoVariant, state.logoColor, pad, cursorY, colW * 0.6, H * 0.09, 'left');
  cursorY += H * 0.14;

  ctx.fillStyle = ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const titleFactor = state.titleFontSizePt / 30;
  const titleMaxWidth = colW - pad * 2;
  let titleFont = colW * 0.11 * titleFactor;
  ctx.font = `700 ${Math.round(titleFont)}px 'Ancizar Serif', Georgia, serif`;
  let titleLines = wrapText(ctx, state.texts.title, titleMaxWidth);
  // Si alguna línea sigue excediendo el ancho (p. ej. una palabra larga que
  // no se puede partir), reduce sin deformar hasta que todas quepan.
  while (titleLines.some((ln) => ctx.measureText(ln).width > titleMaxWidth) && titleFont > 10) {
    titleFont -= 1;
    ctx.font = `700 ${Math.round(titleFont)}px 'Ancizar Serif', Georgia, serif`;
    titleLines = wrapText(ctx, state.texts.title, titleMaxWidth);
  }
  const titleLineH = titleFont * 1.14;
  titleLines.slice(0, 3).forEach((ln, i) => {
    cursorY += titleLineH;
    ctx.fillText(ln, pad, cursorY);
  });

  // Despeje natural bajo el título (descendentes/interlineado) + el aire
  // extra pedido, para que nunca se monte sobre el subtítulo.
  cursorY += titleLineH * 0.55 + 28 * uScale;
  const subFontC = colW * 0.052;
  ctx.font = `500 ${Math.round(subFontC)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.subtitle.toUpperCase(), pad, cursorY);
  cursorY += subFontC * 0.9 + 24 * uScale;
  const priceFontC = 54 * uScale;
  ctx.font = `500 ${Math.round(priceFontC)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.price, pad, cursorY);

  ctx.font = `400 ${Math.round(colW * 0.04)}px 'DM Mono', monospace`;
  ctx.fillText(state.texts.secondary, pad, H - H * 0.07);

  // Right — photo column
  drawPhotoCover(ctx, state.photo.img, colW, 0, W - colW, H, state.photo.zoom, state.photo.offsetX, state.photo.offsetY);
}

function renderTemplateD(ctx, W, H) {
  const bg = state.bgColorD;
  const ink = inkFor(bg);
  const uScale = Math.min(W, H) / 1080;
  const sizeRatio = (state.titleFontSizePt || 30) / 30;
  const isWide = W > H;
  const fontFamilySerif = "'Ancizar Serif', Georgia, serif";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Titular — en horizontal, reorganiza la frase por defecto en 2 líneas más
  // panorámicas; si el usuario escribió su propio texto, se respetan sus
  // saltos de línea manuales siempre.
  const isDefaultHeadline = state.texts.headlineD === 'La vida\nen Bici\nrueda\nmejor';
  let lines = state.texts.headlineD.split('\n').filter((l) => l.length > 0);
  if (isWide && isDefaultHeadline) {
    lines = ['La vida en Bici', 'rueda mejor'];
  }

  // Ancho máximo del titular: más panorámico en horizontal.
  const maxLineWidth = W * (isWide ? 0.68 : 0.78);
  let headlineFont0 = (isWide ? 96 : 124) * uScale * sizeRatio;
  lines.forEach((ln) => {
    const fitted = getFittedFontSize(ctx, ln, maxLineWidth, headlineFont0, 700, fontFamilySerif);
    headlineFont0 = Math.min(headlineFont0, fitted);
  });

  // ---- Alturas nominales de cada bloque, antes del reajuste de grupo ----
  const iconH0 = 96 * uScale;
  const subFont0 = 24 * uScale;
  const badgeW0 = 150 * uScale;
  const sealImg = imageCache.get('badge-bictr-2005.svg');
  const sealAspect = sealImg ? (sealImg.naturalHeight || sealImg.height) / (sealImg.naturalWidth || sealImg.width) : 1;
  const badgeH0 = badgeW0 * sealAspect;

  const gap1_0 = 44 * uScale; // isotipo → titular
  const gap2_0 = 42 * uScale; // titular → subtítulo
  const gap3_0 = 36 * uScale; // subtítulo → badge

  const headlineLineH0 = headlineFont0 * 1.08;
  const titleBlockH0 = lines.length * headlineLineH0;
  const subLineH0 = subFont0 * 1.3;
  const subtitleBlockH0 = 2 * subLineH0;

  const totalContentHeight0 = iconH0 + gap1_0 + titleBlockH0 + gap2_0 + subtitleBlockH0 + gap3_0 + badgeH0;
  const maxAllowedH = H * 0.86;
  const fitScale = totalContentHeight0 > maxAllowedH ? maxAllowedH / totalContentHeight0 : 1;

  const iconH = iconH0 * fitScale;
  const headlineFont = headlineFont0 * fitScale;
  const headlineLineH = headlineFont * 1.08;
  const titleBlockH = lines.length * headlineLineH;
  const subFont = subFont0 * fitScale;
  const subLineH = subFont * 1.3;
  const subtitleBlockH = 2 * subLineH;
  const badgeW = badgeW0 * fitScale;
  const badgeH = badgeH0 * fitScale;
  const gap1 = gap1_0 * fitScale;
  const gap2 = gap2_0 * fitScale;
  const gap3 = gap3_0 * fitScale;

  const totalContentHeight = iconH + gap1 + titleBlockH + gap2 + subtitleBlockH + gap3 + badgeH;

  // Centrado del conjunto alrededor de H * 0.5, orden secuencial descendente:
  // isotipo → titular → subtítulo → sello.
  let cursorY = H * 0.5 - totalContentHeight / 2;
  const emblemCenterY = cursorY + iconH / 2;
  cursorY += iconH + gap1;
  const headlineStartY = cursorY + headlineLineH / 2;
  cursorY += titleBlockH + gap2;
  const subtitleStartY = cursorY + subLineH / 2;
  cursorY += subtitleBlockH + gap3;
  const sealCenterY = cursorY + badgeH / 2;

  // Emblema circular superior (isotipo de bicicleta a ~56% del diámetro)
  drawCircularBikeIsotype(ctx, ink, W / 2, emblemCenterY, iconH, 0.56);

  // Titular central
  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.round(headlineFont)}px ${fontFamilySerif}`;
  lines.forEach((ln, i) => ctx.fillText(ln, W / 2, headlineStartY + i * headlineLineH));
  ctx.restore();

  // Subtítulo en dos líneas, Marfil Base.
  ctx.save();
  ctx.fillStyle = COLORS.marfil;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `400 ${Math.round(subFont)}px 'DM Mono', monospace`;
  ['Slow-Handcrafted', 'Leather Pieces'].forEach((ln, i) => {
    ctx.fillText(ln, W / 2, subtitleStartY + i * subLineH);
  });
  ctx.restore();

  // Sello vertical clásico inferior (arte real, teñido a la tinta de contraste).
  if (sealImg) {
    const tinted = getTintedImage('badge-bictr-2005.svg', sealImg, ink);
    drawImageContain(ctx, tinted, W / 2, sealCenterY, badgeW, badgeH);
  }
}

function renderTemplateE(ctx, W, H) {
  const uScale = Math.min(W, H) / 1080;
  const fontFamilySerif = "'Ancizar Serif', Georgia, serif";
  const fontFamilyMono = "'DM Mono', monospace";

  // ---- Fondo / fotografía plena ----
  drawPhotoCover(ctx, state.photo.img, 0, 0, W, H, state.photo.zoom, state.photo.offsetX, state.photo.offsetY, state.bgColorE);

  // ---- Esquina superior izquierda: isotipo circular ----
  const iconSize = 88 * uScale;
  const marginTL = 34 * uScale;
  drawCircularBikeIsotype(ctx, COLORS.espresso, marginTL + iconSize / 2, marginTL + iconSize / 2, iconSize, 0.58);

  // ---- Esquina superior derecha: crédito editorial (2 líneas) ----
  const marginTR = 34 * uScale;
  ctx.save();
  ctx.textAlign = 'right';
  ctx.fillStyle = COLORS.marfil;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 5 * uScale;

  const creditFont1 = 24 * uScale;
  const creditFont2 = 22 * uScale;
  const creditGap = creditFont1 * 0.9;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `italic 400 ${Math.round(creditFont1)}px ${fontFamilySerif}`;
  ctx.fillText(state.texts.creditLine1, W - marginTR, marginTR + creditFont1 * 0.85);
  ctx.font = `500 ${Math.round(creditFont2)}px ${fontFamilyMono}`;
  ctx.fillText(state.texts.creditLine2, W - marginTR, marginTR + creditFont1 * 0.85 + creditGap);
  ctx.restore();

  // ---- Parte inferior: párrafo editorial justificado, con degradado de
  // contraste y garantía de que se vea íntegro (nunca cortado a medias). ----
  if (state.texts.editorialEn) {
    const paraMarginSide = 36 * uScale;
    const paraMarginBottom = 36 * uScale;
    const paraBoxWidth = W - paraMarginSide * 2;
    const maxParaBlockHeight = H * 0.45;
    ctx.font = `400 ${Math.round(26 * uScale)}px ${fontFamilyMono}`;
    const fit = fitJustifiedBlock(ctx, state.texts.editorialEn, paraBoxWidth, 26 * uScale, 1.35, maxParaBlockHeight, 400, fontFamilyMono);

    const gradientHeight = Math.min(H, fit.blockHeight + paraMarginBottom * 2.2);
    const gradY = H - gradientHeight;
    const grad = ctx.createLinearGradient(0, gradY, 0, H);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(0, gradY, W, gradientHeight);
    ctx.restore();

    ctx.save();
    ctx.font = `400 ${Math.round(fit.fontSize)}px ${fontFamilyMono}`;
    ctx.fillStyle = COLORS.marfil;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 6 * uScale;
    const startY = H - paraMarginBottom - fit.blockHeight + fit.fontSize * 0.85;
    drawJustifiedText(ctx, state.texts.editorialEn, paraMarginSide, startY, paraBoxWidth, fit.lineHeight, true);
    ctx.restore();
  }
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
  else if (state.template === 'C') renderTemplateC(ctx, fmt.w, fmt.h);
  else if (state.template === 'D') renderTemplateD(ctx, fmt.w, fmt.h);
  else renderTemplateE(ctx, fmt.w, fmt.h);

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
   Canvas pointer interaction (drag / rotate / scale / select / remove)
   --------------------------------------------------------- */

let dragState = null; // { type: 'move'|'rotate'|'scale', uid, ... }

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
      if (selected) {
        if (isPointInDeleteBtn(selected, fmt.w, fmt.h, p.x, p.y)) {
          removeBadge(selected.uid);
          return;
        }
        if (isPointInRotateHandle(selected, fmt.w, fmt.h, p.x, p.y)) {
          dragState = { type: 'rotate', uid: selected.uid };
          canvas.style.cursor = 'grabbing';
          return;
        }
        if (isPointInScaleHandle(selected, fmt.w, fmt.h, p.x, p.y)) {
          const dist0 = Math.max(1, Math.hypot(p.x - selected.x, p.y - selected.y));
          dragState = { type: 'scale', uid: selected.uid, startDist: dist0, startScale: selected.scale };
          canvas.style.cursor = 'nwse-resize';
          return;
        }
      }
    }

    const hit = hitTestBadges(p.x, p.y, fmt);
    if (hit) {
      state.selectedBadgeUid = hit.uid;
      syncBadgeInspector();
      dragState = { type: 'move', uid: hit.uid, dx: p.x - hit.x, dy: p.y - hit.y };
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
      if (!inst) return;

      if (dragState.type === 'move') {
        inst.x = p.x - dragState.dx;
        inst.y = p.y - dragState.dy;
      } else if (dragState.type === 'rotate') {
        const angleRad = Math.atan2(p.y - inst.y, p.x - inst.x) + Math.PI / 2;
        let deg = (angleRad * 180) / Math.PI;
        deg = Math.max(-45, Math.min(45, deg));
        inst.rotation = Math.round(deg);
        syncBadgeInspector();
      } else if (dragState.type === 'scale') {
        const dist = Math.hypot(p.x - inst.x, p.y - inst.y);
        const ratio = dist / dragState.startDist;
        inst.scale = Math.round(Math.max(50, Math.min(200, dragState.startScale * ratio)));
        syncBadgeInspector();
      }
      scheduleRedraw();
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
  document.getElementById('field-web').classList.toggle('is-hidden', state.template !== 'A');
  document.getElementById('field-editorial-en').classList.toggle('is-hidden', !(state.template === 'A' || state.template === 'E'));
  document.getElementById('field-show-editorial-en').classList.toggle('is-hidden', state.template !== 'A');
  document.getElementById('field-editorial-horizontal-position').classList.toggle('is-hidden', state.template !== 'A');
  document.getElementById('field-bg-color-d').classList.toggle('is-hidden', state.template !== 'D');
  document.getElementById('field-bg-color-e').classList.toggle('is-hidden', state.template !== 'E');
  document.getElementById('field-credit-lines').classList.toggle('is-hidden', state.template !== 'E');
  document.getElementById('field-headline-d').classList.toggle('is-hidden', state.template !== 'D');
  document.getElementById('field-logo-variant').classList.toggle('is-hidden', !(state.template === 'B' || state.template === 'C'));
  document.getElementById('field-logo-color').classList.toggle('is-hidden', state.template === 'D' || state.template === 'E');
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

function syncEditorialToggle(btn) {
  const on = state.showEditorialEn;
  btn.classList.toggle('is-on', on);
  btn.setAttribute('aria-pressed', String(on));
  btn.querySelector('.toggle-onoff-state').textContent = on ? '[ ON ]' : '[ OFF ]';
}

function buildTextControls() {
  const title = document.getElementById('ctl-title');
  const subtitle = document.getElementById('ctl-subtitle');
  const price = document.getElementById('ctl-price');
  const secondary = document.getElementById('ctl-secondary');
  const web = document.getElementById('ctl-web');
  const headlineD = document.getElementById('ctl-headline-d');

  title.value = state.texts.title;
  subtitle.value = state.texts.subtitle;
  price.value = state.texts.price;
  secondary.value = state.texts.secondary;
  web.value = state.texts.web;
  headlineD.value = state.texts.headlineD;

  title.addEventListener('input', () => { state.texts.title = title.value; scheduleRedraw(); });
  subtitle.addEventListener('input', () => { state.texts.subtitle = subtitle.value; scheduleRedraw(); });
  price.addEventListener('input', () => { state.texts.price = price.value; scheduleRedraw(); });
  secondary.addEventListener('input', () => { state.texts.secondary = secondary.value; scheduleRedraw(); });
  web.addEventListener('input', () => { state.texts.web = web.value; scheduleRedraw(); });
  headlineD.addEventListener('input', () => { state.texts.headlineD = headlineD.value; scheduleRedraw(); });

  const editorialSelect = document.getElementById('editorialParagraphSelect');
  const editorialInput = document.getElementById('editorialParagraphInput');
  const editorialShuffle = document.getElementById('ctl-editorial-shuffle');
  const showEditorialToggle = document.getElementById('ctl-show-editorial-en');

  ENGLISH_EDITORIAL_PARAGRAPHS.forEach((paragraph, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `${i + 1}. ${paragraph.slice(0, 48)}…`;
    editorialSelect.appendChild(opt);
  });
  const initialEditorialIndex = ENGLISH_EDITORIAL_PARAGRAPHS.indexOf(state.texts.editorialEn);
  editorialSelect.value = String(initialEditorialIndex >= 0 ? initialEditorialIndex : 1);
  editorialInput.value = state.texts.editorialEn;
  syncEditorialToggle(showEditorialToggle);

  editorialSelect.addEventListener('change', () => {
    const paragraph = ENGLISH_EDITORIAL_PARAGRAPHS[Number(editorialSelect.value)];
    state.texts.editorialEn = paragraph;
    editorialInput.value = paragraph;
    scheduleRedraw();
  });
  editorialInput.addEventListener('input', () => {
    state.texts.editorialEn = editorialInput.value;
    scheduleRedraw();
  });
  editorialShuffle.addEventListener('click', () => {
    const current = Number(editorialSelect.value) || 0;
    const next = (current + 1) % ENGLISH_EDITORIAL_PARAGRAPHS.length;
    const paragraph = ENGLISH_EDITORIAL_PARAGRAPHS[next];
    state.texts.editorialEn = paragraph;
    editorialSelect.value = String(next);
    editorialInput.value = paragraph;
    scheduleRedraw();
  });
  showEditorialToggle.addEventListener('click', () => {
    state.showEditorialEn = !state.showEditorialEn;
    syncEditorialToggle(showEditorialToggle);
    scheduleRedraw();
  });

  const creditLine1 = document.getElementById('ctl-credit-line1');
  const creditLine2 = document.getElementById('ctl-credit-line2');
  creditLine1.value = state.texts.creditLine1;
  creditLine2.value = state.texts.creditLine2;
  creditLine1.addEventListener('input', () => { state.texts.creditLine1 = creditLine1.value; scheduleRedraw(); });
  creditLine2.addEventListener('input', () => { state.texts.creditLine2 = creditLine2.value; scheduleRedraw(); });

  const editorialPositionWrap = document.getElementById('ctl-editorial-horizontal-position');
  editorialPositionWrap.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.editorialHorizontalPosition = btn.dataset.position;
      editorialPositionWrap.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
      scheduleRedraw();
    });
  });

  const titleSizeSlider = document.getElementById('titleSizeSlider');
  const outTitleSize = document.getElementById('out-title-size');
  const titleSizeReset = document.getElementById('ctl-title-size-reset');

  titleSizeSlider.value = state.titleFontSizePt;
  outTitleSize.textContent = `${state.titleFontSizePt} pt`;

  titleSizeSlider.addEventListener('input', () => {
    state.titleFontSizePt = Number(titleSizeSlider.value);
    outTitleSize.textContent = `${titleSizeSlider.value} pt`;
    scheduleRedraw();
  });
  titleSizeReset.addEventListener('click', () => {
    state.titleFontSizePt = 30;
    titleSizeSlider.value = 30;
    outTitleSize.textContent = '30 pt';
    scheduleRedraw();
  });

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
    btn.dataset.hex = sw.hex;
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

function syncSwatchActive(containerId, hexValue) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.querySelectorAll('.swatch').forEach((b) => b.classList.toggle('active', b.dataset.hex === hexValue));
}

function buildColorControls() {
  buildSwatchPicker(
    'ctl-colors',
    () => state.themeColor,
    (hex) => { state.themeColor = hex; },
    () => {
      state.logoColor = inkFor(state.themeColor);
      syncSwatchActive('ctl-logo-colors', state.logoColor);
    }
  );
  buildSwatchPicker(
    'ctl-ribbon-colors',
    () => state.ribbonColor,
    (hex) => { state.ribbonColor = hex; }
  );
  buildSwatchPicker(
    'ctl-logo-colors',
    () => state.logoColor,
    (hex) => { state.logoColor = hex; }
  );
  buildSwatchPicker(
    'ctl-bg-color-d',
    () => state.bgColorD,
    (hex) => { state.bgColorD = hex; }
  );
  buildSwatchPicker(
    'ctl-bg-color-e',
    () => state.bgColorE,
    (hex) => { state.bgColorE = hex; }
  );
}

function buildLogoVariantControl() {
  const sel = document.getElementById('ctl-logo-variant');
  sel.innerHTML = '';
  Object.entries(LOGO_VARIANTS).forEach(([key, v]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = v.label;
    sel.appendChild(opt);
  });
  sel.value = state.logoVariant;
  sel.addEventListener('change', () => {
    state.logoVariant = sel.value;
    scheduleRedraw();
  });
}

function buildBadgeGrid() {
  const wrap = document.getElementById('ctl-badges');
  BADGES.forEach((b) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'badge-item';
    const img = document.createElement('img');
    img.src = `./assets/${b.file}`;
    img.alt = b.label;
    img.loading = 'lazy';
    if (b.fallbackFile) {
      img.addEventListener('error', function onImgError() {
        img.removeEventListener('error', onImgError);
        img.src = `./assets/${b.fallbackFile}`;
      });
    }
    const span = document.createElement('span');
    span.textContent = b.label;
    item.appendChild(img);
    item.appendChild(span);
    item.title = 'Añadir al centro del lienzo';
    item.addEventListener('click', () => addBadgeInstance(b.id));
    wrap.appendChild(item);
  });

  const backdropWrap = document.getElementById('ctl-badge-backdrop');
  const scaleInput = document.getElementById('ctl-badge-scale');
  const rotInput = document.getElementById('ctl-badge-rotation');
  const outScale = document.getElementById('out-badge-scale');
  const outRot = document.getElementById('out-badge-rotation');
  const removeBtn = document.getElementById('ctl-badge-remove');

  backdropWrap.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const inst = state.badges.find((bd) => bd.uid === state.selectedBadgeUid);
      if (!inst) return;
      inst.backdrop = btn.dataset.backdrop === 'yes';
      syncBadgeInspector();
      scheduleRedraw();
    });
  });

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
  const backdropWrap = document.getElementById('ctl-badge-backdrop');

  if (inst) {
    inspector.classList.remove('is-hidden');
    scaleInput.value = inst.scale;
    rotInput.value = inst.rotation;
    outScale.textContent = `${inst.scale}%`;
    outRot.textContent = `${inst.rotation}°`;
    backdropWrap.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('active', (b.dataset.backdrop === 'yes') === !!inst.backdrop);
    });
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

    // Ocultar temporalmente la selección para que el borde guía, los
    // manejadores y el botón ✕ nunca aparezcan en el PNG exportado.
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
   Centro de Recursos — modal de exportación y motor de empaquetado
   --------------------------------------------------------- */

// Variantes de marca base que se tiñen y empaquetan en el .zip.
const EXPORT_PACK_FILES = ['logo-bictoria-dark.svg', 'tab-bici.svg', 'badge-bictr-2005.svg'];

const exportModalState = {
  color: COLORS.espresso,
  format: 'png',
};

// Fuerza una descarga fresca del PDF del manual, evitando que el navegador o
// GitHub Pages sirvan una copia antigua desde caché cuando el archivo se
// sobrescribe con el mismo nombre.
async function downloadBrandManual(e) {
  e.preventDefault();
  const url = `./assets/Bictoria%20Brand.pdf?v=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const pdfBlob = blob.type === 'application/pdf' ? blob : blob.slice(0, blob.size, 'application/pdf');
    const objectUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = 'Bictoria Brand.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
  } catch (err) {
    // Entorno local vía file:// u otra restricción de red: cae a la
    // descarga directa normal del enlace.
    console.warn('No se pudo forzar la descarga fresca del manual, usando enlace directo:', err);
    const a = document.createElement('a');
    a.href = './assets/Bictoria%20Brand.pdf';
    a.download = 'Bictoria Brand.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

function openExportModal() {
  document.getElementById('export-modal').classList.remove('is-hidden');
}
function closeExportModal() {
  document.getElementById('export-modal').classList.add('is-hidden');
}

// Tiñe el SVG fuente al color elegido, cubriendo tanto fills/strokes en línea
// como el patrón real de nuestros assets (clase CSS .cls-1 { fill:#hex } en
// un <style> dentro del <defs>). Devuelve el SVG serializado de vuelta.
function tintSvgSource(svgText, colorHex) {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');

  // Caso real de nuestros assets: color definido vía clase CSS en <style>.
  doc.querySelectorAll('style').forEach((styleEl) => {
    styleEl.textContent = styleEl.textContent.replace(/fill\s*:\s*#[0-9a-fA-F]{3,8}/gi, `fill: ${colorHex}`);
  });

  // Caso genérico: elementos con fill/stroke en línea (para cualquier otro
  // logotipo que no use el patrón de clase CSS).
  doc.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, line').forEach((el) => {
    const fill = el.getAttribute('fill');
    if (fill && fill.toLowerCase() !== 'none') el.setAttribute('fill', colorHex);
    const stroke = el.getAttribute('stroke');
    if (stroke && stroke.toLowerCase() !== 'none') el.setAttribute('stroke', colorHex);
  });

  return new XMLSerializer().serializeToString(doc);
}

// Rasteriza un SVG ya teñido a un canvas offscreen de alta resolución y
// devuelve su dataURL PNG.
async function rasterizeSvgToPNG(svgText, targetW) {
  const blob = new Blob([svgText], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImageFromURL(url);
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const targetH = Math.round(targetW * (ih / iw));
    const off = document.createElement('canvas');
    off.width = targetW;
    off.height = targetH;
    const octx = off.getContext('2d');
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(img, 0, 0, targetW, targetH);
    return { dataURL: off.toDataURL('image/png', 1.0), w: targetW, h: targetH };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function generateLogoPack() {
  const btn = document.getElementById('export-modal-generate');
  const originalText = btn.textContent;
  btn.textContent = 'Procesando... ⏳';
  btn.disabled = true;

  try {
    const zip = new JSZip();
    const color = exportModalState.color;
    const format = exportModalState.format;

    for (const file of EXPORT_PACK_FILES) {
      const res = await fetch(`./assets/${file}`);
      if (!res.ok) continue;
      const rawSvg = await res.text();
      const svgText = tintSvgSource(rawSvg, color);
      const baseName = `Bictoria-${file.replace(/\.svg$/i, '')}`;

      if (format === 'svg') {
        zip.file(`${baseName}.svg`, svgText);
      } else {
        const { dataURL, w, h } = await rasterizeSvgToPNG(svgText, 2500);
        if (format === 'png') {
          const base64Data = dataURL.split(',')[1];
          zip.file(`${baseName}.png`, base64Data, { base64: true });
        } else if (format === 'pdf') {
          const { jsPDF } = window.jspdf;
          const pdfDoc = new jsPDF({
            orientation: w >= h ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [w, h],
          });
          pdfDoc.addImage(dataURL, 'PNG', 0, 0, w, h);
          zip.file(`${baseName}.pdf`, pdfDoc.output('blob'));
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(content);
    a.href = url;
    a.download = `Bictoria-Logos-${color.replace('#', '')}-${format.toUpperCase()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeExportModal();
  } catch (err) {
    console.error('Error generando el pack de logotipos:', err);
    alert('Ocurrió un error generando el pack de logotipos. Intenta de nuevo.');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

function buildResourceCenter() {
  // Blindaje: si algún ID cambió o falta en el HTML, usar encadenamiento
  // opcional evita un TypeError que detendría boot() antes del primer render.
  document.getElementById('ctl-download-manual')?.addEventListener('click', downloadBrandManual);
  document.getElementById('ctl-open-export-modal')?.addEventListener('click', openExportModal);
  document.getElementById('export-modal-close')?.addEventListener('click', closeExportModal);
  document.getElementById('export-modal-overlay')?.addEventListener('click', closeExportModal);

  const colorsWrap = document.getElementById('export-modal-colors');
  if (colorsWrap) {
    SWATCHES.forEach((sw) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch';
      btn.style.background = sw.hex;
      btn.title = sw.label;
      btn.dataset.hex = sw.hex;
      btn.setAttribute('aria-label', sw.label);
      if (sw.hex === exportModalState.color) btn.classList.add('active');
      btn.addEventListener('click', () => {
        exportModalState.color = sw.hex;
        colorsWrap.querySelectorAll('.swatch').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      colorsWrap.appendChild(btn);
    });
  }

  const formatsWrap = document.getElementById('export-modal-formats');
  if (formatsWrap) {
    formatsWrap.querySelectorAll('.vastago-export-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        exportModalState.format = btn.dataset.format;
        formatsWrap.querySelectorAll('.vastago-export-pill').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  document.getElementById('export-modal-generate')?.addEventListener('click', generateLogoPack);
}

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */

async function boot() {
  // Blindaje de arranque: pase lo que pase (un elemento del DOM faltante,
  // un asset que nunca cargue, una fuente que nunca resuelva), el canvas
  // SIEMPRE debe salir del estado "Cargando…" — por eso assetsReady se
  // fuerza a true y se vuelve a dibujar en el finally, sin excepción.
  try {
    buildFormatSelect();
    buildTemplateSelector();
    buildPhotoControls();
    buildTextControls();
    buildColorControls();
    buildLogoVariantControl();
    buildBadgeGrid();
    buildCanvasInteraction();
    buildExport();
    buildResourceCenter();
    applyTemplateLabels();

    redraw(); // show "Cargando…" placeholder immediately

    // Límite de tiempo global de respaldo: si fuentes/assets tardan
    // demasiado o alguna promesa queda colgada, no bloquear el arranque
    // más de 6s.
    await Promise.race([
      Promise.all([waitForFonts(), preloadAllAssets()]),
      new Promise((resolve) => setTimeout(resolve, 6000)),
    ]);
  } catch (err) {
    console.error('Error en boot():', err);
  } finally {
    assetsReady = true;
    redraw();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

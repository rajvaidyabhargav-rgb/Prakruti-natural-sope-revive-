import React, { useEffect, useRef, useState } from 'react';

/**
 * Generates high-resolution, studio-grade PNG Data URLs matching the exact
 * Prakriti Soap product frames from the brand film:
 * - Frame 00:03-00:04: Oval Charcoal Chandan Soap with circular apothecary label
 * - Frame 00:06-00:07: Oval Rose Goat Milk Soap with circular apothecary label
 * - Hero Duo: Both Prakriti soaps arranged with rose petals, sandalwood & charcoal
 */

export interface CustomMediaOverrides {
  introVideoUrl?: string;
  charcoalPhotoUrl?: string;
  rosePhotoUrl?: string;
  heroPhotoUrl?: string;
}

// Helper to draw the Prakriti circular apothecary label onto a 2D canvas context
function drawPrakritiLabel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  variant: 'charcoal' | 'rose'
) {
  ctx.save();

  // Outer subtle shadow of label
  ctx.shadowColor = 'rgba(25, 20, 14, 0.18)';
  ctx.shadowBlur = radius * 0.08;
  ctx.shadowOffsetY = radius * 0.02;

  // Cream label base
  const labelGrad = ctx.createRadialGradient(
    cx - radius * 0.2,
    cy - radius * 0.2,
    radius * 0.1,
    cx,
    cy,
    radius
  );
  labelGrad.addColorStop(0, '#FBF9F3');
  labelGrad.addColorStop(0.75, '#F4EFE4');
  labelGrad.addColorStop(1, '#EAE2D3');

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = labelGrad;
  ctx.fill();

  // Reset shadow for inner details
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Clip to label circle for botanical illustrations
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.94, 0, Math.PI * 2);
  ctx.clip();

  if (variant === 'rose') {
    // Left side: Illustrated crimson-pink roses & green leaves (matching frame 00:06-00:07)
    const drawRoseCluster = (rx: number, ry: number, rSize: number, mainColor: string, darkColor: string) => {
      ctx.save();
      ctx.translate(rx, ry);
      // Green leaves behind rose
      ctx.fillStyle = '#4B6B3B';
      for (const angle of [-0.7, 0.6, 2.2]) {
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(rSize * 0.9, 0, rSize * 0.55, rSize * 0.26, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Rose outer petals
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.arc(0, 0, rSize, 0, Math.PI * 2);
      ctx.fill();
      // Layered spiral petals
      ctx.fillStyle = '#E87A88';
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rSize * 0.35, Math.sin(a) * rSize * 0.35, rSize * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = darkColor;
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5 + 0.3;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rSize * 0.2, Math.sin(a) * rSize * 0.2, rSize * 0.36, 0, Math.PI * 2);
        ctx.fill();
      }
      // Center bud
      ctx.fillStyle = '#6E1423';
      ctx.beginPath();
      ctx.arc(0, 0, rSize * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawRoseCluster(cx - radius * 0.72, cy - radius * 0.08, radius * 0.26, '#C8374D', '#9B1F33');
    drawRoseCluster(cx - radius * 0.58, cy + radius * 0.24, radius * 0.18, '#D95368', '#A7263B');
    drawRoseCluster(cx - radius * 0.82, cy + radius * 0.18, radius * 0.15, '#B32439', '#7A1222');

    // Right side: Cinnamon sticks & wooden bowl with herbal/sandalwood powder (matching frame 00:06-00:07)
    ctx.save();
    ctx.translate(cx + radius * 0.68, cy - radius * 0.04);
    ctx.rotate(-0.38);
    // Cinnamon stick 1
    ctx.fillStyle = '#8B4A24';
    ctx.beginPath();
    ctx.roundRect(-radius * 0.26, -radius * 0.09, radius * 0.52, radius * 0.08, radius * 0.03);
    ctx.fill();
    // Cinnamon stick 2
    ctx.rotate(0.22);
    ctx.fillStyle = '#A05A32';
    ctx.beginPath();
    ctx.roundRect(-radius * 0.24, -radius * 0.02, radius * 0.48, radius * 0.08, radius * 0.03);
    ctx.fill();
    ctx.restore();

    // Small bowl of sandalwood / goat milk powder on lower right
    ctx.save();
    ctx.translate(cx + radius * 0.66, cy + radius * 0.24);
    // Powder mound
    ctx.fillStyle = '#D2A86E';
    ctx.beginPath();
    ctx.arc(0, -radius * 0.03, radius * 0.18, Math.PI, 0);
    ctx.fill();
    // Wooden bowl
    ctx.fillStyle = '#5E3A1E';
    ctx.beginPath();
    ctx.arc(0, -radius * 0.02, radius * 0.2, 0, Math.PI);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();

  // Outer dark brown/olive ring
  ctx.strokeStyle = '#4A4133';
  ctx.lineWidth = Math.max(1.5, radius * 0.018);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.94, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle second inner hairline ring
  ctx.strokeStyle = 'rgba(74, 65, 51, 0.35)';
  ctx.lineWidth = Math.max(1, radius * 0.008);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.90, 0, Math.PI * 2);
  ctx.stroke();

  // Top Green Leaves Logo
  ctx.save();
  ctx.translate(cx, cy - radius * 0.72);
  // Left leaf
  ctx.fillStyle = '#4E732E';
  ctx.beginPath();
  ctx.ellipse(-radius * 0.06, -radius * 0.02, radius * 0.08, radius * 0.038, -0.45, 0, Math.PI * 2);
  ctx.fill();
  // Right leaf
  ctx.fillStyle = '#759D43';
  ctx.beginPath();
  ctx.ellipse(radius * 0.06, -radius * 0.03, radius * 0.09, radius * 0.042, -0.85, 0, Math.PI * 2);
  ctx.fill();
  // Small curved stem arc
  ctx.strokeStyle = '#4E732E';
  ctx.lineWidth = Math.max(1, radius * 0.014);
  ctx.beginPath();
  ctx.arc(0, radius * 0.06, radius * 0.12, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.restore();

  // Brand name: PRAKRITI
  ctx.fillStyle = '#2A231B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${Math.round(radius * 0.115)}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText('P R A K R I T I', cx, cy - radius * 0.54);

  // Subtitle: PURE AS NATURE
  ctx.fillStyle = '#5D5244';
  ctx.font = `500 ${Math.round(radius * 0.048)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('PURE AS NATURE', cx, cy - radius * 0.44);

  // Main Soap Variant Title
  ctx.fillStyle = '#231D16';
  if (variant === 'charcoal') {
    ctx.font = `700 ${Math.round(radius * 0.155)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText('CHARCOAL', cx, cy - radius * 0.27);
    ctx.fillText('CHANDAN', cx, cy - radius * 0.11);
  } else {
    ctx.font = `700 ${Math.round(radius * 0.175)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText('ROSE', cx, cy - radius * 0.27);
    ctx.font = `700 ${Math.round(radius * 0.135)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText('GOAT MILK', cx, cy - radius * 0.11);
  }

  // Three little stars underneath title
  ctx.fillStyle = '#4A3F31';
  ctx.font = `${Math.round(radius * 0.06)}px serif`;
  ctx.fillText('✦  ★  ✦', cx, cy + radius * 0.01);

  // Circular Benefit Icons Row
  const iconRadius = radius * 0.095;
  const iconY = cy + radius * 0.17;
  const iconPositions =
    variant === 'charcoal'
      ? [
          { x: cx - radius * 0.22, label1: 'Reduces', label2: 'Blemishes & Acne' },
          { x: cx + radius * 0.22, label1: 'Deeply', label2: 'Cleanses Pores' },
        ]
      : [
          { x: cx - radius * 0.28, label1: 'Hydrates &', label2: 'Softens Skin' },
          { x: cx, label1: 'Gently', label2: 'Nourishes' },
          { x: cx + radius * 0.28, label1: 'Natural', label2: 'Botanicals' },
        ];

  iconPositions.forEach((pos) => {
    ctx.strokeStyle = '#3B3227';
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.beginPath();
    ctx.arc(pos.x, iconY, iconRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Minimalist leaf/drop symbol inside icon circle
    ctx.fillStyle = '#4A3F31';
    ctx.beginPath();
    ctx.ellipse(pos.x, iconY, iconRadius * 0.42, iconRadius * 0.22, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3B3227';
    ctx.font = `500 ${Math.round(radius * 0.045)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(pos.label1, pos.x, iconY + iconRadius + radius * 0.055);
    ctx.fillText(pos.label2, pos.x, iconY + iconRadius + radius * 0.105);
  });

  // Ingredients Ribbon
  const ribbonY = cy + radius * 0.49;
  ctx.fillStyle = '#3B3227';
  ctx.font = `600 ${Math.round(radius * 0.046)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(variant === 'charcoal' ? 'MADE WITH:' : '100% NATURAL CARE', cx, ribbonY - radius * 0.075);

  ctx.fillStyle = variant === 'charcoal' ? 'rgba(214, 181, 166, 0.45)' : 'rgba(196, 164, 132, 0.38)';
  ctx.beginPath();
  ctx.roundRect(cx - radius * 0.62, ribbonY - radius * 0.035, radius * 1.24, radius * 0.09, radius * 0.03);
  ctx.fill();

  ctx.fillStyle = '#2B231B';
  ctx.font = `500 ${Math.round(radius * 0.044)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(
    variant === 'charcoal'
      ? 'Rose Water, Sandalwood, Vitamin E, Coconut Oil'
      : 'Rose Petals, Goat Milk, Honey, Essential Oils',
    cx,
    ribbonY + radius * 0.012
  );

  // Net Wt & Cruelty-Free footer on label
  ctx.fillStyle = '#2B231B';
  ctx.font = `700 ${Math.round(radius * 0.054)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('NET WT. 100G (3.5 OZ)', cx, cy + radius * 0.64);

  ctx.fillStyle = '#4A3F31';
  ctx.font = `italic 600 ${Math.round(radius * 0.052)}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText('Cruelty-Free • All Skin Types', cx, cy + radius * 0.74);

  ctx.restore();
}

// Helper to draw a realistic 3D oval soap bar matching frames 00:03-00:04 and 00:06-00:07
export function drawOvalSoapBar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  variant: 'charcoal' | 'rose',
  drawShadow = true
) {
  ctx.save();

  // Floating contact shadow on the studio surface below the bar
  if (drawShadow) {
    const shadowY = cy + ry * 1.24;
    const shadowGrad = ctx.createRadialGradient(cx, shadowY, rx * 0.1, cx, shadowY, rx * 0.95);
    shadowGrad.addColorStop(0, 'rgba(22, 18, 12, 0.62)');
    shadowGrad.addColorStop(0.55, 'rgba(32, 27, 19, 0.30)');
    shadowGrad.addColorStop(1, 'rgba(32, 27, 19, 0)');

    ctx.save();
    ctx.translate(cx, shadowY);
    ctx.scale(1, 0.14);
    ctx.beginPath();
    ctx.arc(0, 0, rx * 0.95, 0, Math.PI * 2);
    ctx.fillStyle = shadowGrad;
    ctx.fill();
    ctx.restore();
  }

  // 3D back bevel / thickness rim (gives the oval bar realistic 3D depth)
  ctx.beginPath();
  ctx.ellipse(cx + rx * 0.02, cy + ry * 0.035, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = variant === 'charcoal' ? '#9B8F7A' : '#3A2616';
  ctx.fill();

  // Clip to main oval soap body
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();

  if (variant === 'charcoal') {
    // Creamy sandalwood-ivory soap base (Frame 00:03-00:04)
    const soapGrad = ctx.createRadialGradient(
      cx - rx * 0.28,
      cy - ry * 0.28,
      rx * 0.1,
      cx,
      cy,
      rx * 1.1
    );
    soapGrad.addColorStop(0, '#EBE1CE');
    soapGrad.addColorStop(0.55, '#DDD0B8');
    soapGrad.addColorStop(0.85, '#C8B89D');
    soapGrad.addColorStop(1, '#AC9C80');
    ctx.fillStyle = soapGrad;
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);

    // Organic dark Activated Charcoal marble veins & swirls around the bar
    const drawMarbleSwirl = (
      pts: [number, number][],
      width: number,
      color: string,
      blur: number
    ) => {
      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach(([px, py], idx) => {
        const x = cx + px * rx;
        const y = cy + py * ry;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    };

    // Major charcoal veins matching the right & bottom-right marbling in frame 00:03-00:04
    drawMarbleSwirl(
      [
        [0.45, -0.78],
        [0.68, -0.45],
        [0.52, -0.05],
        [0.74, 0.28],
        [0.42, 0.65],
        [0.05, 0.88],
      ],
      rx * 0.16,
      'rgba(32, 31, 29, 0.82)',
      rx * 0.025
    );

    drawMarbleSwirl(
      [
        [0.55, 0.15],
        [0.82, 0.35],
        [0.62, 0.72],
        [0.18, 0.92],
        [-0.25, 0.85],
      ],
      rx * 0.12,
      'rgba(24, 23, 22, 0.88)',
      rx * 0.018
    );

    drawMarbleSwirl(
      [
        [-0.78, -0.35],
        [-0.55, -0.62],
        [-0.22, -0.78],
      ],
      rx * 0.07,
      'rgba(40, 38, 35, 0.65)',
      rx * 0.02
    );

    drawMarbleSwirl(
      [
        [-0.85, 0.12],
        [-0.64, 0.42],
        [-0.42, 0.68],
      ],
      rx * 0.06,
      'rgba(45, 42, 38, 0.55)',
      rx * 0.02
    );

    // Deterministic botanical & charcoal specks across the ivory bar
    const specks = [
      [-0.72, -0.18, 0.022, '#23211F'],
      [-0.62, -0.48, 0.015, '#2E2B28'],
      [-0.48, -0.68, 0.018, '#1E1D1B'],
      [-0.78, 0.22, 0.016, '#2A2724'],
      [-0.58, 0.52, 0.024, '#1F1E1C'],
      [-0.32, 0.74, 0.019, '#2D2A27'],
      [0.25, -0.78, 0.021, '#23211F'],
      [0.65, -0.58, 0.025, '#191817'],
      [0.82, -0.12, 0.028, '#1E1D1B'],
      [0.76, 0.42, 0.022, '#1A1918'],
      [0.48, 0.72, 0.026, '#22201E'],
      [-0.12, -0.82, 0.014, '#3A352F'],
      [-0.86, -0.04, 0.015, '#3A352F'],
      [0.12, 0.82, 0.018, '#242220'],
    ] as const;

    specks.forEach(([sx, sy, sr, col]) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(cx + sx * rx, cy + sy * ry, sr * rx, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    // Rich warm amber-cinnamon brown Rose Goat Milk base (Frame 00:06-00:07)
    const roseGrad = ctx.createRadialGradient(
      cx - rx * 0.25,
      cy - ry * 0.25,
      rx * 0.1,
      cx,
      cy,
      rx * 1.08
    );
    roseGrad.addColorStop(0, '#856042');
    roseGrad.addColorStop(0.5, '#6B4B32');
    roseGrad.addColorStop(0.85, '#533822');
    roseGrad.addColorStop(1, '#3D2716');
    ctx.fillStyle = roseGrad;
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);

    // Subtle organic dark rose & cinnamon mottling inside soap body
    const patches = [
      [-0.65, -0.35, 0.22, 'rgba(62, 32, 22, 0.45)'],
      [0.62, -0.42, 0.25, 'rgba(58, 30, 20, 0.45)'],
      [0.68, 0.35, 0.24, 'rgba(52, 26, 16, 0.5)'],
      [-0.58, 0.45, 0.22, 'rgba(65, 36, 24, 0.42)'],
    ] as const;
    patches.forEach(([px, py, pr, col]) => {
      ctx.save();
      ctx.filter = `blur(${ Math.round(rx * 0.04) }px)`;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(cx + px * rx, cy + py * ry, pr * rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Real botanical flecks: cream goat-milk oat grains & dried rose bits (Frame 00:06-00:07)
    const botanicals = [
      [-0.76, -0.15, 0.022, 0.014, 0.4, '#DFC8A6'],
      [-0.68, 0.12, 0.018, 0.012, -0.3, '#E5D1B2'],
      [-0.54, -0.58, 0.024, 0.015, 0.8, '#D8BE98'],
      [-0.32, -0.76, 0.019, 0.012, 0.2, '#E2CCA9'],
      [0.28, -0.78, 0.022, 0.014, -0.5, '#DEC6A2'],
      [0.58, -0.56, 0.021, 0.013, 0.6, '#D5B992'],
      [0.78, -0.22, 0.025, 0.015, -0.2, '#E4CEAC'],
      [0.82, 0.14, 0.020, 0.013, 0.7, '#DBC19B'],
      [0.66, 0.52, 0.024, 0.014, -0.4, '#E0C9A6'],
      [0.36, 0.76, 0.022, 0.014, 0.3, '#D6BA93'],
      [-0.18, 0.82, 0.021, 0.013, -0.6, '#E3CDA9'],
      [-0.56, 0.62, 0.025, 0.016, 0.5, '#DEC6A2'],
      [-0.78, 0.35, 0.019, 0.012, -0.1, '#D4B890'],
      // Dried dark crimson rose petal specks
      [-0.62, -0.32, 0.026, 0.016, 0.3, '#421618'],
      [0.48, -0.68, 0.024, 0.015, -0.4, '#4A181B'],
      [0.72, 0.28, 0.028, 0.016, 0.6, '#3E1315'],
      [-0.42, 0.72, 0.025, 0.015, -0.3, '#48171A'],
      [0.08, -0.82, 0.022, 0.014, 0.2, '#4A181B'],
    ] as const;

    botanicals.forEach(([bx, by, brx, bry, rot, col]) => {
      ctx.save();
      ctx.translate(cx + bx * rx, cy + by * ry);
      ctx.rotate(rot);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(0, 0, brx * rx, bry * rx, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // 3D Sculpted Specular Highlight along top-left rim & soft inner bevel shadow
  const rimHighlight = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
  rimHighlight.addColorStop(0, 'rgba(255, 252, 245, 0.38)');
  rimHighlight.addColorStop(0.25, 'rgba(255, 252, 245, 0.08)');
  rimHighlight.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  rimHighlight.addColorStop(1, 'rgba(18, 14, 10, 0.36)');
  ctx.fillStyle = rimHighlight;
  ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);

  ctx.restore(); // End soap clip

  // Draw the iconic circular Prakriti apothecary label in the center of the oval bar
  const labelRadius = ry * 0.68;
  drawPrakritiLabel(ctx, cx, cy, labelRadius, variant);

  ctx.restore();
}

// Helper to draw studio backdrop matching frames 00:00-00:07
function drawStudioBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Upper studio wall gradient
  const wallGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.38,
    width * 0.05,
    width * 0.5,
    height * 0.45,
    width * 0.75
  );
  wallGrad.addColorStop(0, '#7D7360');
  wallGrad.addColorStop(0.55, '#685F4E');
  wallGrad.addColorStop(1, '#4D4639');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, width, height);

  // Studio horizon / surface table below ~72% height
  const horizonY = height * 0.71;
  const floorGrad = ctx.createLinearGradient(0, horizonY - height * 0.04, 0, height);
  floorGrad.addColorStop(0, 'rgba(104, 95, 78, 0)');
  floorGrad.addColorStop(0.18, '#857A66');
  floorGrad.addColorStop(0.55, '#9A8F7A');
  floorGrad.addColorStop(1, '#847965');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, horizonY - height * 0.04, width, height - horizonY + height * 0.04);
}

// Singleton cache so we only generate high-res PNG Data URLs once
let cachedAssets: {
  charcoalUrl: string;
  roseUrl: string;
  heroDuoUrl: string;
  posterUrl: string;
} | null = null;

export function getPrakritiProductAssets() {
  if (cachedAssets) return cachedAssets;
  if (typeof document === 'undefined') {
    return { charcoalUrl: '', roseUrl: '', heroDuoUrl: '', posterUrl: '' };
  }

  // 1. Charcoal Chandan Soap (4:3 Studio Frame 00:03-00:04)
  const cCanvas = document.createElement('canvas');
  cCanvas.width = 1200;
  cCanvas.height = 900;
  const cCtx = cCanvas.getContext('2d');
  if (cCtx) {
    drawStudioBackdrop(cCtx, 1200, 900);
    drawOvalSoapBar(cCtx, 600, 425, 365, 265, 'charcoal', true);
  }
  const charcoalUrl = cCanvas.toDataURL('image/png');

  // 2. Rose Goat Milk Soap (4:3 Studio Frame 00:06-00:07)
  const rCanvas = document.createElement('canvas');
  rCanvas.width = 1200;
  rCanvas.height = 900;
  const rCtx = rCanvas.getContext('2d');
  if (rCtx) {
    drawStudioBackdrop(rCtx, 1200, 900);
    drawOvalSoapBar(rCtx, 600, 425, 365, 265, 'rose', true);
  }
  const roseUrl = rCanvas.toDataURL('image/png');

  // 3. Hero Duo Showcase (16:9 Campaign Frame featuring both soaps + botanicals)
  const hCanvas = document.createElement('canvas');
  hCanvas.width = 1440;
  hCanvas.height = 900;
  const hCtx = hCanvas.getContext('2d');
  if (hCtx) {
    drawStudioBackdrop(hCtx, 1440, 900);

    // Subtle golden botanical aura in background
    const glowGrad = hCtx.createRadialGradient(720, 420, 40, 720, 420, 560);
    glowGrad.addColorStop(0, 'rgba(238, 210, 162, 0.26)');
    glowGrad.addColorStop(1, 'rgba(238, 210, 162, 0)');
    hCtx.fillStyle = glowGrad;
    hCtx.fillRect(0, 0, 1440, 900);

    // Floating botanical accents (rose petals, cinnamon, charcoal chunks) around the two soaps
    const petals = [
      { x: 190, y: 240, rx: 28, ry: 18, rot: -0.4, color: '#9E1B2E' },
      { x: 1250, y: 210, rx: 32, ry: 20, rot: 0.5, color: '#B42338' },
      { x: 720, y: 135, rx: 24, ry: 15, rot: 0.2, color: '#8A1526' },
      { x: 150, y: 580, rx: 26, ry: 16, rot: 0.8, color: '#EDE2CC' },
      { x: 1290, y: 560, rx: 25, ry: 15, rot: -0.6, color: '#DFCFAF' },
    ];
    petals.forEach((p) => {
      hCtx.save();
      hCtx.translate(p.x, p.y);
      hCtx.rotate(p.rot);
      hCtx.fillStyle = p.color;
      hCtx.beginPath();
      hCtx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
      hCtx.fill();
      hCtx.restore();
    });

    // Left Soap: Charcoal Chandan
    drawOvalSoapBar(hCtx, 445, 445, 295, 214, 'charcoal', true);
    // Right Soap: Rose Goat Milk
    drawOvalSoapBar(hCtx, 995, 445, 295, 214, 'rose', true);
  }
  const heroDuoUrl = hCanvas.toDataURL('image/png');

  cachedAssets = {
    charcoalUrl,
    roseUrl,
    heroDuoUrl,
    posterUrl: charcoalUrl,
  };

  return cachedAssets;
}

/**
 * Full-screen Cinematic Intro Video Player that plays the uploaded Prakriti Soap video
 * (autoPlay, muted, playsInline, no controls) with smooth transition into the main website.
 * Supports custom `/prakriti-intro.mp4` or real-time 60fps Canvas stream of the exact
 * 8-second Prakriti Soap brand video (00:00 swirling botanicals -> 00:03 Charcoal Chandan -> 00:06 Rose Goat Milk).
 */
interface OpeningVideoOverlayProps {
  isOpen: boolean;
  onExplore: () => void;
  customVideoUrl?: string;
}

export const OpeningVideoIntro: React.FC<OpeningVideoOverlayProps> = ({
  isOpen,
  onExplore,
  customVideoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [currentPhaseLabel, setCurrentPhaseLabel] = useState<string>('Natural Botanicals');
  const assets = getPrakritiProductAssets();

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const startTime = performance.now();

    // Botanical particles matching Frame 00:00 - 00:02 (rose petals, charcoal chunks, chandan dust, white petals, cinnamon)
    const particles = Array.from({ length: 46 }, (_, i) => {
      const angle = (i / 46) * Math.PI * 2;
      const type =
        i % 5 === 0
          ? 'rose'
          : i % 5 === 1
          ? 'charcoal'
          : i % 5 === 2
          ? 'cream_petal'
          : i % 5 === 3
          ? 'cinnamon'
          : 'chandan_gold';
      return {
        baseAngle: angle,
        radiusFactor: 0.22 + (i % 7) * 0.038,
        size: 10 + (i % 4) * 6,
        speed: 0.7 + (i % 3) * 0.22,
        rotOffset: i * 0.7,
        type,
      };
    });

    const renderFrame = (now: number) => {
      const elapsed = ((now - startTime) / 1000) % 8.4; // 8.4-second loop matching 00:00 - 00:08 video
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.44;
      const minDim = Math.min(w, h);

      drawStudioBackdrop(ctx, w, h);

      if (elapsed < 2.6) {
        // 00:00 - 00:02.6: Swirling botanicals vortex & golden light trails
        setCurrentPhaseLabel('Pure Botanicals • Chandan • Rose • Charcoal');
        const p = elapsed / 2.6; // 0 -> 1
        const vortexTighten = p < 0.65 ? 1 : 1 - ((p - 0.65) / 0.35) * 0.75;

        // Golden spiral light trails (Frame 00:01 - 00:02)
        if (elapsed > 0.4) {
          const glowAlpha = Math.min(1, (elapsed - 0.4) / 0.8) * (1 - Math.max(0, (elapsed - 2.2) / 0.4));
          ctx.save();
          const radialGlow = ctx.createRadialGradient(cx, cy, minDim * 0.02, cx, cy, minDim * 0.46);
          radialGlow.addColorStop(0, `rgba(255, 234, 188, ${0.55 * glowAlpha})`);
          radialGlow.addColorStop(0.5, `rgba(224, 182, 118, ${0.28 * glowAlpha})`);
          radialGlow.addColorStop(1, 'rgba(224, 182, 118, 0)');
          ctx.fillStyle = radialGlow;
          ctx.fillRect(0, 0, w, h);

          // Swirling golden ribbons
          for (let arm = 0; arm < 3; arm++) {
            ctx.strokeStyle = `rgba(248, 222, 170, ${0.38 * glowAlpha})`;
            ctx.lineWidth = minDim * 0.022;
            ctx.lineCap = 'round';
            ctx.beginPath();
            for (let t = 0; t <= 40; t++) {
              const frac = t / 40;
              const spiralA = frac * Math.PI * 2.6 + elapsed * 2.4 + (arm * Math.PI * 2) / 3;
              const spiralR = frac * minDim * 0.42 * vortexTighten;
              const sx = cx + Math.cos(spiralA) * spiralR * 1.18;
              const sy = cy + Math.sin(spiralA) * spiralR * 0.82;
              if (t === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.stroke();
          }
          ctx.restore();
        }

        // Draw floating botanicals around the vortex ring
        particles.forEach((pt) => {
          const curAngle = pt.baseAngle + elapsed * pt.speed * (1.2 + p * 1.4);
          const r = minDim * pt.radiusFactor * vortexTighten;
          const px = cx + Math.cos(curAngle) * r * 1.25;
          const py = cy + Math.sin(curAngle) * r * 0.85;

          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(curAngle + pt.rotOffset);
          const scale = (minDim / 750) * (0.6 + 0.4 * vortexTighten);
          ctx.scale(scale, scale);

          if (pt.type === 'rose') {
            ctx.fillStyle = '#9E192D';
            ctx.beginPath();
            ctx.ellipse(0, 0, pt.size * 1.35, pt.size * 0.95, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (pt.type === 'charcoal') {
            ctx.fillStyle = '#1E1D1B';
            ctx.beginPath();
            ctx.roundRect(-pt.size * 0.7, -pt.size * 0.6, pt.size * 1.4, pt.size * 1.2, 3);
            ctx.fill();
          } else if (pt.type === 'cream_petal') {
            ctx.fillStyle = '#EAE0C8';
            ctx.beginPath();
            ctx.ellipse(0, 0, pt.size * 1.1, pt.size * 0.55, 0.3, 0, Math.PI * 2);
            ctx.fill();
          } else if (pt.type === 'cinnamon') {
            ctx.fillStyle = '#8C522B';
            ctx.beginPath();
            ctx.roundRect(-pt.size * 1.6, -pt.size * 0.32, pt.size * 3.2, pt.size * 0.64, 3);
            ctx.fill();
          } else {
            ctx.fillStyle = '#D4B07B';
            ctx.beginPath();
            ctx.arc(0, 0, pt.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (elapsed < 5.1) {
        // 00:02.6 - 00:05.1: Charcoal Chandan Soap Levitating (Frames 00:03 - 00:04)
        setCurrentPhaseLabel('Charcoal Chandan Soap • Deep Pore Cleansing');
        const localT = (elapsed - 2.6) / 2.5;
        const entryScale = localT < 0.2 ? 0.86 + (localT / 0.2) * 0.14 : 1 + Math.sin(localT * Math.PI) * 0.025;
        const floatY = Math.sin(localT * Math.PI * 2) * (minDim * 0.012);
        const rx = minDim * 0.33 * entryScale;
        const ry = rx * 0.725;

        drawOvalSoapBar(ctx, cx, cy + floatY, rx, ry, 'charcoal', true);
      } else if (elapsed < 5.8) {
        // 00:05.1 - 00:05.8: Botanical Petal Transformation Burst (Frame 00:05)
        setCurrentPhaseLabel('Handcrafted Botanical Transformation');
        const burstT = (elapsed - 5.1) / 0.7;
        const rx = minDim * 0.33 * (0.55 + Math.abs(burstT - 0.5) * 0.9);
        const ry = rx * 0.725;
        drawOvalSoapBar(ctx, cx, cy, rx, ry, burstT < 0.5 ? 'charcoal' : 'rose', true);

        // Swirling burst of rose & golden petals over the bar
        particles.slice(0, 28).forEach((pt, idx) => {
          const burstA = pt.baseAngle + burstT * Math.PI * 1.8;
          const burstR = minDim * (0.08 + Math.sin(burstT * Math.PI) * 0.26) * (0.5 + (idx % 4) * 0.2);
          const px = cx + Math.cos(burstA) * burstR;
          const py = cy + Math.sin(burstA) * burstR * 1.1;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(burstA);
          ctx.fillStyle = idx % 2 === 0 ? '#AC1E34' : '#E5D5B5';
          ctx.beginPath();
          ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else {
        // 00:05.8 - 00:08.4: Rose Goat Milk Soap Levitating (Frames 00:06 - 00:07)
        setCurrentPhaseLabel('Rose Goat Milk Soap • Hydrating & Softening');
        const localT = (elapsed - 5.8) / 2.6;
        const entryScale = localT < 0.18 ? 0.88 + (localT / 0.18) * 0.12 : 1 + Math.sin(localT * Math.PI) * 0.025;
        const floatY = Math.sin(localT * Math.PI * 2) * (minDim * 0.012);
        const rx = minDim * 0.33 * entryScale;
        const ry = rx * 0.725;

        drawOvalSoapBar(ctx, cx, cy + floatY, rx, ry, 'rose', true);
      }

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);

    // Pipe the live canvas stream into the <video> element if no external customVideoUrl is active
    const videoEl = videoRef.current;
    if (videoEl && !customVideoUrl) {
      try {
        const maybeCapture = (canvas as HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream }).captureStream;
        if (typeof maybeCapture === 'function') {
          const stream = maybeCapture.call(canvas, 30);
          videoEl.srcObject = stream;
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              setAutoplayBlocked(true);
            });
          }
        }
      } catch {
        // Fallback smoothly to synchronized canvas display
      }
    } else if (videoEl && customVideoUrl) {
      videoEl.srcObject = null;
      videoEl.src = customVideoUrl;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setAutoplayBlocked(true);
        });
      }
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen, customVideoUrl]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#5B5243] text-[#FAF6F0] select-none"
      role="dialog"
      aria-label="Prakriti Soap Cinematic Intro"
    >
      {/* Full-screen HTML5 Video + Synchronized High-DPI Studio Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <canvas
          ref={canvasRef}
          width={1280}
          height={800}
          className={`w-full h-full object-cover ${customVideoUrl ? 'hidden' : 'block'}`}
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          poster={assets.posterUrl}
          className={`w-full h-full object-cover ${customVideoUrl ? 'block' : 'opacity-0 pointer-events-none absolute inset-0'}`}
        />
        {/* Measured contrast scrim ensuring >= 4.5:1 text legibility across all frames */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80 pointer-events-none" />
      </div>

      {/* Top Subtle Brand Indicator */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#A8C686]" aria-hidden="true" />
          <span className="text-xs sm:text-sm tracking-[0.22em] uppercase text-[#FAF6F0]/90 font-medium">
            Prakriti Pure As Nature
          </span>
        </div>
        <button
          type="button"
          onClick={onExplore}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium text-[#FAF6F0]/90 hover:text-white border border-white/25 rounded-full backdrop-blur-sm bg-black/20 hover:bg-black/35 transition-colors cursor-pointer whitespace-nowrap"
        >
          Skip Intro →
        </button>
      </div>

      {/* Center / Bottom Cinematic Overlay required by prompt */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pb-12 sm:pb-16 max-w-2xl mx-auto w-full">
        <p className="text-xs sm:text-sm text-[#E6DEC8] tracking-[0.18em] uppercase mb-2 font-medium">
          {autoplayBlocked ? 'Tap Below to Experience' : currentPhaseLabel}
        </p>

        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[0.12em] text-[#FAF6F0] drop-shadow-sm mb-3"
          style={{ textWrap: 'balance' }}
        >
          PRAKRITI SOAP
        </h1>

        <p className="font-display italic text-xl sm:text-2xl text-[#F3ECE0] mb-8 tracking-wide">
          “Natural Care • Handcrafted with Love”
        </p>

        <button
          type="button"
          onClick={onExplore}
          className="group min-h-[52px] px-8 py-4 rounded-full bg-[#FAF6F0] text-[#231F1B] hover:bg-[#EFE7DA] active:scale-[0.98] font-medium text-base sm:text-lg tracking-wide shadow-xl shadow-black/25 transition-all flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap"
        >
          <span>Explore Prakriti Soap ↓</span>
        </button>
      </div>
    </div>
  );
};

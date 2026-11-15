import type { ManualMark } from "@/lib/api/types";

/**
 * The eight printed marks of the drawing sheet, drawn with plain canvas
 * calls. They are reproductions of the stimulus in the source packet — the
 * participant completes the mark instead of starting from an empty square, so
 * the saved drawing has to show what was printed underneath.
 *
 * Every coordinate is a fraction of the box, which keeps the mark in the same
 * place whatever size the canvas renders at. Positions come from the source
 * page (`/tmp/wartegg_boxes.png`, rotated upright): boxes 1–4 on the top row,
 * 5–8 below, marks mostly in the upper half.
 */

type Ctx = CanvasRenderingContext2D;

/** Draw one printed mark into a `width × height` box. Strokes are dark grey, not black — the participant's pen is black. */
export function paintStimulus(
  ctx: Ctx,
  mark: ManualMark,
  width: number,
  height: number,
): void {
  const size = Math.min(width, height);
  const x = (fraction: number) => fraction * width;
  const y = (fraction: number) => fraction * height;

  ctx.save();
  ctx.strokeStyle = "#3f3f46";
  ctx.fillStyle = "#3f3f46";
  ctx.lineWidth = Math.max(size * 0.012, 1.2);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (mark) {
    case "DOT": {
      ctx.beginPath();
      ctx.arc(x(0.3), y(0.48), Math.max(size * 0.016, 1.6), 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "CURVE": {
      // A short wave: up, over and down — the tilde of box 2.
      ctx.beginPath();
      ctx.moveTo(x(0.29), y(0.28));
      ctx.bezierCurveTo(x(0.315), y(0.205), x(0.335), y(0.215), x(0.35), y(0.245));
      ctx.bezierCurveTo(x(0.365), y(0.275), x(0.385), y(0.285), x(0.405), y(0.235));
      ctx.stroke();
      break;
    }
    case "BARS": {
      // Three upright strokes standing on the bottom edge, growing to the right.
      const bars = [
        { at: 0.46, top: 0.84 },
        { at: 0.56, top: 0.73 },
        { at: 0.66, top: 0.6 },
      ];
      for (const bar of bars) {
        ctx.beginPath();
        ctx.moveTo(x(bar.at), y(bar.top));
        ctx.lineTo(x(bar.at), y(1));
        ctx.stroke();
      }
      break;
    }
    case "SQUARE": {
      const side = size * 0.065;
      ctx.fillRect(x(0.78), y(0.18), side, side);
      break;
    }
    case "DIAGONALS": {
      // Two segments of one diagonal, with a gap in the middle.
      ctx.beginPath();
      ctx.moveTo(x(0.1), y(0.9));
      ctx.lineTo(x(0.28), y(0.72));
      ctx.moveTo(x(0.33), y(0.66));
      ctx.lineTo(x(0.5), y(0.49));
      ctx.stroke();
      break;
    }
    case "AXES": {
      // A flat line upper-left and a short upright line to its right.
      ctx.beginPath();
      ctx.moveTo(x(0.22), y(0.24));
      ctx.lineTo(x(0.42), y(0.24));
      ctx.moveTo(x(0.62), y(0.38));
      ctx.lineTo(x(0.62), y(0.52));
      ctx.stroke();
      break;
    }
    case "DOTTED_ARC": {
      // Seven dots on the lower-left quarter of a circle — open towards the top-left.
      const cx = x(0.46);
      const cy = y(0.55);
      const radius = size * 0.1;
      const dots = 7;
      for (let i = 0; i < dots; i += 1) {
        const angle = Math.PI / 2 + (i / (dots - 1)) * (Math.PI / 2);
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(angle) * radius,
          cy + Math.sin(angle) * radius,
          Math.max(size * 0.008, 1),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      break;
    }
    case "ARC": {
      // A dome over the middle of the box, ends dipping just below the centre.
      ctx.beginPath();
      ctx.arc(x(0.5), y(0.42), size * 0.22, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

/**
 * AJ EcoDrive — SVG Geometric Connector Calculator
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — CONNECTOR ENGINE
 *
 * Computes exact vector coordinates connecting the coachmark card edge
 * to the nearest boundary of the target element.
 */

export function calculateConnector(cardRect, targetRect, placement) {
  if (!cardRect || !targetRect || !placement || placement === 'dock' || placement === 'center') {
    return null;
  }

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  const cardCenterX = cardRect.left + (cardRect.width / 2);
  const cardCenterY = cardRect.top + (cardRect.height / 2);
  const targetCenterX = targetRect.left + (targetRect.width / 2);
  const targetCenterY = targetRect.top + (targetRect.height / 2);

  switch (placement) {
    case 'right':
      // Card is to the right of target. Connector points from card left to target right.
      startX = cardRect.left;
      startY = Math.min(Math.max(targetCenterY, cardRect.top + 24), cardRect.bottom - 24);
      endX = targetRect.right;
      endY = targetCenterY;
      break;

    case 'left':
      // Card is to the left of target. Connector points from card right to target left.
      startX = cardRect.right;
      startY = Math.min(Math.max(targetCenterY, cardRect.top + 24), cardRect.bottom - 24);
      endX = targetRect.left;
      endY = targetCenterY;
      break;

    case 'bottom':
      // Card is below target. Connector points from card top to target bottom.
      startX = Math.min(Math.max(targetCenterX, cardRect.left + 24), cardRect.right - 24);
      startY = cardRect.top;
      endX = targetCenterX;
      endY = targetRect.bottom;
      break;

    case 'top':
      // Card is above target. Connector points from card bottom to target top.
      startX = Math.min(Math.max(targetCenterX, cardRect.left + 24), cardRect.right - 24);
      startY = cardRect.bottom;
      endX = targetCenterX;
      endY = targetRect.top;
      break;

    default:
      return null;
  }

  return {
    startX,
    startY,
    endX,
    endY,
    placement,
  };
}

import type { Block } from "../hooks/types.ts";

/* =========================================
   SLOT UTILITIES
========================================= */

export function clampSlot(
    slot: number,
    min: number,
    max: number
): number {
    return Math.min(Math.max(slot, min), max);
}

export function snapSlot(rawSlot: number): number {
    return Math.round(rawSlot);
}

/* =========================================
   PX <-> SLOT
========================================= */

export function pxToSlot(
    clientY: number,
    canvasTopPx: number,
    slotHeightPx: number
): number {
    const relativeY = clientY - canvasTopPx;
    return relativeY / slotHeightPx;
}

export function slotToPx(
    slot: number,
    slotHeightPx: number
): number {
    return slot * slotHeightPx;
}

/* =========================================
   RANGE & OVERLAP
========================================= */

export function blockRange(block: Block) {
    return {
        start: block.startSlot,
        end: block.startSlot + block.durationSlots,
    };
}

export function overlaps(a: Block, b: Block): boolean {
    const rangeA = blockRange(a);
    const rangeB = blockRange(b);

    return (
        rangeA.start < rangeB.end &&
        rangeA.end > rangeB.start
    );
}

/* =========================================
   GLOBAL OVERLAP CHECK
========================================= */

export function hasAnyOverlap(blocks: Block[]): boolean {
    for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
            if (overlaps(blocks[i], blocks[j])) {
                return true;
            }
        }
    }
    return false;
}
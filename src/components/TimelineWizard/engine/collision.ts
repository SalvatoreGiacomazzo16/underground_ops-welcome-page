
import type { Block } from "./types.ts";
import { overlaps } from "./math.ts";

/* =========================================
   CHECK SINGLE OVERLAP
========================================= */

export function isOverlapping(a: Block, b: Block): boolean {
    return overlaps(a, b);
}

/* =========================================
   RESOLVE COLLISION
   Hard guarantee: returns a valid slot
========================================= */

type ResolveArgs = {
    movingId: string;
    proposedStartSlot: number;
    blocks: Block[];
    totalSlots: number;
};

export function resolveCollision({
    movingId,
    proposedStartSlot,
    blocks,
    totalSlots,
}: ResolveArgs): number {

    const movingBlock = blocks.find(b => b.id === movingId);
    if (!movingBlock) return proposedStartSlot;

    const duration = movingBlock.durationSlots;

    // Clamp inside timeline
    let candidate = Math.max(
        0,
        Math.min(proposedStartSlot, totalSlots - duration)
    );

    const others = blocks.filter(b => b.id !== movingId);

    const collides = (startSlot: number) => {
        const test: Block = {
            ...movingBlock,
            startSlot,
        };

        return others.some(b => overlaps(test, b));
    };

    // Already valid
    if (!collides(candidate)) {
        return candidate;
    }

    // Bidirectional scan (nearest valid)
    let offset = 1;

    while (offset < totalSlots) {

        const up = candidate - offset;
        const down = candidate + offset;

        if (up >= 0 && !collides(up)) {
            return up;
        }

        if (down + duration <= totalSlots && !collides(down)) {
            return down;
        }

        offset++;
    }

    // fallback (should not happen)
    return candidate;
}
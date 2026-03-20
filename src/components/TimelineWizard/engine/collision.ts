import type { Block } from "./types.ts";
import { overlaps } from "./math.ts";

export function isOverlapping(a: Block, b: Block): boolean {
    return overlaps(a, b);
}

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
    const movingBlock = blocks.find((b) => b.id === movingId);
    if (!movingBlock) return proposedStartSlot;

    const duration = movingBlock.durationSlots;

    const sorted = [...blocks].sort((a, b) => a.startSlot - b.startSlot);
    const currentIndex = sorted.findIndex((b) => b.id === movingId);

    if (currentIndex === -1) return proposedStartSlot;

    const prevBlock = currentIndex > 0 ? sorted[currentIndex - 1] : null;
    const nextBlock =
        currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

    const minStart = prevBlock
        ? prevBlock.startSlot + prevBlock.durationSlots
        : 0;

    const maxStart = nextBlock
        ? nextBlock.startSlot - duration
        : totalSlots - duration;

    const clamped = Math.max(minStart, Math.min(proposedStartSlot, maxStart));

    return clamped;
}
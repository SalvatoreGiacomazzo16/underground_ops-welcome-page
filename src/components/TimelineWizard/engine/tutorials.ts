import type { Block } from "../hooks/types.ts";
import { overlaps } from "./math.ts";

/* =========================================
   APPLY FORCED OVERLAP
   Forza un conflitto tra i primi due blocchi
========================================= */

export function applyForcedOverlap(blocks: Block[]): Block[] {
    if (blocks.length < 2) return blocks;

    const [first, second, ...rest] = blocks;

    // Forziamo stesso startSlot
    const forcedSecond: Block = {
        ...second,
        startSlot: first.startSlot,
    };

    return [first, forcedSecond, ...rest];
}

/* =========================================
   CHECK IF CONFLICT RESOLVED
========================================= */

export function isConflictResolved(blocks: Block[]): boolean {
    if (blocks.length < 2) return true;

    // Controllo globale overlap
    for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
            if (overlaps(blocks[i], blocks[j])) {
                return false;
            }
        }
    }

    return true;
}
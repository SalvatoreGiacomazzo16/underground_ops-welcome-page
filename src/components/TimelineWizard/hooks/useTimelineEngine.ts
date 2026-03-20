import { useState, useRef, useCallback } from "react";
import { resolveCollision } from "../engine/collision.ts";

import type {
    Block,
    PointerDragState,
} from "../engine/types.ts";

import {
    DEFAULT_CONFIG,
} from "../engine/config.ts";

import {
    clampSlot,
    snapSlot,
} from "../engine/math.ts";

/* =========================================
   INITIAL DEMO BLOCKS
========================================= */

const INITIAL_BLOCKS: Block[] = [
    { id: "a", label: "Soundcheck", startSlot: 2, durationSlots: 4 },
    { id: "b", label: "Live Set", startSlot: 8, durationSlots: 4 },
    { id: "c", label: "Closing", startSlot: 14, durationSlots: 2 },
];

/* =========================================
   HOOK
========================================= */

type UseTimelineEngineOptions = {
    interactive?: boolean;
};

export function useTimelineEngine(
    options: UseTimelineEngineOptions = {}
) {
    const { interactive = true } = options;

    const config = DEFAULT_CONFIG;
    const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);

    const dragRef = useRef<PointerDragState>({
        isDragging: false,
        pointerId: null,
        blockId: null,
        startClientY: 0,
        startSlot: 0,
    });

    const captureElRef = useRef<HTMLElement | null>(null);

    /* =========================================
       POINTER DOWN
    ========================================= */

    const onBlockPointerDown = useCallback(
        (blockId: string, e: React.PointerEvent) => {
            if (!interactive) return;

            const block = blocks.find((b) => b.id === blockId);
            if (!block) return;

            const target = e.currentTarget as HTMLElement;

            dragRef.current = {
                isDragging: true,
                pointerId: e.pointerId,
                blockId,
                startClientY: e.clientY,
                startSlot: block.startSlot,
            };

            captureElRef.current = target;
            target.setPointerCapture(e.pointerId);
        },
        [blocks, interactive]
    );

    /* =========================================
       POINTER MOVE
    ========================================= */

    const onCanvasPointerMove = useCallback(
        (e: React.PointerEvent) => {
            const drag = dragRef.current;
            if (!interactive) return;
            if (!drag.isDragging || !drag.blockId) return;

            const deltaPx = e.clientY - drag.startClientY;
            const deltaSlots = deltaPx / config.slotHeightPx;
            const rawSlot = drag.startSlot + deltaSlots;
            const snapped = snapSlot(rawSlot);

            setBlocks((prev) => {
                const movingBlock = prev.find((b) => b.id === drag.blockId);
                if (!movingBlock) return prev;

                const maxStart = config.totalSlots - movingBlock.durationSlots;
                const clamped = clampSlot(snapped, 0, maxStart);

                const finalSlot = resolveCollision({
                    movingId: drag.blockId!,
                    proposedStartSlot: clamped,
                    blocks: prev,
                    totalSlots: config.totalSlots,
                });

                return prev.map((b) =>
                    b.id === drag.blockId
                        ? { ...b, startSlot: finalSlot }
                        : b
                );
            });
        },
        [config, interactive]
    );

    /* =========================================
       POINTER UP
    ========================================= */

    const endDrag = useCallback(() => {
        dragRef.current = {
            isDragging: false,
            pointerId: null,
            blockId: null,
            startClientY: 0,
            startSlot: 0,
        };
    }, []);

    const onCanvasPointerUp = useCallback(
        (e: React.PointerEvent) => {
            const drag = dragRef.current;
            if (!drag.isDragging) return;

            if (
                captureElRef.current &&
                drag.pointerId !== null &&
                captureElRef.current.hasPointerCapture(drag.pointerId)
            ) {
                captureElRef.current.releasePointerCapture(drag.pointerId);
            }

            captureElRef.current = null;
            endDrag();
        },
        [endDrag]
    );

    return {
        config,
        blocks,
        interactive,
        onBlockPointerDown,
        onCanvasPointerMove,
        onCanvasPointerUp,
    };
}
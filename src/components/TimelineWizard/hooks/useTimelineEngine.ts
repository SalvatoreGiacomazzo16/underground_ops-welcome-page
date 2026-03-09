import { useState, useRef, useCallback } from "react";
import { resolveCollision } from "../engine/collision.ts";

import type {
    Block,
    WizardPhase,
    PointerDragState,
} from "../engine/types.ts";

import {
    DEFAULT_CONFIG,
} from "../engine/config.ts";

import {
    clampSlot,
    snapSlot,
    pxToSlot,
} from "../engine/math.ts";



/* =========================================
   INITIAL DEMO BLOCKS (temporary)
========================================= */

const INITIAL_BLOCKS: Block[] = [
    { id: "a", label: "Soundcheck", startSlot: 2, durationSlots: 4 },
    { id: "b", label: "Live Set", startSlot: 8, durationSlots: 4 },
    { id: "c", label: "Closing", startSlot: 14, durationSlots: 2 },
];



/* =========================================
   HOOK
========================================= */

export function useTimelineEngine() {


    const config = DEFAULT_CONFIG;

    const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
    const [phase] = useState<WizardPhase>("intro"); // temporaneo
    const collisionLock = true;
    // per ora sempre attivo.
    // nel layer successivo verrà controllato dalla state machine.


    const dragRef = useRef<PointerDragState>({
        isDragging: false,
        pointerId: null,
        blockId: null,
        startClientY: 0,
        startSlot: 0,
    });

    const canvasTopRef = useRef<number>(0);



    /* =========================================
       POINTER DOWN
    ========================================= */

    const onBlockPointerDown = useCallback(
        (blockId: string, e: React.PointerEvent) => {

            const block = blocks.find(b => b.id === blockId);
            if (!block) return;

            dragRef.current = {
                isDragging: true,
                pointerId: e.pointerId,
                blockId,
                startClientY: e.clientY,
                startSlot: block.startSlot,
            };

            const rect = (e.currentTarget as HTMLElement)
                .closest("[data-timeline-canvas]")
                ?.getBoundingClientRect();

            if (rect) {
                canvasTopRef.current = rect.top;
            }

            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        },
        [blocks]
    );



    /* =========================================
       POINTER MOVE
    ========================================= */

    const onCanvasPointerMove = useCallback(
        (e: React.PointerEvent) => {

            const drag = dragRef.current;
            if (!drag.isDragging || !drag.blockId) return;

            const deltaPx = e.clientY - drag.startClientY;
            const deltaSlots = deltaPx / config.slotHeightPx;

            const rawSlot = drag.startSlot + deltaSlots;
            const snapped = snapSlot(rawSlot);

            const block = blocks.find(b => b.id === drag.blockId);
            if (!block) return;

            const maxStart =
                config.totalSlots - block.durationSlots;

            const clamped = clampSlot(snapped, 0, maxStart);

            let finalSlot = clamped;

            if (collisionLock) {
                finalSlot = resolveCollision({
                    movingId: drag.blockId,
                    proposedStartSlot: clamped,
                    blocks,
                    totalSlots: config.totalSlots,
                });
            }

            setBlocks(prev =>
                prev.map(b =>
                    b.id === drag.blockId
                        ? { ...b, startSlot: finalSlot }
                        : b
                )
            );
        },
        [blocks, config]
    );



    /* =========================================
       POINTER UP
    ========================================= */

    const onCanvasPointerUp = useCallback(
        (e: React.PointerEvent) => {
            if (!dragRef.current.isDragging) return;

            dragRef.current = {
                isDragging: false,
                pointerId: null,
                blockId: null,
                startClientY: 0,
                startSlot: 0,
            };

            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        },
        []
    );



    return {
        config,
        phase,
        blocks,
        onBlockPointerDown,
        onCanvasPointerMove,
        onCanvasPointerUp,
    };
}
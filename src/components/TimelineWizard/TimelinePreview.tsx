import { useEffect, useMemo, useRef, useState } from "react";
import { PREVIEW_BLOCKS } from "../../constants/previewBlocks";
import type { PreviewBlock } from "../../types/PreviewBlock";
import { motion, AnimatePresence } from "framer-motion";

// ================================
// DEMO TIMELINE CONFIG
// ================================
const SLOT_HEIGHT = 20; // px per 15 min
const UNIT_MINUTES = 15;
const TOTAL_MINUTES = 240; // 4h demo

const STORAGE_KEY_TUTORIAL_DONE = "uo_demo_tutorial_done_v2";

// ================================
// UTILS
// ================================
const minutesToPixels = (minutes: number) => (minutes / UNIT_MINUTES) * SLOT_HEIGHT;
const pixelsToMinutes = (px: number) => (px / SLOT_HEIGHT) * UNIT_MINUTES;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const snapPx = (px: number) => Math.round(px / SLOT_HEIGHT) * SLOT_HEIGHT;

const overlapPx = (aTop: number, aH: number, bTop: number, bH: number) =>
    aTop < bTop + bH && bTop < aTop + aH;

const generateSlots = () => {
    const slots: Array<{ minute: number; isHour: boolean; label: string | null }> = [];
    for (let m = 0; m <= TOTAL_MINUTES; m += UNIT_MINUTES) {
        const isHour = m % 60 === 0;
        const hour = Math.floor(m / 60);
        slots.push({
            minute: m,
            isHour,
            label: isHour ? `${String(hour).padStart(2, "0")}:00` : null
        });
    }
    return slots;
};

type BlockTopMap = Record<string, number>; // px top

interface TimelinePreviewProps {
    step: number;
    isInteractive: boolean; // becomes true when user clicks "Activate Demo"
}

const TimelinePreview = ({ step, isInteractive }: TimelinePreviewProps) => {
    const slots = useMemo(() => generateSlots(), []);
    const timelineHeightPx = useMemo(() => minutesToPixels(TOTAL_MINUTES), []);

    const hasTwoBlocks = PREVIEW_BLOCKS.length >= 2;

    // Base positions from constants
    const baseTops = useMemo(() => {
        const map: BlockTopMap = {};
        PREVIEW_BLOCKS.forEach((b) => (map[b.id] = minutesToPixels(b.start)));
        return map;
    }, []);

    const [topsPx, setTopsPx] = useState<BlockTopMap>(baseTops);

    // “tutorial stage”: we force overlap ONCE when interactive starts, then require user to resolve
    const [tutorialDone, setTutorialDone] = useState(false);
    const [collisionLock, setCollisionLock] = useState(false); // anti-collision after resolved
    const [showYourTurn, setShowYourTurn] = useState(false);
    const [showResolved, setShowResolved] = useState(false);

    // gate: do not allow “resolved” until user actually drags at least once in interactive mode
    const [hasUserMoved, setHasUserMoved] = useState(false);

    // track transition into interactive (so we can force overlap exactly at Activate Demo)
    const prevInteractive = useRef<boolean>(false);

    // When interactive toggles true (Activate Demo):
    useEffect(() => {
        const becameInteractive = isInteractive && !prevInteractive.current;
        prevInteractive.current = isInteractive;

        if (!becameInteractive) return;

        const done = localStorage.getItem(STORAGE_KEY_TUTORIAL_DONE) === "1";
        setTutorialDone(done);

        // In any case: show "Your Turn"
        setShowYourTurn(true);
        const t = window.setTimeout(() => setShowYourTurn(false), 1400);

        // Reset interaction flags on activation
        setHasUserMoved(false);
        setShowResolved(false);

        if (!done && hasTwoBlocks) {
            // FORCE OVERLAP *RIGHT NOW* (this is your requirement)
            const a = PREVIEW_BLOCKS[0];
            const b = PREVIEW_BLOCKS[1];

            const aTop = baseTops[a.id] ?? 0;
            // Force b exactly on top of a to guarantee overlap
            const bTop = aTop;

            setTopsPx((prev) => ({
                ...prev,
                [a.id]: aTop,
                [b.id]: bTop
            }));

            // Collision lock should be OFF until resolved
            setCollisionLock(false);
        } else {
            // If tutorial already done: allow free play with collision lock ON (requested)
            setTopsPx(baseTops);
            setCollisionLock(true);
        }

        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInteractive]);

    // Compute conflict (only meaningful if interactive and tutorial not done)
    const conflict = useMemo(() => {
        if (!isInteractive) return false;
        if (!hasTwoBlocks) return false;
        if (tutorialDone) return false;

        const a = PREVIEW_BLOCKS[0];
        const b = PREVIEW_BLOCKS[1];

        const aTop = topsPx[a.id] ?? baseTops[a.id] ?? 0;
        const bTop = topsPx[b.id] ?? baseTops[b.id] ?? 0;

        const aH = minutesToPixels(a.duration);
        const bH = minutesToPixels(b.duration);

        return overlapPx(aTop, aH, bTop, bH);
    }, [isInteractive, tutorialDone, topsPx, baseTops, hasTwoBlocks]);

    // When conflict becomes resolved AFTER user move => show badge, persist, enable collision lock
    useEffect(() => {
        if (!isInteractive) return;
        if (tutorialDone) return;
        if (!hasUserMoved) return; // IMPORTANT
        if (!hasTwoBlocks) return;

        // Now if not conflict => resolved
        if (!conflict) {
            setShowResolved(true);

            localStorage.setItem(STORAGE_KEY_TUTORIAL_DONE, "1");
            setTutorialDone(true);

            // ENABLE anti-collision after resolved
            setCollisionLock(true);

            const t = window.setTimeout(() => setShowResolved(false), 1400);
            return () => window.clearTimeout(t);
        }
    }, [conflict, isInteractive, tutorialDone, hasUserMoved, hasTwoBlocks]);

    // Drag constraints helper (relative)
    const getConstraints = (topPx: number, heightPx: number) => {
        const up = -topPx;
        const down = timelineHeightPx - (topPx + heightPx);
        return { top: up, bottom: down };
    };

    // Anti-collision resolver (two blocks only; extend later if needed)
    const resolveCollisionIfNeeded = (
        movingId: string,
        proposedTop: number,
        heights: Record<string, number>,
        tops: BlockTopMap
    ) => {
        if (!collisionLock) return proposedTop;
        if (!hasTwoBlocks) return proposedTop;

        const a = PREVIEW_BLOCKS[0];
        const b = PREVIEW_BLOCKS[1];
        const otherId = movingId === a.id ? b.id : a.id;

        const otherTop = tops[otherId] ?? baseTops[otherId] ?? 0;

        const movingH = heights[movingId];
        const otherH = heights[otherId];

        // If no overlap, keep
        if (!overlapPx(proposedTop, movingH, otherTop, otherH)) return proposedTop;

        // If overlap: push moving block either above or below the other, whichever is closer
        const pushAbove = otherTop - movingH;
        const pushBelow = otherTop + otherH;

        // Choose minimal movement
        const distAbove = Math.abs(proposedTop - pushAbove);
        const distBelow = Math.abs(proposedTop - pushBelow);

        const chosen = distAbove <= distBelow ? pushAbove : pushBelow;
        return chosen;
    };

    const onBlockDragEnd = (block: PreviewBlock, rawTopPx: number) => {
        const heightPx = minutesToPixels(block.duration);

        // snap + clamp within axis
        let next = snapPx(rawTopPx);
        next = clamp(next, 0, timelineHeightPx - heightPx);

        // anti-collision (after resolved)
        const heights: Record<string, number> = {};
        PREVIEW_BLOCKS.forEach((b) => (heights[b.id] = minutesToPixels(b.duration)));

        setTopsPx((prev) => {
            const corrected = resolveCollisionIfNeeded(block.id, next, heights, prev);
            const correctedSnapped = clamp(snapPx(corrected), 0, timelineHeightPx - heightPx);

            return {
                ...prev,
                [block.id]: correctedSnapped
            };
        });
    };

    return (
        <section className={`uo-preview ${isInteractive ? "is-interactive" : ""}`}>
            <div className="uo-preview__wrapper">
                {/* AXIS */}
                <div
                    className={`uo-preview__axis ${step === 1 && !isInteractive ? "is-highlighted" : ""}`}
                    style={{ height: `${timelineHeightPx}px` }}
                >
                    {slots.map((slot) => (
                        <div
                            key={slot.minute}
                            className={`uo-preview__axis-slot ${slot.isHour ? "is-hour" : ""}`}
                            style={{ top: `${minutesToPixels(slot.minute)}px` }}
                        >
                            {slot.label && <span className="uo-preview__axis-label">{slot.label}</span>}
                        </div>
                    ))}
                </div>

                {/* TIMELINE */}
                <div className="uo-preview__timeline" style={{ height: `${timelineHeightPx}px` }}>
                    {PREVIEW_BLOCKS.map((block: PreviewBlock, index) => {
                        const topPx = topsPx[block.id] ?? baseTops[block.id] ?? 0;
                        const heightPx = minutesToPixels(block.duration);

                        const isConflictBlock =
                            isInteractive && !tutorialDone && conflict && (index === 0 || index === 1);

                        return (
                            <motion.div
                                key={block.id}
                                className={[
                                    "uo-preview__block",
                                    step === 2 && index === 0 && !isInteractive ? "is-highlighted" : "",
                                    isInteractive ? "is-live" : "",
                                    isConflictBlock ? "is-conflict" : ""
                                ].join(" ")}
                                style={{
                                    top: `${topPx}px`,
                                    height: `${heightPx}px`,
                                    backgroundColor: block.color
                                }}
                                drag={isInteractive ? "y" : false}
                                dragConstraints={isInteractive ? getConstraints(topPx, heightPx) : undefined}
                                dragElastic={0}
                                dragMomentum={false}
                                onDragEnd={(_, info) => {
                                    if (!isInteractive) return;
                                    setHasUserMoved(true);
                                    const raw = topPx + info.offset.y;
                                    onBlockDragEnd(block, raw);
                                }}
                                whileHover={
                                    isInteractive
                                        ? { boxShadow: "0 0 25px rgba(201,22,154,0.6)", scale: 1.03 }
                                        : {}
                                }
                                transition={{ duration: 0.2 }}
                            >
                                {block.label}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {isInteractive && showYourTurn && (
                    <motion.div
                        className="uo-preview-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3>Your Turn.</h3>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isInteractive && !tutorialDone && (
                    <motion.div
                        className="uo-preview-hint"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div className="uo-preview-hint__title">Resolve the conflict</div>
                        <div className="uo-preview-hint__desc">
                            Drag the blocks to remove the overlap. Snap is every 15 minutes.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isInteractive && showResolved && (
                    <motion.div
                        className="uo-preview-badge"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        Conflict resolved
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default TimelinePreview;
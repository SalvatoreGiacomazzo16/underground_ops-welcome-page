import { useTimelineEngine } from "./hooks/useTimelineEngine";

type TimelineDemoProps = {
    interactive?: boolean;
    highlightMode?: "axis" | "blocks" | "control";
};

export default function TimelineDemo({
    interactive = false,
    highlightMode = "axis",
}: TimelineDemoProps) {
    const {
        config,
        blocks,
        onBlockPointerDown,
        onCanvasPointerMove,
        onCanvasPointerUp,
    } = useTimelineEngine({ interactive });

    const height = config.totalSlots * config.slotHeightPx;

    const axisEmphasis = highlightMode === "axis";
    const blocksEmphasis = highlightMode === "blocks";
    const controlEmphasis = highlightMode === "control";

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                    "linear-gradient(180deg, rgba(12, 6, 24, 0.96) 0%, rgba(18, 8, 34, 0.98) 100%)",
                boxShadow:
                    axisEmphasis
                        ? "0 0 34px rgba(157,0,255,0.10), inset 0 0 44px rgba(255,255,255,0.02)"
                        : "0 0 30px rgba(157,0,255,0.14), inset 0 0 40px rgba(255,255,255,0.02)",
                overflow: "hidden",
                transition: "box-shadow 220ms ease, border-color 220ms ease",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                }}
            >
                <div
                    style={{
                        fontSize: 13,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: axisEmphasis ? "#f1dcff" : "#c9b7ff",
                        textShadow: axisEmphasis
                            ? "0 0 12px rgba(209,0,255,0.28)"
                            : "none",
                        transition: "color 180ms ease, text-shadow 180ms ease",
                    }}
                >
                    Timeline Wizard
                </div>

                <div
                    style={{
                        fontSize: 12,
                        color: controlEmphasis
                            ? "#7CFFB2"
                            : interactive
                                ? "#7CFFB2"
                                : "#B8A8E8",
                        opacity: 0.95,
                        textShadow: controlEmphasis
                            ? "0 0 10px rgba(124,255,178,0.22)"
                            : "none",
                        transition: "color 180ms ease, text-shadow 180ms ease",
                    }}
                >
                    {interactive ? "Interactive mode" : "Preview mode"}
                </div>
            </div>

            {/* Body */}
            <div
                data-timeline-canvas
                style={{
                    position: "relative",
                    height,
                    overflow: "hidden",
                    paddingInline: 12,
                    background: axisEmphasis
                        ? "repeating-linear-gradient(to bottom, rgba(255,255,255,0.075) 0px, rgba(255,255,255,0.075) 1px, transparent 1px, transparent 20px)"
                        : "repeating-linear-gradient(to bottom, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 20px)",
                    transition: "background 220ms ease",
                }}
                onPointerMove={onCanvasPointerMove}
                onPointerUp={onCanvasPointerUp}
            >
                {!interactive && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(180deg, rgba(8, 4, 18, 0.10) 0%, rgba(8, 4, 18, 0.18) 100%)",
                            pointerEvents: "none",
                            zIndex: 2,
                        }}
                    />
                )}

                {blocks.map((block, index) => {
                    const isControlTarget = controlEmphasis && index === 1;

                    const blockGlow =
                        blocksEmphasis || controlEmphasis
                            ? index === 1
                                ? "0 0 30px rgba(210,0,255,0.34), inset 0 0 18px rgba(255,255,255,0.05)"
                                : "0 0 24px rgba(157,0,255,0.28), inset 0 0 18px rgba(255,255,255,0.04)"
                            : "0 0 14px rgba(157,0,255,0.12), inset 0 0 10px rgba(255,255,255,0.03)";

                    const blockOpacity = axisEmphasis ? 0.72 : interactive ? 1 : 0.9;

                    return (
                        <div
                            key={block.id}
                            onPointerDown={(e) => onBlockPointerDown(block.id, e)}
                            style={{
                                position: "absolute",
                                left: 12,
                                right: 12,
                                top: block.startSlot * config.slotHeightPx,
                                height: block.durationSlots * config.slotHeightPx,
                                borderRadius: 14,
                                padding: "10px 12px",
                                background:
                                    index === 1
                                        ? "linear-gradient(135deg, #c000ff 0%, #7d2cff 100%)"
                                        : "linear-gradient(135deg, #8b2dff 0%, #5f1ee8 100%)",
                                border: isControlTarget
                                    ? "1px solid rgba(255,255,255,0.18)"
                                    : "1px solid rgba(255,255,255,0.08)",
                                boxShadow: blockGlow,
                                color: "#f7f2ff",
                                cursor: interactive ? "grab" : "default",
                                userSelect: "none",
                                opacity: blockOpacity,
                                zIndex: isControlTarget ? 3 : 1,
                                transform: isControlTarget ? "scale(1.015)" : "scale(1)",
                                transition:
                                    "box-shadow 180ms ease, transform 180ms ease, opacity 180ms ease, border-color 180ms ease",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    marginBottom: 4,
                                }}
                            >
                                {block.label}
                            </div>

                            <div
                                style={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.78)",
                                }}
                            >
                                {block.durationSlots * 15} min slot
                            </div>

                            {isControlTarget && (
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "4px 8px",
                                        borderRadius: 999,
                                        background: "rgba(255,255,255,0.08)",
                                        fontSize: 11,
                                        color: "#ffffff",
                                        boxShadow: "0 0 12px rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: "#7CFFB2",
                                            boxShadow: "0 0 8px rgba(124,255,178,0.45)",
                                        }}
                                    />
                                    Focus block
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer hint */}
            <div
                style={{
                    padding: "12px 16px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 12,
                    color: controlEmphasis ? "#d9ffe9" : "#bba9e8",
                    background: "rgba(255,255,255,0.02)",
                    transition: "color 180ms ease",
                }}
            >
                {highlightMode === "axis" &&
                    "Time structure comes first. Build the frame before the movement."}

                {highlightMode === "blocks" &&
                    "Each block becomes a scheduled moment inside the event flow."}

                {highlightMode === "control" &&
                    (interactive
                        ? "Drag a block to reshape the flow. Collisions stay controlled."
                        : "Control mode is armed. The schedule is ready for live interaction.")}
            </div>
        </div>
    );
}
import { useTimelineEngine } from "./hooks/useTimelineEngine";

export default function TimelineDemo() {

    const {
        config,
        blocks,
        onBlockPointerDown,
        onCanvasPointerMove,
        onCanvasPointerUp,
    } = useTimelineEngine();

    const height = config.totalSlots * config.slotHeightPx;

    return (
        <div
            data-timeline-canvas
            style={{
                position: "relative",
                height,
                border: "1px solid #333",
                overflow: "hidden",
            }}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={onCanvasPointerUp}
        >
            {blocks.map(block => (
                <div
                    key={block.id}
                    onPointerDown={(e) => onBlockPointerDown(block.id, e)}
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: block.startSlot * config.slotHeightPx,
                        height: block.durationSlots * config.slotHeightPx,
                        background: "#9d00ff",
                        border: "1px solid #000",
                        cursor: "grab",
                    }}
                >
                    {block.label}
                </div>
            ))}
        </div>
    );
}
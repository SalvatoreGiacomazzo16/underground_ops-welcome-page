import { PREVIEW_BLOCKS } from "../../constants/previewBlocks";
import type { PreviewBlock } from "../../types/PreviewBlock";
import { motion } from "framer-motion";

// ================================
// DEMO TIMELINE CONFIG
// ================================

const SLOT_HEIGHT = 20;
const UNIT_MINUTES = 15;
const TOTAL_MINUTES = 240;

// ================================
// UTILS
// ================================

const minutesToPixels = (minutes: number) =>
    (minutes / UNIT_MINUTES) * SLOT_HEIGHT;

const generateSlots = () => {
    const slots = [];

    for (let m = 0; m <= TOTAL_MINUTES; m += UNIT_MINUTES) {
        const isHour = m % 60 === 0;
        const hour = Math.floor(m / 60);

        slots.push({
            minute: m,
            isHour,
            label: isHour
                ? `${String(hour).padStart(2, "0")}:00`
                : null
        });
    }

    return slots;
};

const TimelinePreview = () => {
    const slots = generateSlots();

    return (
        <section className="uo-preview">
            <div className="uo-preview__wrapper">

                {/* AXIS */}
                <div className="uo-preview__axis">
                    {slots.map((slot) => (
                        <div
                            key={slot.minute}
                            className={`uo-preview__axis-slot ${slot.isHour ? "is-hour" : ""
                                }`}
                            style={{
                                top: `${minutesToPixels(slot.minute)}px`
                            }}
                        >
                            {slot.label && (
                                <span className="uo-preview__axis-label">
                                    {slot.label}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* TIMELINE */}
                <div className="uo-preview__timeline">
                    {PREVIEW_BLOCKS.map((block: PreviewBlock) => {
                        const top = minutesToPixels(block.start);
                        const height = minutesToPixels(block.duration);

                        return (
                            <motion.div
                                key={block.id}
                                className="uo-preview__block"
                                style={{
                                    top: `${top}px`,
                                    height: `${height}px`,
                                    backgroundColor: block.color
                                }}
                                whileHover={{
                                    boxShadow: "0 0 20px rgba(201,22,154,0.4)",
                                    scale: 1.02
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {block.label}
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default TimelinePreview;

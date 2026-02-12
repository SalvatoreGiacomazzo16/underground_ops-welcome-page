import { useState, useRef, useEffect } from "react";
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
    const [step, setStep] = useState<number>(1);

    const axisRef = useRef<HTMLDivElement | null>(null);
    const firstBlockRef = useRef<HTMLDivElement | null>(null);

    const [wizardPos, setWizardPos] = useState({
        top: 0,
        left: 0
    });

    // ================================
    // DYNAMIC POSITIONING
    // ================================

    useEffect(() => {
        const updatePosition = () => {
            let rect: DOMRect | null = null;

            if (step === 1 && axisRef.current) {
                rect = axisRef.current.getBoundingClientRect();
                setWizardPos({
                    top: rect.top + rect.height / 2 - 40,
                    left: rect.left - 220
                });
            }

            if (step === 2 && firstBlockRef.current) {
                rect = firstBlockRef.current.getBoundingClientRect();
                setWizardPos({
                    top: rect.top - 90,
                    left: rect.right + 20
                });
            }

            if (step === 3 && axisRef.current) {
                rect = axisRef.current.getBoundingClientRect();
                setWizardPos({
                    top: rect.top + 60,
                    left: rect.left - 220
                });
            }
        };

        updatePosition();
    }, [step]);

    return (
        <section className="uo-preview">
            <div className="uo-preview__wrapper">

                {/* ================= AXIS ================= */}
                <div
                    ref={axisRef}
                    className={`uo-preview__axis ${step === 1 ? "is-highlighted" : ""
                        }`}
                >
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

                {/* ================= TIMELINE ================= */}
                <div className="uo-preview__timeline">
                    {PREVIEW_BLOCKS.map((block: PreviewBlock, index) => {
                        const top = minutesToPixels(block.start);
                        const height = minutesToPixels(block.duration);

                        return (
                            <motion.div
                                ref={index === 0 ? firstBlockRef : null}
                                key={block.id}
                                className={`uo-preview__block ${step === 2 && index === 0
                                    ? "is-highlighted"
                                    : ""
                                    }`}
                                style={{
                                    top: `${top}px`,
                                    height: `${height}px`,
                                    backgroundColor: block.color
                                }}
                                whileHover={{
                                    boxShadow:
                                        "0 0 20px rgba(201,22,154,0.4)",
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

            {/* ================= WIZARD ================= */}
            {step > 0 && (
                <motion.div
                    className={`uo-wizard arrow-${step}`}
                    style={{
                        position: "fixed",
                        top: wizardPos.top,
                        left: wizardPos.left
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                        if (step < 3) setStep(step + 1);
                        else setStep(0);
                    }}
                >

                    <div className="uo-wizard__content">
                        {step === 1 && (
                            <p>
                                Timeline axis.
                                Each line = 15 minutes.
                            </p>
                        )}
                        {step === 2 && (
                            <p>
                                Blocks = scheduled sets
                                inside the event.
                            </p>
                        )}
                        {step === 3 && (
                            <p>
                                Movement snaps every 15 min
                                for precision control.
                            </p>
                        )}

                        <span className="uo-wizard__hint">
                            click to continue →
                        </span>
                    </div>
                </motion.div>
            )}
        </section>
    );
};

export default TimelinePreview;

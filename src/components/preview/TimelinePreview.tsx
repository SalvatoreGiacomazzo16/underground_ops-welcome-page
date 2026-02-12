import { PREVIEW_BLOCKS } from "../../constants/previewsBlocks";
import type { PreviewBlock } from "../../types/PreviewBlock";
import { motion } from "framer-motion";

const SLOT_HEIGHT = 20;        // px
const UNIT_MINUTES = 15;

const minutesToPixels = (minutes: number) =>
    (minutes / UNIT_MINUTES) * SLOT_HEIGHT;

const TimelinePreview = () => {
    return (
        <section className="uo-preview">
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
        </section>
    );
};

export default TimelinePreview;

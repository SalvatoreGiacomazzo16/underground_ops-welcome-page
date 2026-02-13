import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const line1: string = "UNDERGROUND";
const line2: string = "OPS";

const HeroSystemBoot = () => {
    const [isOn, setIsOn] = useState(false);
    const [isStable, setIsStable] = useState(false);
    const [glitchIndexes, setGlitchIndexes] = useState<number[]>([]);

    // Boot iniziale
    useEffect(() => {
        const t = setTimeout(() => {
            setIsOn(true);
        }, 600);

        return () => clearTimeout(t);
    }, []);

    // Stabilizzazione dopo boot (durata boot ~3.2s)
    useEffect(() => {
        if (!isOn) return;

        const t = setTimeout(() => {
            setIsStable(true);
        }, 3200);

        return () => clearTimeout(t);
    }, [isOn]);

    // Glitch random solo quando stabile
    useEffect(() => {
        if (!isStable) return;

        const interval = setInterval(() => {
            const totalLength = line1.length + line2.length;
            const randomIndex = Math.floor(Math.random() * totalLength);

            setGlitchIndexes([randomIndex]);

            setTimeout(() => {
                setGlitchIndexes([]);
            }, 200);
        }, 1800);

        return () => clearInterval(interval);
    }, [isStable]);

    const renderLine = (
        text: string,
        baseDelay: number,
        lineOffset: number
    ) =>
        text.split("").map((char, index) => {
            const globalIndex = lineOffset + index;
            const pulseDuration = 3 + Math.random() * 3;

            return (
                <motion.span
                    key={`${text}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={isOn ? { opacity: 1 } : {}}
                    transition={{
                        delay: baseDelay + index * 0.05,
                        duration: 0.25
                    }}
                    className={`uo-letter 
            ${isStable ? "pulse-active" : ""}
            ${glitchIndexes.includes(globalIndex) ? "is-glitch" : ""}
          `}
                    style={{
                        animationDuration: `${pulseDuration}s`
                    }}
                >
                    {char}
                </motion.span>
            );
        });

    return (
        <section className="uo-hero">

            <div className={`uo-hero__background ${isStable ? "is-stable" : ""}`}>

                <div className="uo-hero__content">

                    {/* TITLE */}
                    <h1 className={`uo-hero__title ${isOn ? "is-on" : ""} ${isStable ? "is-stable" : ""}`}>

                        <div className="uo-line">
                            {renderLine(line1, 0.6, 0)}
                        </div>

                        <div className="uo-line">
                            {renderLine(line2, 1.6, line1.length)}
                        </div>
                    </h1>

                    {/* SUBTITLE */}
                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 8,
                            color: "rgba(255,255,255,0.08)"
                        }}
                        animate={
                            isOn
                                ? {
                                    opacity: 1,
                                    y: 0,
                                    color: "rgba(255,255,255,0.75)"
                                }
                                : {}
                        }
                        transition={{
                            delay: 4.2,
                            duration: 1.8,
                            ease: "easeOut"
                        }}
                        className="uo-hero__subtitle"
                    >
                        system control for underground events
                    </motion.p>

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={isOn ? { opacity: 1 } : {}}
                        transition={{ delay: 4.8, duration: 1 }}
                        className="uo-hero__cta"
                    >
                        ENTER
                    </motion.button>
                </div>
            </div>

        </section >
    );
};

export default HeroSystemBoot;

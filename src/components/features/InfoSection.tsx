import { useState, useEffect, useRef } from "react";
import ControlPanel from "./ControlPanel";
import NeonDial from "./NeonDial";
import "../../styles/info-section.css";

type Mode = "manual" | "uops";

export default function InfoSection() {
    const [mode, setMode] = useState<Mode>("manual");

    const [revealTitle, setRevealTitle] = useState(false);
    const [showDanger, setShowDanger] = useState(false);
    const [persistentGlitch, setPersistentGlitch] = useState(false);
    const [showPanels, setShowPanels] = useState(false);
    const [highlightErrors, setHighlightErrors] = useState(false);
    const [showDial, setShowDial] = useState(false);

    const sectionRef = useRef<HTMLElement | null>(null);


    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;

                setRevealTitle(true);

                timers.push(setTimeout(() => setShowDanger(true), 1500));
                timers.push(setTimeout(() => setPersistentGlitch(true), 2100));
                timers.push(
                    setTimeout(() => {
                        setShowPanels(true);
                        setHighlightErrors(true);
                    }, 3600)
                );
                timers.push(setTimeout(() => setShowDial(true), 4450));
                timers.push(setTimeout(() => setHighlightErrors(false), 4500));

                observer.disconnect();
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            observer.disconnect();
            timers.forEach(clearTimeout);
        };
    }, []);

    return (
        <section ref={sectionRef} className="uo-info-section">
            <div className="uo-title-row">
                <h2 className="uo-line-title">
                    {/* LINE 1 */}
                    <span className="title-line">
                        {revealTitle &&
                            "What happens when".split(" ").map((word, wi) => (
                                <span key={`l1w-${wi}`} className="word">
                                    {word.split("").map((char, ci) => {
                                        // delay continuo (word index + char index)
                                        const index = wi * 10 + ci; // semplice, stabile
                                        return (
                                            <span
                                                key={`l1c-${wi}-${ci}`}
                                                className="letter"
                                                style={{ animationDelay: `${index * 0.04}s` }}
                                            >
                                                {char}
                                            </span>
                                        );
                                    })}
                                    {/* spazio tra parole (non splittato in lettere) */}
                                    <span className="space">&nbsp;</span>
                                </span>
                            ))}
                    </span>

                    {/* LINE 2 */}
                    <span className="title-line">
                        {showDanger && (
                            <>
                                <span className="word">you&nbsp;</span>

                                <span className="danger-wrapper">
                                    {"lose control".split(" ").map((word, wi) => (
                                        <span key={`dw-${wi}`} className="word">
                                            {word.split("").map((char, ci) => (
                                                <span
                                                    key={`danger-${wi}-${ci}`}
                                                    data-text={char}
                                                    className={`danger-letter ${persistentGlitch ? "glitching" : ""}`}
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                            <span className="space">&nbsp;</span>
                                        </span>
                                    ))}
                                </span>

                                <span className="question visible">?</span>
                            </>
                        )}
                    </span>
                </h2>

                {showDial && (
                    <div className="uo-dial-anchor visible">
                        <NeonDial mode={mode} onChange={setMode} />
                    </div>
                )}
            </div>

            <div className={`control-room-grid ${showPanels ? "visible" : ""} ${highlightErrors ? "bursting" : ""}`}>
                <ControlPanel
                    delay={0}
                    mode={mode}
                    highlightErrors={mode === "manual"}
                    title="Timeline Engine"
                    manualLogs={["[ERROR] Collision detected", "[WARNING] Overlapping blocks", "[ALERT] Visibility lost"]}
                    uopsLogs={["[OK] 15-min snapping active", "[OK] Collision control stable", "[OK] Live overview synced"]}
                />

                <ControlPanel
                    delay={150}
                    mode={mode}
                    highlightErrors={mode === "manual"}
                    title="Staff Allocation"
                    manualLogs={["[ERROR] Role mismatch", "[WARNING] Double booking", "[UNKNOWN] Assignment unclear"]}
                    uopsLogs={["[OK] Smart assignments", "[OK] Role validation", "[OK] Availability synced"]}
                />

                <ControlPanel
                    delay={300}
                    mode={mode}
                    highlightErrors={mode === "manual"}
                    title="Multi-Day Matrix"
                    manualLogs={["[ERROR] Date conflict", "[WARNING] Location mismatch", "[FAIL] Template inconsistency"]}
                    uopsLogs={["[OK] Multi-day matrix loaded", "[OK] Location filters active", "[OK] Templates synced"]}
                />
            </div>
        </section>
    );
}
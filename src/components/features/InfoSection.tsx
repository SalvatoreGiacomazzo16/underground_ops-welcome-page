import { useState, useEffect, useRef } from "react";
import InfoCard from "./InfoCard";
import "../../styles/info-section.css";

type Mode = "manual" | "uops";

export default function InfoSection() {
    const [mode] = useState<Mode>("manual");

    const [revealTitle, setRevealTitle] = useState(false);
    const [showDanger, setShowDanger] = useState(false);
    const [persistentGlitch, setPersistentGlitch] = useState(false);
    const [showCards, setShowCards] = useState(false);

    const sectionRef = useRef<HTMLElement | null>(null);

    const text = "What happens when you";

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;

                setRevealTitle(true);

                // pausa più lunga prima della minaccia
                setTimeout(() => setShowDanger(true), 1400);

                // glitch parte un po’ dopo che è apparso
                setTimeout(() => setPersistentGlitch(true), 1900);

                // card entrano ancora dopo
                setTimeout(() => setShowCards(true), 2500);

                observer.disconnect();
            },
            { threshold: 0.4 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);


    return (
        <section ref={sectionRef} className="uo-info-section">

            <div className="uo-title-sequence">
                <h2 className="uo-line-title">

                    {revealTitle &&
                        text.split("").map((char, index) => (
                            <span
                                key={index}
                                className="letter"
                                style={{ animationDelay: `${index * 0.04}s` }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}

                    {showDanger && (
                        <>
                            <span className="danger-wrapper">
                                {" "}
                                {"lose control".split("").map((char, index) => {
                                    const randomClass = Math.random() > 0.6 ? "chaos" : "";
                                    return (
                                        <span
                                            key={index}
                                            data-text={char}
                                            className={`danger-letter ${persistentGlitch ? "glitching" : ""} ${randomClass}`}
                                        >
                                            {char === " " ? "\u00A0" : char}
                                        </span>
                                    );
                                })}

                            </span>



                            <span className={`question ${showDanger ? "visible" : ""}`}>
                                ?
                            </span>
                        </>
                    )}


                </h2>
            </div>

            <div className={`uo-info-grid ${showCards ? "show" : ""}`}>
                <InfoCard
                    delay={0}
                    mode={mode}
                    title="Timeline chaos"
                    problems={["Overlaps", "Last minute changes", "No visibility"]}
                    solutions={[
                        "15-min snapping + collision control",
                        "Drag & resize with constraints",
                        "Live overview + conflicts warning"
                    ]}
                />

                <InfoCard
                    delay={120}
                    mode={mode}
                    title="Staff confusion"
                    problems={["Who is assigned?", "Role mismatch", "Double booking"]}
                    solutions={[
                        "Smart assignments",
                        "Quick add staff ⚡",
                        "Role badges + availability"
                    ]}
                />

                <InfoCard
                    delay={240}
                    mode={mode}
                    title="Multi-day madness"
                    problems={["Lost in dates", "Location mixups", "Template chaos"]}
                    solutions={[
                        "Multi-day matrix",
                        "Location filters",
                        "Copy day templates"
                    ]}
                />
            </div>

        </section>
    );
}

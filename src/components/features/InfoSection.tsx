import { useEffect, useRef, useState } from "react";
import ControlPanel from "./ControlPanel";
import "../../styles/info-section.css";

type Mode = "manual" | "uops";

export default function InfoSection() {
    const [mode] = useState<Mode>("manual");
    const [isVisible, setIsVisible] = useState(false);

    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setIsVisible(true);
                observer.disconnect();
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`uo-info-section ${isVisible ? "is-visible" : ""}`}
        >
            <div className="uo-info-shell">
                <header className="uo-info-header">
                    <h2 className="uo-info-title">
                        <span className="uo-info-title-line">WHAT HAPPENS WHEN</span>
                        <span className="uo-info-title-line">
                            YOU <span className="uo-info-title-accent">LOSE CONTROL</span>?
                        </span>
                    </h2>

                    <p className="uo-info-subtitle">
                        Scheduling, staff and multi-day logic stop moving as one.
                        That’s when operations start to drift.
                    </p>
                </header>

                <div className="uo-info-schematic">
                    <div className="uo-schematic-core">
                        <span className="uo-schematic-label">OPS STATE</span>
                        <span className="uo-schematic-status">SYNC DEGRADED</span>
                    </div>

                    <div className="uo-schematic-node uo-node-timeline">
                        <span className="uo-node-title">Timeline Engine</span>
                        <span className="uo-node-meta">collision pressure</span>
                    </div>

                    <div className="uo-schematic-node uo-node-staff">
                        <span className="uo-node-title">Staff Allocation</span>
                        <span className="uo-node-meta">assignment drift</span>
                    </div>

                    <div className="uo-schematic-node uo-node-multiday">
                        <span className="uo-node-title">Multi-Day Matrix</span>
                        <span className="uo-node-meta">date context mismatch</span>
                    </div>

                    <span className="uo-link uo-link-core-left" />
                    <span className="uo-link uo-link-core-right" />
                    <span className="uo-link uo-link-core-bottom" />
                </div>

                <div className="control-room-grid">
                    <ControlPanel
                        delay={0}
                        mode={mode}
                        highlightErrors={mode === "manual"}
                        title="Timeline Engine"
                        manualLogs={[
                            "[ERROR] Collision detected",
                            "[WARNING] Overlapping blocks",
                            "[ALERT] Visibility lost",
                        ]}
                        uopsLogs={[
                            "[OK] 15-min snapping active",
                            "[OK] Collision control stable",
                            "[OK] Live overview synced",
                        ]}
                    />

                    <ControlPanel
                        delay={150}
                        mode={mode}
                        highlightErrors={mode === "manual"}
                        title="Staff Allocation"
                        manualLogs={[
                            "[ERROR] Role mismatch",
                            "[WARNING] Double booking",
                            "[UNKNOWN] Assignment unclear",
                        ]}
                        uopsLogs={[
                            "[OK] Smart assignments",
                            "[OK] Role validation",
                            "[OK] Availability synced",
                        ]}
                    />

                    <ControlPanel
                        delay={300}
                        mode={mode}
                        highlightErrors={mode === "manual"}
                        title="Multi-Day Matrix"
                        manualLogs={[
                            "[ERROR] Date conflict",
                            "[WARNING] Location mismatch",
                            "[FAIL] Template inconsistency",
                        ]}
                        uopsLogs={[
                            "[OK] Multi-day matrix loaded",
                            "[OK] Location filters active",
                            "[OK] Templates synced",
                        ]}
                    />
                </div>
            </div>
        </section>
    );
}
import { useEffect, useRef, useState } from "react";
import ControlPanel from "./ControlPanel";
import "../../styles/info-section.css";

type Mode = "manual" | "uops";

export default function InfoSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [isRestored, setIsRestored] = useState(false);

    const sectionRef = useRef<HTMLElement | null>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const firstCardTriggerRef = useRef<HTMLDivElement | null>(null);
    const restoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const restoreTriggeredRef = useRef(false);

    const mode: Mode = isRestored ? "uops" : "manual";

    const schematicStatus = isRestored ? "SYNC RESTORED" : "SYNC DEGRADED";
    const timelineMeta = isRestored ? "aligned timeline" : "collision pressure";
    const staffMeta = isRestored ? "roles synchronized" : "assignment drift";
    const multidayMeta = isRestored ? "schedule unified" : "date context mismatch";

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

    useEffect(() => {
        const gridEl = gridRef.current;
        const firstCardEl = firstCardTriggerRef.current;

        if (!gridEl || !firstCardEl) return;

        const mediaQuery = window.matchMedia("(max-width: 980px)");
        let restoreObserver: IntersectionObserver | null = null;

        const triggerRestore = () => {
            if (restoreTriggeredRef.current) return;

            restoreTriggeredRef.current = true;
            setIsRestoring(true);

            if (restoreTimeoutRef.current) {
                clearTimeout(restoreTimeoutRef.current);
            }

            restoreTimeoutRef.current = setTimeout(() => {
                setIsRestoring(false);
                setIsRestored(true);
            }, 520);
        };

        const setupObserver = () => {
            restoreObserver?.disconnect();

            if (restoreTriggeredRef.current) return;

            const target = mediaQuery.matches ? firstCardEl : gridEl;
            const threshold = mediaQuery.matches ? 0.45 : 0.22;

            restoreObserver = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) return;
                    triggerRestore();
                    restoreObserver?.disconnect();
                },
                {
                    threshold,
                    rootMargin: "0px 0px -6% 0px",
                }
            );

            restoreObserver.observe(target);
        };

        setupObserver();

        const handleChange = () => {
            if (restoreTriggeredRef.current) return;
            setupObserver();
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            restoreObserver?.disconnect();
            mediaQuery.removeEventListener("change", handleChange);

            if (restoreTimeoutRef.current) {
                clearTimeout(restoreTimeoutRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className={[
                "uo-info-section",
                isVisible ? "is-visible" : "",
                isRestoring ? "is-restoring" : "",
                isRestored ? "is-restored" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="uo-info-shell">
                <header className="uo-info-header">
                    <h2 className="uo-info-title">
                        <span className="uo-info-title-line">WHAT HAPPENS WHEN</span>
                        <span className="uo-info-title-line">
                            YOU{" "}
                            <span
                                className={[
                                    "uo-info-title-accent",
                                    !isRestoring && !isRestored
                                        ? "uo-info-title-accent--flicker"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                LOSE CONTROL
                            </span>
                            ?
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
                        <span className="uo-schematic-status">{schematicStatus}</span>
                    </div>

                    <div className="uo-schematic-node uo-node-timeline">
                        <span className="uo-node-title">Timeline Engine</span>
                        <span className="uo-node-meta">{timelineMeta}</span>
                    </div>

                    <div className="uo-schematic-node uo-node-staff">
                        <span className="uo-node-title">Staff Allocation</span>
                        <span className="uo-node-meta">{staffMeta}</span>
                    </div>

                    <div className="uo-schematic-node uo-node-multiday">
                        <span className="uo-node-title">Multi-Day Matrix</span>
                        <span className="uo-node-meta">{multidayMeta}</span>
                    </div>

                    <span className="uo-link uo-link-core-left" />
                    <span className="uo-link uo-link-core-right" />
                    <span className="uo-link uo-link-core-bottom" />
                </div>

                <div className="control-room-grid" ref={gridRef}>
                    <div className="uo-control-panel-trigger" ref={firstCardTriggerRef}>
                        <ControlPanel
                            delay={0}
                            mode={mode}
                            highlightErrors={mode === "manual" && !isRestoring}
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
                    </div>

                    <ControlPanel
                        delay={150}
                        mode={mode}
                        highlightErrors={mode === "manual" && !isRestoring}
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
                        highlightErrors={mode === "manual" && !isRestoring}
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
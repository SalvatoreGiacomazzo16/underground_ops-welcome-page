import { useEffect, useState } from "react";

type Props = {
    title: string;
    manualLogs: string[];
    uopsLogs: string[];
    mode: "manual" | "uops";
    delay?: number;
    highlightErrors?: boolean;
};

export default function ControlPanel({
    title,
    manualLogs,
    uopsLogs,
    mode,
    delay = 0,
    highlightErrors = false,
}: Props) {
    const [stabilized, setStabilized] = useState(false);
    const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    const logs = stabilized ? uopsLogs : manualLogs;

    /* =============================
       MODE TRANSITION
    ==============================*/
    useEffect(() => {
        const timer = setTimeout(() => {
            setStabilized(mode === "uops");
        }, delay);

        return () => clearTimeout(timer);
    }, [mode, delay]);

    /* =============================
       STREAM LOGS LIKE TERMINAL
    ==============================*/
    useEffect(() => {
        setVisibleLogs([]);

        let index = 0;

        const stream = setInterval(() => {
            if (index < logs.length) {
                setVisibleLogs((prev) => [...prev, logs[index]]);
                index++;
            } else {
                clearInterval(stream);
            }
        }, 180);

        return () => clearInterval(stream);
    }, [logs]);

    /* =============================
       PROGRESS ANIMATION
    ==============================*/
    useEffect(() => {
        const target = stabilized ? 100 : 35;

        let current = 0;
        const interval = setInterval(() => {
            current += stabilized ? 3 : 1.5;

            if (current >= target) {
                current = target;
                clearInterval(interval);
            }

            setProgress(Math.floor(current));
        }, 18);

        return () => clearInterval(interval);
    }, [stabilized]);

    return (
        <div
            className={`cr-panel ${stabilized ? "uops" : "manual"} ${highlightErrors && !stabilized ? "alerting" : ""
                }`}
        >

            {/* HEADER */}
            <div className="cr-header">
                <span className="cr-title">{title}</span>

                <div className="cr-status-indicator">
                    <span className={`cr-dot ${stabilized ? "safe" : "danger"}`} />
                    <span className="cr-status-text">
                        {stabilized ? "STABILIZED" : "UNSTABLE"}
                    </span>
                </div>
            </div>

            {/* LIVE LOGS */}
            <div className="cr-logs">
                {visibleLogs.map((log, i) => (
                    <div
                        key={i}
                        className={`cr-log-line ${stabilized ? "ok" : "error"}`}
                    >
                        {log}
                    </div>
                ))}
            </div>

            {/* STATUS BAR */}
            <div className="cr-status">
                <div className="cr-bar">
                    <div
                        className="cr-bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="cr-percentage">
                    {progress}%
                </div>
            </div>

            {/* subtle monitor noise layer */}
            <div className="cr-noise" />
        </div>
    );
}

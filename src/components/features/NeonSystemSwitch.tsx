import { useEffect, useState } from "react";

type Props = {
    mode: "manual" | "uops";
    onToggle: () => void;
};

export default function NeonSystemSwitch({ mode, onToggle }: Props) {
    const [booting, setBooting] = useState(false);

    useEffect(() => {
        if (mode === "uops") {
            setBooting(true);
            const t = setTimeout(() => setBooting(false), 800);
            return () => clearTimeout(t);
        }
    }, [mode]);

    return (
        <div className="ns-wrapper">
            <div className="ns-label">SYSTEM MODE</div>

            <div
                className={`ns-switch ${mode} ${booting ? "booting" : ""}`}
                onClick={onToggle}
            >
                <div className="ns-track" />

                <div className="ns-knob">
                    <div className="ns-knob-core" />
                </div>

                <div className="ns-mode-text">
                    {mode === "manual" ? "MANUAL" : "UOPS"}
                </div>

                <div className="ns-scan" />
            </div>
        </div>
    );
}

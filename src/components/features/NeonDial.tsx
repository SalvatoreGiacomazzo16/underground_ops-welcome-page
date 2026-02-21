import { useRef, useState, useEffect } from "react";

type Props = {
    mode: "manual" | "uops";
    onChange: (mode: "manual" | "uops") => void;
};

export default function NeonDial({ mode, onChange }: Props) {
    const dialRef = useRef<HTMLDivElement>(null);
    const [angle, setAngle] = useState(mode === "uops" ? 270 : 0);
    const [dragging, setDragging] = useState(false);

    const MIN = 0;
    const MAX = 270;
    const SNAP_UP = 240;
    const SNAP_DOWN = 30;

    const calculateAngle = (x: number, y: number) => {
        if (!dialRef.current) return;

        const rect = dialRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const radians = Math.atan2(y - cy, x - cx);
        let deg = radians * (180 / Math.PI);

        deg += 135;

        if (deg < MIN) deg = MIN;
        if (deg > MAX) deg = MAX;

        // micro elastic resistance
        const tension = deg > MAX ? MAX : deg < MIN ? MIN : deg;

        setAngle(tension);
    };

    const snapPosition = () => {
        if (angle >= SNAP_UP) {
            setAngle(MAX);
            onChange("uops");
        } else if (angle <= SNAP_DOWN) {
            setAngle(MIN);
            onChange("manual");
        }
    };

    useEffect(() => {
        const move = (e: PointerEvent) => {
            if (!dragging) return;
            calculateAngle(e.clientX, e.clientY);
        };

        const up = () => {
            if (!dragging) return;
            setDragging(false);
            snapPosition();
        };

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);

        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        };
    }, [dragging, angle]);

    return (
        <div className="amp-dial-wrapper">

            <div
                ref={dialRef}
                className={`amp-dial ${mode}`}
                onPointerDown={(e) => {
                    setDragging(true);
                    calculateAngle(e.clientX, e.clientY);
                }}
                style={{ transform: `rotate(${angle}deg)` }}
            >
                <div className="amp-indicator" />
            </div>
        </div>
    );
}

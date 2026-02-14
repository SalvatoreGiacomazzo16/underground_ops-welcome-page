import { useEffect, useState } from "react";

type Props = {
    title: string;
    problems: string[];
    solutions: string[];
    mode: "manual" | "uops";
    delay?: number;
};

export default function InfoCard({
    title,
    problems,
    solutions,
    mode,
    delay = 0
}: Props) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), delay);
        return () => clearTimeout(timer);
    }, [delay, mode]);

    const isSolved = mode === "uops";

    return (
        <div
            className={`uo-card ${isSolved ? "flipped" : ""} ${animate ? "animate" : ""
                }`}
        >
            <div className="uo-card-inner">

                {/* FRONT */}
                <div className="uo-card-face uo-card-front">
                    <h3>{title}</h3>
                    <ul>
                        {problems.map((p, i) => (
                            <li key={i}>{p}</li>
                        ))}
                    </ul>
                    <span className="uo-risk">risk: high</span>
                </div>

                {/* BACK */}
                <div className="uo-card-face uo-card-back">
                    <h3>{title}</h3>
                    <ul>
                        {solutions.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                    <span className="uo-solved-badge">Solved ✓</span>
                </div>

            </div>
        </div>
    );
}

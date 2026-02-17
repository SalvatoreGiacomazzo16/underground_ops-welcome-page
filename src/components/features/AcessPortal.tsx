import { useEffect, useState } from "react";
import "../../styles/access-portal.css";

type Phase = "closed" | "typing" | "lift" | "form";

export default function AccessPortal() {
    const [open, setOpen] = useState(false);
    const [phase, setPhase] = useState<Phase>("closed");
    const [typed, setTyped] = useState("");

    const full = "Access Protocol";

    const toggle = () => {
        if (!open) {
            setOpen(true);
            setPhase("typing");
            setTyped("");
        } else {
            setOpen(false);
            setPhase("closed");
            setTyped("");
        }
    };

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    useEffect(() => {
        if (!open || phase !== "typing") return;

        let i = 0;

        const sequence = async () => {
            // pause iniziale
            await new Promise(r => setTimeout(r, 300));


            setTyped(".");
            await new Promise(r => setTimeout(r, 200));

            setTyped(". .");
            await new Promise(r => setTimeout(r, 400));

            // reset
            setTyped("");
            await new Promise(r => setTimeout(r, 150));


            // reset e digita titolo
            setTyped("");
            await new Promise(r => setTimeout(r, 150));

            const interval = setInterval(() => {
                i++;
                setTyped(full.slice(0, i));
                if (i >= full.length) {
                    clearInterval(interval);

                    // pausa prima lift
                    setTimeout(() => setPhase("lift"), 500);
                    setTimeout(() => setPhase("form"), 900);
                }
            }, 40);
        };

        sequence();
    }, [open, phase]);

    return (
        <>
            <button
                className={`portal-orb ${open ? "active" : ""}`}
                onClick={toggle}
            >
                {!open && <span className="orb-label">Join</span>}
            </button>

            <div className={`portal-bg ${open ? "expand" : ""}`} />

            <div className={`portal-overlay ${open ? "visible" : ""}`}>
                <div className={`portal-center ${phase !== "closed" ? "show" : ""}`}>

                    <div className={`terminal-line ${phase === "lift" || phase === "form" ? "lift" : ""}`}>

                        <span className="prompt">&gt;</span>

                        <span className="terminal-text">
                            {typed}
                        </span>

                        <span className={`caret ${phase !== "closed" ? "on" : ""}`}>
                            ▍
                        </span>

                    </div>


                    <div className={`portal-form-shell ${phase === "form" ? "show" : ""}`}>
                        <div className="portal-form-placeholder">
                            <div className="ph-title">Control Room</div>
                            <div className="ph-row" />
                            <div className="ph-row" />
                            <div className="ph-btn" />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

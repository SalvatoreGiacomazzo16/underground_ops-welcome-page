import { useEffect, useState } from "react";
import { SignIn, useAuth } from "@clerk/react";
import "../../styles/access-portal.css";
import ClerkLaravelBridge from "../auth/ClerkLaravelBridge";

type Phase = "closed" | "typing" | "lift" | "form";

export default function AccessPortal() {
    const [open, setOpen] = useState(false);
    const [phase, setPhase] = useState<Phase>("closed");
    const [typed, setTyped] = useState("");
    const { isLoaded, isSignedIn } = useAuth();

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
            await new Promise(r => setTimeout(r, 300));

            setTyped(".");
            await new Promise(r => setTimeout(r, 200));

            setTyped(". .");
            await new Promise(r => setTimeout(r, 400));

            setTyped("");
            await new Promise(r => setTimeout(r, 150));

            const interval = setInterval(() => {
                i++;
                setTyped(full.slice(0, i));

                if (i >= full.length) {
                    clearInterval(interval);

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
                        <span className="terminal-text">{typed}</span>
                        <span className={`caret ${phase !== "closed" ? "on" : ""}`}>▍</span>
                    </div>

                    <div className={`portal-form-shell ${phase === "form" ? "show" : ""}`}>
                        {phase === "form" && (
                            <>
                                <ClerkLaravelBridge />

                                {isLoaded && !isSignedIn && (
                                    <SignIn
                                        routing="hash"
                                        appearance={{
                                            variables: {
                                                colorPrimary: "#d100ff",
                                                colorBackground: "rgba(10,0,20,0.88)",
                                                colorText: "#f7f2ff",
                                                colorInputBackground: "#120018",
                                                colorInputText: "#ffffff",
                                                borderRadius: "14px"
                                            },
                                            elements: {
                                                card: "uo-clerk-card",
                                                headerTitle: "uo-clerk-title",
                                                headerSubtitle: "uo-clerk-subtitle",
                                                socialButtonsBlockButton: "uo-clerk-social",
                                                formButtonPrimary: "uo-clerk-continue",
                                                footerActionLink: "uo-clerk-link",
                                                formFieldInput: "uo-clerk-input",
                                                formFieldLabel: "uo-clerk-label"
                                            },
                                            layout: {
                                                logoPlacement: "none"
                                            }
                                        }}
                                        fallbackRedirectUrl="/"
                                        forceRedirectUrl="/"
                                    />
                                )}

                                {isLoaded && isSignedIn && (
                                    <div className="uo-auth-success">
                                        <div className="uo-auth-loader">
                                            <div className="uo-auth-loader-ring" />
                                            <div className="uo-auth-loader-core" />
                                        </div>

                                        <div className="uo-auth-loader-copy">
                                            <div className="uo-auth-loader-line">&gt; identity verified</div>
                                            <div className="uo-auth-loader-line">&gt; syncing session<span className="uo-dots" /></div>
                                            <div className="uo-auth-loader-line uo-auth-loader-line--dim">&gt; opening control room</div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
import { useMemo, useState } from "react";
import WizardNarrative from "./WizardNarrative";
import TimelineDemo from "./TimelineDemo";

const WizardSection = () => {
    const [step, setStep] = useState(1);
    const [isInteractive, setIsInteractive] = useState(false);

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep((prev) => prev + 1);
            return;
        }

        setIsInteractive(true);
    };

    const highlightMode =
        isInteractive ? "control" :
            step === 1 ? "axis" :
                step === 2 ? "blocks" :
                    "control";

    return (
        <section className="uo-wizard-section">
            <div className="uo-wizard-left">
                {!isInteractive ? (
                    <WizardNarrative
                        step={step}
                        totalSteps={totalSteps}
                        onNext={handleNext}
                    />
                ) : (
                    <div className="uo-wizard-live-panel">
                        <div className="uo-wizard-live-kicker">
                            Live Control
                        </div>

                        <h3 className="uo-wizard-live-title">
                            Schedule Integrity Preserved
                        </h3>

                        <p className="uo-wizard-live-copy">
                            Drag blocks to reshape the flow. The demo keeps the structure readable
                            and prevents chaotic overlap.
                        </p>

                        <div className="uo-wizard-live-status">
                            <span className="uo-live-dot" />
                            Interactive mode enabled
                        </div>

                        <div className="uo-wizard-live-card">
                            <div className="uo-wizard-live-card-title">
                                Control Layer
                            </div>

                            <ul className="uo-wizard-live-list">
                                <li>Drag blocks in real time</li>
                                <li>Snap keeps timing readable</li>
                                <li>Collision lock prevents chaos</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className="uo-wizard-right">
                <TimelineDemo
                    interactive={isInteractive}
                    highlightMode={highlightMode}
                />
            </div>
        </section>
    );
};

export default WizardSection;
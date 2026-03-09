import { useState } from "react";
import WizardNarrative from "./WizardNarrative";
import TimelineDemo from "./TimelineDemo";

const WizardSection = () => {
    const [step, setStep] = useState(1);
    const [isInteractive, setIsInteractive] = useState(false);

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep((prev) => prev + 1);
        } else {
            // finito wizard → attiva demo
            setIsInteractive(true);
        }
    };

    return (
        <section className="uo-wizard-section">

            <div className="uo-wizard-left">
                {!isInteractive && (
                    <WizardNarrative
                        step={step}
                        totalSteps={totalSteps}
                        onNext={handleNext}
                    />
                )}
            </div>

            <div className="uo-wizard-right">
                <TimelineDemo />
            </div>

        </section>
    );
};

export default WizardSection;
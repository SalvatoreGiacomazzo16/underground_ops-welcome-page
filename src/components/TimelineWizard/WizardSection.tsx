import { useState } from "react";
import WizardNarrative from "./WizardNarrative";
import TimelinePreview from "./TimelinePreview";

const WizardSection = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep((prev) => prev + 1);
        }
    };

    return (
        <section className="uo-wizard-section">

            <div className="uo-wizard-left">
                <WizardNarrative
                    step={step}
                    totalSteps={totalSteps}
                    onNext={handleNext}
                />
            </div>

            <div className="uo-wizard-right">
                <TimelinePreview
                    step={step}
                    totalSteps={totalSteps}
                    onNext={handleNext}
                />
            </div>

        </section>
    );
};

export default WizardSection;
import { motion, AnimatePresence } from "framer-motion";

interface WizardNarrativeProps {
    step: number;
    totalSteps: number;
    onNext: () => void;
}

const stepsContent = [
    {
        title: "Time Is Structure",
        description:
            "Every line represents 15 minutes. Precision begins with clarity."
    },
    {
        title: "Blocks Define Flow",
        description:
            "Each block is a scheduled set inside your event. No chaos. Only structure."
    },
    {
        title: "Control The Movement",
        description:
            "Snapping ensures perfect alignment. Every move is intentional."
    }
];

const WizardNarrative = ({
    step,
    totalSteps,
    onNext
}: WizardNarrativeProps) => {
    const current = stepsContent[step - 1];

    return (
        <div className="uo-wizard-narrative">

            <div className="uo-wizard-progress">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <span
                        key={index}
                        className={`uo-wizard-dot ${step === index + 1 ? "is-active" : ""
                            }`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    className="uo-wizard-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="uo-wizard-step">
                        STEP {step}/{totalSteps}
                    </span>

                    <h2 className="uo-wizard-title">
                        {current.title}
                    </h2>

                    <p className="uo-wizard-description">
                        {current.description}
                    </p>

                    <button
                        className="uo-wizard-button"
                        onClick={onNext}
                    >
                        {step < totalSteps ? "Continue →" : "Activate Demo"}
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default WizardNarrative;
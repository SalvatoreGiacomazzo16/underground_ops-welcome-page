import { motion } from "framer-motion";
import { FEATURES } from "../../constants/features";
import FeatureCard from "./FeatureCard";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
};

const FeaturesSection = () => {
    return (
        <section className="uo-features">
            <motion.div
                className="uo-features__grid"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                {FEATURES.map((feature) => (
                    <motion.div
                        key={feature.id}
                        variants={item}
                        transition={{ duration: 0.8 }}
                    >
                        <FeatureCard feature={feature} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default FeaturesSection;

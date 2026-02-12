import { motion } from "framer-motion";

const HeroSystemBoot = () => {
    return (
        <section className="uo-hero">
            <div className="uo-hero__content">

                <motion.h1
                    initial={{ opacity: 0, letterSpacing: "0.4em" }}
                    animate={{ opacity: 1, letterSpacing: "0.1em" }}
                    transition={{ duration: 1.2 }}
                    className="uo-hero__title"
                >
                    UNDERGROUND OPS
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.6 }}
                    className="uo-hero__subtitle"
                >
                    system control for underground events
                </motion.p>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="uo-hero__cta"
                >
                    ENTER CONTROL ROOM
                </motion.button>

            </div>
        </section>
    );
};

export default HeroSystemBoot;

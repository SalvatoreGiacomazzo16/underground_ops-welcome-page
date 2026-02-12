import Layout from "../components/layout/Layout";
import HeroSystemBoot from "../components/hero/HeroSystemBoot";
import { MotionSection } from "../components/ui/MotionSection";
import FeaturesSection from "../components/features/FeaturesSection";
import TimelinePreview from "../components/preview/TimelinePreview";



const Home = () => {
    return (
        <Layout>
            <HeroSystemBoot />
            <FeaturesSection />
            <TimelinePreview />

            <MotionSection>
                <div style={{ height: "100vh" }} />
            </MotionSection>

            {/* Timeline Preview */}
            {/* CTA */}
        </Layout>
    );
};

export default Home;

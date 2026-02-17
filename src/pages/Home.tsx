import Layout from "../components/layout/Layout";
import HeroSystemBoot from "../components/hero/HeroSystemBoot";
import { MotionSection } from "../components/ui/MotionSection";
import InfoSection from "../components/features/InfoSection";
import TimelinePreview from "../components/preview/TimelinePreview";
import AccessPortal from "../components/features/AcessPortal";


const Home = () => {
    return (
        <Layout>
            <HeroSystemBoot />
            <InfoSection />
            <TimelinePreview />

            <MotionSection>
                <div style={{ height: "100vh" }} />
            </MotionSection>
            <AccessPortal />


            {/* Timeline Preview */}
            {/* CTA */}
        </Layout>
    );
};

export default Home;

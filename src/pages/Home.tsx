import Layout from "../components/layout/Layout";
import HeroSystemBoot from "../components/hero/HeroSystemBoot";
import { MotionSection } from "../components/ui/MotionSection";
import InfoSection from "../components/features/InfoSection";
import AccessPortal from "../components/features/AcessPortal";
import WizardSection from "../components/TimelineWizard/WizardSection";

const Home = () => {
    return (
        <Layout>
            <HeroSystemBoot />
            <InfoSection />

            <WizardSection />
            <MotionSection>
                <div style={{ height: "100vh" }} />
            </MotionSection>

            <AccessPortal />
        </Layout>
    );
};


export default Home;

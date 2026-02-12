import type { Feature } from "../../types/Feature";

type FeatureCardProps = {
    feature: Feature;
};

const FeatureCard = ({ feature }: FeatureCardProps) => {
    return (
        <div className="uo-feature-card">
            <h3 className="uo-feature-card__title">
                {feature.title}
            </h3>
            <p className="uo-feature-card__desc">
                {feature.description}
            </p>
        </div>
    );
};

export default FeatureCard;

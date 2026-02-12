import type { PropsWithChildren } from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";

type LayoutProps = PropsWithChildren<{}>;

const Layout = ({ children }: LayoutProps) => {
    const progress = useScrollProgress();

    return (
        <div className="uo-layout">
            <div
                className="uo-scroll-indicator"
                style={{ transform: `scaleY(${progress})` }}
            />
            {children}
        </div>
    );
};

export default Layout;

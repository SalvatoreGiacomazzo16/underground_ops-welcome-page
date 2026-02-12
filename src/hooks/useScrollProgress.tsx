import { useEffect, useState } from "react";

export const useScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const total = document.body.scrollHeight - window.innerHeight;
            const current = window.scrollY;
            const value = total > 0 ? current / total : 0;
            setProgress(value);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return progress;
};

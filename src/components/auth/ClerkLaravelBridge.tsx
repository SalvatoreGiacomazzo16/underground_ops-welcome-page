import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/react";

export default function ClerkLaravelBridge() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const sentRef = useRef(false);

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user || sentRef.current) return;

        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) return;

        sentRef.current = true;

        const params = new URLSearchParams({
            clerk_id: user.id,
            email,
            name: user.fullName ?? user.firstName ?? "",
        });

        window.location.href = `https://underground-ops.test/auth/clerk/bridge?${params.toString()}`;
    }, [isLoaded, isSignedIn, user]);

    return null;
}
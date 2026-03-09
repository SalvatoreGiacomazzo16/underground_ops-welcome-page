import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/react";

export default function ClerkLaravelBridge() {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    const sentRef = useRef(false);

    useEffect(() => {
        const run = async () => {
            if (!isLoaded || !isSignedIn || !user || sentRef.current) return;

            sentRef.current = true;

            try {
                const token = await getToken();

                const res = await fetch("https://underground-ops.test/auth/clerk/bridge", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        clerk_id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName ?? user.firstName ?? "",
                        token,
                    }),
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error("Clerk bridge failed:", text);
                    sentRef.current = false;
                    return;
                }

                const data = await res.json();

                if (data?.ok && data?.redirect) {
                    window.location.href = data.redirect;
                } else {
                    console.error("Unexpected bridge response:", data);
                    sentRef.current = false;
                }
            } catch (error) {
                console.error("Bridge request error:", error);
                sentRef.current = false;
            }
        };

        run();
    }, [isLoaded, isSignedIn, user, getToken]);

    return null;
}
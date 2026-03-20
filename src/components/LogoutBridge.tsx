import { useEffect } from "react";
import { useClerk } from "@clerk/react";

export default function LogoutBridge() {
    const clerk = useClerk();

    useEffect(() => {
        clerk.signOut({ redirectUrl: "/" });
    }, [clerk]);

    return (
        <div className="uo-auth-success">
            <div className="uo-auth-loader">
                <div className="uo-auth-loader-ring" />
                <div className="uo-auth-loader-core" />
            </div>

            <div className="uo-auth-loader-copy">
                <div className="uo-auth-loader-line">&gt; closing control room</div>
                <div className="uo-auth-loader-line">&gt; clearing operator session</div>
                <div className="uo-auth-loader-line uo-auth-loader-line--dim">&gt; returning to welcome page</div>
            </div>
        </div>
    );
}
export default function Footer() {
    return (
        <footer
            style={{
                width: "100%",
                padding: "28px 20px 40px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background:
                    "linear-gradient(180deg, rgba(8,0,16,0.35) 0%, rgba(8,0,16,0.7) 100%)",
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 12,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#ff4fd8",
                    }}
                >
                    2026 - Underground Ops
                </div>

                <div
                    style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.78)",
                    }}
                >
                    Built by Salvatore Giacomazzo
                </div>

                <a
                    href="https://github.com/SalvatoreGiacomazzo16"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        fontSize: 14,
                        color: "#f7f2ff",
                        textDecoration: "none",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 999,
                        padding: "10px 16px",
                        background: "rgba(255,255,255,0.03)",
                        boxShadow: "0 0 16px rgba(209,0,255,0.08)",
                    }}
                >
                    GitHub / SalvatoreGiacomazzo16
                </a>
            </div>
        </footer>
    );
}
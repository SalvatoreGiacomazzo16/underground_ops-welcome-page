import "../../styles/control-panel.css";

type Mode = "manual" | "uops";

type ControlPanelProps = {
    delay?: number;
    mode: Mode;
    highlightErrors?: boolean;
    title: string;
    manualLogs: string[];
    uopsLogs: string[];
};

const META_BY_TITLE: Record<string, string> = {
    "Timeline Engine": "slot collision pressure",
    "Staff Allocation": "assignment drift",
    "Multi-Day Matrix": "date context mismatch",
};

function parseLog(log: string, fallbackTag: string) {
    const match = log.match(/^\[(.*?)\]\s*(.*)$/);
    if (!match) {
        return { tag: fallbackTag, text: log };
    }

    return {
        tag: match[1].toUpperCase(),
        text: match[2],
    };
}

function getTagTone(tag: string, mode: Mode) {
    if (mode === "uops") return "is-ok";

    if (tag.includes("ERROR") || tag.includes("FAIL")) return "is-critical";
    if (tag.includes("ALERT") || tag.includes("WARNING")) return "is-warning";
    return "is-muted";
}

export default function ControlPanel({
    delay = 0,
    mode,
    highlightErrors = false,
    title,
    manualLogs,
    uopsLogs,
}: ControlPanelProps) {
    const isManual = mode === "manual";
    const logs = (isManual ? manualLogs : uopsLogs)
        .slice(0, 2)
        .map((log) => parseLog(log, isManual ? "WARNING" : "OK"));

    const meta = META_BY_TITLE[title] ?? "system state tracking";
    const statusLabel = isManual ? "DESYNC" : "SYNCED";
    const stability = isManual ? 35 : 94;

    return (
        <article
            className={[
                "uo-control-panel",
                isManual ? "is-desync" : "is-synced",
                highlightErrors && isManual ? "is-live" : "",
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="uo-control-panel__ambient" />

            <header className="uo-control-panel__header">
                <div className="uo-control-panel__heading">
                    <h3 className="uo-control-panel__title">{title}</h3>
                    <p className="uo-control-panel__meta">{meta}</p>
                </div>

                <span className="uo-control-panel__status">
                    <span className="uo-control-panel__status-dot" />
                    {statusLabel}
                </span>
            </header>

            <ul className="uo-control-panel__logs">
                {logs.map((log, index) => (
                    <li className="uo-control-panel__log" key={`${title}-log-${index}`}>
                        <span
                            className={[
                                "uo-control-panel__tag",
                                getTagTone(log.tag, mode),
                            ].join(" ")}
                        >
                            {log.tag}
                        </span>

                        <span className="uo-control-panel__text">{log.text}</span>
                    </li>
                ))}
            </ul>

            <footer className="uo-control-panel__footer">
                <span className="uo-control-panel__footer-label">stability</span>

                <div className="uo-control-panel__meter">
                    <span
                        className="uo-control-panel__meter-fill"
                        style={{ width: `${stability}%` }}
                    />
                </div>

                <span className="uo-control-panel__footer-value">{stability}%</span>
            </footer>
        </article>
    );
}
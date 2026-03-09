export type Block = {
    id: string;
    label: string;
    startSlot: number;        // posizione in slot (intero)
    durationSlots: number;    // durata in slot (intero > 0)
    color?: string;
};

export type TimelineConfig = {
    unitMinutes: number;
    slotHeightPx: number;
    totalSlots: number;
    totalMinutes: number;
};

export type WizardPhase =
    | "intro"
    | "explain"
    | "ready"
    | "tutorial_conflict"
    | "tutorial_your_turn"
    | "tutorial_resolved"
    | "free_play";

export type PointerDragState = {
    isDragging: boolean;
    pointerId: number | null;
    blockId: string | null;
    startClientY: number;
    startSlot: number;
};

export type EngineFlags = {
    collisionLock: boolean;
    showOverlay: boolean;
    showHint: boolean;
    showBadge: boolean;
};

export type MachineEvent =
    | "NEXT"
    | "ACTIVATE_DEMO"
    | "CONFLICT_APPLIED"
    | "DRAG_START"
    | "DRAG_END"
    | "CONFLICT_RESOLVED";
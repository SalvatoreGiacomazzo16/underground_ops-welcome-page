// src/components/TimelineWizard/engine/stateMachine.ts

import type {
    WizardPhase,
    MachineEvent,
    EngineFlags,
} from "../engine/types.ts";

/* =========================================
   TRANSITION MAP
   phase -> event -> nextPhase
========================================= */

const TRANSITIONS: Record<
    WizardPhase,
    Partial<Record<MachineEvent, WizardPhase>>
> = {
    intro: {
        NEXT: "explain",
    },

    explain: {
        NEXT: "ready",
    },

    ready: {
        ACTIVATE_DEMO: "tutorial_conflict",
    },

    tutorial_conflict: {
        CONFLICT_APPLIED: "tutorial_your_turn",
    },

    tutorial_your_turn: {
        CONFLICT_RESOLVED: "tutorial_resolved",
    },

    tutorial_resolved: {
        NEXT: "free_play",
    },

    free_play: {
        // eventualmente RESET in futuro
    },
};

/* =========================================
   TRANSITION FUNCTION
========================================= */

export function transition(
    current: WizardPhase,
    event: MachineEvent
): WizardPhase {
    const next = TRANSITIONS[current]?.[event];

    return next ?? current;
}

/* =========================================
   PHASE FLAGS
   Deriva UI behavior e regole engine
========================================= */

export function phaseFlags(phase: WizardPhase): EngineFlags {
    switch (phase) {
        case "intro":
        case "explain":
            return {
                collisionLock: false,
                showOverlay: false,
                showHint: false,
                showBadge: false,
            };

        case "ready":
            return {
                collisionLock: false,
                showOverlay: true,
                showHint: false,
                showBadge: false,
            };

        case "tutorial_conflict":
            return {
                collisionLock: false,
                showOverlay: false,
                showHint: false,
                showBadge: false,
            };

        case "tutorial_your_turn":
            return {
                collisionLock: false, // permettiamo overlap finché non risolve
                showOverlay: true,
                showHint: true,
                showBadge: false,
            };

        case "tutorial_resolved":
            return {
                collisionLock: true, // da qui in poi no overlap
                showOverlay: false,
                showHint: false,
                showBadge: true,
            };

        case "free_play":
            return {
                collisionLock: true,
                showOverlay: false,
                showHint: false,
                showBadge: false,
            };

        default:
            return {
                collisionLock: true,
                showOverlay: false,
                showHint: false,
                showBadge: false,
            };
    }
}


import type { TimelineConfig } from "../hooks/types";

export const UNIT_MINUTES = 15;
export const SLOT_HEIGHT_PX = 20;

export const TOTAL_MINUTES = 240; // 4h demo
export const TOTAL_SLOTS = TOTAL_MINUTES / UNIT_MINUTES;

export const MIN_DURATION_SLOTS = 4; // 60 minuti

export const STORAGE_KEY_TUTORIAL_DONE =
    "uo_timeline_wizard_done_v1";

export const DEFAULT_CONFIG: TimelineConfig = {
    unitMinutes: UNIT_MINUTES,
    slotHeightPx: SLOT_HEIGHT_PX,
    totalMinutes: TOTAL_MINUTES,
    totalSlots: TOTAL_SLOTS,
};
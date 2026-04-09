import type { OneDimNormalizedSignal } from "../types";

export type ReceivedRequest = {
    requestId: string;
    signalsData: OneDimNormalizedSignal[];
};

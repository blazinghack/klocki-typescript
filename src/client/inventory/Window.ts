import { _Slot } from "./Slot";

export class _Window {
    public _slots: _Slot[];
    private _slotIndex: number;

    constructor(countSlots: number) {
        this._slotIndex = 0;
        this._slots = new Array(countSlots);
    }
    public _initAppendSlot(s: _Slot) {
        if (this._slotIndex >= this._slots.length) {
            throw new Error("init window: too small window size in constructor");
        }
        this._slots[this._slotIndex++] = s;
    }
    public _initAppendSlots(ss: _Slot[]) {
        for (let i = 0; i < ss.length; i++) {
            this._initAppendSlot(ss[i]);
        }
    }
}

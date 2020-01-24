import { _PlayerInventory } from "./PlayerInventory";
import { _Window } from "./Window";
import { _Slot } from "./Slot";

export class _InventoryWindow extends _Window {

    constructor(inv: _PlayerInventory) {
        super(46);
        for (let i = 0; i < 5; i++) {
            this._initAppendSlot(new _Slot());
        }
        this._initAppendSlots(inv._armorInventory);
        this._initAppendSlots(inv._mainInventory);
        this._initAppendSlots(inv._offHandInventory);
    }
}

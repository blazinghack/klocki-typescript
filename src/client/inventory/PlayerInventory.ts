import { _Slot } from "./Slot";

export class _PlayerInventory {
    public _mainInventory: _Slot[];
    public _armorInventory: _Slot[];
    public _offHandInventory: _Slot[];
    // public _allInventory: _Slot[];
    public constructor() {
        this._mainInventory = _Slot._makeSlotArray(36);
        this._armorInventory = _Slot._makeSlotArray(4);
        this._offHandInventory = _Slot._makeSlotArray(1);
        // this._allInventory = this._armorInventory.concat(this._mainInventory, this._offHandInventory);
    }
}

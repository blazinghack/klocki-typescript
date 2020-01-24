import { _Klocki } from "../Klocki";
import { _PlayerInventory } from "../inventory/PlayerInventory";
import { _InventoryWindow } from "../inventory/InventoryWindow";
import { _Window } from "../inventory/Window";

import { _KlockiEntityPlayer } from "./KlockiEntityPlayer";

export class _KlockiEntityPlayerSP extends _KlockiEntityPlayer {
 

    public _touchMoveForward: number;
    public _touchMoveStrafe: number;
    public _inventory: _PlayerInventory;
    public _inventoryWindow: _InventoryWindow;
    public _currentWindow: _Window;
    public _selectedHotbarSlot: number;
    public _hotbarSlots: number;

    constructor(klocki: _Klocki) {
        super(klocki);
        this._doGravity = true;
        this._touchMoveForward = 0;
        this._touchMoveStrafe = 0;
        this._inventory = new _PlayerInventory();
        this._inventoryWindow = new _InventoryWindow(this._inventory);
        this._currentWindow = this._inventoryWindow;
        this._selectedHotbarSlot = 0;
        this._hotbarSlots = 9;
    }

    public _tick() {
        super._tick();
    }
    public _render() {
        if (this._klocki._personViewMode != 0) {
            super._render();
        }
    }
    public _scroll(delta: number) {
        this._selectedHotbarSlot += delta;
        this._selectedHotbarSlot = (this._selectedHotbarSlot + this._hotbarSlots) % this._hotbarSlots;
    }

}

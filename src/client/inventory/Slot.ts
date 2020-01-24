import { _ItemStack } from "./ItemStack";

export class _Slot {

    public _item: _ItemStack | null = null;

    public static _makeSlotArray(n: number): _Slot[] {
        const arr = new Array<_Slot>(n);
        for (let i = 0; i < n; i++) {
            arr[i] = new _Slot();
        }

        return arr;
    }

    public _setItem(is: _ItemStack) {
        this._item = is;
        // todo listeners?
    }
}

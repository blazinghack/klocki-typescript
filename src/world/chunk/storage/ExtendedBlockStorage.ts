import { _NibbleArray } from "../NibbleArray";

export class _ExtendedBlockStorage {
    public _data: Uint16Array;
    public _blocklightArray: _NibbleArray;
    public _skylightArray: _NibbleArray | null;

    public readonly _yBase: number;



    constructor(y: number, storeSkylight: boolean, data?: Uint16Array, blocklightArray?: _NibbleArray, skylightArray?: _NibbleArray) {
        this._yBase = y;
        if (data) {
            this._data = data;
            if (data.length !== 4096) {
                throw new Error(`data byteLen should be 8192 instead of ${data.byteLength}`);
            }
        } else {
            this._data = new Uint16Array(4096);
        }
        this._blocklightArray = blocklightArray || new _NibbleArray();
        if (storeSkylight) {
            this._skylightArray = skylightArray || new _NibbleArray();
        } else {
            this._skylightArray = null;
        }
    }

    public _setExtSkylightValue(x: number, y: number, z: number, value: number): void {
        if (this._skylightArray) {
            this._skylightArray._set(x, y, z, value);
        } else {
            throw new Error("There is no skylight");
        }
    }


    public _getExtSkylightValue(x: number, y: number, z: number): number {
        if (this._skylightArray) {
            return this._skylightArray._get(x, y, z);
        } else {
            throw new Error("There is no skylight");
        }
    }

    public _setExtBlocklightValue(x: number, y: number, z: number, value: number): void {
        this._blocklightArray._set(x, y, z, value);
    }

    public _getExtBlocklightValue(x: number, y: number, z: number): number {
        return this._blocklightArray._get(x, y, z);
    }


}

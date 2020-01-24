import { _NibbleArray } from "../NibbleArray";

export class _Uint32BlockStorage {
    public _data: Uint32Array;

    public _blocklightArray: _NibbleArray;
    public _skylightArray: _NibbleArray | null;
    private readonly _yBase: number;
    private _blockRefCount: number = 0;
    private _tickRefCount: number = 0;

    constructor(y: number, storeSkylight: boolean, data?: Uint32Array, blocklightArray?: _NibbleArray, skylightArray?: _NibbleArray) {
        this._yBase = y;
        if (data) {
            this._data = data;
            if (data.length !== 4096) {
                throw new Error(`data len should be 4096 instead of ${data.byteLength}`);
            }
        } else {
            this._data = new Uint32Array(4096);
        }
        this._blocklightArray = blocklightArray || new _NibbleArray();
        if (storeSkylight) {
            this._skylightArray = skylightArray || new _NibbleArray();
        } else {
            this._skylightArray = null;
        }
    }

    public isEmpty(): boolean {
        return this._blockRefCount === 0;
    }
    public _getNeedsRandomTick(): boolean {
        return this._tickRefCount > 0;
    }
    public _getYLocation(): number {
        return this._yBase;
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

    public _removeInvalidBlocks(): void {
        this._blockRefCount = 0;
        this._tickRefCount = 0;
        for (let i = 0; i < 16 * 16 * 16; i++) {
            // TODO
        }
    }

}

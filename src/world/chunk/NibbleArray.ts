export class _NibbleArray {
    /**
     * Byte array of data stored in this holder. Possibly a light map or some chunk data. Data is accessed in 4-bit
     * pieces.
     */
    public readonly _data: Uint8Array;
    constructor(data?: Uint8Array) {
        if (data) {
            this._data = data;
            if (data.length != 2048) {
                throw new Error(`ChunkNibbleArrays should be 2048 bytes not: ${data.length}`);
            }
        } else {
            this._data = new Uint8Array(2048);
        }
    }
    /**
     * Returns the nibble of data corresponding to the passed in x, y, z. y is at most 6 bits, z is at most 4.
     */
    public _get(x: number, y: number, z: number): number {
        return this._getFromIndex(this._getCoordinateIndex(x, y, z));
    }

    /**
     * Arguments are x, y, z, val. Sets the nibble of data at x << 11 | z << 7 | y to val.
     */
    public _set(x: number, y: number, z: number, value: number): void {
        this._setIndex(this._getCoordinateIndex(x, y, z), value);
    }

    public _getFromIndex(index: number): number {
        const i: number = this._getNibbleIndex(index);

        // return this.isLowerNibble(index) ? this.data[i] & 15 : this.data[i] >> 4 & 15;
        return (this._data[i] >> ((index & 1) << 2)) & 15;
    }

    public _setIndex(index: number, value: number): void {
        const i: number = this._getNibbleIndex(index);

        if (this._isLowerNibble(index)) {
            this._data[i] = (this._data[i] & 240 | value & 15);
        } else {
            this._data[i] = (this._data[i] & 15 | (value & 15) << 4);
        }
    }

    private _getCoordinateIndex(x: number, y: number, z: number): number {
        return y << 8 | z << 4 | x;
    }

    private _isLowerNibble(index: number): boolean {
        return (index & 1) === 0;
    }

    private _getNibbleIndex(index: number): number {
        return index >> 1;
    }

}

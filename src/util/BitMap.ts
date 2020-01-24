export class _BitMap {
    public _bits: Uint32Array;
    public _bitSize: number;
    public _mask: number;

    constructor(bitSize: number, bits: Uint32Array) {
        this._bitSize = bitSize;
        this._bits = bits;
        this._mask = (1 << this._bitSize) - 1;


    }

    public _get(i: number) {
        const bitSize = this._bitSize;
        i *= bitSize;
        const pos = i >> 5;
        const mask = this._mask;
        const ii = i & 0x1F;
        const pos2 = (i + bitSize - 1) >>> 5;

        const bits = this._bits;
        const len = bits.length;
        if (pos < len && pos2 < len) {
            if (pos2 != pos) {
                const used = 32 - ii;

                return ((bits[pos] >>> ii) | ((bits[pos2]) << used)) & mask;
            } else {
                return (bits[pos] >>> ii) & mask;
            }
        } else {
            return 0;
        }
    }
}

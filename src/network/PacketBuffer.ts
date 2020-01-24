export class _PacketBuffer {
    public static _utf8decoder = new TextDecoder("utf-8");
    public static _utf8encoder = new TextEncoder();

    public _b: ArrayBuffer;
    public _v: DataView;
    public _u8: Uint8Array;
    public _byteOffset: number;
    private _r: number;
    private _w: number;

    constructor(b: ArrayBuffer, byteOffsetIn?: number, byteLengthIn?: number) {
        const byteOffset = byteOffsetIn !== void 0 ? byteOffsetIn : 0;
        const byteLength = byteLengthIn !== void 0 ? byteLengthIn : b.byteLength - byteOffset;
        this._v = new DataView(b, byteOffset, byteLength);
        this._u8 = new Uint8Array(b, byteOffset, byteLength);
        this._byteOffset = byteOffset;
        this._b = b;
        this._r = 0;
        this._w = 0;
    }

    public static _varIntSize(n: number): number {
        if ((n & 0xFFFFFF80) === 0) {
            return 1;
        }
        if ((n & 0xFFFFC000) === 0) {
            return 2;
        }
        if ((n & 0xFFE00000) === 0) {
            return 3;
        }
        if ((n & 0xF0000000) === 0) {
            return 4;
        }

        return 5;
    }
    public static _stringSize(n: string): number {
        n = unescape(encodeURIComponent(n));

        return n.length + this._varIntSize(n.length);
    }
    public _reset(): void {
        this._r = 0;
        this._w = 0;
    }

    public _getReaderIndex(): number {
        return this._r;
    }
    public _setReaderIndex(r: number): void {
        this._r = r;
    }

    public _getWriterIndex(): number {
        return this._w;
    }
    public _setWriterIndex(w: number): void {
        this._w = w;
    }

    public _readUint8(): number {
        return this._v.getUint8(this._r++);
    }
    public _writeUint8(n: number): _PacketBuffer {
        this._v.setUint8(this._w++, n);

        return this;
    }
    public _readUint16(): number {
        const n: number = this._v.getUint16(this._r);
        this._r += 2;

        return n;
    }
    public _writeUint16(n: number): _PacketBuffer {
        this._v.setUint16(this._w, n);
        this._w += 2;

        return this;
    }
    public _readUint32(): number {
        const n: number = this._v.getUint32(this._r);
        this._r += 4;

        return n;
    }
    public _writeUint32(n: number): _PacketBuffer {
        this._v.setUint32(this._w, n);
        this._w += 4;

        return this;
    }

    public _readInt8(): number {
        return this._v.getInt8(this._r++);
    }
    public _writeInt8(n: number): _PacketBuffer {
        this._v.setInt8(this._w++, n);

        return this;
    }
    public _readInt16(): number {
        const n: number = this._v.getInt16(this._r);
        this._r += 2;

        return n;
    }
    public _writeInt16(n: number): _PacketBuffer {
        this._v.setInt16(this._w, n);
        this._w += 2;

        return this;
    }
    public _readInt32(): number {
        const n: number = this._v.getInt32(this._r);
        this._r += 4;

        return n;
    }
    public _writeInt32(n: number): _PacketBuffer {
        this._v.setInt32(this._w, n);
        this._w += 4;

        return this;
    }

    public _readBoolean(): boolean {
        return this._readUint8() !== 0;
    }
    public _writeBoolean(n: boolean): _PacketBuffer {
        this._writeUint8(n ? 1 : 0);

        return this;
    }
    public _readFloat32(): number {
        const n: number = this._v.getFloat32(this._r);
        this._r += 4;

        return n;
    }
    public _writeFloat32(n: number): _PacketBuffer {
        this._v.setFloat32(this._w, n);
        this._w += 4;

        return this;
    }
    public _readFloat64(): number {
        const n: number = this._v.getFloat64(this._r);
        this._r += 8;

        return n;
    }
    public _writeFloat64(n: number): _PacketBuffer {
        this._v.setFloat64(this._w, n);
        this._w += 8;

        return this;
    }
    public _writeUint8Array(n: Uint8Array) {
        this._u8.set(n, this._w);
        this._w += n.byteLength;
    }

    public _readVarInt(): number {
        let v: number = 0;
        let moves: number = 0;
        let buff: number;
        do {
            buff = this._readInt8();
            v |= (buff & 0x7F) << moves++ * 7;
            if (moves > 5) {
                throw new Error("VarInt too big");
            }
        } while ((buff & 0x80) === 128);

        return v;
    }
    public _writeVarInt(n: number): _PacketBuffer {
        while (n & 0xFFFFFF80) {
            this._writeInt8(n | 0x80);
            n = n >>> 7;
        }
        this._writeInt8(n);

        return this;
    }
    public _readString(): string {
        const len: number = this._readVarInt();
        const b: Uint8Array = this._peekUint8Array(len);

        return _PacketBuffer._utf8decoder.decode(b);
    }
    
    public _writeString(n: string): void {
        const b: Uint8Array = _PacketBuffer._utf8encoder.encode(n);
        this._writeVarInt(b.length);
        new Uint8Array(this._b).set(b, this._w);
        this._w += b.length;
    }

    public _peekUint8Array(n: number): Uint8Array {
        if (n > 1024 * 1024 * 2) {
            throw new Error("tried to peek " + n + " bytes");
        }
        const arr: Uint8Array = new Uint8Array(this._b, this._v.byteOffset + this._r, n);
        this._r += n;

        return arr;
    }
    public _peekUint32Array(n: number): Uint32Array {
        const arr: Uint32Array = new Uint32Array(this._b, this._v.byteOffset + this._r, n);
        this._r += n * 4;

        return arr;
    }
    public _readUint8Array(n: number): Uint8Array {
        const start = this._v.byteOffset + this._r;
        const arr: Uint8Array = new Uint8Array(this._b.slice(start, start + n));
        this._r += n;

        return arr;
    }
    public _readUint32Array(n: number): Uint32Array {
        const start = this._v.byteOffset + this._r;
        const end = start + n * 4;
        if(end > this._v.byteLength){
            throw new RangeError("can't read "+n+" more uint32s");
        }
        const arr: Uint32Array = new Uint32Array(this._b.slice(start, end));
        this._r += n * 4;

        return arr;
    }
    public _readInt32Array(n: number): Int32Array {
        const start = this._v.byteOffset + this._r;
        const end = start + n * 4;
        if(end > this._v.byteLength){
            throw new RangeError("can't read "+n+" more int32s");
        }
        const arr: Int32Array = new Int32Array(this._b.slice(start, end));
        this._r += n * 4;

        return arr;
    }
    public _readInt64Array(n: number): BigInt64Array {
        const start = this._v.byteOffset + this._r;
        const arr: BigInt64Array = new BigInt64Array(this._b.slice(start, start + n * 8));
        this._r += n * 8;

        return arr;
    }
    public _readUint64Array(n: number): BigUint64Array {
        const start = this._v.byteOffset + this._r;
        const arr: BigUint64Array = new BigUint64Array(this._b.slice(start, start + n * 8));
        this._r += n * 8;

        return arr;
    }

    public _readPosition(): Int32Array {
        const b = this._readUint32();
        const a = this._readUint32();
        const arr = new Int32Array(3);
        arr[0] = b >>> (38-32);
        arr[1] = a & 0xFFF;
        arr[2] = (a >>> 12)|((b&0x3F)<<12);
        
        return arr;
    }
}

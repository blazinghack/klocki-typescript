import { _PacketBuffer } from "../network/PacketBuffer";
export interface _NbtBase {
}
export class _NbtByte implements _NbtBase {
    public _val: Int8Array;
    constructor(initial: number) {
        this._val = new Int8Array(1);
        this._val[0] = initial;
    }
}
export class _NbtShort implements _NbtBase {
    public _val: Int16Array;
    constructor(initial: number) {
        this._val = new Int16Array(1);
        this._val[0] = initial;
    }
}
export class _NbtInt implements _NbtBase {
    public _val: Int32Array;
    constructor(initial: number) {
        this._val = new Int32Array(1);
        this._val[0] = initial;
    }
}
export class _NbtLong implements _NbtBase {
    public _val: Uint8Array;
    constructor(initial?: Uint8Array) {
        if (initial) {
            this._val = initial;
        } else {
            this._val = new Uint8Array(8);
        }
        
    }
}
export class _NbtFloat implements _NbtBase {
    public _val: Float32Array;
    constructor(initial: number) {
        this._val = new Float32Array(1);
        this._val[0] = initial;
    }
}
export class _NbtDouble implements _NbtBase {
    public _val: Float64Array;
    constructor(initial: number) {
        this._val = new Float64Array(1);
        this._val[0] = initial;
    }
}
export class _NbtByteArray implements _NbtBase {
    public _val: Uint8Array;
    constructor(initial?: Uint8Array) {
        if (initial) {
            this._val = initial;
        } else {
            this._val = new Uint8Array(0);
        }
        
    }
}
export class _NbtString implements _NbtBase {
    public _val: Uint8Array;
    constructor(initial?: Uint8Array) {
        if (initial) {
            this._val = initial;
        } else {
            this._val = new Uint8Array(0);
        }
        
    }
}
export class _NbtList implements _NbtBase {
    public _val: _NbtBase[];
    constructor(initial?: _NbtBase[]) {
        if (initial) {
            this._val = initial;
        } else {
            this._val = new Array<_NbtBase>(0);
        }
        
    }
}
export class _NbtIntArray implements _NbtBase {
    public _val: Int32Array;
    constructor(initial?: Int32Array) {
        if (initial) {
            this._val = initial;
        } else {
            this._val = new Int32Array(0);
        }
        
    }
}
export class _NbtLongArray implements _NbtBase {
    public _val: BigInt64Array;
    constructor(initial?: BigInt64Array) {
        if (initial) {
            this._val = initial;
        } else {
            this._val = new BigInt64Array(0);
        }
        
    }
}
export class _NbtReader {
    public static utf8decoder = new TextDecoder("utf-8");
    public static _instance: _NbtReader = new _NbtReader(new _PacketBuffer(new ArrayBuffer(0)));
    public _buf: _PacketBuffer;

    public constructor(buf: _PacketBuffer) {
        this._buf = buf;
    }
    public static _readNBT(buf: _PacketBuffer): Map<string, _NbtBase> {
        const m: Map<string, _NbtBase> = new Map();

        return m;
    }

    public static _readMainTag(buf: _PacketBuffer): Map<string, _NbtBase> {
        const m: Map<string, _NbtBase> = new Map();

        const r = _NbtReader._instance;
        r._buf = buf;
        r._readIdNameTag(m, 100);

        return m;
    }
    public static _readOptionalMainTag(buf: _PacketBuffer): Map<string, _NbtBase> | null {
        let m: Map<string, _NbtBase> | null = null;
        const nbtId = buf._readUint8();
        if (nbtId != 0) {
            m = new Map();

            const r = _NbtReader._instance;
            r._buf = buf;
            
            r._readNameTag(nbtId, m, 100);
        }

        return m;
    }

    public _readTag(id: number, level: number): Map<string, _NbtBase> | _NbtBase | null {
        if (id == 0) {
            return null;
        } else if (id == 1) {
            return new _NbtByte(this._buf._readInt8());
        } else if (id == 2) {
            return new _NbtShort(this._buf._readInt16());
        } else if (id == 3) {
            return new _NbtInt(this._buf._readInt32());
        } else if (id == 4) {
            return new _NbtLong(this._buf._readUint8Array(8));
        } else if (id == 5) {
            return new _NbtFloat(this._buf._readFloat32());
        } else if (id == 6) {
            return new _NbtDouble(this._buf._readFloat64());
        } else if (id == 7) {
            const size = this._buf._readUint32();
            if (size < 0 || size > 1024 * 1024) {
                throw new Error("nbt byte array size " + size + " too large");
            }

            return new _NbtByteArray(this._buf._readUint8Array(size));
        } else if (id == 8) {
            const size = this._buf._readUint16();

            return new _NbtString(this._buf._readUint8Array(size));
        } else if (id == 9) {
            const listedTagId = this._buf._readUint8();
            const listSize = this._buf._readUint32();
            if (listSize > 1024 * 1024) {
                throw new Error("nbt list size " + listSize + " too large");
            }
            const list = new Array<_NbtBase>(listSize);
            for (let i = 0; i < listSize; i++) {
                list[i] = this._readTag(listedTagId, level - 1)!;
            }

            return new _NbtList(list);
        } else if (id == 10) {
            const m: Map<string, _NbtBase> = new Map();
            for (let i = 0; ; i++) {
                const tagId = this._readIdNameTag(m, level - 1);
                if (tagId == 0) {
                    break;
                }
                if (i > 10000) {
                    throw new Error("too many nbt tags in compound");
                }
            }

            return m;
        } else if (id == 11) {
            const size = this._buf._readUint32();
            if (size < 0 ||  size > 1024 * 1024) {
                throw new Error("nbt int array size " + size + " too large");
            }

            return new _NbtIntArray(this._buf._readInt32Array(size));
        }else if (id == 12) {
            const size = this._buf._readUint32();
            if (size < 0 || size > 1024 * 1024) {
                throw new Error("nbt long array size " + size + " too large");
            }

            return new _NbtLongArray(this._buf._readInt64Array(size));
        }else{
            throw new Error("wrong nbt tag ID "+id);
        }

        return null;
    }
    public _readNameTag(id: number, obj: Map<string, _NbtBase>, level: number): void {
        const nameLen = this._buf._readInt16();
        const arr = this._buf._peekUint8Array(nameLen);
        const name = _NbtReader.utf8decoder.decode(arr);

        const tagdata: Map<string, _NbtBase> | _NbtBase = this._readTag(id, level - 1)!;

        obj.set(name, tagdata);
    }
    public _readIdNameTag(obj: Map<string, _NbtBase>, level: number): number {
        const id = this._buf._readUint8();
        if (id == 0) {
            return 0;
            // throw new Error("can't read empty nbt tag id 0");
        }
        this._readNameTag(id, obj, level);

        return id;
    }
}

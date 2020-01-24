export class _TagType {
    public static readonly _end: number = 0;
    public static readonly _byte: number = 1;
    public static readonly _short: number = 2;
    public static readonly _int: number = 3;
    public static readonly _long: number = 4;
    public static readonly _float: number = 5;
    public static readonly _double: number = 6;
    public static readonly _byteArray: number = 7;
    public static readonly _string: number = 8;
    public static readonly _list: number = 9;
    public static readonly _compound: number = 10;
    public static readonly _intArray: number = 11;
    public static readonly _longArray: number = 12;
}

export class _Byte { constructor(public _value: number) { } }
export class _Short { constructor(public _value: number) { } }
export class _Int { constructor(public _value: number) { } }
export class _Long { constructor(public _byteArray: Uint8Array) { } }
export class _Float { constructor(public _value: number) { } }

export interface _TagArray extends Array<_Tag> { }
export interface _TagObject { [key: string]: _Tag; }
export type _Tag = number | string | _Long | _Byte | _Short | _Int | _Float
    | Buffer | Int32Array | BigInt64Array | _TagArray | _TagObject;

export function _getTagType(tag: _Tag): number {
    if (tag === null) { return _TagType._end; }
    if (tag instanceof _Byte) { return _TagType._byte; }
    if (tag instanceof _Short) { return _TagType._short; }
    if (tag instanceof _Int) { return _TagType._int; }
    if (tag instanceof _Long) { return _TagType._long; }
    if (tag instanceof _Float) { return _TagType._float; }
    if (typeof tag === "number") { return _TagType._double; }
    if (tag instanceof Buffer) { return _TagType._byteArray; }
    if (typeof tag === "string") { return _TagType._string; }
    if (tag instanceof Array) { return _TagType._list; }
    if (tag.constructor === Object) { return _TagType._compound; }
    if (tag instanceof Int32Array) { return _TagType._intArray; }
    if (tag instanceof BigInt64Array) { return _TagType._longArray; }
    throw new Error("Invalid tag value");
}


import { _Byte, _Float, _getTagType, _Int, _Long, _Short, _Tag, _TagArray, _TagObject, _TagType } from "./tag";

function _accommodate(buffer: Buffer, offset: number, size: number) {
    if (buffer.length >= offset + size) { return buffer; }

    return Buffer.concat([buffer, Buffer.alloc(buffer.length)]);
}

export function _decodeTag(buffer: Buffer, offset: number, type: number) {
    let value: _Tag;
    switch (type) {
        case _TagType._byte:
            value = new _Byte(buffer.readInt8(offset));
            offset += 1;
            break;
        case _TagType._short:
            value = new _Short(buffer.readInt16BE(offset));
            offset += 2;
            break;
        case _TagType._int:
            value = new _Int(buffer.readInt32BE(offset));
            offset += 4;
            break;
        case _TagType._long: {
            const _byteArray: Uint8Array = new Uint8Array(8);
            _byteArray.set(buffer.slice(offset, 8), 0);
            value = new _Long(_byteArray);
            offset += 8;
            break;
        }
        case _TagType._float: value = new _Float(buffer.readFloatBE((offset += 4) - 4)); break;
        case _TagType._double: value = buffer.readDoubleBE((offset += 8) - 8); break;
        case _TagType._byteArray: {
            const len = buffer.readUInt32BE(offset);
            offset += 4;
            value = buffer.slice(offset, offset += len);
            break;
        }
        case _TagType._string: {
            const len = buffer.readUInt16BE(offset);
            value = (offset += 2, buffer.toString("utf-8", offset, offset += len));
            break;
        }
        case _TagType._list: {
            const type = buffer.readUInt8(offset);
            const len = buffer.readUInt32BE(offset + 1);
            offset += 5;
            const items: _Tag[] = [];
            for (let i = 0; i < len; i++) {
                ({ value, offset } = _decodeTag(buffer, offset, type));
                items.push(value);
            }
            value = items;
            break;
        }
        case _TagType._compound: {
            const object: _TagObject = {};
            while (true) {
                const type = buffer.readUInt8(offset);
                offset += 1;
                if (type == _TagType._end) { break; }
                const len = buffer.readUInt16BE(offset);
                offset += 2;
                const name = buffer.toString("utf-8", offset, offset += len)
                ; ({ value, offset } = _decodeTag(buffer, offset, type));
                object[name] = value;
            }
            value = object;
            break;
        }
        case _TagType._intArray: {
            const len = buffer.readUInt32BE(offset);
            offset += 4;
            const dataview = new DataView(buffer.buffer, offset);
            const array = new Int32Array(len);
            for (let i = 0; i < len; i++) {
                array[i] = dataview.getInt32(i * 4, false);
            }
            offset += array.buffer.byteLength;
            value = array;
            break;
        }
        case _TagType._longArray: {
            const len = buffer.readUInt32BE(offset);
            offset += 4;
            const dataview = new DataView(buffer.buffer, offset);
            const array = new BigInt64Array(len);
            for (let i = 0; i < len; i++) {
                array[i] = dataview.getBigInt64(i * 8, false);
            }
            offset += array.buffer.byteLength;
            value = array;
            break;
        }
        default: throw new Error(`Tag type ${type} not implemented`);
    }

    return { value: value, offset };
}

interface _DecodeResult {
    name?: string;
    value?: _Tag;
    offset: number;
}

export function _decode(buffer: Buffer, offset = 0): _DecodeResult {
    const type = buffer.readUInt8(offset);
    offset += 1;
    if (type == _TagType._end) { return { offset }; }
    const len = buffer.readUInt16BE(offset);
    offset += 2;
    const name = buffer.toString("utf-8", offset, offset += len);

    return { name, ..._decodeTag(buffer, offset, type) };
}

function _writeString(text: string, buffer: Buffer, offset: number) {
    const data = Buffer.from(text);
    buffer = _accommodate(buffer, offset, data.length + 2);
    offset = buffer.writeUInt16BE(data.length, offset);
    data.copy(buffer, offset), offset += data.length;

    return { buffer, offset };
}

export function _encodeTag(tag: _Tag, buffer = Buffer.alloc(1024), offset = 0) {
    buffer = _accommodate(buffer, offset, 8);
    if (tag instanceof _Byte) {
        offset = buffer.writeInt8(tag._value, offset);
    } else if (tag instanceof _Short) {
        offset = buffer.writeInt16BE(tag._value, offset);
    } else if (tag instanceof _Int) {
        offset = buffer.writeInt32BE(tag._value, offset);
    } else if (tag instanceof _Long) {
        for (let i = 0; i < 8; i++) {
            offset = buffer.writeUInt8(tag._byteArray[i], offset);
        }
    } else if (tag instanceof _Float) {
        offset = buffer.writeFloatBE(tag._value, offset);
    } else if (typeof tag == "number") {
        offset = buffer.writeDoubleBE(tag, offset);
    } else if (tag instanceof Buffer) {
        offset = buffer.writeUInt32BE(tag.length, offset);
        buffer = _accommodate(buffer, offset, tag.length);
        tag.copy(buffer, offset), offset += tag.length;
    } else if (tag instanceof Array) {
        const type = tag.length > 0 ? _getTagType(tag[0]) : _TagType._end;
        offset = buffer.writeUInt8(type, offset);
        offset = buffer.writeUInt32BE(tag.length, offset);
        for (const item of tag) {
            if (_getTagType(item) != type) { throw new Error("Odd tag type in list"); }
            ({ buffer, offset } = _encodeTag(item, buffer, offset));
        }
    } else if (typeof tag == "string") {
        ({ buffer, offset } = _writeString(tag, buffer, offset));
    } else if (tag instanceof Int32Array) {
        offset = buffer.writeUInt32BE(tag.length, offset);
        buffer = _accommodate(buffer, offset, tag.buffer.byteLength);
        const dataview = new DataView(buffer.buffer, offset);
        for (let i = 0; i < tag.length; i++) {
            dataview.setInt32(i * 4, tag[i], false);
        }
        offset += tag.buffer.byteLength;
    } else if (tag instanceof BigInt64Array) {
        offset = buffer.writeUInt32BE(tag.length, offset);
        buffer = _accommodate(buffer, offset, tag.buffer.byteLength);
        const dataview = new DataView(buffer.buffer, offset);
        for (let i = 0; i < tag.length; i++) {
            dataview.setBigInt64(i * 8, tag[i], false);
        }
        offset += tag.buffer.byteLength;
    } else {
        for (const [key, value] of Object.entries(tag)) {
            offset = buffer.writeUInt8(_getTagType(value), offset);
            ({ buffer, offset } = _writeString(key, buffer, offset));
            ({ buffer, offset } = _encodeTag(value, buffer, offset));
        }
        buffer = _accommodate(buffer, offset, 1);
        offset = buffer.writeUInt8(0, offset);
    }

    return { buffer, offset };
}

export function _encode(name = "", tag: _Tag) {
    let buffer = Buffer.alloc(1024), offset = 0;
    offset = buffer.writeUInt8(_getTagType(tag), offset);
    ({ buffer, offset } = _writeString(name, buffer, offset));
    ({ buffer, offset } = _encodeTag(tag, buffer, offset));

    return buffer.slice(0, offset);
}

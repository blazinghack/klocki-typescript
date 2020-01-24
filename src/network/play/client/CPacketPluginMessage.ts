import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _CPacketPluginMessage extends _Packet<any> {
    private readonly _channel: string;
    private readonly _data: Uint8Array;

    constructor(channel?: string, data?: Uint8Array) {
        super();
        this._channel = (channel !== undefined ? channel : "");
        this._data = (data !== undefined ? data : new Uint8Array());
    }

    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        buf._writeVarInt(0x01);
        buf._writeString(this._channel);
        new Uint8Array(buf._b).set(this._data, buf._getReaderIndex());
        buf._setReaderIndex(buf._getReaderIndex() + this._data.byteLength);
    }

}

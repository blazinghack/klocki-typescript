import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _EnumConnectionState } from "../../EnumConnectionState";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _CHandshake extends _Packet<any> {
    private readonly _protocolVersion: number;
    private readonly _ip: string;
    private readonly _port: number;
    private readonly _requestedState: number;

    constructor(version?: number, ip?: string, port?: number, requestedState?: number) {
        super();
        this._protocolVersion = (version !== undefined ? version : 47);
        this._ip = (ip !== undefined ? ip : "");
        this._port = (port !== undefined ? port : 25565);
        this._requestedState = (requestedState !== undefined ? requestedState : _EnumConnectionState._Login);
    }

    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        buf._writeVarInt(0x00);
        buf._writeVarInt(this._protocolVersion);
        buf._writeString(this._ip);
        buf._writeUint16(this._port);
        buf._writeVarInt(this._requestedState);
    }

}

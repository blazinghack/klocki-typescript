import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketJoinGame extends _Packet<_NetHandlerPlayClient> {
    public _entityId: number | undefined;
    public _hardcoreMode: boolean | undefined;
    public _gameType: number | undefined;
    public _dimension: number | undefined;
    public _difficulty: number | undefined;
    public _maxPlayers: number | undefined;
    public _worldType: string | undefined;
    public _reducedDebugInfo: boolean | undefined;
    public _viewDistance: number | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._entityId = buf._readInt32();
        let i: number = buf._readUint8();
        this._hardcoreMode = (i & 8) == 8;
        i = i & -9;
        this._gameType = i;
        if (reg._protocol >= 107) {
            this._dimension = buf._readInt32();
        } else {
            this._dimension = buf._readInt8();
        }
        if (reg._protocol < 477) {
            this._difficulty = buf._readUint8();
        }
        this._maxPlayers = buf._readUint8();
        this._worldType = buf._readString();
        if (reg._protocol >= 477) {
            this._viewDistance = buf._readVarInt();
        }
        this._reducedDebugInfo = buf._readBoolean();
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleJoinGame(this);
    }
}

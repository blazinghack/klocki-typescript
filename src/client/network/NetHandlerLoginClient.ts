import { _INetHandler } from "../../network/INetHandler";
import { _Packet } from "../../network/Packet";
import { _SPacketDisconnect } from "../../network/login/server/SPacketDisconnect";
import { _SPacketLoginSuccess } from "../../network/login/server/SPacketLoginSuccess";
import { _Klocki } from "../Klocki";

import { _NetHandlerPlayClient } from "./NetHandlerPlayClient";

export class _NetHandlerLoginClient implements _INetHandler {
    public _klocki: _Klocki;
    constructor(klocki: _Klocki) {
        this._klocki = klocki;
    }

    public _handleDisconnect(packet: _SPacketDisconnect): void {
        console.log(`Disconnected: ${packet._reason}`);
        alert(`Disconnected: ${packet._reason}`);
    }
    public _handleLoginSuccess(packet: _SPacketLoginSuccess): void {
        console.log(`Logged as ${packet._name} with UUID ${packet._uuid}`);
        if (this._klocki._networkManager) {
            this._klocki._networkManager._packetListener = new _NetHandlerPlayClient(this._klocki);
        }
    }
    public _deserialize(id: number): _Packet<_NetHandlerLoginClient> | null {
        switch (id) {
            case 0x00: return new _SPacketDisconnect();
            case 0x02: return new _SPacketLoginSuccess();
            default: 
                //this._klocki._networkManager!._close();
                throw new Error(`Bad packet id ${id}`);
        }
    }

}

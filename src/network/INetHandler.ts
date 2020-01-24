import { _Packet } from "./Packet";

export interface _INetHandler {
    _deserialize(id: number): _Packet<_INetHandler> | null;
}

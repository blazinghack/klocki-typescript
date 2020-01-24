import { _NetworkManager } from "./network/NetworkManager";
import { _NetworkWorker } from "./network/NetworkWorker";

let _networkSystem: _NetworkWorker | null;
const _self = self;

onmessage = (e: MessageEvent) => {
    if (!_networkSystem) {
        _networkSystem = new _NetworkWorker(_self, <string>e.data);
    } else if (e.data === 0) {
        _networkSystem._flushInterThread();
    } else {
        _networkSystem._sendPacket(<ArrayBuffer>e.data);
    }
};

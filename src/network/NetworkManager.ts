
import { _Klocki } from '../client/Klocki';

import { _Packet } from './Packet';
import { _PacketBuffer } from './PacketBuffer';
import { _INetHandler } from './INetHandler';
import { _PacketRegistry } from './registry/PacketRegistry';
import { _v47 } from './registry/v47';
import { _v480 } from './registry/v480';

export class _NetworkManager {
    public readonly _w: Worker;
    public _packetListener: _INetHandler | null = null;
    public _writeArrayBuffer: ArrayBuffer;
    public _writePacketBuffer: _PacketBuffer;
    public _packetRegistry: _PacketRegistry;
    public _protocol: number;
    public _requestPackets: boolean;
    constructor(klocki: _Klocki, url: string) {
        this._w = new Worker("network.js");
        this._w.onerror = (event: ErrorEvent) => this._onError(event);
        this._w.onmessage = (event: MessageEvent) => this._onMessage(event);
        this._w.postMessage(url);
       
        this._writeArrayBuffer = new ArrayBuffer(2 * 1024 * 1024);
        this._writePacketBuffer = new _PacketBuffer(this._writeArrayBuffer);
        this._requestPackets = false;
        this._requestPacketsFromWorker();

        this._protocol = klocki._protocol;
        const reg: _PacketRegistry = _NetworkManager._getRegistryByProtocol(this._protocol);
        this._packetRegistry = reg;

    }
    public static _getRegistryByProtocol(protocol: number): _PacketRegistry {
        let reg: _PacketRegistry | null = null;
        if (protocol === 47) {
            reg = new _v47();
        }
        if (protocol >= 480) {
            reg = new _v480();
        }
        if (reg) {
            reg._protocol = protocol;

            return reg;
        }
        throw new Error(`unrecognized protocol: ${protocol}`);
    }

    public _sendPacket(packet: _Packet<any>): void {
        const buff: _PacketBuffer = this._writePacketBuffer;
        buff._reset();
        packet._writePacketData(buff, this._packetRegistry);
        const r: number = buff._getReaderIndex();
        const w: number = buff._getWriterIndex();
        const written: ArrayBuffer = this._writeArrayBuffer.slice(r, w);
        this._w.postMessage(written, [written]);
    }
    public _close(): void {

        this._w.postMessage("string that is not arraybuffer");
    }
    public _onError(event: ErrorEvent): void {
        console.log(event);
    }
    public _onPacket(buf: Uint8Array): void {
        const p: _PacketBuffer = new _PacketBuffer(buf.buffer, buf.byteOffset, buf.byteLength);
        const id: number = p._readVarInt();
        if (this._packetListener) {
            try {
                const packet: _Packet<_INetHandler> | null = this._packetListener._deserialize(id);
                if (packet !== null) {
                    packet._readPacketData(p, this._packetRegistry);
                    if (p._getReaderIndex() !== p._u8.byteLength) {
                        throw new Error(`Packet id:${id} = 0x` + id.toString(16) + ` larger, found ${buf.byteLength - p._getReaderIndex()}B extra`);
                    }
                    packet._processPacket(this._packetListener);
                } else {
                    // console.log(`missing packet id ${id} = 0x`+id.toString(16));
                }
            } catch (e) {
                console.log(`err in`, id, "= 0x" + id.toString(16), e);
            }
        } else {
            console.warn(`unhandled packet ${id} = 0x` + id.toString(16));
        }
    }
    public _onMessage(event: MessageEvent): void {
        const data = event.data;

        if (data instanceof Array) {
            this._requestPacketsFromWorker();
            for (let i = 0; i < data.length; i++) {
                this._onPacket(data[i]);
            }
        } else if (data instanceof Uint8Array) {
            const buf = data;
            this._onPacket(buf);
        } else {
            console.log(`received message: ${event.data}`);
        }
    }
    public _requestPacketsFromWorker() {
        this._requestPackets = true;
    }
    public _idleCallback() {
        if (this._requestPackets) {
            this._w.postMessage(0);
        }
    }
}

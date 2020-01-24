import { _Packet } from './Packet';
import { _PacketBuffer } from './PacketBuffer';

export class _NetworkWorker {
    private static readonly _MAX_SIZE: number = 2097152;
    private readonly _ws: WebSocket;
    private readonly _pako: any = require('../pako');
    private readonly _outboundPacketsQueue: ArrayBuffer[] = [];
    private readonly _self: any;
    private _playing: boolean = false;
    private _threshold: number = -1;
    private _interThreadPacketQueue: Uint8Array[];
    private _interThreadTransferQueue: ArrayBuffer[];
    private readonly _outPacketBuffer: ArrayBuffer = new ArrayBuffer(2 * 1024 * 1024);

    constructor(_self: any, url: string) {
        this._self = _self;
        this._interThreadPacketQueue = [];
        this._interThreadTransferQueue = [];

        this._ws = new WebSocket(url);
        this._ws.binaryType = "arraybuffer";
        this._ws.onclose = (event: CloseEvent) => {
            this._onWsClose(event);
        };
        this._ws.onerror = (event: Event) => {
            this._onWsError(event);
        };
        this._ws.onmessage = (event: MessageEvent) => {
            this._onWsMessage(event);
        };
        this._ws.onopen = (event: Event) => {
            this._onWsOpen(event);
        };
    }
    /**
     * add to queue
     * @param packet
     */
    public _sendPacket(packet: ArrayBuffer): void {
        if (this._ws.readyState != WebSocket.OPEN) {
            this._outboundPacketsQueue.push(packet);

            return;
        }
        while (this._outboundPacketsQueue.length) {
            const p: ArrayBuffer | undefined = this._outboundPacketsQueue.shift();
            if (p) {
                this._writePacket(p);
            }
        }
        this._writePacket(packet);
    }
    public _onWsClose(event: CloseEvent): void {
        this._self.postMessage(`c\t${event.code}\t${event.reason}`);

    }
    public _onWsError(event: Event): void {
        this._self.postMessage('e');

    }
    /**
     *
     * @param packet raw klocek packet without length, first bytes are ID in varint
     * @param source
     */
    public _receivePacket(packet: Uint8Array, source?: ArrayBuffer): void {
        const u: _PacketBuffer = new _PacketBuffer(packet.buffer, packet.byteOffset, packet.byteLength);

        if (this._playing) {
            /*
            if (u._readVarInt() === 0x46) { // change threshold
                this._threshold = u._readVarInt();

                return;
            }
            */
        } else {
            if (u._readVarInt() === 0x03) { // change threshold
                this._threshold = u._readVarInt();
                console.log("compression set:", this._threshold);
                this._playing = true;

                return;
            } else if (u._readVarInt() === 0x02) { // switch to play
                this._playing = true;
            }
        }
        this._interThreadPacketQueue.push(packet);
        this._interThreadTransferQueue.push(packet.buffer);
        if (source !== undefined) {
            // this._self.postMessage(packet, [packet.buffer, source]);
            
            this._interThreadTransferQueue.push(source);
        } else {
            // this._self.postMessage(packet, [packet.buffer]);
        }
    }
    public _onWsMessage(event: MessageEvent): void {
        if (!(event.data instanceof ArrayBuffer)) {
            this._ws.close();
            throw new Error(`Invalid message type: ${typeof event.data}`);
        }
        
        const p: _PacketBuffer = new _PacketBuffer(event.data, 1);
        
        for(let i = 0; i<10000; i++){
            const packetLen: number = p._readVarInt();
            const onePacket = p._readUint8Array(packetLen);
            this._onMcCompressedOrNotPacket(onePacket.buffer);

            if(p._getReaderIndex()>=event.data.byteLength-1){
                return;
            }
        }
    }
    public _onMcCompressedOrNotPacket(data: ArrayBuffer): void {
        const mcPacket = new Uint8Array(data, 0);
        if (this._threshold < 0) {
            if (mcPacket.byteLength > _NetworkWorker._MAX_SIZE) {
                throw new Error(`Size of ${mcPacket.byteLength} is larger than protocol maximum of ${_NetworkWorker._MAX_SIZE}`);
            }
            this._receivePacket(mcPacket);
        } else {
            const p: _PacketBuffer = new _PacketBuffer(data, 0);
            const dataLen: number = p._readVarInt();
            if (dataLen === 0) {
                this._receivePacket(new Uint8Array(data, 1));
            } else if (dataLen < this._threshold) {
                throw new Error(`Badly compressed packet - size of ${dataLen} is below server threhold of ${this._threshold}`);
            } else if (dataLen > _NetworkWorker._MAX_SIZE) {
                throw new Error(`Badly compressed packet - size of ${dataLen} is larger than protocol maximum of ${_NetworkWorker._MAX_SIZE}`);
            } else {
                const inflated: any = this._pako.inflate(new Uint8Array(data, 0 + p._getReaderIndex()));
                if (inflated instanceof Uint8Array) {
                    this._receivePacket(inflated);
                } else {
                    throw new Error(`Inflate error: ${inflated}`);
                }
            }
        }
    }
    public _onWsOpen(event: Event): void {
        this._writeConnectPacket("127.0.0.1:27779");


        while (this._outboundPacketsQueue.length) {
            const p: ArrayBuffer | undefined = this._outboundPacketsQueue.shift();
            if (p) {
                this._writePacket(p);
            }
        }
        this._self.postMessage('o');
    }
    public _flushInterThread() {
        // if(this._interThreadPacketQueue.length > 0){
        this._self.postMessage(this._interThreadPacketQueue, this._interThreadTransferQueue);
        this._interThreadPacketQueue = [];
        this._interThreadTransferQueue = [];
        // }
    }
    /**
     * write packet to websocket
     * @param packet
     */
    private _writePacket(packet: ArrayBuffer): void {
        let entirePacket: Uint8Array;
        if (this._threshold < 0) {
            // console.log("no compression")
            entirePacket = new Uint8Array(this._outPacketBuffer, 0, 1 + packet.byteLength);
            entirePacket[0] = 1;
            entirePacket.set(new Uint8Array(packet), 1);

            // this._self.postMessage([packet], [packet]);
        } else if (packet.byteLength < this._threshold) {
            // console.log("not needed compression")
            entirePacket = new Uint8Array(this._outPacketBuffer, 0, 1 + 1 + packet.byteLength);
            entirePacket[0] = 1;
            entirePacket[1] = 0;
            entirePacket.set(new Uint8Array(packet), 2);
            
        } else {
            // console.log("enabled compression")
            const compressed: Uint8Array = this._pako.deflate(packet);
            const p: _PacketBuffer = new _PacketBuffer(this._outPacketBuffer);
            p._writeVarInt(1);
            p._writeVarInt(packet.byteLength);
            entirePacket = new Uint8Array(this._outPacketBuffer, 0, p._getWriterIndex() + compressed.byteLength);
            entirePacket.set(compressed, p._getWriterIndex());
            
        }
        this._ws.send(entirePacket);
    }
    private _writeConnectPacket(server: string): void {
        
        const p: _PacketBuffer = new _PacketBuffer(this._outPacketBuffer);
        p._writeVarInt(0);
        p._writeString(server);
        const entirePacket: Uint8Array = new Uint8Array(this._outPacketBuffer, 0, p._getWriterIndex());
            
        this._ws.send(entirePacket);
    }
}

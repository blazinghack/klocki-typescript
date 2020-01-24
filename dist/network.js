/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 196);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class _PacketBuffer {
    constructor(b, byteOffsetIn, byteLengthIn) {
        const byteOffset = byteOffsetIn !== void 0 ? byteOffsetIn : 0;
        const byteLength = byteLengthIn !== void 0 ? byteLengthIn : b.byteLength - byteOffset;
        this._v = new DataView(b, byteOffset, byteLength);
        this._u8 = new Uint8Array(b, byteOffset, byteLength);
        this._byteOffset = byteOffset;
        this._b = b;
        this._r = 0;
        this._w = 0;
    }
    static _varIntSize(n) {
        if ((n & 0xFFFFFF80) === 0) {
            return 1;
        }
        if ((n & 0xFFFFC000) === 0) {
            return 2;
        }
        if ((n & 0xFFE00000) === 0) {
            return 3;
        }
        if ((n & 0xF0000000) === 0) {
            return 4;
        }
        return 5;
    }
    static _stringSize(n) {
        n = unescape(encodeURIComponent(n));
        return n.length + this._varIntSize(n.length);
    }
    _reset() {
        this._r = 0;
        this._w = 0;
    }
    _getReaderIndex() {
        return this._r;
    }
    _setReaderIndex(r) {
        this._r = r;
    }
    _getWriterIndex() {
        return this._w;
    }
    _setWriterIndex(w) {
        this._w = w;
    }
    _readUint8() {
        return this._v.getUint8(this._r++);
    }
    _writeUint8(n) {
        this._v.setUint8(this._w++, n);
        return this;
    }
    _readUint16() {
        const n = this._v.getUint16(this._r);
        this._r += 2;
        return n;
    }
    _writeUint16(n) {
        this._v.setUint16(this._w, n);
        this._w += 2;
        return this;
    }
    _readUint32() {
        const n = this._v.getUint32(this._r);
        this._r += 4;
        return n;
    }
    _writeUint32(n) {
        this._v.setUint32(this._w, n);
        this._w += 4;
        return this;
    }
    _readInt8() {
        return this._v.getInt8(this._r++);
    }
    _writeInt8(n) {
        this._v.setInt8(this._w++, n);
        return this;
    }
    _readInt16() {
        const n = this._v.getInt16(this._r);
        this._r += 2;
        return n;
    }
    _writeInt16(n) {
        this._v.setInt16(this._w, n);
        this._w += 2;
        return this;
    }
    _readInt32() {
        const n = this._v.getInt32(this._r);
        this._r += 4;
        return n;
    }
    _writeInt32(n) {
        this._v.setInt32(this._w, n);
        this._w += 4;
        return this;
    }
    _readBoolean() {
        return this._readUint8() !== 0;
    }
    _writeBoolean(n) {
        this._writeUint8(n ? 1 : 0);
        return this;
    }
    _readFloat32() {
        const n = this._v.getFloat32(this._r);
        this._r += 4;
        return n;
    }
    _writeFloat32(n) {
        this._v.setFloat32(this._w, n);
        this._w += 4;
        return this;
    }
    _readFloat64() {
        const n = this._v.getFloat64(this._r);
        this._r += 8;
        return n;
    }
    _writeFloat64(n) {
        this._v.setFloat64(this._w, n);
        this._w += 8;
        return this;
    }
    _writeUint8Array(n) {
        this._u8.set(n, this._w);
        this._w += n.byteLength;
    }
    _readVarInt() {
        let v = 0;
        let moves = 0;
        let buff;
        do {
            buff = this._readInt8();
            v |= (buff & 0x7F) << moves++ * 7;
            if (moves > 5) {
                throw new Error("VarInt too big");
            }
        } while ((buff & 0x80) === 128);
        return v;
    }
    _writeVarInt(n) {
        while (n & 0xFFFFFF80) {
            this._writeInt8(n | 0x80);
            n = n >>> 7;
        }
        this._writeInt8(n);
        return this;
    }
    _readString() {
        const len = this._readVarInt();
        const b = this._peekUint8Array(len);
        return _PacketBuffer._utf8decoder.decode(b);
    }
    _writeString(n) {
        const b = _PacketBuffer._utf8encoder.encode(n);
        this._writeVarInt(b.length);
        new Uint8Array(this._b).set(b, this._w);
        this._w += b.length;
    }
    _peekUint8Array(n) {
        if (n > 1024 * 1024 * 2) {
            throw new Error("tried to peek " + n + " bytes");
        }
        const arr = new Uint8Array(this._b, this._v.byteOffset + this._r, n);
        this._r += n;
        return arr;
    }
    _peekUint32Array(n) {
        const arr = new Uint32Array(this._b, this._v.byteOffset + this._r, n);
        this._r += n * 4;
        return arr;
    }
    _readUint8Array(n) {
        const start = this._v.byteOffset + this._r;
        const arr = new Uint8Array(this._b.slice(start, start + n));
        this._r += n;
        return arr;
    }
    _readUint32Array(n) {
        const start = this._v.byteOffset + this._r;
        const end = start + n * 4;
        if (end > this._v.byteLength) {
            throw new RangeError("can't read " + n + " more uint32s");
        }
        const arr = new Uint32Array(this._b.slice(start, end));
        this._r += n * 4;
        return arr;
    }
    _readInt32Array(n) {
        const start = this._v.byteOffset + this._r;
        const end = start + n * 4;
        if (end > this._v.byteLength) {
            throw new RangeError("can't read " + n + " more int32s");
        }
        const arr = new Int32Array(this._b.slice(start, end));
        this._r += n * 4;
        return arr;
    }
    _readInt64Array(n) {
        const start = this._v.byteOffset + this._r;
        const arr = new BigInt64Array(this._b.slice(start, start + n * 8));
        this._r += n * 8;
        return arr;
    }
    _readUint64Array(n) {
        const start = this._v.byteOffset + this._r;
        const arr = new BigUint64Array(this._b.slice(start, start + n * 8));
        this._r += n * 8;
        return arr;
    }
    _readPosition() {
        const b = this._readUint32();
        const a = this._readUint32();
        const arr = new Int32Array(3);
        arr[0] = b >>> (38 - 32);
        arr[1] = a & 0xFFF;
        arr[2] = (a >>> 12) | ((b & 0x3F) << 12);
        return arr;
    }
}
exports._PacketBuffer = _PacketBuffer;
_PacketBuffer._utf8decoder = new TextDecoder("utf-8");
_PacketBuffer._utf8encoder = new TextEncoder();


/***/ }),

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const NetworkWorker_1 = __webpack_require__(197);
let _networkSystem;
const _self = self;
onmessage = (e) => {
    if (!_networkSystem) {
        _networkSystem = new NetworkWorker_1._NetworkWorker(_self, e.data);
    }
    else if (e.data === 0) {
        _networkSystem._flushInterThread();
    }
    else {
        _networkSystem._sendPacket(e.data);
    }
};


/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const PacketBuffer_1 = __webpack_require__(10);
class _NetworkWorker {
    constructor(_self, url) {
        this._pako = __webpack_require__(198);
        this._outboundPacketsQueue = [];
        this._playing = false;
        this._threshold = -1;
        this._outPacketBuffer = new ArrayBuffer(2 * 1024 * 1024);
        this._self = _self;
        this._interThreadPacketQueue = [];
        this._interThreadTransferQueue = [];
        this._ws = new WebSocket(url);
        this._ws.binaryType = "arraybuffer";
        this._ws.onclose = (event) => {
            this._onWsClose(event);
        };
        this._ws.onerror = (event) => {
            this._onWsError(event);
        };
        this._ws.onmessage = (event) => {
            this._onWsMessage(event);
        };
        this._ws.onopen = (event) => {
            this._onWsOpen(event);
        };
    }
    _sendPacket(packet) {
        if (this._ws.readyState != WebSocket.OPEN) {
            this._outboundPacketsQueue.push(packet);
            return;
        }
        while (this._outboundPacketsQueue.length) {
            const p = this._outboundPacketsQueue.shift();
            if (p) {
                this._writePacket(p);
            }
        }
        this._writePacket(packet);
    }
    _onWsClose(event) {
        this._self.postMessage(`c\t${event.code}\t${event.reason}`);
    }
    _onWsError(event) {
        this._self.postMessage('e');
    }
    _receivePacket(packet, source) {
        const u = new PacketBuffer_1._PacketBuffer(packet.buffer, packet.byteOffset, packet.byteLength);
        if (this._playing) {
        }
        else {
            if (u._readVarInt() === 0x03) {
                this._threshold = u._readVarInt();
                console.log("compression set:", this._threshold);
                this._playing = true;
                return;
            }
            else if (u._readVarInt() === 0x02) {
                this._playing = true;
            }
        }
        this._interThreadPacketQueue.push(packet);
        this._interThreadTransferQueue.push(packet.buffer);
        if (source !== undefined) {
            this._interThreadTransferQueue.push(source);
        }
        else {
        }
    }
    _onWsMessage(event) {
        if (!(event.data instanceof ArrayBuffer)) {
            this._ws.close();
            throw new Error(`Invalid message type: ${typeof event.data}`);
        }
        const p = new PacketBuffer_1._PacketBuffer(event.data, 1);
        for (let i = 0; i < 10000; i++) {
            const packetLen = p._readVarInt();
            const onePacket = p._readUint8Array(packetLen);
            this._onMcCompressedOrNotPacket(onePacket.buffer);
            if (p._getReaderIndex() >= event.data.byteLength - 1) {
                return;
            }
        }
    }
    _onMcCompressedOrNotPacket(data) {
        const mcPacket = new Uint8Array(data, 0);
        if (this._threshold < 0) {
            if (mcPacket.byteLength > _NetworkWorker._MAX_SIZE) {
                throw new Error(`Size of ${mcPacket.byteLength} is larger than protocol maximum of ${_NetworkWorker._MAX_SIZE}`);
            }
            this._receivePacket(mcPacket);
        }
        else {
            const p = new PacketBuffer_1._PacketBuffer(data, 0);
            const dataLen = p._readVarInt();
            if (dataLen === 0) {
                this._receivePacket(new Uint8Array(data, 1));
            }
            else if (dataLen < this._threshold) {
                throw new Error(`Badly compressed packet - size of ${dataLen} is below server threhold of ${this._threshold}`);
            }
            else if (dataLen > _NetworkWorker._MAX_SIZE) {
                throw new Error(`Badly compressed packet - size of ${dataLen} is larger than protocol maximum of ${_NetworkWorker._MAX_SIZE}`);
            }
            else {
                const inflated = this._pako.inflate(new Uint8Array(data, 0 + p._getReaderIndex()));
                if (inflated instanceof Uint8Array) {
                    this._receivePacket(inflated);
                }
                else {
                    throw new Error(`Inflate error: ${inflated}`);
                }
            }
        }
    }
    _onWsOpen(event) {
        this._writeConnectPacket("127.0.0.1:27779");
        while (this._outboundPacketsQueue.length) {
            const p = this._outboundPacketsQueue.shift();
            if (p) {
                this._writePacket(p);
            }
        }
        this._self.postMessage('o');
    }
    _flushInterThread() {
        this._self.postMessage(this._interThreadPacketQueue, this._interThreadTransferQueue);
        this._interThreadPacketQueue = [];
        this._interThreadTransferQueue = [];
    }
    _writePacket(packet) {
        let entirePacket;
        if (this._threshold < 0) {
            entirePacket = new Uint8Array(this._outPacketBuffer, 0, 1 + packet.byteLength);
            entirePacket[0] = 1;
            entirePacket.set(new Uint8Array(packet), 1);
        }
        else if (packet.byteLength < this._threshold) {
            entirePacket = new Uint8Array(this._outPacketBuffer, 0, 1 + 1 + packet.byteLength);
            entirePacket[0] = 1;
            entirePacket[1] = 0;
            entirePacket.set(new Uint8Array(packet), 2);
        }
        else {
            const compressed = this._pako.deflate(packet);
            const p = new PacketBuffer_1._PacketBuffer(this._outPacketBuffer);
            p._writeVarInt(1);
            p._writeVarInt(packet.byteLength);
            entirePacket = new Uint8Array(this._outPacketBuffer, 0, p._getWriterIndex() + compressed.byteLength);
            entirePacket.set(compressed, p._getWriterIndex());
        }
        this._ws.send(entirePacket);
    }
    _writeConnectPacket(server) {
        const p = new PacketBuffer_1._PacketBuffer(this._outPacketBuffer);
        p._writeVarInt(0);
        p._writeString(server);
        const entirePacket = new Uint8Array(this._outPacketBuffer, 0, p._getWriterIndex());
        this._ws.send(entirePacket);
    }
}
exports._NetworkWorker = _NetworkWorker;
_NetworkWorker._MAX_SIZE = 2097152;


/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var assign = __webpack_require__(8).assign;
var deflate = __webpack_require__(199);
var inflate = __webpack_require__(202);
var pako = {};
assign(pako, deflate, inflate);
module.exports = pako;


/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var zlib_deflate = __webpack_require__(200);
var utils = __webpack_require__(8);
var ZStream = __webpack_require__(65);
var toString = Object.prototype.toString;
var _Z_NO_FLUSH = 0;
var _Z_FINISH = 4;
var _Z_OK = 0;
var _Z_STREAM_END = 1;
var _Z_SYNC_FLUSH = 2;
var _Z_DEFAULT_COMPRESSION = -1;
var _Z_DEFAULT_STRATEGY = 0;
var _Z_DEFLATED = 8;
function Deflate(options) {
    if (!(this instanceof Deflate))
        return new Deflate(options);
    this.options = utils.assign({
        level: _Z_DEFAULT_COMPRESSION,
        method: _Z_DEFLATED,
        chunkSize: 16384,
        _windowBits: 15,
        memLevel: 8,
        strategy: _Z_DEFAULT_STRATEGY,
        to: ''
    }, options || {});
    var opt = this.options;
    if (opt.raw && (opt._windowBits > 0)) {
        opt._windowBits = -opt._windowBits;
    }
    this.err = 0;
    this.msg = '';
    this.ended = false;
    this.chunks = [];
    this._strm = new ZStream();
    this._strm._avail_out = 0;
    var status = zlib_deflate._deflateInit2(this._strm, opt.level, opt.method, opt._windowBits, opt.memLevel, opt.strategy);
    if (status !== _Z_OK) {
        throw new Error(msg[status]);
    }
}
Deflate.prototype.push = function (data, _mode) {
    var _strm = this._strm;
    var chunkSize = this.options.chunkSize;
    var status, __mode;
    if (this.ended) {
        return false;
    }
    __mode = (_mode === ~~_mode) ? _mode : ((_mode === true) ? _Z_FINISH : _Z_NO_FLUSH);
    if (toString.call(data) === '[object ArrayBuffer]') {
        _strm._input = new Uint8Array(data);
    }
    else {
        _strm._input = data;
    }
    _strm._next_in = 0;
    _strm._avail_in = _strm._input.length;
    do {
        if (_strm._avail_out === 0) {
            _strm.output = new utils.Buf8(chunkSize);
            _strm._next_out = 0;
            _strm._avail_out = chunkSize;
        }
        status = zlib_deflate._deflate(_strm, __mode);
        if (status !== _Z_STREAM_END && status !== _Z_OK) {
            this.onEnd(status);
            this.ended = true;
            return false;
        }
        if (_strm._avail_out === 0 || (_strm._avail_in === 0 && (__mode === _Z_FINISH || __mode === _Z_SYNC_FLUSH))) {
            this.onData(utils.shrinkBuf(_strm.output, _strm._next_out));
        }
    } while ((_strm._avail_in > 0 || _strm._avail_out === 0) && status !== _Z_STREAM_END);
    if (__mode === _Z_FINISH) {
        status = zlib_deflate._deflateEnd(this._strm);
        this.onEnd(status);
        this.ended = true;
        return status === _Z_OK;
    }
    if (__mode === _Z_SYNC_FLUSH) {
        this.onEnd(_Z_OK);
        _strm._avail_out = 0;
        return true;
    }
    return true;
};
Deflate.prototype.onData = function (chunk) {
    this.chunks.push(chunk);
};
Deflate.prototype.onEnd = function (status) {
    if (status === _Z_OK) {
        this.result = utils.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this._strm.msg;
};
function deflate(input, options) {
    var deflator = new Deflate(options);
    deflator.push(input, true);
    if (deflator.err) {
        throw deflator.msg || msg[deflator.err];
    }
    return deflator.result;
}
exports.deflate = deflate;


/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var utils = __webpack_require__(8);
var trees = __webpack_require__(201);
var adler32 = __webpack_require__(64);
var _Z_NO_FLUSH = 0;
var _Z_PARTIAL_FLUSH = 1;
var _Z_FULL_FLUSH = 3;
var _Z_FINISH = 4;
var _Z_BLOCK = 5;
var _Z_OK = 0;
var _Z_STREAM_END = 1;
var _Z_STREAM_ERROR = -2;
var _Z_DATA_ERROR = -3;
var _Z_BUF_ERROR = -5;
var _Z_DEFAULT_COMPRESSION = -1;
var _Z_FILTERED = 1;
var _Z_HUFFMAN_ONLY = 2;
var _Z_RLE = 3;
var _Z_FIXED = 4;
var _Z_DEFAULT_STRATEGY = 0;
var _Z_UNKNOWN = 2;
var _Z_DEFLATED = 8;
var MAX_MEM_LEVEL = 9;
var MAX_WBITS = 15;
var DEF_MEM_LEVEL = 8;
var LENGTH_CODES = 29;
var LITERALS = 256;
var L_CODES = LITERALS + 1 + LENGTH_CODES;
var D_CODES = 30;
var BL_CODES = 19;
var HEAP_SIZE = 2 * L_CODES + 1;
var MAX_BITS = 15;
var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);
var PRESET_DICT = 0x20;
var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;
var BS_NEED_MORE = 1;
var BS_BLOCK_DONE = 2;
var BS_FINISH_STARTED = 3;
var BS_FINISH_DONE = 4;
var OS_CODE = 0x03;
function err(_strm, errorCode) {
    _strm.msg = errorCode;
    return errorCode;
}
function rank(f) {
    return ((f) << 1) - ((f) > 4 ? 9 : 0);
}
function zero(buf) { var len = buf.length; while (--len >= 0) {
    buf[len] = 0;
} }
function flush_pending(_strm) {
    var s = _strm._state;
    var len = s.pending;
    if (len > _strm._avail_out) {
        len = _strm._avail_out;
    }
    if (len === 0) {
        return;
    }
    utils.arraySet(_strm.output, s._pending_buf, s.pending_out, len, _strm._next_out);
    _strm._next_out += len;
    s.pending_out += len;
    _strm.total_out += len;
    _strm._avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
        s.pending_out = 0;
    }
}
function flush_block_only(s, last) {
    trees._tr_flush_block(s, (s._block_start >= 0 ? s._block_start : -1), s._strstart - s._block_start, last);
    s._block_start = s._strstart;
    flush_pending(s._strm);
}
function put_byte(s, b) {
    s._pending_buf[s.pending++] = b;
}
function putShortMSB(s, b) {
    s._pending_buf[s.pending++] = (b >>> 8) & 0xff;
    s._pending_buf[s.pending++] = b & 0xff;
}
function read_buf(_strm, buf, start, size) {
    var len = _strm._avail_in;
    if (len > size) {
        len = size;
    }
    if (len === 0) {
        return 0;
    }
    _strm._avail_in -= len;
    utils.arraySet(buf, _strm._input, _strm._next_in, len, start);
    if (_strm._state.wrap === 1) {
        _strm.adler = adler32(_strm.adler, buf, len, start);
    }
    _strm._next_in += len;
    _strm.total_in += len;
    return len;
}
function longest_match(s, cur_match) {
    var chain_length = s.max_chain_length;
    var scan = s._strstart;
    var match;
    var len;
    var best_len = s._prev_length;
    var nice_match = s.nice_match;
    var limit = (s._strstart > (s.w_size - MIN_LOOKAHEAD)) ?
        s._strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    var _win = s._window;
    var wmask = s.w_mask;
    var prev = s.prev;
    var strend = s._strstart + MAX_MATCH;
    var scan_end1 = _win[scan + best_len - 1];
    var scan_end = _win[scan + best_len];
    if (s._prev_length >= s.good_match) {
        chain_length >>= 2;
    }
    if (nice_match > s._lookahead) {
        nice_match = s._lookahead;
    }
    do {
        match = cur_match;
        if (_win[match + best_len] !== scan_end ||
            _win[match + best_len - 1] !== scan_end1 ||
            _win[match] !== _win[scan] ||
            _win[++match] !== _win[scan + 1]) {
            continue;
        }
        scan += 2;
        match++;
        do {
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
            _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
            _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
            _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
            scan < strend);
        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len > best_len) {
            s.match_start = cur_match;
            best_len = len;
            if (len >= nice_match) {
                break;
            }
            scan_end1 = _win[scan + best_len - 1];
            scan_end = _win[scan + best_len];
        }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s._lookahead) {
        return best_len;
    }
    return s._lookahead;
}
function fill__window(s) {
    var _w_size = s.w_size;
    var p, n, m, more, str;
    do {
        more = s._window_size - s._lookahead - s._strstart;
        if (s._strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
            utils.arraySet(s._window, s._window, _w_size, _w_size, 0);
            s.match_start -= _w_size;
            s._strstart -= _w_size;
            s._block_start -= _w_size;
            n = s.hash_size;
            p = n;
            do {
                m = s.head[--p];
                s.head[p] = (m >= _w_size ? m - _w_size : 0);
            } while (--n);
            n = _w_size;
            p = n;
            do {
                m = s.prev[--p];
                s.prev[p] = (m >= _w_size ? m - _w_size : 0);
            } while (--n);
            more += _w_size;
        }
        if (s._strm._avail_in === 0) {
            break;
        }
        n = read_buf(s._strm, s._window, s._strstart + s._lookahead, more);
        s._lookahead += n;
        if (s._lookahead + s.insert >= MIN_MATCH) {
            str = s._strstart - s.insert;
            s._ins_h = s._window[str];
            s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[str + 1]) & s.hash_mask;
            while (s.insert) {
                s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[str + MIN_MATCH - 1]) & s.hash_mask;
                s.prev[str & s.w_mask] = s.head[s._ins_h];
                s.head[s._ins_h] = str;
                str++;
                s.insert--;
                if (s._lookahead + s.insert < MIN_MATCH) {
                    break;
                }
            }
        }
    } while (s._lookahead < MIN_LOOKAHEAD && s._strm._avail_in !== 0);
}
function deflate_stored(s, flush) {
    var max_block_size = 0xffff;
    if (max_block_size > s._pending_buf_size - 5) {
        max_block_size = s._pending_buf_size - 5;
    }
    for (;;) {
        if (s._lookahead <= 1) {
            fill__window(s);
            if (s._lookahead === 0 && flush === _Z_NO_FLUSH) {
                return BS_NEED_MORE;
            }
            if (s._lookahead === 0) {
                break;
            }
        }
        s._strstart += s._lookahead;
        s._lookahead = 0;
        var max_start = s._block_start + max_block_size;
        if (s._strstart === 0 || s._strstart >= max_start) {
            s._lookahead = s._strstart - max_start;
            s._strstart = max_start;
            flush_block_only(s, false);
            if (s._strm._avail_out === 0) {
                return BS_NEED_MORE;
            }
        }
        if (s._strstart - s._block_start >= (s.w_size - MIN_LOOKAHEAD)) {
            flush_block_only(s, false);
            if (s._strm._avail_out === 0) {
                return BS_NEED_MORE;
            }
        }
    }
    s.insert = 0;
    if (flush === _Z_FINISH) {
        flush_block_only(s, true);
        if (s._strm._avail_out === 0) {
            return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
    }
    if (s._strstart > s._block_start) {
        flush_block_only(s, false);
        if (s._strm._avail_out === 0) {
            return BS_NEED_MORE;
        }
    }
    return BS_NEED_MORE;
}
function deflate_fast(s, flush) {
    var hash_head;
    var bflush;
    for (;;) {
        if (s._lookahead < MIN_LOOKAHEAD) {
            fill__window(s);
            if (s._lookahead < MIN_LOOKAHEAD && flush === _Z_NO_FLUSH) {
                return BS_NEED_MORE;
            }
            if (s._lookahead === 0) {
                break;
            }
        }
        hash_head = 0;
        if (s._lookahead >= MIN_MATCH) {
            s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s._strstart & s.w_mask] = s.head[s._ins_h];
            s.head[s._ins_h] = s._strstart;
        }
        if (hash_head !== 0 && ((s._strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
            s._match_length = longest_match(s, hash_head);
        }
        if (s._match_length >= MIN_MATCH) {
            bflush = trees._tr_tally(s, s._strstart - s.match_start, s._match_length - MIN_MATCH);
            s._lookahead -= s._match_length;
            if (s._match_length <= s.max_lazy_match && s._lookahead >= MIN_MATCH) {
                s._match_length--;
                do {
                    s._strstart++;
                    s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + MIN_MATCH - 1]) & s.hash_mask;
                    hash_head = s.prev[s._strstart & s.w_mask] = s.head[s._ins_h];
                    s.head[s._ins_h] = s._strstart;
                } while (--s._match_length !== 0);
                s._strstart++;
            }
            else {
                s._strstart += s._match_length;
                s._match_length = 0;
                s._ins_h = s._window[s._strstart];
                s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + 1]) & s.hash_mask;
            }
        }
        else {
            bflush = trees._tr_tally(s, 0, s._window[s._strstart]);
            s._lookahead--;
            s._strstart++;
        }
        if (bflush) {
            flush_block_only(s, false);
            if (s._strm._avail_out === 0) {
                return BS_NEED_MORE;
            }
        }
    }
    s.insert = ((s._strstart < (MIN_MATCH - 1)) ? s._strstart : MIN_MATCH - 1);
    if (flush === _Z_FINISH) {
        flush_block_only(s, true);
        if (s._strm._avail_out === 0) {
            return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
    }
    if (s.last_lit) {
        flush_block_only(s, false);
        if (s._strm._avail_out === 0) {
            return BS_NEED_MORE;
        }
    }
    return BS_BLOCK_DONE;
}
function deflate_slow(s, flush) {
    var hash_head;
    var bflush;
    var max_insert;
    for (;;) {
        if (s._lookahead < MIN_LOOKAHEAD) {
            fill__window(s);
            if (s._lookahead < MIN_LOOKAHEAD && flush === _Z_NO_FLUSH) {
                return BS_NEED_MORE;
            }
            if (s._lookahead === 0) {
                break;
            }
        }
        hash_head = 0;
        if (s._lookahead >= MIN_MATCH) {
            s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s._strstart & s.w_mask] = s.head[s._ins_h];
            s.head[s._ins_h] = s._strstart;
        }
        s._prev_length = s._match_length;
        s.prev_match = s.match_start;
        s._match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && s._prev_length < s.max_lazy_match &&
            s._strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)) {
            s._match_length = longest_match(s, hash_head);
            if (s._match_length <= 5 &&
                (s.strategy === _Z_FILTERED || (s._match_length === MIN_MATCH && s._strstart - s.match_start > 4096))) {
                s._match_length = MIN_MATCH - 1;
            }
        }
        if (s._prev_length >= MIN_MATCH && s._match_length <= s._prev_length) {
            max_insert = s._strstart + s._lookahead - MIN_MATCH;
            bflush = trees._tr_tally(s, s._strstart - 1 - s.prev_match, s._prev_length - MIN_MATCH);
            s._lookahead -= s._prev_length - 1;
            s._prev_length -= 2;
            do {
                if (++s._strstart <= max_insert) {
                    s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + MIN_MATCH - 1]) & s.hash_mask;
                    hash_head = s.prev[s._strstart & s.w_mask] = s.head[s._ins_h];
                    s.head[s._ins_h] = s._strstart;
                }
            } while (--s._prev_length !== 0);
            s._match_available = 0;
            s._match_length = MIN_MATCH - 1;
            s._strstart++;
            if (bflush) {
                flush_block_only(s, false);
                if (s._strm._avail_out === 0) {
                    return BS_NEED_MORE;
                }
            }
        }
        else if (s._match_available) {
            bflush = trees._tr_tally(s, 0, s._window[s._strstart - 1]);
            if (bflush) {
                flush_block_only(s, false);
            }
            s._strstart++;
            s._lookahead--;
            if (s._strm._avail_out === 0) {
                return BS_NEED_MORE;
            }
        }
        else {
            s._match_available = 1;
            s._strstart++;
            s._lookahead--;
        }
    }
    if (s._match_available) {
        bflush = trees._tr_tally(s, 0, s._window[s._strstart - 1]);
        s._match_available = 0;
    }
    s.insert = s._strstart < MIN_MATCH - 1 ? s._strstart : MIN_MATCH - 1;
    if (flush === _Z_FINISH) {
        flush_block_only(s, true);
        if (s._strm._avail_out === 0) {
            return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
    }
    if (s.last_lit) {
        flush_block_only(s, false);
        if (s._strm._avail_out === 0) {
            return BS_NEED_MORE;
        }
    }
    return BS_BLOCK_DONE;
}
function deflate_rle(s, flush) {
    var bflush;
    var prev;
    var scan, strend;
    var _win = s._window;
    for (;;) {
        if (s._lookahead <= MAX_MATCH) {
            fill__window(s);
            if (s._lookahead <= MAX_MATCH && flush === _Z_NO_FLUSH) {
                return BS_NEED_MORE;
            }
            if (s._lookahead === 0) {
                break;
            }
        }
        s._match_length = 0;
        if (s._lookahead >= MIN_MATCH && s._strstart > 0) {
            scan = s._strstart - 1;
            prev = _win[scan];
            if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
                strend = s._strstart + MAX_MATCH;
                do {
                } while (prev === _win[++scan] && prev === _win[++scan] &&
                    prev === _win[++scan] && prev === _win[++scan] &&
                    prev === _win[++scan] && prev === _win[++scan] &&
                    prev === _win[++scan] && prev === _win[++scan] &&
                    scan < strend);
                s._match_length = MAX_MATCH - (strend - scan);
                if (s._match_length > s._lookahead) {
                    s._match_length = s._lookahead;
                }
            }
        }
        if (s._match_length >= MIN_MATCH) {
            bflush = trees._tr_tally(s, 1, s._match_length - MIN_MATCH);
            s._lookahead -= s._match_length;
            s._strstart += s._match_length;
            s._match_length = 0;
        }
        else {
            bflush = trees._tr_tally(s, 0, s._window[s._strstart]);
            s._lookahead--;
            s._strstart++;
        }
        if (bflush) {
            flush_block_only(s, false);
            if (s._strm._avail_out === 0) {
                return BS_NEED_MORE;
            }
        }
    }
    s.insert = 0;
    if (flush === _Z_FINISH) {
        flush_block_only(s, true);
        if (s._strm._avail_out === 0) {
            return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
    }
    if (s.last_lit) {
        flush_block_only(s, false);
        if (s._strm._avail_out === 0) {
            return BS_NEED_MORE;
        }
    }
    return BS_BLOCK_DONE;
}
function deflate_huff(s, flush) {
    var bflush;
    for (;;) {
        if (s._lookahead === 0) {
            fill__window(s);
            if (s._lookahead === 0) {
                if (flush === _Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                }
                break;
            }
        }
        s._match_length = 0;
        bflush = trees._tr_tally(s, 0, s._window[s._strstart]);
        s._lookahead--;
        s._strstart++;
        if (bflush) {
            flush_block_only(s, false);
            if (s._strm._avail_out === 0) {
                return BS_NEED_MORE;
            }
        }
    }
    s.insert = 0;
    if (flush === _Z_FINISH) {
        flush_block_only(s, true);
        if (s._strm._avail_out === 0) {
            return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
    }
    if (s.last_lit) {
        flush_block_only(s, false);
        if (s._strm._avail_out === 0) {
            return BS_NEED_MORE;
        }
    }
    return BS_BLOCK_DONE;
}
function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
}
var configuration_table;
configuration_table = [
    new Config(0, 0, 0, 0, deflate_stored),
    new Config(4, 4, 8, 4, deflate_fast),
    new Config(4, 5, 16, 8, deflate_fast),
    new Config(4, 6, 32, 32, deflate_fast),
    new Config(4, 4, 16, 16, deflate_slow),
    new Config(8, 16, 32, 32, deflate_slow),
    new Config(8, 16, 128, 128, deflate_slow),
    new Config(8, 32, 128, 256, deflate_slow),
    new Config(32, 128, 258, 1024, deflate_slow),
    new Config(32, 258, 258, 4096, deflate_slow)
];
function lm_init(s) {
    s._window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s._strstart = 0;
    s._block_start = 0;
    s._lookahead = 0;
    s.insert = 0;
    s._match_length = s._prev_length = MIN_MATCH - 1;
    s._match_available = 0;
    s._ins_h = 0;
}
function DeflateState() {
    this._strm = null;
    this.status = 0;
    this._pending_buf = null;
    this._pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.method = _Z_DEFLATED;
    this._last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this._window = null;
    this._window_size = 0;
    this.prev = null;
    this.head = null;
    this._ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this._block_start = 0;
    this._match_length = 0;
    this.prev_match = 0;
    this._match_available = 0;
    this._strstart = 0;
    this.match_start = 0;
    this._lookahead = 0;
    this._prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this._dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
    this._dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
    this._bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
    zero(this._dyn_ltree);
    zero(this._dyn_dtree);
    zero(this._bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new utils.Buf16(MAX_BITS + 1);
    this.heap = new utils.Buf16(2 * L_CODES + 1);
    zero(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new utils.Buf16(2 * L_CODES + 1);
    zero(this.depth);
    this.l_buf = 0;
    this.lit_bufsize = 0;
    this.last_lit = 0;
    this.d_buf = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this._bi_valid = 0;
}
function deflateResetKeep(_strm) {
    var s;
    if (!_strm || !_strm._state) {
        return err(_strm, _Z_STREAM_ERROR);
    }
    _strm.total_in = _strm.total_out = 0;
    _strm._data_type = _Z_UNKNOWN;
    s = _strm._state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
        s.wrap = -s.wrap;
    }
    s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
    _strm.adler = (s.wrap === 2) ?
        0
        :
            1;
    s._last_flush = _Z_NO_FLUSH;
    trees._tr_init(s);
    return _Z_OK;
}
function deflateReset(_strm) {
    var ret = deflateResetKeep(_strm);
    if (ret === _Z_OK) {
        lm_init(_strm._state);
    }
    return ret;
}
function deflateInit2(_strm, level, method, _windowBits, memLevel, strategy) {
    if (!_strm) {
        return _Z_STREAM_ERROR;
    }
    var wrap = 1;
    if (level === _Z_DEFAULT_COMPRESSION) {
        level = 6;
    }
    if (_windowBits < 0) {
        wrap = 0;
        _windowBits = -_windowBits;
    }
    else if (_windowBits > 15) {
        wrap = 2;
        _windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== _Z_DEFLATED ||
        _windowBits < 8 || _windowBits > 15 || level < 0 || level > 9 ||
        strategy < 0 || strategy > _Z_FIXED) {
        return err(_strm, _Z_STREAM_ERROR);
    }
    if (_windowBits === 8) {
        _windowBits = 9;
    }
    var s = new DeflateState();
    _strm._state = s;
    s._strm = _strm;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = _windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s._window = new utils.Buf8(s.w_size * 2);
    s.head = new utils.Buf16(s.hash_size);
    s.prev = new utils.Buf16(s.w_size);
    s.lit_bufsize = 1 << (memLevel + 6);
    s._pending_buf_size = s.lit_bufsize * 4;
    s._pending_buf = new utils.Buf8(s._pending_buf_size);
    s.d_buf = 1 * s.lit_bufsize;
    s.l_buf = (1 + 2) * s.lit_bufsize;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(_strm);
}
function deflate(_strm, flush) {
    var old_flush, s;
    var beg, val;
    if (!_strm || !_strm._state ||
        flush > _Z_BLOCK || flush < 0) {
        return _strm ? err(_strm, _Z_STREAM_ERROR) : _Z_STREAM_ERROR;
    }
    s = _strm._state;
    if (!_strm.output ||
        (!_strm._input && _strm._avail_in !== 0) ||
        (s.status === FINISH_STATE && flush !== _Z_FINISH)) {
        return err(_strm, (_strm._avail_out === 0) ? _Z_BUF_ERROR : _Z_STREAM_ERROR);
    }
    s._strm = _strm;
    old_flush = s._last_flush;
    s._last_flush = flush;
    if (s.status === INIT_STATE) {
        {
            var header = (_Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
            var level_flags = -1;
            if (s.strategy >= _Z_HUFFMAN_ONLY || s.level < 2) {
                level_flags = 0;
            }
            else if (s.level < 6) {
                level_flags = 1;
            }
            else if (s.level === 6) {
                level_flags = 2;
            }
            else {
                level_flags = 3;
            }
            header |= (level_flags << 6);
            if (s._strstart !== 0) {
                header |= PRESET_DICT;
            }
            header += 31 - (header % 31);
            s.status = BUSY_STATE;
            putShortMSB(s, header);
            if (s._strstart !== 0) {
                putShortMSB(s, _strm.adler >>> 16);
                putShortMSB(s, _strm.adler & 0xffff);
            }
            _strm.adler = 1;
        }
    }
    if (s.pending !== 0) {
        flush_pending(_strm);
        if (_strm._avail_out === 0) {
            s._last_flush = -1;
            return _Z_OK;
        }
    }
    else if (_strm._avail_in === 0 && rank(flush) <= rank(old_flush) &&
        flush !== _Z_FINISH) {
        return err(_strm, _Z_BUF_ERROR);
    }
    if (s.status === FINISH_STATE && _strm._avail_in !== 0) {
        return err(_strm, _Z_BUF_ERROR);
    }
    if (_strm._avail_in !== 0 || s._lookahead !== 0 ||
        (flush !== _Z_NO_FLUSH && s.status !== FINISH_STATE)) {
        var bstate = (s.strategy === _Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
            (s.strategy === _Z_RLE ? deflate_rle(s, flush) :
                configuration_table[s.level].func(s, flush));
        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
            s.status = FINISH_STATE;
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
            if (_strm._avail_out === 0) {
                s._last_flush = -1;
            }
            return _Z_OK;
        }
        if (bstate === BS_BLOCK_DONE) {
            if (flush === _Z_PARTIAL_FLUSH) {
                trees._tr_align(s);
            }
            else if (flush !== _Z_BLOCK) {
                trees._tr_stored_block(s, 0, 0, false);
                if (flush === _Z_FULL_FLUSH) {
                    zero(s.head);
                    if (s._lookahead === 0) {
                        s._strstart = 0;
                        s._block_start = 0;
                        s.insert = 0;
                    }
                }
            }
            flush_pending(_strm);
            if (_strm._avail_out === 0) {
                s._last_flush = -1;
                return _Z_OK;
            }
        }
    }
    if (flush !== _Z_FINISH) {
        return _Z_OK;
    }
    if (s.wrap <= 0) {
        return _Z_STREAM_END;
    }
    if (s.wrap === 2) {
        put_byte(s, _strm.adler & 0xff);
        put_byte(s, (_strm.adler >> 8) & 0xff);
        put_byte(s, (_strm.adler >> 16) & 0xff);
        put_byte(s, (_strm.adler >> 24) & 0xff);
        put_byte(s, _strm.total_in & 0xff);
        put_byte(s, (_strm.total_in >> 8) & 0xff);
        put_byte(s, (_strm.total_in >> 16) & 0xff);
        put_byte(s, (_strm.total_in >> 24) & 0xff);
    }
    else {
        putShortMSB(s, _strm.adler >>> 16);
        putShortMSB(s, _strm.adler & 0xffff);
    }
    flush_pending(_strm);
    if (s.wrap > 0) {
        s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? _Z_OK : _Z_STREAM_END;
}
function deflateEnd(_strm) {
    var status;
    if (!_strm || !_strm._state) {
        return _Z_STREAM_ERROR;
    }
    status = _strm._state.status;
    if (status !== INIT_STATE &&
        status !== EXTRA_STATE &&
        status !== NAME_STATE &&
        status !== COMMENT_STATE &&
        status !== HCRC_STATE &&
        status !== BUSY_STATE &&
        status !== FINISH_STATE) {
        return err(_strm, _Z_STREAM_ERROR);
    }
    _strm._state = null;
    return status === BUSY_STATE ? err(_strm, _Z_DATA_ERROR) : _Z_OK;
}
exports._deflateInit2 = deflateInit2;
exports._deflate = deflate;
exports._deflateEnd = deflateEnd;
exports._deflateInfo = 'pako deflate (from Nodeca project)';


/***/ }),

/***/ 201:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var utils = __webpack_require__(8);
var _Z_FIXED = 4;
var _Z_BINARY = 0;
var _Z_TEXT = 1;
var _Z_UNKNOWN = 2;
function zero(buf) { var len = buf.length; while (--len >= 0) {
    buf[len] = 0;
} }
var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES = 2;
var MIN_MATCH = 3;
var MAX_MATCH = 258;
var LENGTH_CODES = 29;
var LITERALS = 256;
var L_CODES = LITERALS + 1 + LENGTH_CODES;
var D_CODES = 30;
var BL_CODES = 19;
var HEAP_SIZE = 2 * L_CODES + 1;
var MAX_BITS = 15;
var Buf_size = 16;
var MAX_BL_BITS = 7;
var END_BLOCK = 256;
var REP_3_6 = 16;
var REPZ_3_10 = 17;
var REPZ_11_138 = 18;
var extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
var extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
var extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
var DIST_CODE_LEN = 512;
var static_ltree = new Array((L_CODES + 2) * 2);
zero(static_ltree);
var static_dtree = new Array(D_CODES * 2);
zero(static_dtree);
var _dist_code = new Array(DIST_CODE_LEN);
zero(_dist_code);
var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);
var base_length = new Array(LENGTH_CODES);
zero(base_length);
var base_dist = new Array(D_CODES);
zero(base_dist);
function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
}
var static_l_desc;
var static_d_desc;
var static_bl_desc;
function TreeDesc(dyn_tree, _stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this._stat_desc = _stat_desc;
}
function d_code(dist) {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}
function put_short(s, w) {
    s._pending_buf[s.pending++] = (w) & 0xff;
    s._pending_buf[s.pending++] = (w >>> 8) & 0xff;
}
function send_bits(s, value, length) {
    if (s._bi_valid > (Buf_size - length)) {
        s.bi_buf |= (value << s._bi_valid) & 0xffff;
        put_short(s, s.bi_buf);
        s.bi_buf = value >> (Buf_size - s._bi_valid);
        s._bi_valid += length - Buf_size;
    }
    else {
        s.bi_buf |= (value << s._bi_valid) & 0xffff;
        s._bi_valid += length;
    }
}
function send_code(s, c, tree) {
    send_bits(s, tree[c * 2], tree[c * 2 + 1]);
}
function bi_reverse(code, len) {
    var res = 0;
    do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
    } while (--len > 0);
    return res >>> 1;
}
function bi_flush(s) {
    if (s._bi_valid === 16) {
        put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s._bi_valid = 0;
    }
    else if (s._bi_valid >= 8) {
        s._pending_buf[s.pending++] = s.bi_buf & 0xff;
        s.bi_buf >>= 8;
        s._bi_valid -= 8;
    }
}
function gen_bitlen(s, desc) {
    var tree = desc.dyn_tree;
    var max_code = desc.max_code;
    var stree = desc._stat_desc.static_tree;
    var has_stree = desc._stat_desc.has_stree;
    var extra = desc._stat_desc.extra_bits;
    var base = desc._stat_desc.extra_base;
    var max_length = desc._stat_desc.max_length;
    var h;
    var n, m;
    var bits;
    var xbits;
    var f;
    var overflow = 0;
    for (bits = 0; bits <= MAX_BITS; bits++) {
        s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
            bits = max_length;
            overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > max_code) {
            continue;
        }
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) {
            xbits = extra[n - base];
        }
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) {
            s.static_len += f * (stree[n * 2 + 1] + xbits);
        }
    }
    if (overflow === 0) {
        return;
    }
    do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0) {
            bits--;
        }
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
            m = s.heap[--h];
            if (m > max_code) {
                continue;
            }
            if (tree[m * 2 + 1] !== bits) {
                s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
                tree[m * 2 + 1] = bits;
            }
            n--;
        }
    }
}
function gen_codes(tree, max_code, bl_count) {
    var next_code = new Array(MAX_BITS + 1);
    var code = 0;
    var bits;
    var n;
    for (bits = 1; bits <= MAX_BITS; bits++) {
        next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
    }
    for (n = 0; n <= max_code; n++) {
        var len = tree[n * 2 + 1];
        if (len === 0) {
            continue;
        }
        tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
}
function tr_static_init() {
    var n;
    var bits;
    var length;
    var code;
    var dist;
    var bl_count = new Array(MAX_BITS + 1);
    length = 0;
    for (code = 0; code < LENGTH_CODES - 1; code++) {
        base_length[code] = length;
        for (n = 0; n < (1 << extra_lbits[code]); n++) {
            _length_code[length++] = code;
        }
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0; code < 16; code++) {
        base_dist[code] = dist;
        for (n = 0; n < (1 << extra_dbits[code]); n++) {
            _dist_code[dist++] = code;
        }
    }
    dist >>= 7;
    for (; code < D_CODES; code++) {
        base_dist[code] = dist << 7;
        for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
            _dist_code[256 + dist++] = code;
        }
    }
    for (bits = 0; bits <= MAX_BITS; bits++) {
        bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
    }
    while (n <= 255) {
        static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
    }
    while (n <= 279) {
        static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
    }
    while (n <= 287) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES + 1, bl_count);
    for (n = 0; n < D_CODES; n++) {
        static_dtree[n * 2 + 1] = 5;
        static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
}
function init_block(s) {
    var n;
    for (n = 0; n < L_CODES; n++) {
        s._dyn_ltree[n * 2] = 0;
    }
    for (n = 0; n < D_CODES; n++) {
        s._dyn_dtree[n * 2] = 0;
    }
    for (n = 0; n < BL_CODES; n++) {
        s._bl_tree[n * 2] = 0;
    }
    s._dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.last_lit = s.matches = 0;
}
function bi_windup(s) {
    if (s._bi_valid > 8) {
        put_short(s, s.bi_buf);
    }
    else if (s._bi_valid > 0) {
        s._pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s._bi_valid = 0;
}
function copy_block(s, buf, len, header) {
    bi_windup(s);
    if (header) {
        put_short(s, len);
        put_short(s, ~len);
    }
    utils.arraySet(s._pending_buf, s._window, buf, len, s.pending);
    s.pending += len;
}
function smaller(tree, n, m, depth) {
    var _n2 = n * 2;
    var _m2 = m * 2;
    return (tree[_n2] < tree[_m2] ||
        (tree[_n2] === tree[_m2] && depth[n] <= depth[m]));
}
function pqdownheap(s, tree, k) {
    var v = s.heap[k];
    var j = k << 1;
    while (j <= s.heap_len) {
        if (j < s.heap_len &&
            smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
            j++;
        }
        if (smaller(tree, v, s.heap[j], s.depth)) {
            break;
        }
        s.heap[k] = s.heap[j];
        k = j;
        j <<= 1;
    }
    s.heap[k] = v;
}
function compress_block(s, ltree, dtree) {
    var dist;
    var lc;
    var lx = 0;
    var code;
    var extra;
    if (s.last_lit !== 0) {
        do {
            dist = (s._pending_buf[s.d_buf + lx * 2] << 8) | (s._pending_buf[s.d_buf + lx * 2 + 1]);
            lc = s._pending_buf[s.l_buf + lx];
            lx++;
            if (dist === 0) {
                send_code(s, lc, ltree);
            }
            else {
                code = _length_code[lc];
                send_code(s, code + LITERALS + 1, ltree);
                extra = extra_lbits[code];
                if (extra !== 0) {
                    lc -= base_length[code];
                    send_bits(s, lc, extra);
                }
                dist--;
                code = d_code(dist);
                send_code(s, code, dtree);
                extra = extra_dbits[code];
                if (extra !== 0) {
                    dist -= base_dist[code];
                    send_bits(s, dist, extra);
                }
            }
        } while (lx < s.last_lit);
    }
    send_code(s, END_BLOCK, ltree);
}
function build_tree(s, desc) {
    var tree = desc.dyn_tree;
    var stree = desc._stat_desc.static_tree;
    var has_stree = desc._stat_desc.has_stree;
    var elems = desc._stat_desc.elems;
    var n, m;
    var max_code = -1;
    var node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE;
    for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
            s.heap[++s.heap_len] = max_code = n;
            s.depth[n] = 0;
        }
        else {
            tree[n * 2 + 1] = 0;
        }
    }
    while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) {
            s.static_len -= stree[node * 2 + 1];
        }
    }
    desc.max_code = max_code;
    for (n = (s.heap_len >> 1); n >= 1; n--) {
        pqdownheap(s, tree, n);
    }
    node = elems;
    do {
        n = s.heap[1];
        s.heap[1] = s.heap[s.heap_len--];
        pqdownheap(s, tree, 1);
        m = s.heap[1];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[1] = node++;
        pqdownheap(s, tree, 1);
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[1];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
}
function scan_tree(s, tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0 * 2 + 1];
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 0xffff;
    for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
            continue;
        }
        else if (count < min_count) {
            s._bl_tree[curlen * 2] += count;
        }
        else if (curlen !== 0) {
            if (curlen !== prevlen) {
                s._bl_tree[curlen * 2]++;
            }
            s._bl_tree[REP_3_6 * 2]++;
        }
        else if (count <= 10) {
            s._bl_tree[REPZ_3_10 * 2]++;
        }
        else {
            s._bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
        }
        else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
        }
        else {
            max_count = 7;
            min_count = 4;
        }
    }
}
function send_tree(s, tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0 * 2 + 1];
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
            continue;
        }
        else if (count < min_count) {
            do {
                send_code(s, curlen, s._bl_tree);
            } while (--count !== 0);
        }
        else if (curlen !== 0) {
            if (curlen !== prevlen) {
                send_code(s, curlen, s._bl_tree);
                count--;
            }
            send_code(s, REP_3_6, s._bl_tree);
            send_bits(s, count - 3, 2);
        }
        else if (count <= 10) {
            send_code(s, REPZ_3_10, s._bl_tree);
            send_bits(s, count - 3, 3);
        }
        else {
            send_code(s, REPZ_11_138, s._bl_tree);
            send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
        }
        else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
        }
        else {
            max_count = 7;
            min_count = 4;
        }
    }
}
function build__bl_tree(s) {
    var max_blindex;
    scan_tree(s, s._dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s._dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (s._bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
            break;
        }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
}
function send_all_trees(s, lcodes, dcodes, blcodes) {
    var rank;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank = 0; rank < blcodes; rank++) {
        send_bits(s, s._bl_tree[bl_order[rank] * 2 + 1], 3);
    }
    send_tree(s, s._dyn_ltree, lcodes - 1);
    send_tree(s, s._dyn_dtree, dcodes - 1);
}
function detect_data_type(s) {
    var black_mask = 0xf3ffc07f;
    var n;
    for (n = 0; n <= 31; n++, black_mask >>>= 1) {
        if ((black_mask & 1) && (s._dyn_ltree[n * 2] !== 0)) {
            return _Z_BINARY;
        }
    }
    if (s._dyn_ltree[9 * 2] !== 0 || s._dyn_ltree[10 * 2] !== 0 ||
        s._dyn_ltree[13 * 2] !== 0) {
        return _Z_TEXT;
    }
    for (n = 32; n < LITERALS; n++) {
        if (s._dyn_ltree[n * 2] !== 0) {
            return _Z_TEXT;
        }
    }
    return _Z_BINARY;
}
var static_init_done = false;
function _tr_init(s) {
    if (!static_init_done) {
        tr_static_init();
        static_init_done = true;
    }
    s.l_desc = new TreeDesc(s._dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s._dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s._bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s._bi_valid = 0;
    init_block(s);
}
function _tr_stored_block(s, buf, stored_len, last) {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    copy_block(s, buf, stored_len, true);
}
function _tr_align(s) {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
}
function _tr_flush_block(s, buf, stored_len, last) {
    var opt_lenb, static_lenb;
    var max_blindex = 0;
    if (s.level > 0) {
        if (s._strm._data_type === _Z_UNKNOWN) {
            s._strm._data_type = detect_data_type(s);
        }
        build_tree(s, s.l_desc);
        build_tree(s, s.d_desc);
        max_blindex = build__bl_tree(s);
        opt_lenb = (s.opt_len + 3 + 7) >>> 3;
        static_lenb = (s.static_len + 3 + 7) >>> 3;
        if (static_lenb <= opt_lenb) {
            opt_lenb = static_lenb;
        }
    }
    else {
        opt_lenb = static_lenb = stored_len + 5;
    }
    if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
        _tr_stored_block(s, buf, stored_len, last);
    }
    else if (s.strategy === _Z_FIXED || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
        compress_block(s, static_ltree, static_dtree);
    }
    else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        compress_block(s, s._dyn_ltree, s._dyn_dtree);
    }
    init_block(s);
    if (last) {
        bi_windup(s);
    }
}
function _tr_tally(s, dist, lc) {
    s._pending_buf[s.d_buf + s.last_lit * 2] = (dist >>> 8) & 0xff;
    s._pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;
    s._pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
    s.last_lit++;
    if (dist === 0) {
        s._dyn_ltree[lc * 2]++;
    }
    else {
        s.matches++;
        dist--;
        s._dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
        s._dyn_dtree[d_code(dist) * 2]++;
    }
    return (s.last_lit === s.lit_bufsize - 1);
}
exports._tr_init = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;


/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var zlib_inflate = __webpack_require__(203);
var utils = __webpack_require__(8);
var c = __webpack_require__(206);
var ZStream = __webpack_require__(65);
var toString = Object.prototype.toString;
function Inflate(options) {
    if (!(this instanceof Inflate))
        return new Inflate(options);
    this.options = utils.assign({
        chunkSize: 16384,
        _windowBits: 0,
        to: ''
    }, options || {});
    var opt = this.options;
    if (opt.raw && (opt._windowBits >= 0) && (opt._windowBits < 16)) {
        opt._windowBits = -opt._windowBits;
        if (opt._windowBits === 0) {
            opt._windowBits = -15;
        }
    }
    if ((opt._windowBits >= 0) && (opt._windowBits < 16) &&
        !(options && options._windowBits)) {
        opt._windowBits += 32;
    }
    if ((opt._windowBits > 15) && (opt._windowBits < 48)) {
        if ((opt._windowBits & 15) === 0) {
            opt._windowBits |= 15;
        }
    }
    this.err = 0;
    this.msg = '';
    this.ended = false;
    this.chunks = [];
    this._strm = new ZStream();
    this._strm._avail_out = 0;
    var status = zlib_inflate._inflateInit2(this._strm, opt._windowBits);
    if (status !== c._Z_OK) {
        throw new Error(status);
    }
}
Inflate.prototype.push = function (data, _mode) {
    var _strm = this._strm;
    var chunkSize = this.options.chunkSize;
    var status, __mode;
    var _next_out_utf8, tail, utf8str;
    var allowBufError = false;
    if (this.ended) {
        return false;
    }
    __mode = (_mode === ~~_mode) ? _mode : ((_mode === true) ? c._Z_FINISH : c._Z_NO_FLUSH);
    if (toString.call(data) === '[object ArrayBuffer]') {
        _strm._input = new Uint8Array(data);
    }
    else {
        _strm._input = data;
    }
    _strm._next_in = 0;
    _strm._avail_in = _strm._input.length;
    do {
        if (_strm._avail_out === 0) {
            _strm.output = new utils.Buf8(chunkSize);
            _strm._next_out = 0;
            _strm._avail_out = chunkSize;
        }
        status = zlib_inflate._inflate(_strm, c._Z_NO_FLUSH);
        if (status === c._Z_BUF_ERROR && allowBufError === true) {
            status = c._Z_OK;
            allowBufError = false;
        }
        if (status !== c._Z_STREAM_END && status !== c._Z_OK) {
            this.onEnd(status);
            this.ended = true;
            return false;
        }
        if (_strm._next_out) {
            if (_strm._avail_out === 0 || status === c._Z_STREAM_END || (_strm._avail_in === 0 && (__mode === c._Z_FINISH || __mode === c._Z_SYNC_FLUSH))) {
                this.onData(utils.shrinkBuf(_strm.output, _strm._next_out));
            }
        }
        if (_strm._avail_in === 0 && _strm._avail_out === 0) {
            allowBufError = true;
        }
    } while ((_strm._avail_in > 0 || _strm._avail_out === 0) && status !== c._Z_STREAM_END);
    if (status === c._Z_STREAM_END) {
        __mode = c._Z_FINISH;
    }
    if (__mode === c._Z_FINISH) {
        status = zlib_inflate._inflateEnd(this._strm);
        this.onEnd(status);
        this.ended = true;
        return status === c._Z_OK;
    }
    if (__mode === c._Z_SYNC_FLUSH) {
        this.onEnd(c._Z_OK);
        _strm._avail_out = 0;
        return true;
    }
    return true;
};
Inflate.prototype.onData = function (chunk) {
    this.chunks.push(chunk);
};
Inflate.prototype.onEnd = function (status) {
    if (status === c._Z_OK) {
        this.result = utils.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this._strm.msg;
};
function inflate(input, options) {
    var inflator = new Inflate(options);
    inflator.push(input, true);
    if (inflator.err) {
        throw inflator.msg || inflator.err;
    }
    return inflator.result;
}
exports.inflate = inflate;


/***/ }),

/***/ 203:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var utils = __webpack_require__(8);
var adler32 = __webpack_require__(64);
var inflate_fast = __webpack_require__(204);
var inflate_table = __webpack_require__(205);
var CODES = 0;
var LENS = 1;
var DISTS = 2;
var _Z_FINISH = 4;
var _Z_BLOCK = 5;
var _Z_TREES = 6;
var _Z_OK = 0;
var _Z_STREAM_END = 1;
var _Z_NEED_DICT = 2;
var _Z_STREAM_ERROR = -2;
var _Z_DATA_ERROR = -3;
var _Z_MEM_ERROR = -4;
var _Z_BUF_ERROR = -5;
var _Z_DEFLATED = 8;
var HEAD = 1;
var FLAGS = 2;
var TIME = 3;
var OS = 4;
var EXLEN = 5;
var EXTRA = 6;
var NAME = 7;
var COMMENT = 8;
var HCRC = 9;
var DICTID = 10;
var DICT = 11;
var TYPE = 12;
var TYPEDO = 13;
var STORED = 14;
var COPY_ = 15;
var COPY = 16;
var TABLE = 17;
var LENLENS = 18;
var CODELENS = 19;
var LEN_ = 20;
var LEN = 21;
var LENEXT = 22;
var DIST = 23;
var DISTEXT = 24;
var MATCH = 25;
var LIT = 26;
var CHECK = 27;
var LENGTH = 28;
var DONE = 29;
var BAD = 30;
var MEM = 31;
var SYNC = 32;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
var MAX_WBITS = 15;
var DEF_WBITS = MAX_WBITS;
function zswap32(q) {
    return (((q >>> 24) & 0xff) +
        ((q >>> 8) & 0xff00) +
        ((q & 0xff00) << 8) +
        ((q & 0xff) << 24));
}
function InflateState() {
    this._mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this._window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new utils.Buf16(320);
    this.work = new utils.Buf16(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
}
function inflateResetKeep(_strm) {
    var _state;
    if (!_strm || !_strm._state) {
        return _Z_STREAM_ERROR;
    }
    _state = _strm._state;
    _strm.total_in = _strm.total_out = _state.total = 0;
    _strm.msg = '';
    if (_state.wrap) {
        _strm.adler = _state.wrap & 1;
    }
    _state._mode = HEAD;
    _state.last = 0;
    _state.havedict = 0;
    _state.dmax = 32768;
    _state.head = null;
    _state.hold = 0;
    _state.bits = 0;
    _state.lencode = _state.lendyn = new utils.Buf32(ENOUGH_LENS);
    _state.distcode = _state.distdyn = new utils.Buf32(ENOUGH_DISTS);
    _state.sane = 1;
    _state.back = -1;
    return _Z_OK;
}
function inflateReset(_strm) {
    var _state;
    if (!_strm || !_strm._state) {
        return _Z_STREAM_ERROR;
    }
    _state = _strm._state;
    _state.wsize = 0;
    _state.whave = 0;
    _state.wnext = 0;
    return inflateResetKeep(_strm);
}
function inflateReset2(_strm, _windowBits) {
    var wrap;
    var _state;
    if (!_strm || !_strm._state) {
        return _Z_STREAM_ERROR;
    }
    _state = _strm._state;
    if (_windowBits < 0) {
        wrap = 0;
        _windowBits = -_windowBits;
    }
    else {
        wrap = (_windowBits >> 4) + 1;
        if (_windowBits < 48) {
            _windowBits &= 15;
        }
    }
    if (_windowBits && (_windowBits < 8 || _windowBits > 15)) {
        return _Z_STREAM_ERROR;
    }
    if (_state._window !== null && _state.wbits !== _windowBits) {
        _state._window = null;
    }
    _state.wrap = wrap;
    _state.wbits = _windowBits;
    return inflateReset(_strm);
}
function inflateInit2(_strm, _windowBits) {
    var ret;
    var _state;
    if (!_strm) {
        return _Z_STREAM_ERROR;
    }
    _state = new InflateState();
    _strm._state = _state;
    _state._window = null;
    ret = inflateReset2(_strm, _windowBits);
    if (ret !== _Z_OK) {
        _strm._state = null;
    }
    return ret;
}
var virgin = true;
var lenfix, distfix;
function fixedtables(_state) {
    if (virgin) {
        var sym;
        lenfix = new utils.Buf32(512);
        distfix = new utils.Buf32(32);
        sym = 0;
        while (sym < 144) {
            _state.lens[sym++] = 8;
        }
        while (sym < 256) {
            _state.lens[sym++] = 9;
        }
        while (sym < 280) {
            _state.lens[sym++] = 7;
        }
        while (sym < 288) {
            _state.lens[sym++] = 8;
        }
        inflate_table(LENS, _state.lens, 0, 288, lenfix, 0, _state.work, { bits: 9 });
        sym = 0;
        while (sym < 32) {
            _state.lens[sym++] = 5;
        }
        inflate_table(DISTS, _state.lens, 0, 32, distfix, 0, _state.work, { bits: 5 });
        virgin = false;
    }
    _state.lencode = lenfix;
    _state.lenbits = 9;
    _state.distcode = distfix;
    _state.distbits = 5;
}
function update_window(_strm, src, end, copy) {
    var dist;
    var _state = _strm._state;
    if (_state._window === null) {
        _state.wsize = 1 << _state.wbits;
        _state.wnext = 0;
        _state.whave = 0;
        _state._window = new utils.Buf8(_state.wsize);
    }
    if (copy >= _state.wsize) {
        utils.arraySet(_state._window, src, end - _state.wsize, _state.wsize, 0);
        _state.wnext = 0;
        _state.whave = _state.wsize;
    }
    else {
        dist = _state.wsize - _state.wnext;
        if (dist > copy) {
            dist = copy;
        }
        utils.arraySet(_state._window, src, end - copy, dist, _state.wnext);
        copy -= dist;
        if (copy) {
            utils.arraySet(_state._window, src, end - copy, copy, 0);
            _state.wnext = copy;
            _state.whave = _state.wsize;
        }
        else {
            _state.wnext += dist;
            if (_state.wnext === _state.wsize) {
                _state.wnext = 0;
            }
            if (_state.whave < _state.wsize) {
                _state.whave += dist;
            }
        }
    }
    return 0;
}
function inflate(_strm, flush) {
    var _state;
    var input, output;
    var next;
    var put;
    var have, left;
    var hold;
    var bits;
    var _in, _out;
    var copy;
    var from;
    var from_source;
    var here = 0;
    var here_bits, here_op, here_val;
    var last_bits, last_op, last_val;
    var len;
    var ret;
    var hbuf = new utils.Buf8(4);
    var opts;
    var n;
    var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    if (!_strm || !_strm._state || !_strm.output ||
        (!_strm._input && _strm._avail_in !== 0)) {
        return _Z_STREAM_ERROR;
    }
    _state = _strm._state;
    if (_state._mode === TYPE) {
        _state._mode = TYPEDO;
    }
    put = _strm._next_out;
    output = _strm.output;
    left = _strm._avail_out;
    next = _strm._next_in;
    input = _strm._input;
    have = _strm._avail_in;
    hold = _state.hold;
    bits = _state.bits;
    _in = have;
    _out = left;
    ret = _Z_OK;
    inf_leave: for (;;) {
        switch (_state._mode) {
            case HEAD:
                if (_state.wrap === 0) {
                    _state._mode = TYPEDO;
                    break;
                }
                while (bits < 16) {
                    if (have === 0) {
                        break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                _state.flags = 0;
                if (_state.head) {
                    _state.head.done = false;
                }
                if (!(_state.wrap & 1) ||
                    (((hold & 0xff) << 8) + (hold >> 8)) % 31) {
                    _strm.msg = 'incorrect header check';
                    _state._mode = BAD;
                    break;
                }
                if ((hold & 0x0f) !== _Z_DEFLATED) {
                    _strm.msg = 'unknown compression method';
                    _state._mode = BAD;
                    break;
                }
                hold >>>= 4;
                bits -= 4;
                len = (hold & 0x0f) + 8;
                if (_state.wbits === 0) {
                    _state.wbits = len;
                }
                else if (len > _state.wbits) {
                    _strm.msg = 'invalid _window size';
                    _state._mode = BAD;
                    break;
                }
                _state.dmax = 1 << len;
                _strm.adler = _state.check = 1;
                _state._mode = hold & 0x200 ? DICTID : TYPE;
                hold = 0;
                bits = 0;
                break;
            case DICTID:
                while (bits < 32) {
                    if (have === 0) {
                        break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                _strm.adler = _state.check = zswap32(hold);
                hold = 0;
                bits = 0;
                _state._mode = DICT;
            case DICT:
                if (_state.havedict === 0) {
                    _strm._next_out = put;
                    _strm._avail_out = left;
                    _strm._next_in = next;
                    _strm._avail_in = have;
                    _state.hold = hold;
                    _state.bits = bits;
                    return _Z_NEED_DICT;
                }
                _strm.adler = _state.check = 1;
                _state._mode = TYPE;
            case TYPE:
                if (flush === _Z_BLOCK || flush === _Z_TREES) {
                    break inf_leave;
                }
            case TYPEDO:
                if (_state.last) {
                    hold >>>= bits & 7;
                    bits -= bits & 7;
                    _state._mode = CHECK;
                    break;
                }
                while (bits < 3) {
                    if (have === 0) {
                        break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                _state.last = (hold & 0x01);
                hold >>>= 1;
                bits -= 1;
                switch ((hold & 0x03)) {
                    case 0:
                        _state._mode = STORED;
                        break;
                    case 1:
                        fixedtables(_state);
                        _state._mode = LEN_;
                        if (flush === _Z_TREES) {
                            hold >>>= 2;
                            bits -= 2;
                            break inf_leave;
                        }
                        break;
                    case 2:
                        _state._mode = TABLE;
                        break;
                    case 3:
                        _strm.msg = 'invalid block type';
                        _state._mode = BAD;
                }
                hold >>>= 2;
                bits -= 2;
                break;
            case STORED:
                hold >>>= bits & 7;
                bits -= bits & 7;
                while (bits < 32) {
                    if (have === 0) {
                        break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
                    _strm.msg = 'invalid stored block lengths';
                    _state._mode = BAD;
                    break;
                }
                _state.length = hold & 0xffff;
                hold = 0;
                bits = 0;
                _state._mode = COPY_;
                if (flush === _Z_TREES) {
                    break inf_leave;
                }
            case COPY_:
                _state._mode = COPY;
            case COPY:
                copy = _state.length;
                if (copy) {
                    if (copy > have) {
                        copy = have;
                    }
                    if (copy > left) {
                        copy = left;
                    }
                    if (copy === 0) {
                        break inf_leave;
                    }
                    utils.arraySet(output, input, next, copy, put);
                    have -= copy;
                    next += copy;
                    left -= copy;
                    put += copy;
                    _state.length -= copy;
                    break;
                }
                _state._mode = TYPE;
                break;
            case TABLE:
                while (bits < 14) {
                    if (have === 0) {
                        break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                _state.nlen = (hold & 0x1f) + 257;
                hold >>>= 5;
                bits -= 5;
                _state.ndist = (hold & 0x1f) + 1;
                hold >>>= 5;
                bits -= 5;
                _state.ncode = (hold & 0x0f) + 4;
                hold >>>= 4;
                bits -= 4;
                if (_state.nlen > 286 || _state.ndist > 30) {
                    _strm.msg = 'too many length or distance symbols';
                    _state._mode = BAD;
                    break;
                }
                _state.have = 0;
                _state._mode = LENLENS;
            case LENLENS:
                while (_state.have < _state.ncode) {
                    while (bits < 3) {
                        if (have === 0) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    _state.lens[order[_state.have++]] = (hold & 0x07);
                    hold >>>= 3;
                    bits -= 3;
                }
                while (_state.have < 19) {
                    _state.lens[order[_state.have++]] = 0;
                }
                _state.lencode = _state.lendyn;
                _state.lenbits = 7;
                opts = { bits: _state.lenbits };
                ret = inflate_table(CODES, _state.lens, 0, 19, _state.lencode, 0, _state.work, opts);
                _state.lenbits = opts.bits;
                if (ret) {
                    _strm.msg = 'invalid code lengths set';
                    _state._mode = BAD;
                    break;
                }
                _state.have = 0;
                _state._mode = CODELENS;
            case CODELENS:
                while (_state.have < _state.nlen + _state.ndist) {
                    for (;;) {
                        here = _state.lencode[hold & ((1 << _state.lenbits) - 1)];
                        here_bits = here >>> 24;
                        here_op = (here >>> 16) & 0xff;
                        here_val = here & 0xffff;
                        if ((here_bits) <= bits) {
                            break;
                        }
                        if (have === 0) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    if (here_val < 16) {
                        hold >>>= here_bits;
                        bits -= here_bits;
                        _state.lens[_state.have++] = here_val;
                    }
                    else {
                        if (here_val === 16) {
                            n = here_bits + 2;
                            while (bits < n) {
                                if (have === 0) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            hold >>>= here_bits;
                            bits -= here_bits;
                            if (_state.have === 0) {
                                _strm.msg = 'invalid bit length repeat';
                                _state._mode = BAD;
                                break;
                            }
                            len = _state.lens[_state.have - 1];
                            copy = 3 + (hold & 0x03);
                            hold >>>= 2;
                            bits -= 2;
                        }
                        else if (here_val === 17) {
                            n = here_bits + 3;
                            while (bits < n) {
                                if (have === 0) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            hold >>>= here_bits;
                            bits -= here_bits;
                            len = 0;
                            copy = 3 + (hold & 0x07);
                            hold >>>= 3;
                            bits -= 3;
                        }
                        else {
                            n = here_bits + 7;
                            while (bits < n) {
                                if (have === 0) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            hold >>>= here_bits;
                            bits -= here_bits;
                            len = 0;
                            copy = 11 + (hold & 0x7f);
                            hold >>>= 7;
                            bits -= 7;
                        }
                        if (_state.have + copy > _state.nlen + _state.ndist) {
                            _strm.msg = 'invalid bit length repeat';
                            _state._mode = BAD;
                            break;
                        }
                        while (copy--) {
                            _state.lens[_state.have++] = len;
                        }
                    }
                }
                if (_state._mode === BAD) {
                    break;
                }
                if (_state.lens[256] === 0) {
                    _strm.msg = 'invalid code -- missing end-of-block';
                    _state._mode = BAD;
                    break;
                }
                _state.lenbits = 9;
                opts = { bits: _state.lenbits };
                ret = inflate_table(LENS, _state.lens, 0, _state.nlen, _state.lencode, 0, _state.work, opts);
                _state.lenbits = opts.bits;
                if (ret) {
                    _strm.msg = 'invalid literal/lengths set';
                    _state._mode = BAD;
                    break;
                }
                _state.distbits = 6;
                _state.distcode = _state.distdyn;
                opts = { bits: _state.distbits };
                ret = inflate_table(DISTS, _state.lens, _state.nlen, _state.ndist, _state.distcode, 0, _state.work, opts);
                _state.distbits = opts.bits;
                if (ret) {
                    _strm.msg = 'invalid distances set';
                    _state._mode = BAD;
                    break;
                }
                _state._mode = LEN_;
                if (flush === _Z_TREES) {
                    break inf_leave;
                }
            case LEN_:
                _state._mode = LEN;
            case LEN:
                if (have >= 6 && left >= 258) {
                    _strm._next_out = put;
                    _strm._avail_out = left;
                    _strm._next_in = next;
                    _strm._avail_in = have;
                    _state.hold = hold;
                    _state.bits = bits;
                    inflate_fast(_strm, _out);
                    put = _strm._next_out;
                    output = _strm.output;
                    left = _strm._avail_out;
                    next = _strm._next_in;
                    input = _strm._input;
                    have = _strm._avail_in;
                    hold = _state.hold;
                    bits = _state.bits;
                    if (_state._mode === TYPE) {
                        _state.back = -1;
                    }
                    break;
                }
                _state.back = 0;
                for (;;) {
                    here = _state.lencode[hold & ((1 << _state.lenbits) - 1)];
                    here_bits = here >>> 24;
                    here_op = (here >>> 16) & 0xff;
                    here_val = here & 0xffff;
                    if (here_bits <= bits) {
                        break;
                    }
                    if (have === 0) {
                        break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                if (here_op && (here_op & 0xf0) === 0) {
                    last_bits = here_bits;
                    last_op = here_op;
                    last_val = here_val;
                    for (;;) {
                        here = _state.lencode[last_val +
                            ((hold & ((1 << (last_bits + last_op)) - 1)) >> last_bits)];
                        here_bits = here >>> 24;
                        here_op = (here >>> 16) & 0xff;
                        here_val = here & 0xffff;
                        if ((last_bits + here_bits) <= bits) {
                            break;
                        }
                        if (have === 0) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    hold >>>= last_bits;
                    bits -= last_bits;
                    _state.back += last_bits;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                _state.back += here_bits;
                _state.length = here_val;
                if (here_op === 0) {
                    _state._mode = LIT;
                    break;
                }
                if (here_op & 32) {
                    _state.back = -1;
                    _state._mode = TYPE;
                    break;
                }
                if (here_op & 64) {
                    _strm.msg = 'invalid literal/length code';
                    _state._mode = BAD;
                    break;
                }
                _state.extra = here_op & 15;
                _state._mode = LENEXT;
            case LENEXT:
                if (_state.extra) {
                    n = _state.extra;
                    while (bits < n) {
                        if (have === 0) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    _state.length += hold & ((1 << _state.extra) - 1);
                    hold >>>= _state.extra;
                    bits -= _state.extra;
                    _state.back += _state.extra;
                }
                _state.was = _state.length;
                _state._mode = DIST;
            case DIST:
                for (;;) {
                    here = _state.distcode[hold & ((1 << _state.distbits) - 1)];
                    here_bits = here >>> 24;
                    here_op = (here >>> 16) & 0xff;
                    here_val = here & 0xffff;
                    if ((here_bits) <= bits) {
                        break;
                    }
                    if (have === 0) {
                        break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                if ((here_op & 0xf0) === 0) {
                    last_bits = here_bits;
                    last_op = here_op;
                    last_val = here_val;
                    for (;;) {
                        here = _state.distcode[last_val +
                            ((hold & ((1 << (last_bits + last_op)) - 1)) >> last_bits)];
                        here_bits = here >>> 24;
                        here_op = (here >>> 16) & 0xff;
                        here_val = here & 0xffff;
                        if ((last_bits + here_bits) <= bits) {
                            break;
                        }
                        if (have === 0) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    hold >>>= last_bits;
                    bits -= last_bits;
                    _state.back += last_bits;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                _state.back += here_bits;
                if (here_op & 64) {
                    _strm.msg = 'invalid distance code';
                    _state._mode = BAD;
                    break;
                }
                _state.offset = here_val;
                _state.extra = (here_op) & 15;
                _state._mode = DISTEXT;
            case DISTEXT:
                if (_state.extra) {
                    n = _state.extra;
                    while (bits < n) {
                        if (have === 0) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    _state.offset += hold & ((1 << _state.extra) - 1);
                    hold >>>= _state.extra;
                    bits -= _state.extra;
                    _state.back += _state.extra;
                }
                if (_state.offset > _state.dmax) {
                    _strm.msg = 'invalid distance too far back';
                    _state._mode = BAD;
                    break;
                }
                _state._mode = MATCH;
            case MATCH:
                if (left === 0) {
                    break inf_leave;
                }
                copy = _out - left;
                if (_state.offset > copy) {
                    copy = _state.offset - copy;
                    if (copy > _state.whave) {
                        if (_state.sane) {
                            _strm.msg = 'invalid distance too far back';
                            _state._mode = BAD;
                            break;
                        }
                    }
                    if (copy > _state.wnext) {
                        copy -= _state.wnext;
                        from = _state.wsize - copy;
                    }
                    else {
                        from = _state.wnext - copy;
                    }
                    if (copy > _state.length) {
                        copy = _state.length;
                    }
                    from_source = _state._window;
                }
                else {
                    from_source = output;
                    from = put - _state.offset;
                    copy = _state.length;
                }
                if (copy > left) {
                    copy = left;
                }
                left -= copy;
                _state.length -= copy;
                do {
                    output[put++] = from_source[from++];
                } while (--copy);
                if (_state.length === 0) {
                    _state._mode = LEN;
                }
                break;
            case LIT:
                if (left === 0) {
                    break inf_leave;
                }
                output[put++] = _state.length;
                left--;
                _state._mode = LEN;
                break;
            case CHECK:
                if (_state.wrap) {
                    while (bits < 32) {
                        if (have === 0) {
                            break inf_leave;
                        }
                        have--;
                        hold |= input[next++] << bits;
                        bits += 8;
                    }
                    _out -= left;
                    _strm.total_out += _out;
                    _state.total += _out;
                    if (_out) {
                        _strm.adler = _state.check =
                            (adler32(_state.check, output, _out, put - _out));
                    }
                    _out = left;
                    if ((_state.flags ? hold : zswap32(hold)) !== _state.check) {
                        _strm.msg = 'incorrect data check';
                        _state._mode = BAD;
                        break;
                    }
                    hold = 0;
                    bits = 0;
                }
                _state._mode = DONE;
            case DONE:
                ret = _Z_STREAM_END;
                break inf_leave;
            case BAD:
                ret = _Z_DATA_ERROR;
                break inf_leave;
            case MEM:
                return _Z_MEM_ERROR;
            case SYNC:
            default:
                return _Z_STREAM_ERROR;
        }
    }
    _strm._next_out = put;
    _strm._avail_out = left;
    _strm._next_in = next;
    _strm._avail_in = have;
    _state.hold = hold;
    _state.bits = bits;
    if (_state.wsize || (_out !== _strm._avail_out && _state._mode < BAD &&
        (_state._mode < CHECK || flush !== _Z_FINISH))) {
        if (update_window(_strm, _strm.output, _strm._next_out, _out - _strm._avail_out)) {
            _state._mode = MEM;
            return _Z_MEM_ERROR;
        }
    }
    _in -= _strm._avail_in;
    _out -= _strm._avail_out;
    _strm.total_in += _in;
    _strm.total_out += _out;
    _state.total += _out;
    if (_state.wrap && _out) {
        _strm.adler = _state.check =
            (adler32(_state.check, output, _out, _strm._next_out - _out));
    }
    _strm._data_type = _state.bits + (_state.last ? 64 : 0) +
        (_state._mode === TYPE ? 128 : 0) +
        (_state._mode === LEN_ || _state._mode === COPY_ ? 256 : 0);
    if (((_in === 0 && _out === 0) || flush === _Z_FINISH) && ret === _Z_OK) {
        ret = _Z_BUF_ERROR;
    }
    return ret;
}
function inflateEnd(_strm) {
    if (!_strm || !_strm._state) {
        return _Z_STREAM_ERROR;
    }
    var _state = _strm._state;
    if (_state._window) {
        _state._window = null;
    }
    _strm._state = null;
    return _Z_OK;
}
exports._inflateInit2 = inflateInit2;
exports._inflate = inflate;
exports._inflateEnd = inflateEnd;
exports._inflateInfo = 'pako inflate (from Nodeca project)';


/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var BAD = 30;
var TYPE = 12;
module.exports = function inflate_fast(_strm, start) {
    var _state;
    var _in;
    var last;
    var _out;
    var beg;
    var end;
    var dmax;
    var wsize;
    var whave;
    var wnext;
    var s__window;
    var hold;
    var bits;
    var lcode;
    var dcode;
    var lmask;
    var dmask;
    var here;
    var op;
    var len;
    var dist;
    var from;
    var from_source;
    var input, output;
    _state = _strm._state;
    _in = _strm._next_in;
    input = _strm._input;
    last = _in + (_strm._avail_in - 5);
    _out = _strm._next_out;
    output = _strm.output;
    beg = _out - (start - _strm._avail_out);
    end = _out + (_strm._avail_out - 257);
    dmax = _state.dmax;
    wsize = _state.wsize;
    whave = _state.whave;
    wnext = _state.wnext;
    s__window = _state._window;
    hold = _state.hold;
    bits = _state.bits;
    lcode = _state.lencode;
    dcode = _state.distcode;
    lmask = (1 << _state.lenbits) - 1;
    dmask = (1 << _state.distbits) - 1;
    top: do {
        if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
        }
        here = lcode[hold & lmask];
        dolen: for (;;) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = (here >>> 16) & 0xff;
            if (op === 0) {
                output[_out++] = here & 0xffff;
            }
            else if (op & 16) {
                len = here & 0xffff;
                op &= 15;
                if (op) {
                    if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                    }
                    len += hold & ((1 << op) - 1);
                    hold >>>= op;
                    bits -= op;
                }
                if (bits < 15) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    hold += input[_in++] << bits;
                    bits += 8;
                }
                here = dcode[hold & dmask];
                dodist: for (;;) {
                    op = here >>> 24;
                    hold >>>= op;
                    bits -= op;
                    op = (here >>> 16) & 0xff;
                    if (op & 16) {
                        dist = here & 0xffff;
                        op &= 15;
                        if (bits < op) {
                            hold += input[_in++] << bits;
                            bits += 8;
                            if (bits < op) {
                                hold += input[_in++] << bits;
                                bits += 8;
                            }
                        }
                        dist += hold & ((1 << op) - 1);
                        if (dist > dmax) {
                            _strm.msg = 'invalid distance too far back';
                            _state._mode = BAD;
                            break top;
                        }
                        hold >>>= op;
                        bits -= op;
                        op = _out - beg;
                        if (dist > op) {
                            op = dist - op;
                            if (op > whave) {
                                if (_state.sane) {
                                    _strm.msg = 'invalid distance too far back';
                                    _state._mode = BAD;
                                    break top;
                                }
                            }
                            from = 0;
                            from_source = s__window;
                            if (wnext === 0) {
                                from += wsize - op;
                                if (op < len) {
                                    len -= op;
                                    do {
                                        output[_out++] = s__window[from++];
                                    } while (--op);
                                    from = _out - dist;
                                    from_source = output;
                                }
                            }
                            else if (wnext < op) {
                                from += wsize + wnext - op;
                                op -= wnext;
                                if (op < len) {
                                    len -= op;
                                    do {
                                        output[_out++] = s__window[from++];
                                    } while (--op);
                                    from = 0;
                                    if (wnext < len) {
                                        op = wnext;
                                        len -= op;
                                        do {
                                            output[_out++] = s__window[from++];
                                        } while (--op);
                                        from = _out - dist;
                                        from_source = output;
                                    }
                                }
                            }
                            else {
                                from += wnext - op;
                                if (op < len) {
                                    len -= op;
                                    do {
                                        output[_out++] = s__window[from++];
                                    } while (--op);
                                    from = _out - dist;
                                    from_source = output;
                                }
                            }
                            while (len > 2) {
                                output[_out++] = from_source[from++];
                                output[_out++] = from_source[from++];
                                output[_out++] = from_source[from++];
                                len -= 3;
                            }
                            if (len) {
                                output[_out++] = from_source[from++];
                                if (len > 1) {
                                    output[_out++] = from_source[from++];
                                }
                            }
                        }
                        else {
                            from = _out - dist;
                            do {
                                output[_out++] = output[from++];
                                output[_out++] = output[from++];
                                output[_out++] = output[from++];
                                len -= 3;
                            } while (len > 2);
                            if (len) {
                                output[_out++] = output[from++];
                                if (len > 1) {
                                    output[_out++] = output[from++];
                                }
                            }
                        }
                    }
                    else if ((op & 64) === 0) {
                        here = dcode[(here & 0xffff) + (hold & ((1 << op) - 1))];
                        continue dodist;
                    }
                    else {
                        _strm.msg = 'invalid distance code';
                        _state._mode = BAD;
                        break top;
                    }
                    break;
                }
            }
            else if ((op & 64) === 0) {
                here = lcode[(here & 0xffff) + (hold & ((1 << op) - 1))];
                continue dolen;
            }
            else if (op & 32) {
                _state._mode = TYPE;
                break top;
            }
            else {
                _strm.msg = 'invalid literal/length code';
                _state._mode = BAD;
                break top;
            }
            break;
        }
    } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    _strm._next_in = _in;
    _strm._next_out = _out;
    _strm._avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
    _strm._avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
    _state.hold = hold;
    _state.bits = bits;
    return;
};


/***/ }),

/***/ 205:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var utils = __webpack_require__(8);
var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
var CODES = 0;
var LENS = 1;
var DISTS = 2;
var lbase = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
    35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];
var lext = [
    16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
    19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];
var dbase = [
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
    257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
    8193, 12289, 16385, 24577, 0, 0
];
var dext = [
    16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
    23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
    28, 28, 29, 29, 64, 64
];
module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
    var bits = opts.bits;
    var len = 0;
    var sym = 0;
    var min = 0, max = 0;
    var root = 0;
    var curr = 0;
    var drop = 0;
    var left = 0;
    var used = 0;
    var huff = 0;
    var incr;
    var fill;
    var low;
    var mask;
    var next;
    var base = null;
    var base_index = 0;
    var end;
    var count = new utils.Buf16(MAXBITS + 1);
    var offs = new utils.Buf16(MAXBITS + 1);
    var extra = null;
    var extra_index = 0;
    var here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) {
            break;
        }
    }
    if (root > max) {
        root = max;
    }
    if (max === 0) {
        table[table_index++] = (1 << 24) | (64 << 16) | 0;
        table[table_index++] = (1 << 24) | (64 << 16) | 0;
        opts.bits = 1;
        return 0;
    }
    for (min = 1; min < max; min++) {
        if (count[min] !== 0) {
            break;
        }
    }
    if (root < min) {
        root = min;
    }
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= count[len];
        if (left < 0) {
            return -1;
        }
    }
    if (left > 0 && (type === CODES || max !== 1)) {
        return -1;
    }
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
            work[offs[lens[lens_index + sym]]++] = sym;
        }
    }
    if (type === CODES) {
        base = extra = work;
        end = 19;
    }
    else if (type === LENS) {
        base = lbase;
        base_index -= 257;
        extra = lext;
        extra_index -= 257;
        end = 256;
    }
    else {
        base = dbase;
        extra = dext;
        end = -1;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
    }
    for (;;) {
        here_bits = len - drop;
        if (work[sym] < end) {
            here_op = 0;
            here_val = work[sym];
        }
        else if (work[sym] > end) {
            here_op = extra[extra_index + work[sym]];
            here_val = base[base_index + work[sym]];
        }
        else {
            here_op = 32 + 64;
            here_val = 0;
        }
        incr = 1 << (len - drop);
        fill = 1 << curr;
        min = fill;
        do {
            fill -= incr;
            table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val | 0;
        } while (fill !== 0);
        incr = 1 << (len - 1);
        while (huff & incr) {
            incr >>= 1;
        }
        if (incr !== 0) {
            huff &= incr - 1;
            huff += incr;
        }
        else {
            huff = 0;
        }
        sym++;
        if (--count[len] === 0) {
            if (len === max) {
                break;
            }
            len = lens[lens_index + work[sym]];
        }
        if (len > root && (huff & mask) !== low) {
            if (drop === 0) {
                drop = root;
            }
            next += min;
            curr = len - drop;
            left = 1 << curr;
            while (curr + drop < max) {
                left -= count[curr + drop];
                if (left <= 0) {
                    break;
                }
                curr++;
                left <<= 1;
            }
            used += 1 << curr;
            if ((type === LENS && used > ENOUGH_LENS) ||
                (type === DISTS && used > ENOUGH_DISTS)) {
                return 1;
            }
            low = huff & mask;
            table[low] = (root << 24) | (curr << 16) | (next - table_index) | 0;
        }
    }
    if (huff !== 0) {
        table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0;
    }
    opts.bits = root;
    return 0;
};


/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {
    _Z_NO_FLUSH: 0,
    _Z_PARTIAL_FLUSH: 1,
    _Z_SYNC_FLUSH: 2,
    _Z_FULL_FLUSH: 3,
    _Z_FINISH: 4,
    _Z_BLOCK: 5,
    _Z_TREES: 6,
    _Z_OK: 0,
    _Z_STREAM_END: 1,
    _Z_NEED_DICT: 2,
    _Z_ERRNO: -1,
    _Z_STREAM_ERROR: -2,
    _Z_DATA_ERROR: -3,
    _Z_BUF_ERROR: -5,
    _Z_NO_COMPRESSION: 0,
    _Z_BEST_SPEED: 1,
    _Z_BEST_COMPRESSION: 9,
    _Z_DEFAULT_COMPRESSION: -1,
    _Z_FILTERED: 1,
    _Z_HUFFMAN_ONLY: 2,
    _Z_RLE: 3,
    _Z_FIXED: 4,
    _Z_DEFAULT_STRATEGY: 0,
    _Z_BINARY: 0,
    _Z_TEXT: 1,
    _Z_UNKNOWN: 2,
    _Z_DEFLATED: 8
};


/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function adler32(adler, buf, len, pos) {
    var s1 = (adler & 0xffff) | 0, s2 = ((adler >>> 16) & 0xffff) | 0, n = 0;
    while (len !== 0) {
        n = len > 2000 ? 2000 : len;
        len -= n;
        do {
            s1 = (s1 + buf[pos++]) | 0;
            s2 = (s2 + s1) | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
    }
    return (s1 | (s2 << 16)) | 0;
}
module.exports = adler32;


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function ZStream() {
    this._input = null;
    this._next_in = 0;
    this._avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this._next_out = 0;
    this._avail_out = 0;
    this.total_out = 0;
    this.msg = '';
    this._state = null;
    this._data_type = 2;
    this.adler = 0;
}
module.exports = ZStream;


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TYPED_OK = (typeof Uint8Array !== 'undefined') &&
    (typeof Uint16Array !== 'undefined') &&
    (typeof Int32Array !== 'undefined');
function _has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
exports.assign = function (obj) {
    var sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
        var source = sources.shift();
        if (!source) {
            continue;
        }
        if (typeof source !== 'object') {
            throw new TypeError(source + 'must be non-object');
        }
        for (var p in source) {
            if (_has(source, p)) {
                obj[p] = source[p];
            }
        }
    }
    return obj;
};
exports.shrinkBuf = function (buf, size) {
    if (buf.length === size) {
        return buf;
    }
    if (buf.subarray) {
        return buf.subarray(0, size);
    }
    buf.length = size;
    return buf;
};
var fnTyped = {
    arraySet: function (dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
            dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
            return;
        }
        for (var i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i];
        }
    },
    flattenChunks: function (chunks) {
        var i, l, len, pos, chunk, result;
        len = 0;
        for (i = 0, l = chunks.length; i < l; i++) {
            len += chunks[i].length;
        }
        result = new Uint8Array(len);
        pos = 0;
        for (i = 0, l = chunks.length; i < l; i++) {
            chunk = chunks[i];
            result.set(chunk, pos);
            pos += chunk.length;
        }
        return result;
    }
};
var fnUntyped = {
    arraySet: function (dest, src, src_offs, len, dest_offs) {
        for (var i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i];
        }
    },
    flattenChunks: function (chunks) {
        return [].concat.apply([], chunks);
    }
};
exports.setTyped = function (on) {
    if (on) {
        exports.Buf8 = Uint8Array;
        exports.Buf16 = Uint16Array;
        exports.Buf32 = Int32Array;
        exports.assign(exports, fnTyped);
    }
    else {
        exports.Buf8 = Array;
        exports.Buf16 = Array;
        exports.Buf32 = Array;
        exports.assign(exports, fnUntyped);
    }
};
exports.setTyped(TYPED_OK);


/***/ })

/******/ });
//# sourceMappingURL=network.js.map
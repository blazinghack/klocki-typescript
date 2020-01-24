import { _INetHandler } from "../../network/INetHandler";
import { _Packet } from "../../network/Packet";
import { _Klocki } from "../Klocki";
import { _SPacketChat } from "../../network/play/server/SPacketChat";
import { _SPacketJoinGame } from "../../network/play/server/SPacketJoinGame";
import { _NetworkManager } from "../../network/NetworkManager";
import { _CPacketChatMessage } from "../../network/play/client/CPacketChatMessage";
import { _SPacketKeepAlive as _SPacketKeepAlive } from "../../network/play/server/SPacketKeepAlive";
import { _CPacketKeepAlive as _CPacketKeepAlive } from "../../network/play/client/CPacketKeepAlive";
import { _ChatUtils } from "../../util/ChatUtils";
import { _ChatColor } from "../../util/ChatColor";
import { _SPacketPlayerPosLook } from "../../network/play/server/SPacketPlayerPosLook";
import { _SPacketChunkData47 } from "../../network/play/server/SPacketChunkData47";
import { _SPacketMapChunkBulk47 } from "../../network/play/server/SPacketMapChunkBulk47";
import { _v47 } from "../../network/registry/v47";
import { _PacketRegistry } from "../../network/registry/PacketRegistry";
import { _WorldClient } from "../world/WorldClient";
import { _KlockiEntityPlayer } from "../entity/KlockiEntityPlayer";
import { _ChunkSection } from "../world/ChunkSection";
import { _ExtendedBlockStorage } from "../../world/chunk/storage/ExtendedBlockStorage";
import { _CPacketClientStatus } from "../../network/play/client/CPacketClientStatus";
import { _KlockiEntityPlayerSP } from "../entity/KlockiEntityPlayerSP";
import { _SPacketSpawnPlayer } from "../../network/play/server/SPacketSpawnPlayer";
import { _KlockiEntityPlayerMP } from "../entity/KlockiEntityPlayerMP";
import { _SPacketEntityRelativeMove } from "../../network/play/server/SPacketEntityRelativeMove";
import { _SPacketEntityLookRelativeMove } from "../../network/play/server/SPacketEntityLookRelativeMove";
import { _SPacketEntityLook } from "../../network/play/server/SPacketEntityLook";
import { _SPacketEntityTeleport } from "../../network/play/server/SPacketEntityTeleport";
import { _CPacketPositionAndLook } from "../../network/play/client/CPacketPositionAndLook";
import { _SPacketChunkData107 } from "../../network/play/server/SPacketChunkData107";
import { _PacketBuffer } from "../../network/PacketBuffer";
import { _BitMap } from "../../util/BitMap";
import { _Uint32BlockStorage } from "../../world/chunk/storage/Uint32BlockStorage";
import { _SPacketEntityDestroy } from "../../network/play/server/SPacketEntityDestroy";
import { _SPacketOpenWindow } from "../../network/play/server/SPacketOpenWindow";
import { _SPacketWindowItems } from "../../network/play/server/SPacketWindowItems";
import { _SPacketSetSlot } from "../../network/play/server/SPacketSetSlot";
import { _SPacketSpawnMob } from "../../network/play/server/SPacketSpawnMob";
import { _KlockiEntityCreeper } from "../entity/KlockiEntityCreeper";
import { _KlockiEntityLiving } from "../entity/KlockiEntityLiving";
import { _CPacketTeleportConfirm } from "../../network/play/client/CPacketTeleportConfirm";
import { _SPacketBlockChange } from "../../network/play/server/SPacketBlockChange";
import { _SPacketMultiBlockChange } from "../../network/play/server/SPacketMultiBlockChange";
import { _SectionWatcher } from "../world/SectionWatcher";
import { _SPacketChunkUnload } from "../../network/play/server/SPacketChunkUnload";
import { _KlockiEntityItemFrame } from "../entity/KlockiEntityItemFrame";
import { _KlockiEntityBase } from "../entity/KlockiEntityBase";
import { _SPacketSpawnObject } from "../../network/play/server/SPacketSpawnObject";

export class _NetHandlerPlayClient implements _INetHandler {

    public _klocki: _Klocki;
    public _netManager: _NetworkManager;
    public _protocol: number;
    public _inPacketArr: any[];
    public _world: _WorldClient | null = null;
    public _firstJoin: boolean;

    constructor(klocki: _Klocki) {
        this._klocki = klocki;
        this._netManager = <_NetworkManager>klocki._networkManager;
        this._protocol = klocki._protocol;
        this._inPacketArr = Array(100);
        this._firstJoin = true;

        const reg: _PacketRegistry = this._netManager._packetRegistry;
        this._inPacketArr[reg._CLIENT_KEEPALIVE] = _SPacketKeepAlive;
        this._inPacketArr[reg._CLIENT_JOIN_GAME] = _SPacketJoinGame;
        this._inPacketArr[reg._CLIENT_CHAT] = _SPacketChat;
        this._inPacketArr[reg._CLIENT_PLAYER_POSITION_AND_LOOK] = _SPacketPlayerPosLook;
        this._inPacketArr[reg._CLIENT_SPAWN_PLAYER] = _SPacketSpawnPlayer;
        // console.log("chat is ", reg._CLIENT_CHAT)
        this._inPacketArr[reg._CLIENT_ENTITY_RELATIVE_MOVE] = _SPacketEntityRelativeMove;
        this._inPacketArr[reg._CLIENT_ENTITY_LOOK_AND_RELATIVE_MOVE] = _SPacketEntityLookRelativeMove;
        this._inPacketArr[reg._CLIENT_ENTITY_LOOK] = _SPacketEntityLook;
        this._inPacketArr[reg._CLIENT_ENTITY_TELEPORT] = _SPacketEntityTeleport;
        this._inPacketArr[reg._CLIENT_DESTROY_ENTITIES] = _SPacketEntityDestroy;
        this._inPacketArr[reg._CLIENT_SPAWN_MOB] = _SPacketSpawnMob;
        this._inPacketArr[reg._CLIENT_BLOCK_CHANGE] = _SPacketBlockChange;
        this._inPacketArr[reg._CLIENT_MULTI_BLOCK_CHANGE] = _SPacketMultiBlockChange;
        this._inPacketArr[reg._CLIENT_UNLOAD_CHUNK] = _SPacketChunkUnload;   
        if (this._protocol <= 47) {
            this._inPacketArr[reg._CLIENT_CHUNK_DATA] = _SPacketChunkData47;
            this._inPacketArr[reg._CLIENT_MAP_CHUNK_BULK] = _SPacketMapChunkBulk47;
            
            
            this._inPacketArr[reg._CLIENT_OPEN_WINDOW] = _SPacketOpenWindow;
            this._inPacketArr[reg._CLIENT_WINDOW_ITEMS] = _SPacketWindowItems;
            this._inPacketArr[reg._CLIENT_SET_SLOT] = _SPacketSetSlot;
            
        }
        if (this._protocol >= 107) {
            this._inPacketArr[reg._CLIENT_CHUNK_DATA] = _SPacketChunkData107;
        }

    }
    public _handleKeepAlive(packet: _SPacketKeepAlive): void {
        console.log(`keep alive: ${packet._keepAliveID}`);
        this._netManager._sendPacket(new _CPacketKeepAlive(packet._keepAliveID!));
    }
    public _handleJoinGame(packet: _SPacketJoinGame): void {
        console.log(`joined the game:`, packet);
        const world = new _WorldClient(this._klocki, this);
        this._klocki._theWorld = world;
        const thePlayer = new _KlockiEntityPlayerSP(this._klocki);
        thePlayer._eid = <number>packet._entityId;
        thePlayer._gameMode = <number>packet._gameType;
        world._thePlayer = thePlayer;
        world._addEntity(thePlayer);

        this._world = world;

        if (this._firstJoin) {
            this._firstJoin = false;
            
        }
        // this._netManager._sendPacket(new _CPacketChatMessage(`hello ${Date.now()}`));
    }
    public _handleChat(packet: _SPacketChat): void {
        const jsonChat = JSON.parse(<string>packet._chatComponent);
        const plainText = _ChatUtils._toLegacyTextFromChat(jsonChat);
        console.log("rawChat:", packet._chatComponent);
        console.log(`CHAT: ${_ChatColor._stripColor(plainText)}`);

        this._klocki._guiChat._appendMessage(jsonChat);
    }
    public _handlePlayerPosLook(packet: _SPacketPlayerPosLook): void {
        if (this._world === null) {
            return;
        }
        const thePlayer: _KlockiEntityPlayer = this._world._thePlayer!;

        let v = "pos move:";

        if (packet._isRelative(_SPacketPlayerPosLook._X_FLAG)) {
            v += ` x_rel=${packet._x}`;
            thePlayer._posX += packet._x!;
        } else {
            v += ` x_abs=${packet._x}`;
            thePlayer._posX = packet._x!;
        }
        if (packet._isRelative(_SPacketPlayerPosLook._Y_FLAG)) {
            v += ` y_rel=${packet._y}`;
            thePlayer._posY += packet._y!;
        } else {
            v += ` y_abs=${packet._y}`;
            thePlayer._posY = packet._y!;
        }
        if (packet._isRelative(_SPacketPlayerPosLook._Z_FLAG)) {
            v += ` z_rel=${packet._z}`;
            thePlayer._posZ += packet._z!;
        } else {
            v += ` z_abs=${packet._z}`;
            thePlayer._posZ = packet._z!;
        }
        if (packet._isRelative(_SPacketPlayerPosLook._YAW_ROT_FLAG)) {
            v += ` yaw_rel=${packet._yaw}`;
            thePlayer._yaw += (packet._yaw! / 180) * Math.PI;
        } else {
            v += ` yaw_abs=${packet._yaw}`;
            thePlayer._yaw = (packet._yaw! / 180) * Math.PI;
        }
        if (packet._isRelative(_SPacketPlayerPosLook._PITCH_ROT_FLAG)) {
            v += ` pitch_rel=${packet._pitch}`;
            thePlayer._pitch += (packet._pitch! / 180) * Math.PI;
        } else {
            v += ` pitch_abs=${packet._pitch}`;
            thePlayer._pitch = (packet._pitch! / 180) * Math.PI;
        }

        console.log(v);
        if(this._protocol >= 107){
            this._netManager._sendPacket(new _CPacketTeleportConfirm(packet._teleportId!));
        }
    }
    public _handleChunkData47(packet: _SPacketChunkData47): void {
        if(!this._world){
            return;
        }
        //console.log(`Received one chunk at pos ${packet._chunkX}x${packet._chunkZ}`);
        const primaryMask = packet._primaryBitMask!;

        this._world!._setUglyChunkLoaded(packet._chunkX!, packet._chunkZ!)
        let offset = 0;
        for (let y = 0; y < 16; y++) {
            if ((primaryMask & (1 << y)) !== 0) {
                const cpblocks = packet._data!.slice(offset, offset + 8192);

                this._loadChunk47(packet._chunkX!, y, packet._chunkZ!, cpblocks);
                offset += 8192;
            }
        }
    }
    public _handleChunkUnload(packet: _SPacketChunkUnload): void {
        const world = this._world;
        if (world != null) {
            const x = packet._chunkX!;
            const z = packet._chunkZ!;

            world._setUglyChunkUnloaded(x, z)
            for(let y = 0; y<16; y++){
                const key = _WorldClient._sectionKey(x, y, z);

                const w = world._sections.get(key);
                if(w != null){
                    w._setSection(null);
                    
                }
            }
        }
    }
    public _handleMapChunkBulk47(packet: _SPacketMapChunkBulk47): void {
        const world = this._world;
        if (!world) {
            return;
        }
        for (let i: number = 0; i < packet._chunkX!.length; i++) {
            const x = packet._chunkX![i];
            const z = packet._chunkZ![i];

            this._world!._setUglyChunkLoaded(x, z)
            // const len = packet._chunkData![i].length;
            // console.log(`Received chunk in bulk at pos ${x}x${z} with ${len} bytes`);

            const primaryMask = packet._primaryBitMask![i];
            let offset = 0;
            for (let y = 0; y < 16; y++) {
                if ((primaryMask & (1 << y)) !== 0) {
                    const data = packet._chunkData![i];
                    const cpblocks = data.slice(offset, offset + 8192);

                    this._loadChunk47(x, y, z, cpblocks);

                    offset += 8192;
                }
            }
        }
    }
    public _loadChunk47(x: number, y: number, z: number, cpblocks: Uint8Array) {
        
        const world = this._world!;
        const uints = new Uint32Array(new Uint16Array(cpblocks.buffer, 0, 4096));
        const storage = new _Uint32BlockStorage(y, false, uints);

        const section = new _ChunkSection(x, y, z, storage);
        let w = world._getSectionWatcher(x, y, z);
        w._setSection(section);

        w = world._getSectionWatcher(x + 1, y, z);
        w._notify();
        w = world._getSectionWatcher(x, y, z + 1);
        w._notify();
        w = world._getSectionWatcher(x - 1, y, z);
        w._notify();
        w = world._getSectionWatcher(x, y, z - 1);
        w._notify();
        
    }

    public _handleSpawnPlayer(packet: _SPacketSpawnPlayer) {
        const world = this._world;
        if (world != null) {
            console.log("spawning player eid", packet._eid);

            const player = new _KlockiEntityPlayerMP(this._klocki);
            player._eid = packet._eid!;
            player._serverPosX = packet._serverx!;
            player._serverPosY = packet._servery!;
            player._serverPosZ = packet._serverz!;

            player._serverYaw = packet._yaw!;
            player._serverPitch = packet._pitch!;

            player._yaw = packet._yaw!;
            player._pitch = packet._pitch!;

            player._prevYaw = packet._yaw!;
            player._prevPitch = packet._pitch!;

            player._posX = packet._serverx!;
            player._posY = packet._servery!;
            player._posZ = packet._serverz!;

            player._lastTickPosX = packet._serverx!;
            player._lastTickPosY = packet._servery!;
            player._lastTickPosZ = packet._serverz!;

            player._prevPosX = packet._serverx!;
            player._prevPosY = packet._servery!;
            player._prevPosZ = packet._serverz!;

            world._addEntity(player);
        }
    }
    
    public _handleSpawnMob(packet: _SPacketSpawnMob) {
        const world = this._world;
        if (world != null) {
            //console.log("spawning mob eid", packet._eid, " type ", packet._mobType);

            let entity: _KlockiEntityLiving | null = null
            let creeperType = 50
            if(this._protocol >= 480){
                creeperType = 11
            }
            if(packet._mobType == creeperType){
                entity = new _KlockiEntityCreeper(this._klocki);
            }
            if(entity != null){
                entity._eid = packet._eid!;
                entity._serverPosX = packet._serverx!;
                entity._serverPosY = packet._servery!;
                entity._serverPosZ = packet._serverz!;

                entity._serverYaw = packet._yaw!;
                entity._serverPitch = packet._pitch!;

                entity._yaw = packet._yaw!;
                entity._pitch = packet._pitch!;

                entity._prevYaw = packet._yaw!;
                entity._prevPitch = packet._pitch!;

                entity._posX = packet._serverx!;
                entity._posY = packet._servery!;
                entity._posZ = packet._serverz!;

                entity._lastTickPosX = packet._serverx!;
                entity._lastTickPosY = packet._servery!;
                entity._lastTickPosZ = packet._serverz!;

                entity._prevPosX = packet._serverx!;
                entity._prevPosY = packet._servery!;
                entity._prevPosZ = packet._serverz!;

                world._addEntity(entity);
            }
        }
    }
    public _handleSpawnObject(packet: _SPacketSpawnObject) {
        const world = this._world;
        if (world != null) {
            //console.log("spawning mob eid", packet._eid, " type ", packet._mobType);

            let entity: _KlockiEntityBase | null = null
            let itemFrameType = 50
            if(this._protocol >= 480){
                itemFrameType = 71
            }
            if(packet._mobType == itemFrameType){
                entity = new _KlockiEntityItemFrame(this._klocki);
            }
            if(entity != null){
                entity._eid = packet._eid!;
                entity._serverPosX = packet._serverx!;
                entity._serverPosY = packet._servery!;
                entity._serverPosZ = packet._serverz!;

                entity._serverYaw = packet._yaw!;
                entity._serverPitch = packet._pitch!;

                entity._yaw = packet._yaw!;
                entity._pitch = packet._pitch!;

                entity._prevYaw = packet._yaw!;
                entity._prevPitch = packet._pitch!;

                entity._posX = packet._serverx!;
                entity._posY = packet._servery!;
                entity._posZ = packet._serverz!;

                entity._lastTickPosX = packet._serverx!;
                entity._lastTickPosY = packet._servery!;
                entity._lastTickPosZ = packet._serverz!;

                entity._prevPosX = packet._serverx!;
                entity._prevPosY = packet._servery!;
                entity._prevPosZ = packet._serverz!;

                world._addEntity(entity);
            }
        }
    }
    public _handleEntityRelativeMove(packet: _SPacketEntityRelativeMove) {
        const world = this._world;
        if (world != null) {
            // console.log("relative move eid", packet._eid);
            const entity = world._getEntity(packet._eid!);
            if (entity) {
                entity._serverPosX += packet._serverx!;
                entity._serverPosY += packet._servery!;
                entity._serverPosZ += packet._serverz!;

                entity._setNewLocation(entity._serverPosX, entity._serverPosY, entity._serverPosZ, entity._serverYaw, entity._serverPitch, 3, false);
            }
        }
    }
    public _handleEntityLookRelativeMove(packet: _SPacketEntityLookRelativeMove) {
        const world = this._world;
        if (world != null) {
            // console.log("relative look move eid", packet._eid);
            const entity = world._getEntity(packet._eid!);
            if (entity) {
                entity._serverPosX += packet._serverx!;
                entity._serverPosY += packet._servery!;
                entity._serverPosZ += packet._serverz!;

                entity._serverYaw = packet._yaw!;
                entity._serverPitch = packet._pitch!;

                entity._setNewLocation(entity._serverPosX, entity._serverPosY, entity._serverPosZ, entity._serverYaw, entity._serverPitch, 3, false);
            }
        }
    }
    public _handleEntityLook(packet: _SPacketEntityLook) {
        const world = this._world;
        if (world != null) {
            // console.log("look eid", packet._eid);
            const entity = world._getEntity(packet._eid!);
            if (entity) {
                entity._serverYaw = packet._yaw!;
                entity._serverPitch = packet._pitch!;

                entity._setNewLocation(entity._serverPosX, entity._serverPosY, entity._serverPosZ, entity._serverYaw, entity._serverPitch, 3, false);
            }
        }
    }
    public _handleEntityTeleport(packet: _SPacketEntityTeleport) {
        const world = this._world;
        if (world != null) {
            // console.log("teleport eid", packet._eid);
            const entity = world._getEntity(packet._eid!);
            if (entity) {
                entity._serverPosX = packet._serverx!;
                entity._serverPosY = packet._servery!;
                entity._serverPosZ = packet._serverz!;

                entity._serverYaw = packet._yaw!;
                entity._serverPitch = packet._pitch!;

                entity._setNewLocation(entity._serverPosX, entity._serverPosY, entity._serverPosZ, entity._serverYaw, entity._serverPitch, 3, false);
            }
        }
    }
    public _handleEntityDestroy(packet: _SPacketEntityDestroy) {
        const world = this._world;
        if (world != null) {
            // console.log("relative move eid", packet._eid);
            for (let i = 0; i < packet._count!; i++) {
                const eid = packet._eids![i];
                const entity = world._getEntity(eid);
                if (entity) {
                    entity._onDestroy();

                    world._removeEntity(eid);
                }
            }
        }
    }
    public _handleOpenWindow(packet: _SPacketOpenWindow) {
        const world = this._world;
        if (world != null) {
            const player = world._thePlayer!;
            // player._inventory.

            if (packet._windowId == 0) {
                console.log("window main inv: " + packet._windowType);

                for (let i = 0; i < packet._numSlots!; i++) {
                    void(player);
                }

            }
        }

    }
    public _handleWindowItems(packet: _SPacketWindowItems) {
        const world = this._world;
        if (world != null) {
            const player = world._thePlayer!;
            // player._inventory.
            void(player);
            console.log("window items " + packet._windowId + " " + packet._count);
            if (packet._windowId == 0) {
                const inv = player._currentWindow;
                for (let i = 0; i < packet._count!; i++) {
                    inv._slots[i]._setItem(packet._slots![i]);
                }
            }
        }

    }
    public _handleSetSlot(packet: _SPacketSetSlot) {
        const world = this._world;
        if (world != null) {
            const player = world._thePlayer!;
            // player._inventory.
            void(player);
            console.log("set slot " + packet._windowId + " " + packet._slotId);
            if (packet._windowId == 0) {
                const inv = player._currentWindow;
                
                inv._slots[packet._slotId!]._setItem(packet._slot!);
                
            }
        }

    }
    public _handleBlockChange(packet: _SPacketBlockChange) {
        const world = this._world;
        if (world != null) {
            const bx = packet._position![0];
            const by = packet._position![1];
            const bz = packet._position![2];
            const x = bx >> 4;
            const y = by >> 4;
            const z = bz >> 4;
            //const section = world._getSection(x,y,z);
            let w = world._getSectionWatcher(x, y, z);
            //console.log("block change", bx,by,bz,packet._blockID!);
            let section = w._section;
            if(!w._section){
                section = new _ChunkSection(x,y,z, new _Uint32BlockStorage(y, false, new Uint32Array(4096)));
                w._setSection(section);
            }
            if(section){
                const sx = bx&15;
                const sy = by&15;
                const sz = bz&15;
                section._setBlockType(sx, sy, sz, packet._blockID!);
                w._notify();

                if(sx == 15){
                    w = world._getSectionWatcher(x + 1, y, z);
                    w._notify();
                }
                if(sz == 15){
                    w = world._getSectionWatcher(x, y, z + 1);
                    w._notify();
                }
                if(sy == 15){
                    w = world._getSectionWatcher(x, y+1, z);
                    w._notify();
                }
                if(sx == 0){
                    w = world._getSectionWatcher(x - 1, y, z);
                    w._notify();
                }
                if(sz == 0){
                    w = world._getSectionWatcher(x, y, z - 1);
                    w._notify();
                }
                if(sy == 0){
                    w = world._getSectionWatcher(x, y-1, z);
                    w._notify();
                }
            }
        }

    }

    public _handleMultiBlockChange(packet: _SPacketMultiBlockChange) {
        const world = this._world;
        if (world != null) {
            const watchersToNotify: Set<_SectionWatcher> = new Set();

            const records = packet._records!;
            const offsetX = packet._chunkX!*16;
            const offsetZ = packet._chunkZ!*16;
            for(let i = 0; i<records.length; i+= 4){
                const bx = offsetX+records[i];
                const by = records[i+1];
                const bz = offsetZ+records[i+2];
                const blockID = records[i+3];
                const x = bx >> 4;
                const y = by >> 4;
                const z = bz >> 4;
                //const section = world._getSection(x,y,z);
                let w = world._getSectionWatcher(x, y, z);
                //console.log("multi block change", bx,by,bz, blockID);
                let section = w._section;
                if(!w._section){
                    section = new _ChunkSection(x,y,z, new _Uint32BlockStorage(y, false, new Uint32Array(4096)));
                    w._setSection(section);
                }
                if(section){
                    const sx = bx&15;
                    const sy = by&15;
                    const sz = bz&15;
                    section._setBlockType(sx, sy, sz, blockID);
                    watchersToNotify.add(w);
    
                    if(sx == 15){
                        w = world._getSectionWatcher(x + 1, y, z);
                        watchersToNotify.add(w);
                    }
                    if(sz == 15){
                        w = world._getSectionWatcher(x, y, z + 1);
                        watchersToNotify.add(w);
                    }
                    if(sy == 15){
                        w = world._getSectionWatcher(x, y+1, z);
                        watchersToNotify.add(w);
                    }
                    if(sx == 0){
                        w = world._getSectionWatcher(x - 1, y, z);
                        watchersToNotify.add(w);
                    }
                    if(sz == 0){
                        w = world._getSectionWatcher(x, y, z - 1);
                        watchersToNotify.add(w);
                    }
                    if(sy == 0){
                        w = world._getSectionWatcher(x, y-1, z);
                        watchersToNotify.add(w);
                    }
                }
            }
            watchersToNotify.forEach((w) => w._notify());


           
        }

    }
    public _handleChunkData107(packet: _SPacketChunkData107) {

        //console.log(`Received one new chunk at pos ${packet._chunkX}x${packet._chunkZ}`, packet._heightmaps);

        const world = this._world;
        if (!world) {
            return;
        }
        const primaryMask = packet._primaryBitMask!;

        const buf = new _PacketBuffer(packet._data!.buffer, packet._data!.byteOffset, packet._data!.byteLength);
        const x = packet._chunkX!;
        const z = packet._chunkZ!;
        world._setUglyChunkLoaded(x, z)
        // let offset = 0;
        for (let y = 0; y < 16; y++) {
            if ((primaryMask & (1 << y)) !== 0) {
                const nonAirBlocks = buf._readUint16();
                void(nonAirBlocks);

                let bitsPerBlock = buf._readUint8();
                if(bitsPerBlock < 4){
                    //bitsPerBlock = 4;
                }
                let blockMap: Uint32Array | null = null;
                if (bitsPerBlock <= 8) {
                    const count = buf._readVarInt();
                    blockMap = new Uint32Array(count);
                    for (let i = 0; i < count; i++) {
                        const bid = buf._readVarInt();
                        blockMap[i] = bid;
                    }
                    
                    //throw new Error("unimplemented global pallete" + bitsPerBlock);
                } else {
                    //throw new Error("unimplemented global pallete" + bitsPerBlock);
                }
                const blocks = new Uint32Array(4096);
                const blen = buf._readVarInt();
                if(blen < 0 || blen > 1024*1024){
                    throw new Error("wrong count of uint64s in block array");
                }
                const packed = buf._readUint32Array(blen * 2);

                // change byte order
                let val1 = 0;
                let val2 = 0;
                for(let i = 0; i<packed.length; i+=2){
                    val1 = packed[i];
                    val2 = packed[i+1];
                    packed[i+1] = ((val1 & 0xFF) << 24) | ((val1 & 0xFF00) << 8) | ((val1 >>> 8) & 0xFF00) | ((val1 >>> 24) & 0xFF);
                    packed[i] = ((val2 & 0xFF) << 24) | ((val2 & 0xFF00) << 8) | ((val2 >>> 8) & 0xFF00) | ((val2 >>> 24) & 0xFF);
                }

                const bitMap = new _BitMap(bitsPerBlock, packed);
                if(blockMap == null){
                    for (let i = 0; i < 4096; i++) {
                        blocks[i] = bitMap._get(i);
                    }
                }else{
                    for (let i = 0; i < 4096; i++) {
                        blocks[i] = blockMap[bitMap._get(i)];
                    }
                }
               
                const storage = new _Uint32BlockStorage(y, false, blocks);

                const section = new _ChunkSection(x, y, z, storage);
                section._debugInfo = "bits:"+bitsPerBlock;
                let w = world._getSectionWatcher(x, y, z);
                w._setSection(section);

                w = world._getSectionWatcher(x + 1, y, z);
                w._notify();
                w = world._getSectionWatcher(x, y, z + 1);
                w._notify();
                w = world._getSectionWatcher(x - 1, y, z);
                w._notify();
                w = world._getSectionWatcher(x, y, z - 1);
                w._notify();

                //buf._peekUint8Array(4096);
                // const cpblocks = packet._data!.slice(offset, offset + 8192);

                // this._loadChunk107(packet._chunkX!, y, packet._chunkZ!, cpblocks);
                // offset += 8192;
            }
        }
    }

    public _respawn() {
        this._netManager._sendPacket(new _CPacketClientStatus(0));
    }
    public _sendPosition(x: number, y: number, z: number, yaw: number, pitch: number, onground: boolean) {
        
        this._netManager._sendPacket(new _CPacketPositionAndLook(x, y, z, (yaw / Math.PI) * 180, (pitch / Math.PI) * 180, onground));
        
    }

    public _deserialize(id: number): _Packet<_NetHandlerPlayClient> | null {
        const packetClass: any = this._inPacketArr[id];
        if (packetClass !== undefined) {
            return new packetClass();
        } else {
            return null;
        }
    }

}

import { _PacketBuffer } from "../../network/PacketBuffer";
import { _NbtBase, _NbtReader } from "../../nbt/Nbt";

export class _ItemStack {
    public _count: number = 1;
    public _damage: number = 0;
    public _id: number = 0;
    public _nbt: Map<string, _NbtBase> | null = null;

    public static _read(buf: _PacketBuffer, protocol: number): _ItemStack | null {
        const id = buf._readInt16();
        if (id == -1) {
            return null;
        }
        const is = new _ItemStack();
        is._id = id;
        const count = buf._readInt8();
        is._count = count;
        const damage = buf._readInt16();
        is._damage = damage;

        const nbt = _NbtReader._readOptionalMainTag(buf);
        is._nbt = nbt;
        
        return is;
    }
}

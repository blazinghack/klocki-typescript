import { _AxisAlignedBB } from "../util/AxisAlignedBB";

export class _Placeholders {
    public static _translucentArr = _Placeholders._makeTranslucent();
    public static _fullBlockAABB = new _AxisAlignedBB(new Float64Array([0, 0, 0, 1, 1, 1]));

    public static _isLiquidBlock(b: number) {
        return b >= 8 && b <= 11;
    }
    public static _makeTranslucent() {
        const blocks = new Array(256);
        blocks[0] = true;
        blocks[6] = true;
        for (let i = 8; i <= 11; i++) {
            blocks[i] = true;
        }
        blocks[31] = true;
        blocks[32] = true;
        for (let i = 37; i <= 40; i++) {
            blocks[i] = true;
        }
        blocks[50] = true;
        blocks[55] = true;
        blocks[59] = true;
        blocks[63] = true;
        blocks[65] = true;
        blocks[66] = true;
        blocks[68] = true;
        blocks[69] = true;
        blocks[70] = true;
        blocks[72] = true;
        blocks[75] = true;
        blocks[76] = true;
        blocks[77] = true;
        blocks[83] = true;
        blocks[90] = true;
        blocks[104] = true;
        blocks[105] = true;
        blocks[106] = true;
        blocks[140] = true;
        blocks[141] = true;
        blocks[142] = true;
        blocks[143] = true;
        blocks[147] = true;
        blocks[148] = true;
        blocks[171] = true;
        blocks[175] = true;

        return blocks;
    }
    public static _isTranslucentBlock(id: number) {
        return _Placeholders._translucentArr[id];
    }
}


export class _Item {
    public static _ToolMaterial = {
        _IRON: 1,
        _WOOD: 2,
        _STONE: 3,
        _DIAMOND: 4,
        _GOLD: 5,
    };
    public _name: string;
    public _unlocalizedName: string;

    constructor(){
        this._name = "";
        this._unlocalizedName = "";
    }
    public _setName(name: string) {
        this._name = name;
        return this;
    }
    public _setUnlocalizedName(name: string) {
        this._unlocalizedName = name;
        return this;
    }
    public _setCreativeTab(tab: number) {
        return this;
    }
}

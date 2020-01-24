import { _Material } from "./Material";
import { _MaterialColor } from "./MaterialColor";
import { _SoundType } from "./SoundType";
import { _Block } from "./Block";

export class _BlockProperties {
    public _opaque: boolean;
    public _slipperinessFactor: number;
    public _material: any;
    public _materialColor: any;
    public _hardness: number = 1;
    public _resistance: number = 1;
    public _soundType: _SoundType;

    constructor() {
        this._opaque = true;
        this._slipperinessFactor = 0.6;
        this._soundType = _SoundType._STONE;
    }

    public static _create(mat: _Material, matColor?: _MaterialColor): _BlockProperties {
        const p: _BlockProperties = new _BlockProperties();
        p._material = mat;
        if (matColor) {
            p._materialColor = matColor;
        }

        return p;
    }

    public static _from(other: _BlockProperties): _BlockProperties {
        const p: _BlockProperties = new _BlockProperties();
        p._material = other._material;
        p._materialColor = other._materialColor;
        p._opaque = other._opaque;
        p._slipperinessFactor = other._slipperinessFactor;

        return p;
    }

    public _setTranslucent(): _BlockProperties {
        this._opaque = false;

        return this;
    }
    public _variableOpacity(): _BlockProperties {
        return this;
    }

    public _hardnessAndResistance(hardness: number, resistance?: number): _BlockProperties {
        this._hardness = hardness;
        if (resistance) {
            this._resistance = resistance;
        } else {
            this._resistance = hardness;
        }

        return this;
    }

    public _zeroHardnessAndResistance(): _BlockProperties {
        return this._hardnessAndResistance(0, 0);
    }

    public _sound(sound: _SoundType): _BlockProperties {
        this._soundType = sound;

        return this;
    }

    public _needsRandomTick(): _BlockProperties {
        return this;
    }

    public _lightValue(light: number): _BlockProperties {
        return this;
    }
    
    public _slipperiness(s: number): _BlockProperties {
        this._slipperinessFactor = s;

        return this;
    }
    public _lootFrom(block: _Block): _BlockProperties {
        //this._loot = block._loot

        return this;
    }
    public _tickRandomly(): _BlockProperties {
        return this;
    }
    public _noDrops(): _BlockProperties {
        return this;
    }
}

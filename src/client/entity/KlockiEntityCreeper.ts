
import { _Klocki } from "../Klocki";
import { _TextureInfo } from "../txt/TextureInfo";
import { _KlockiTexture } from "../txt/KlockiTexture";

import { _KlockiEntityLiving } from "./KlockiEntityLiving";
import { _RenderBox } from "./RenderBox";
import { _RenderPlayer } from "../render/RenderPlayer";

export class _KlockiEntityCreeper extends _KlockiEntityLiving {


    constructor(klocki: _Klocki) {
        super(klocki);
        
    }

    public _tick() {

        super._tick();
        const dx = this._posX - this._prevPosX;
        const dz = this._posZ - this._prevPosZ;
        this._prevLimbSwingAmount = this._limbSwingAmount;
    
        let dist = Math.sqrt(dx * dx + dz * dz) * 4;
        if (dist > 1) {
            dist = 1;
        }
    
        this._limbSwingAmount += (dist - this._limbSwingAmount) * 0.4;
        this._limbSwing += this._limbSwingAmount;
    }
    public _render() {

        this._klocki._entityRenders._renderCreeper._render(this);
        
    }
}

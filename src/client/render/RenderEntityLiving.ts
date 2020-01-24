import { _KlockiEntityLiving } from "../entity/KlockiEntityLiving";
import { mat4 } from "gl-matrix";
import { _Klocki } from "../Klocki";
import { _KlockiEntityBase } from "../entity/KlockiEntityBase";

export class _RenderEntity {
    public _klocki: _Klocki;

    public static _positionMatrix: mat4 = mat4.create();


    public constructor(klocki: _Klocki){
        this._klocki = klocki
    }

    public _render(entity: _KlockiEntityBase){
        const matEntity = _RenderEntity._positionMatrix;
        mat4.identity(matEntity);
        const partial = this._klocki._getPartialTicks();
        mat4.translate(matEntity, matEntity, [entity._renderX(partial), entity._renderY(partial), entity._renderZ(partial)]);
        
        mat4.rotateY(matEntity, matEntity, Math.PI - entity._renderYaw(partial));

    }
}
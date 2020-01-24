import { mat4 } from "gl-matrix";
import { _KlockiEntityPlayer } from "../entity/KlockiEntityPlayer";
import { _RenderEntity } from "./RenderEntityLiving";


export class _RenderPlayer extends _RenderEntity {

    //public static _positionMatrix: mat4;
    public static _headMatrix: mat4 = mat4.create();
    public static _chestMatrix: mat4 = mat4.create();
    public static _legRightMatrix: mat4 = mat4.create();
    public static _legLeftMatrix: mat4 = mat4.create();
    public static _armLeftMatrix: mat4 = mat4.create();
    public static _armRightMatrix: mat4 = mat4.create();

    public _render(entity: _KlockiEntityPlayer){
        super._render(entity);
        const playerScale = 0.9375;
        // console.log("rendering player");
        const partial = this._klocki._getPartialTicks();
        const matEntity = _RenderEntity._positionMatrix;
        mat4.scale(matEntity, matEntity, [playerScale, playerScale, playerScale]);


        // if(Math.floor(Math.random()*100) == 0){
        // console.log(matEntity);
        // }
        mat4.translate(_RenderPlayer._headMatrix, _RenderPlayer._positionMatrix, [0, 12 / 16 + 12 / 16, 0]);
        mat4.translate(_RenderPlayer._chestMatrix, _RenderPlayer._positionMatrix, [0, 12 / 16 + 6 / 16, 0]);

        const wr = this._klocki._worldRendererMobs;
        const limbSwing = entity._limbSwing - entity._limbSwingAmount * (1 - partial);
        const limbSwingAmount = entity._prevLimbSwingAmount + (entity._limbSwingAmount - entity._prevLimbSwingAmount) * partial;
        const armTime = 0;
        // wr._reset();
        mat4.rotateX(_RenderPlayer._headMatrix, _RenderPlayer._headMatrix, -entity._renderPitch(partial));
        entity._headBox!._renderAt(wr, _RenderPlayer._headMatrix);
        entity._headOBox!._renderAt(wr, _RenderPlayer._headMatrix);
        entity._chestBox!._renderAt(wr, _RenderPlayer._chestMatrix);
        entity._chestOBox!._renderAt(wr, _RenderPlayer._chestMatrix);

        mat4.translate(_RenderPlayer._legRightMatrix, _RenderPlayer._positionMatrix, [-2 / 16, 12 / 16, 0]);
        const rightLegRotX = (Math.sin(limbSwing * 0.6662) * 1.4 * limbSwingAmount);
        mat4.rotateX(_RenderPlayer._legRightMatrix, _RenderPlayer._legRightMatrix, rightLegRotX);
        mat4.translate(_RenderPlayer._legLeftMatrix, _RenderPlayer._positionMatrix, [2 / 16, 12 / 16, 0]);
        const leftLegRotX = (Math.sin(limbSwing * 0.6662 + Math.PI) * 1.4 * limbSwingAmount);
        mat4.rotateX(_RenderPlayer._legLeftMatrix, _RenderPlayer._legLeftMatrix, leftLegRotX);

        entity._legRightBox!._renderAt(wr, _RenderPlayer._legRightMatrix);
        entity._legRightOBox!._renderAt(wr, _RenderPlayer._legRightMatrix);
        entity._legLeftBox!._renderAt(wr, _RenderPlayer._legLeftMatrix);
        entity._legLeftOBox!._renderAt(wr, _RenderPlayer._legLeftMatrix);

        let iTime = entity._idleTime;
        iTime += this._klocki._timer._deltaTime * 0.02;
        if (iTime > Math.PI * 2) {
            iTime -= Math.PI * 2;
        }

        mat4.translate(_RenderPlayer._armRightMatrix, _RenderPlayer._positionMatrix, [-6 / 16, 12 / 16 + 12 / 16, 0]);
        mat4.rotateZ(_RenderPlayer._armRightMatrix, _RenderPlayer._armRightMatrix, (Math.cos(iTime) * 0.06) - 0.06);
        const rightRotX = (Math.sin(limbSwing * 0.6662 + Math.PI) * limbSwingAmount) - ((7.5 - Math.abs(armTime - 7.5)) / 7.5);
        mat4.rotateX(_RenderPlayer._armRightMatrix, _RenderPlayer._armRightMatrix, rightRotX);

        entity._armRightBox!._renderAt(wr, _RenderPlayer._armRightMatrix);
        entity._armRightOBox!._renderAt(wr, _RenderPlayer._armRightMatrix);

        mat4.translate(_RenderPlayer._armLeftMatrix, _RenderPlayer._positionMatrix, [6 / 16, 12 / 16 + 12 / 16, 0]);
        mat4.rotateZ(_RenderPlayer._armLeftMatrix, _RenderPlayer._armLeftMatrix, -(Math.cos(iTime) * 0.06) + 0.06);
        const leftRotX = (Math.sin(limbSwing * 0.6662) * limbSwingAmount);
        mat4.rotateX(_RenderPlayer._armLeftMatrix, _RenderPlayer._armLeftMatrix, leftRotX);

        entity._armLeftBox!._renderAt(wr, _RenderPlayer._armLeftMatrix);
        entity._armLeftOBox!._renderAt(wr, _RenderPlayer._armLeftMatrix);
    }
}
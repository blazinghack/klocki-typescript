import { _GoRect } from "./GoRect";

// RGBA32
export class _GoImage {
    public _rect: _GoRect;
    public _stride: number;

    constructor(public _pixels: Uint8Array, width: number, height: number, stride?: number) {
        this._rect = new _GoRect(0, 0, width, height);
        this._stride = 4 * width;
        if (stride != undefined) {
            this._stride = stride;
        }
    }

    public _bounds() {
        return this._rect;
    }
    public _subImage(rect: _GoRect) {
        const i = this._pixOffset(rect._min._x, rect._min._y);
        const pix = this._pixels.slice(i);
        const img = new _GoImage(pix, 0, 0);
        img._rect = rect;
        img._stride = this._stride;

        return img;
    }
    public _pixOffset(x: number, y: number) {
        return (y - this._rect._min._y) * this._stride + (x - this._rect._min._x) * 4;
    }
}

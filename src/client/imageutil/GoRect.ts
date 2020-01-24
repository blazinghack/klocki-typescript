import { _GoPoint } from "./GoPoint";

export class _GoRect {
    public _min: _GoPoint;
    public _max: _GoPoint;
    constructor(x0: number, y0: number, x1: number, y1: number) {
        if (x0 > x1) {
            const tmp = x0;
            x0 = x1;
            x1 = tmp;
        }
        if (y0 > y1) {
            const tmp = y0;
            y0 = y1;
            y1 = tmp;
        }
        this._min = new _GoPoint(x0, y0);
        this._max = new _GoPoint(x1, y1);

        return;
    }
    public _dx() {
        return this._max._x - this._min._x;
    }
    public _dy() {
        return this._max._y - this._min._y;
    }
}

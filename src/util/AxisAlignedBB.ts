
export class _AxisAlignedBB {
    public _arr: Float64Array;

    constructor(arr?: Float64Array) {
        if (arr) {
            this._arr = arr;
        } else {
            this._arr = new Float64Array(6);
        }
    }

    public static _createEntityAABB(X: number, Y: number, Z: number, W: number, H: number): _AxisAlignedBB {
        W = W / 2 - 0.000001;

        return new _AxisAlignedBB(new Float64Array([X - W, Y, Z - W, X + W, Y + H, Z + W]));
    }

    public static _fromBounds(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): _AxisAlignedBB {
        const aabb: _AxisAlignedBB = new _AxisAlignedBB();
        const arr: Float64Array = aabb._arr;

        arr[0] = Math.min(x1, x2);
        arr[1] = Math.min(y1, y2);
        arr[2] = Math.min(z1, z2);
        arr[3] = Math.max(x1, x2);
        arr[4] = Math.max(y1, y2);
        arr[5] = Math.max(z1, z2);

        return aabb;
    }

    public _minX(): number {
        return this._arr[0];
    }
    public _minY(): number {
        return this._arr[1];
    }
    public _minZ(): number {
        return this._arr[2];
    }
    public _maxX(): number {
        return this._arr[3];
    }
    public _maxY(): number {
        return this._arr[4];
    }
    public _maxZ(): number {
        return this._arr[5];
    }
    public _copy(): _AxisAlignedBB {
        return new _AxisAlignedBB(this._arr.slice(0));
    }

    public _offset(x: number, y: number, z: number): _AxisAlignedBB {
        const arr: Float64Array = this._arr;
        // min
        arr[0] += x;
        arr[1] += y;
        arr[2] += z;
        // max
        arr[3] += x;
        arr[4] += y;
        arr[5] += z;

        return this;
    }

    public _union(other: _AxisAlignedBB): _AxisAlignedBB {
        const v: _AxisAlignedBB = this._copy();
        const arr: Float64Array = v._arr;
        arr[0] = Math.min(this._arr[0], other._arr[0]);
        arr[1] = Math.min(this._arr[1], other._arr[1]);
        arr[2] = Math.min(this._arr[2], other._arr[2]);
        arr[3] = Math.max(this._arr[3], other._arr[3]);
        arr[4] = Math.max(this._arr[4], other._arr[4]);
        arr[5] = Math.max(this._arr[5], other._arr[5]);

        return v;
    }
    public _createWithOffset(x: number, y: number, z: number): _AxisAlignedBB {
        return this._copy()._offset(x, y, z);
    }
    public _fix(): _AxisAlignedBB {
        const arr: Float64Array = this._arr;

        const minx: number = arr[0] < arr[3] ? arr[0] : arr[3];
        const miny: number = arr[1] < arr[4] ? arr[1] : arr[4];
        const minz: number = arr[2] < arr[5] ? arr[2] : arr[5];

        const maxx: number = arr[0] < arr[3] ? arr[3] : arr[0];
        const maxy: number = arr[1] < arr[4] ? arr[4] : arr[1];
        const maxz: number = arr[2] < arr[5] ? arr[5] : arr[2];

        arr[0] = minx;
        arr[1] = miny;
        arr[2] = minz;

        arr[3] = maxx;
        arr[4] = maxy;
        arr[5] = maxz;

        return this;
    }

    /**
     * expands 3 out of 6 sides of AABB if xyz != 0
     */
    public _addCoord(x: number, y: number, z: number): _AxisAlignedBB {
        let minx: number = this._arr[0];
        let miny: number = this._arr[1];
        let minz: number = this._arr[2];
        let maxx: number = this._arr[3];
        let maxy: number = this._arr[4];
        let maxz: number = this._arr[5];
        if (x < 0) {
            minx += x;
        } else {
            maxx += x;
        }
        if (y < 0) {
            miny += y;
        } else {
            maxy += y;
        }
        if (z < 0) {
            minz += z;
        } else {
            maxz += z;
        }

        return new _AxisAlignedBB(new Float64Array([minx, miny, minz, maxx, maxy, maxz]));
    }

    public _expand(x: number, y: number, z: number): _AxisAlignedBB {
        const arr: Float64Array = this._arr;
        arr[0] -= x;
        arr[1] -= y;
        arr[2] -= z;
        arr[3] += x;
        arr[4] += y;
        arr[5] += z;

        return this;
    }

    public _createWithExpand(x: number, y: number, z: number): _AxisAlignedBB {
        return this._copy()._expand(x, y, z);
    }

    public _calculateXOffset(aabb: _AxisAlignedBB, offset: number) {
        if (aabb._maxY() > this._minY() && aabb._minY() < this._maxY()) {
            if (aabb._maxZ() > this._minZ() && aabb._minZ() < this._maxZ()) {
                let temp = 0;
                if (offset > 0 && aabb._maxX() <= this._minX()) {
                    temp = this._minX() - aabb._maxX() - 0.0000001;

                    if (temp < offset) {
                        offset = temp;
                    }
                }
                if (offset < 0 && aabb._minX() >= this._maxX()) {
                    temp = this._maxX() - aabb._minX() + 0.0000001;

                    if (temp > offset) {
                        offset = temp;
                    }
                }
            }
        }

        return offset;
    }
    public _calculateYOffset(aabb: _AxisAlignedBB, offset: number) {
        if (aabb._maxX() > this._minX() && aabb._minX() < this._maxX()) {
            if (aabb._maxZ() > this._minZ() && aabb._minZ() < this._maxZ()) {
                let temp = 0;
                if (offset > 0 && aabb._maxY() <= this._minY()) {
                    temp = this._minY() - aabb._maxY() - 0.0000001;

                    if (temp < offset) {
                        offset = temp;
                    }
                }
                if (offset < 0 && aabb._minY() >= this._maxY()) {
                    temp = this._maxY() - aabb._minY() + 0.0000001;

                    if (temp > offset) {
                        offset = temp;
                    }
                }
            }
        }

        return offset;
    }
    public _calculateZOffset(aabb: _AxisAlignedBB, offset: number) {
        if (aabb._maxX() > this._minX() && aabb._minX() < this._maxX()) {
            if (aabb._maxY() > this._minY() && aabb._minY() < this._maxY()) {
                let temp = 0;
                if (offset > 0 && aabb._maxZ() <= this._minZ()) {
                    temp = this._minZ() - aabb._maxZ() - 0.0000001;

                    if (temp < offset) {
                        offset = temp;
                    }
                }
                if (offset < 0 && aabb._minZ() >= this._maxZ()) {
                    temp = this._maxZ() - aabb._minZ() + 0.0000001;

                    if (temp > offset) {
                        offset = temp;
                    }
                }
            }
        }

        return offset;
    }

    public _intersectsWith(other: _AxisAlignedBB): boolean {
        return other._maxX() > this._minX() && other._minX() < this._maxX() ? (other._maxY() > this._minY() && other._minY() < this._maxY() ? other._maxZ() > this._minZ() && other._minZ() < this._maxZ() : false) : false;
    }

    public _getAverageEdgeLength(): number {
        const x: number = this._maxX() - this._minX();
        const y: number = this._maxY() - this._minY();
        const z: number = this._maxZ() - this._minZ();

        return (x + y + z) / 3;
    }

    public _contract(x: number, y: number, z: number): _AxisAlignedBB {
        const x1: number = this._minX() + x;
        const y1: number = this._minY() + y;
        const z1: number = this._minZ() + z;
        const x2: number = this._maxX() - x;
        const y2: number = this._maxY() - y;
        const z2: number = this._maxZ() - z;

        return _AxisAlignedBB._fromBounds(x1, y1, z1, x2, y2, z2)._fix();
    }

    public _intersectsLine(origin: Float64Array, dir: Float64Array): Float64Array {
        const right = 0;
        const left = 1;
        const middle = 2;
        const quadrant = new Uint8Array(3);
        const candidatePlane = new Float64Array(3);
        const maxT = new Float64Array([-1, -1, -1]);
        
        let inside = true;
        for (let i = 0; i < 3; i++) {
            if (origin[i] < this._arr[i]) {
                quadrant[i] = left;
                candidatePlane[i] = this._arr[i];
                inside = false;
            } else if (origin[i] > this._arr[3 + i]) {
                quadrant[i] = right;
                candidatePlane[i] = this._arr[3 + i];
                inside = false;
            } else {
                quadrant[i] = middle;
            }
        }
        if (inside) {
            return origin;
        }
    
        for (let i = 0; i < 3; i++) {
            if (quadrant[i] != middle && dir[i] != 0) {
                maxT[i] = (candidatePlane[i] - origin[i]) / dir[i];
            }
        }
        let whichPlane = 0;
        for (let i = 1; i < 3; i++) {
            if (maxT[whichPlane] < maxT[i]) {
                whichPlane = i;
            }
        }
        if (maxT[whichPlane] < 0) {
            return origin;
        }
    
        const coord = new Float64Array(3);
        for (let i = 0; i < 3; i++) {
            if (whichPlane != i) {
                coord[i] = origin[i] + maxT[whichPlane] * dir[i];
                if (coord[i] < this._arr[i] || coord[i] > this._arr[3 + i]) {
                    return origin;
                }
            } else {
                coord[i] = candidatePlane[i];
            }
        }

        return coord;
    }
}

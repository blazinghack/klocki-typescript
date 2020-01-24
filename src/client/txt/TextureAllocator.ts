import { _Deque } from '../../util/Deque';

import { _KlockiTexture } from './KlockiTexture';

export class _TextureAllocator {
    public _squaresBySize: Map<number, _Deque<_KlockiTexture>>;
    public _maxSize: number;
    constructor() {
        this._squaresBySize = new Map<number, _Deque<_KlockiTexture>>();
        this._maxSize = 1;
    }
    public static _isPowerOf2(value: number): boolean {
        return (value & (value - 1)) === 0;
    }
    public _getSizeDeque(size: number): _Deque<_KlockiTexture> {
        if (!_TextureAllocator._isPowerOf2(size)) {
            throw new RangeError("size is not power of 2 (NPOT)");
        }
        let q: _Deque<_KlockiTexture> | undefined = this._squaresBySize.get(size);
        if (!q) {
            q = new _Deque<_KlockiTexture>();
            this._squaresBySize.set(size, q);
        }

        return q;
    }
    public _provide(klockiTexture: _KlockiTexture): void {
        const dx: number = klockiTexture._subRect._dx();
        const dy: number = klockiTexture._subRect._dy();
        if (dx !== dy) {
            throw new RangeError("tried to provide not a square texture");
        }
        const q: _Deque<_KlockiTexture> = this._getSizeDeque(dx);
        q._enqueue(klockiTexture);
        if (dx > this._maxSize) {
            this._maxSize = dx;
        }
    }

    public _allocate(size: number): _KlockiTexture {
        if (size > this._maxSize) {
            throw new Error("texture size " + size + " too big > " + this._maxSize);
        }
        const q: _Deque<_KlockiTexture> = this._getSizeDeque(size);
        if (q._size() === 0) {
            const uberTexture: _KlockiTexture = this._allocate(size * 2);
            const children: _KlockiTexture[] = uberTexture.split();
            children.forEach((element: _KlockiTexture) => {
                q._enqueue(element);
            });
        }
        const texture: _KlockiTexture | undefined = q._dequeue();
        if (!texture) {
            throw new Error("ran out of free texture space");
        }

        return texture;
    }
}

export class _Deque<T> {
    private _head: number = 0;
    private _tail: number = 0;
    private _mask: number = 1;
    private _list: (T | undefined)[];

    constructor(initSize?: number) {
        if (!initSize) {
            initSize = 2;
        }
        this._list = Array<T>(initSize);
    }

    public _enqueue(value: T): this {
        const list: (T | undefined)[] = this._list;
        const head: number = this._head = (this._head - 1) & this._mask;
        list[head] = value;
        if (head === this._tail) {
            this._resize(list.length, list.length << 1);
        }

        return this;
    }

    public _pushLeft(value: T): this {
        const list: (T | undefined)[] = this._list;
        const head: number = this._head = (this._head - 1) & this._mask;
        list[head] = value;
        if (head === this._tail) {
            this._resize(list.length, list.length << 1);
        }

        return this;
    }

    public _clear(): void {
        this._head = 0;
        this._tail = 0;
    }

    public _peek(index: number): T {
        const list: (T | undefined)[] = this._list;
        const { _head: head, _tail: tail } = this;
        const s = this._size();
        if ((index | 0) !== index || index >= s || index < -s) {
            throw new RangeError('deque index out of range');
        }

        const pos = ((index >= 0 ? head : tail) + index) & this._mask;

        return list[pos] as T;
    }

    public _indexOf(needle: T, start = 0) {
        const list: (T | undefined)[] = this._list;
        const { _head: head, _mask: mask } = this;
        const offset: number = start >= 0 ? start : start < -this._size() ? 0 : this._size() + start;

        for (let i = offset; i < this._size(); i++) {
            if (list[(head + i) & mask] === needle) {
                return i;
            }
        }

        return -1;
    }

    public _has(needle: T): boolean {
        const list: (T | undefined)[] = this._list;
        const { _head: head, _mask: mask } = this;

        for (let i = 0; i < this._size(); i++) {
            if (list[(head + i) & mask] === needle) {
                return true;
            }
        }

        return false;
    }

    public _size(): number {
        return (this._tail - this._head) & this._mask;
    }

    public _dequeue(): T {
        if (this._head === this._tail) {
            throw new RangeError('pop from an empty deque');
        }

        this._tail = (this._tail - 1) & this._mask;
        const value = this._list[this._tail] as T;
        this._list[this._tail] = undefined;
        if (this._size() < this._mask >>> 1) { this._resize(this._size(), this._list.length >>> 1); }

        return value;
    }
    
    public _popLeft(): T {
        if (this._head === this._tail) {
            throw new RangeError('pop from an empty deque');
        }

        const value = this._list[this._head] as T;
        this._list[this._head] = undefined;
        this._head = (this._head + 1) & this._mask;
        if (this._size() < this._mask >>> 1) { this._resize(this._size(), this._list.length >>> 1); }

        return value;
    }
    
    public *_entries(): IterableIterator<T> {
        const list: (T | undefined)[] = this._list;
        const { _head: head, _mask: mask } = this;
        const s = this._size();
        for (let i = 0; i < s; i++) {
            yield list[(head + i) & mask] as T;
        }
    }

    public keys() {
        return this._entries();
    }

    public _values() {
        return this._entries();
    }

    public [Symbol.iterator]() {
        return this._entries();
    }

    private _resize(size: number, length: number) {
        const { _head: head, _mask: mask } = this;
        this._head = 0;
        this._tail = size;
        this._mask = length - 1;

        const list: (T | undefined)[] = this._list;
        if (head === 0) {
            list.length = length;

            return;
        }

        const sorted = new Array<T | undefined>(length);
        for (let i = 0; i < size; i++) {
            sorted[i] = list[(head + i) & mask];
        }
        this._list = sorted;
    }
}

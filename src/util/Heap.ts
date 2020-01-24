export type ICompareFunction<T> = (obj1: T, obj2: T) => number;

export function minNumberCompare(num1: number, num2: number): number {
    return num1 - num2;
}

export function MaxNumberComparer(num1: number, num2: number): number {
    return num2 - num1;
}

export class _Heap<T> {
    private readonly items: T[] = [];
    private readonly itemToIndexMap = new Map<T, number>();
    private readonly innerCompare: ICompareFunction<T>;

    constructor(compareFunction: ICompareFunction<T>) {
        this.innerCompare = compareFunction;
    }

    public peek(): T | undefined {
        return this.items[0];
    }

    public add(item: T): void {
        if (this.itemToIndexMap.has(item)) {
            throw new Error("Connot add an item that is already in the heap.");
        }

        this.items.push(item);
        this.itemToIndexMap.set(item, this.items.length - 1);
        this.bubbleUpToPlace(this.items.length - 1);
    }

    public pop(): T | undefined {
        if (this.isEmpty()) { return undefined; }

        const obj = this.items[0];
        this.removeAt(0);

        return obj;
    }

    public size(): number {
        return this.items.length;
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public remove(item: T): boolean {
        const index = this.itemToIndexMap.get(item);

        if (index === undefined) { return false; }

        this.removeAt(index);

        return true;
    }

    public clear(): void {
        this.items.length = 0;
        this.itemToIndexMap.clear();
    }

    public contains(item: T): boolean {
        return this.itemToIndexMap.has(item);
    }

    public [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }

    private compare(a: T, b: T): number {
        const result = this.innerCompare(a, b);

		// if (typeof result !== "number")
		// 	throw new Error(`The typeof compare result cannot be different from number: ${result}`);

        if (isNaN(result)) {
            throw new Error(`Compare result cannot be NaN.`);
        }

        return result;
    }

    private removeAt(index: number): void {
        if (this.items.length === 1) {
            this.clear();

            return;
        }

        if (index === this.items.length - 1) {
            this.itemToIndexMap.delete(this.items[this.items.length - 1]);
            this.items.length = this.items.length - 1;

            return;
        }

        const poppedItem = this.items[index];
        this.itemToIndexMap.delete(poppedItem);

        this.items[index] = this.items[this.items.length - 1];
        this.items.splice(this.items.length - 1, 1);
        this.itemToIndexMap.set(this.items[index], index);

        const compare = this.compare(this.items[index], poppedItem);

        if (compare < 0) {
            this.bubbleUpToPlace(index);
        } else if (compare > 0) {
            this.bubbleDownToPlace(index);
        }
    }

    private getLeftChildIndex(nodeIndex: number): number {
        return (2 * nodeIndex) + 1;
    }

    private getParentIndex(nodeIndex: number): number {
        return Math.floor((nodeIndex - 1) / 2);
    }

    private getSmallerChildIndex(leftChildIndex: number, rightChildIndex: number): number | undefined {
        if (rightChildIndex >= this.items.length) {
            if (leftChildIndex >= this.items.length) {
                return undefined;
            } else {
                return leftChildIndex;
            }
        } else {
            if (leftChildIndex >= this.items.length) {
                return rightChildIndex;
            } else if (this.compare(this.items[leftChildIndex], this.items[rightChildIndex]) <= 0) {
            return leftChildIndex;
        } else {
            return rightChildIndex;
        }
        }
    }

    private bubbleUpToPlace(index: number): void {
        if (index === 0) { return; }

        const indexData = this.items[index];

        while (true) {
            const parentIndex = this.getParentIndex(index);
            const parentData = this.items[parentIndex];

            if (this.compare(parentData, indexData) <= 0) { break; }

            this.swap(index, parentIndex, indexData, parentData);

            if (parentIndex === 0) { break; }

            index = parentIndex;
        }
    }

    private bubbleDownToPlace(index: number): void {
        let leftChildIndex = this.getLeftChildIndex(index);
        let smallerChildIndex = this.getSmallerChildIndex(leftChildIndex, leftChildIndex + 1);

        while (smallerChildIndex !== undefined) {
            const indexData = this.items[index];
            const smallerChildData = this.items[smallerChildIndex];

            if (this.compare(indexData, smallerChildData) < 0) { break; }

            this.swap(index, smallerChildIndex, indexData, smallerChildData);

            index = smallerChildIndex;

            leftChildIndex = this.getLeftChildIndex(index);
            smallerChildIndex = this.getSmallerChildIndex(leftChildIndex, leftChildIndex + 1);
        }
    }

    private swap(i1: number, i2: number, data1?: T, data2?: T): void {
        data1 = data1 || this.items[i1];
        data2 = data2 || this.items[i2];

        const temp = data1;
        this.items[i1] = data2;
        this.items[i2] = temp;

        this.itemToIndexMap.set(data1, i2);
        this.itemToIndexMap.set(data2, i1);
    }
}

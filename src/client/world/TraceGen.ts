// Thanks to Thinkofname for making an awesome steven-go and steven-rust
export class _TraceGen {
    
    public _count: number;
    public _state: Float64Array;
    constructor(start: number, d: number) {
        this._count = 0;
        this._state = new Float64Array(2);
        
		      if (d > 0) {
          this._state[0] = (Math.ceil(start) - start) / d;
      } else if (d < 0) {
          d = -d;
          this._state[0] = (start - Math.floor(start)) / d;
      }
		      this._state[1] = d;
    }
    
    public _next() {
        this._count++;
		      if (this._state[1] == 0) {
          return Infinity;
      }

		      return this._state[0] + (this._count - 1) / this._state[1];
    }
}

export class _Timer {
    public _ticksPerSecond: number;
    public _timeNow: number;
    public _deltaTicks: number = 0;
    public _deltaTime: number = 0;
    public _timeNowQuantized: number;
    public _elapsedTicks: number = 0;
    public _deltaTimeQuantized: number = 0;
    public _renderPartialTicks: number = 0;
    private _timeLastUpdate: number;

    constructor(ticksPerSecond: number) {
        this._ticksPerSecond = ticksPerSecond;
        this._timeNow = Date.now() / 1000;
        this._timeNowQuantized = this._timeNow;
        this._timeLastUpdate = this._timeNow;
    }

    public _updateTimer(time: number) {
        this._timeNow = Date.now() / 1000;

        this._deltaTime = this._timeNow - this._timeLastUpdate;
        
        this._deltaTimeQuantized = this._timeNow - this._timeNowQuantized;
        this._deltaTicks = this._deltaTimeQuantized * this._ticksPerSecond;

        if (Math.abs(this._deltaTicks) > 5 * this._ticksPerSecond) {
            console.log("Can't keep up! Skipping", this._deltaTicks, "ticks");
            this._deltaTime = 0;
            this._deltaTicks = 0;
            this._timeNowQuantized = this._timeNow;
        }
        this._elapsedTicks = Math.floor(this._deltaTicks);
        this._timeNowQuantized += this._elapsedTicks / this._ticksPerSecond;
        this._renderPartialTicks = this._deltaTicks % 1;

        this._timeLastUpdate = this._timeNow;
    }

}

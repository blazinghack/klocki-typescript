export class _Display {
    public _canvas: HTMLCanvasElement;
    public _gl: WebGL2RenderingContext;
    public _width: number = 0;
    public _height: number = 0;
    public _guiWidth: number = 0;
    public _guiHeight: number = 0;
    public _guiScale: number = 2;
    public _indexBuffer!: WebGLBuffer;

    constructor() {
        const canvas: HTMLElement | null = document.getElementById('klockicanvas');
        if (!canvas) {
            throw new Error('#klockicanvas not found');
        }
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('#klockicanvas is not a canvas');
        }
        const attributes = { antialias: false, translucent: false };
        const webgl = canvas.getContext('webgl2', attributes) || canvas.getContext('experimental-webgl2', attributes);
        if (!(webgl instanceof WebGL2RenderingContext)) {
            alert('WebGL2 is not supported in your browser');
            throw new Error('WebGL2 not supported');
        }
        this._gl = webgl;
        this._canvas = canvas;

        // TODO retina 2x scaling on mobile
        this._resize();
        window.addEventListener("resize", (ev: Event) => this._resize());

        this._generateIndices();

    }
    public _resize(): void {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this._guiWidth = this._width / this._guiScale;
        this._guiHeight = this._height / this._guiScale;

        this._canvas.style.width = `${this._width}px`;
        this._canvas.style.height = `${this._height}px`;

        this._canvas.width = this._width;
        this._canvas.height = this._height;
        // this._canvas.style.width = this._width+"px";
        // this._canvas.style.height = this._height+"px";
        this._gl.viewport(0, 0, this._width, this._height);
    }

    private _generateIndices() {
        const gl = this._gl;
        const indexBuffer = gl.createBuffer();
        this._indexBuffer = indexBuffer!;

        const numQuads = 1024 * 1024;
        const indices = new Uint32Array(6 * numQuads);
        let j, k;
        for (let i = 0; i < numQuads; i++) {
            j = i * 6;
            k = i * 4;
            
            indices[j + 0] = k + 0;
            indices[j + 1] = k + 1;
            indices[j + 2] = k + 2;
            indices[j + 3] = k + 3;
            indices[j + 4] = k + 2;
            indices[j + 5] = k + 1;
            
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    }
}

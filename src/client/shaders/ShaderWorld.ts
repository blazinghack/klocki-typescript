import { _Klocki } from "../Klocki";

import { _Shader } from "./Shader";

export class _ShaderWorld extends _Shader {

    public _program: WebGLProgram;
    public _attribLocations: { _vertexPosition: number; _textureCoord: number; _textureAtlas: number; _color: number };
    public _uniformLocations: { _projectionMatrix: WebGLUniformLocation | null; _offset: WebGLUniformLocation | null; _uSampler: WebGLUniformLocation | null; _screenSize: WebGLUniformLocation | null };
    public _klocki: _Klocki;
    public _offsetx: number = 0.1337;
    public _offsety: number = 0.1337;
    public _offsetz: number = 0.1337;
    public _gl: WebGL2RenderingContext;
    public _zero: Float32Array;

    constructor(klocki: _Klocki) {
        super();
        this._klocki = klocki;
        this._zero = new Float32Array(4);
        const vsSource = `#version 300 es
    //precision lowp float;

    in vec4 aVertexPosition;
    in vec2 aTextureCoord;
    in int aTextureAtlas;
    in vec4 aColor;
    
  
    uniform mat4 uProjectionMatrix;
    uniform vec4 uOffset;
    uniform float screenSize;
  
    out lowp vec4 vertexColor;
    out lowp vec3 vTextureCoord;
  
    void main(void) {
      vec4 pos = aVertexPosition;
      //pos.xyz *= 0.015625;
      //pos.xyz *= (1.0/64.0);
      vec4 screenPos = uProjectionMatrix * (pos+uOffset);
      gl_Position = screenPos;
      vertexColor = aColor;
      vTextureCoord = vec3(aTextureCoord, aTextureAtlas);

      //gl_PointSize = screenSize/screenPos.z;
    }
  `;
        const fsSource = `#version 300 es
  precision lowp float;
  
    in lowp vec3 vTextureCoord;
    in lowp vec4 vertexColor;
  
    uniform lowp sampler2DArray uSampler;
  
    out vec4 fragColor;





    void main(void) {
      //fragColor = texture(uSampler, vTextureCoord+vec3(gl_PointCoord*0.015625, 0)) * vertexColor;
      fragColor = texture(uSampler, vTextureCoord) * vertexColor;

      if(fragColor.a < 0.1){
        discard;
      }
    }
  `;
        const gl = klocki._display._gl;
        this._gl = gl;
        const program = this._initShaderProgram(gl, vsSource, fsSource);
        this._program = program;
        this._attribLocations = {
            _vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
            _textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
            _textureAtlas: gl.getAttribLocation(program, 'aTextureAtlas'),
            _color: gl.getAttribLocation(program, 'aColor'),
        };
        this._uniformLocations = {
            _projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
            _offset: gl.getUniformLocation(program, 'uOffset'),
            _uSampler: gl.getUniformLocation(program, 'uSampler'),
            _screenSize: gl.getUniformLocation(program, 'screenSize'),
        };

    }

    public _updateOffset(off: Float32Array) {
        if (off[0] != this._offsetx || off[1] != this._offsety || off[2] != this._offsetz) {
            this._gl.uniform4fv(this._uniformLocations._offset, off);
        }
    }
    public _setScreenSize(size: number) {
        this._gl.uniform1f(this._uniformLocations._screenSize, size);
    }
    public _zeroOffset() {
        this._updateOffset(this._zero);
    }

}

import { _Klocki } from "../Klocki";

import { _Shader } from "./Shader";

export class _ShaderMobs extends _Shader {

    public _program: WebGLProgram;
    public _attribLocations: { _vertexPosition: number; _textureCoord: number; _textureAtlas: number; _color: number; _groupMatrixID: number };
    public _uniformLocations: { _projectionMatrix: WebGLUniformLocation | null; _uSampler: WebGLUniformLocation | null ; _uGroupinfoSampler: WebGLUniformLocation | null };
    public _klocki: _Klocki;
    public _gl: WebGL2RenderingContext;

    constructor(klocki: _Klocki) {
        super();
        this._klocki = klocki;
        const vsSource = `#version 300 es
    in vec4 aVertexPosition;
    in vec2 aTextureCoord;
    in int aTextureAtlas;
    in vec4 aColor;
    in int aGroupMatrixID;

  
    uniform mat4 uProjectionMatrix;
    uniform lowp sampler2D uGroupinfoSampler;
  
    out lowp vec4 vertexColor;
    out lowp vec3 vTextureCoord;
  
    mat4 getGroupMatrix(int id){
      id = id << 2;
      int groupMatrixX = id & 255;
      int groupMatrixY = id >> 8;
      vec4 ga = texelFetch(uGroupinfoSampler, ivec2(groupMatrixX, groupMatrixY), 0);
      vec4 gb = texelFetch(uGroupinfoSampler, ivec2(groupMatrixX+1, groupMatrixY), 0);
      vec4 gc = texelFetch(uGroupinfoSampler, ivec2(groupMatrixX+2, groupMatrixY), 0);
      vec4 gd = texelFetch(uGroupinfoSampler, ivec2(groupMatrixX+3, groupMatrixY), 0);
      return mat4(ga, gb, gc, gd);
    }
    void main(void) {
      vec4 pos = aVertexPosition;

      
      pos = getGroupMatrix(aGroupMatrixID) * pos;

      gl_Position = uProjectionMatrix * (pos);
      vertexColor = aColor;
      vTextureCoord = vec3(aTextureCoord, aTextureAtlas);
    }
  `;
        const fsSource = `#version 300 es
  precision lowp float;
  
    in lowp vec3 vTextureCoord;
    in lowp vec4 vertexColor;
  
    uniform lowp sampler2DArray uSampler;
    
  
    out vec4 fragColor;
    void main(void) {
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
            _groupMatrixID: gl.getAttribLocation(program, 'aGroupMatrixID'),
        };
        this._uniformLocations = {
            _projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
            _uSampler: gl.getUniformLocation(program, 'uSampler'),
            _uGroupinfoSampler: gl.getUniformLocation(program, 'uGroupinfoSampler'),
        };

    }

}

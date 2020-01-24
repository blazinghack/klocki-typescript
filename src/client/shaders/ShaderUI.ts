import { _Klocki } from "../Klocki";

import { _Shader } from "./Shader";

export class _ShaderUI extends _Shader {
    public _program: WebGLProgram;
    public _attribLocations: { _vertexPosition: number; _textureCoord: number; _textureAtlas: number; _color: number };
    public _uniformLocations: { _uiMatrix: WebGLUniformLocation | null; _uSampler: WebGLUniformLocation | null };

    constructor(klocki: _Klocki) {
        super();
        const vsSource = `#version 300 es
  in vec4 aVertexPosition;
  in vec2 aTextureCoord;
  in float aTextureAtlas;
  in vec4 aColor;

  uniform mat4 uUiMatrix;

  out lowp vec4 vertexColor;
  out highp vec3 vTextureCoord;

  void main(void) {
    gl_Position = uUiMatrix * aVertexPosition;
    vertexColor = aColor;
    vTextureCoord = vec3(aTextureCoord, aTextureAtlas);
  }
`;
        const fsSource = `#version 300 es
precision mediump float;

  in highp vec3 vTextureCoord;
  in lowp vec4 vertexColor;

  uniform mediump sampler2DArray uSampler;

  out vec4 fragColor;
  void main(void) {
    fragColor = texture(uSampler, vTextureCoord) * vertexColor;
    if(fragColor.a < 0.1){
      discard;
    }
  }
`;
        const gl = klocki._display._gl;
        const program = this._initShaderProgram(gl, vsSource, fsSource);
        this._program = program;
        this._attribLocations = {
            _vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
            _textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
            _textureAtlas: gl.getAttribLocation(program, 'aTextureAtlas'),
            _color: gl.getAttribLocation(program, 'aColor'),
        };

        this._uniformLocations = {
            _uiMatrix: gl.getUniformLocation(program, 'uUiMatrix'),
            _uSampler: gl.getUniformLocation(program, 'uSampler'),
        };

    }

}

import { _Klocki } from "../Klocki";

import { _Shader } from "./Shader";

export class _ShaderLines extends _Shader {
    public _program: WebGLProgram;
    public _attribLocations: { _vertexPosition: number; _color: number };
    public _uniformLocations: { _projectionMatrix: WebGLUniformLocation | null };

    constructor(klocki: _Klocki) {
        super();
        const vsSource = `#version 300 es
  in vec4 aVertexPosition;
  in vec4 aColor;

  uniform mat4 uProjectionMatrix;

  out lowp vec4 vertexColor;

  void main(void) {
    gl_Position = uProjectionMatrix * aVertexPosition;
    vertexColor = aColor;
  }
`;
        const fsSource = `#version 300 es
precision mediump float;

  in lowp vec4 vertexColor;


  out vec4 fragColor;
  void main(void) {
    fragColor = vertexColor;
  }
`;
        const gl = klocki._display._gl;
        const program = this._initShaderProgram(gl, vsSource, fsSource);
        this._program = program;
        this._attribLocations = {
            _vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
            _color: gl.getAttribLocation(program, 'aColor'),
        };

        this._uniformLocations = {
            _projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
        };

    }

}

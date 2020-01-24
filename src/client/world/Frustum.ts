import { mat4, vec3, vec4 } from "gl-matrix";


let planes = new Array<vec4>(6);
let plane = vec4.create();
let distance = 0.001;
let minDistance = 9999999;
let i = 0;

export class _Frustum {
    public _planes: vec4[];
    constructor() {
        const planes = new Array<vec4>(6);
        this._planes = planes;
        for (let i = 0; i < 6; i++) {
            planes[i] = vec4.create();
        }
    }
    public _update(vpMat: mat4) {
        const planes = this._planes;

        planes[0][0] = vpMat[0 * 4 + 3] - vpMat[0 * 4 + 0];
        planes[0][1] = vpMat[1 * 4 + 3] - vpMat[1 * 4 + 0];
        planes[0][2] = vpMat[2 * 4 + 3] - vpMat[2 * 4 + 0];
        planes[0][3] = vpMat[3 * 4 + 3] - vpMat[3 * 4 + 0];

        planes[1][0] = vpMat[0 * 4 + 3] + vpMat[0 * 4 + 0];
        planes[1][1] = vpMat[1 * 4 + 3] + vpMat[1 * 4 + 0];
        planes[1][2] = vpMat[2 * 4 + 3] + vpMat[2 * 4 + 0];
        planes[1][3] = vpMat[3 * 4 + 3] + vpMat[3 * 4 + 0];

        planes[2][0] = vpMat[0 * 4 + 3] + vpMat[0 * 4 + 1];
        planes[2][1] = vpMat[1 * 4 + 3] + vpMat[1 * 4 + 1];
        planes[2][2] = vpMat[2 * 4 + 3] + vpMat[2 * 4 + 1];
        planes[2][3] = vpMat[3 * 4 + 3] + vpMat[3 * 4 + 1];

        planes[3][0] = vpMat[0 * 4 + 3] - vpMat[0 * 4 + 1];
        planes[3][1] = vpMat[1 * 4 + 3] - vpMat[1 * 4 + 1];
        planes[3][2] = vpMat[2 * 4 + 3] - vpMat[2 * 4 + 1];
        planes[3][3] = vpMat[3 * 4 + 3] - vpMat[3 * 4 + 1];

        planes[4][0] = vpMat[0 * 4 + 3] - vpMat[0 * 4 + 2];
        planes[4][1] = vpMat[1 * 4 + 3] - vpMat[1 * 4 + 2];
        planes[4][2] = vpMat[2 * 4 + 3] - vpMat[2 * 4 + 2];
        planes[4][3] = vpMat[3 * 4 + 3] - vpMat[3 * 4 + 2];

        planes[5][0] = vpMat[0 * 4 + 3] + vpMat[0 * 4 + 2];
        planes[5][1] = vpMat[1 * 4 + 3] + vpMat[1 * 4 + 2];
        planes[5][2] = vpMat[2 * 4 + 3] + vpMat[2 * 4 + 2];
        planes[5][3] = vpMat[3 * 4 + 3] + vpMat[3 * 4 + 2];

        for (let i = 0; i < 6; i++) {
            const p = planes[i];
            const mag = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
            p[0] /= mag;
            p[1] /= mag;
            p[2] /= mag;
            p[3] /= mag;
        }
    }
    public _testSphereTouches(pos: vec3, radius: number) {
        const planes = this._planes;
        for (let i = 0; i < 6; i++) {
            const plane = planes[i];
            const distance = plane[0] * pos[0] + plane[1] * pos[1] + plane[2] * pos[2] + plane[3];
            if (distance < radius) {
                return false;
            }
        }

        return true;
    }
    public _testSphereFully(pos: vec3) {
        planes = this._planes;
        minDistance = 9999999;
        for (i = 0; i < 6; ++i) {
            plane = planes[i];
            distance = plane[0] * pos[0] + plane[1] * pos[1] + plane[2] * pos[2] + plane[3];
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        return minDistance;
    }

}

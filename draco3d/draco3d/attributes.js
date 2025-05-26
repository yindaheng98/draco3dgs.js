// Attributes for the Draco 3D library
const dracoAttributesInfo = {
    POSITION: { defaultType: Float32Array, stride: 3 },
    NORMAL: { defaultType: Float32Array, stride: 3 },
    COLOR: { defaultType: Uint8Array, stride: 3 },
    TEX_COORD: { defaultType: Uint8Array, stride: 2 },
    SCALE_3DGS: { defaultType: Float32Array, stride: 3 },
    ROTATION_3DGS: { defaultType: Float32Array, stride: 4 },
    OPACITY_3DGS: { defaultType: Float32Array, stride: 1 },
    FEATURE_DC_3DGS: { defaultType: Float32Array, stride: 3 },
    FEATURE_REST_3DGS: { defaultType: Float32Array, stride: 45 },
    GENERIC: { defaultType: Uint8Array, stride: 3 },
};
module.exports = { dracoAttributesInfo }
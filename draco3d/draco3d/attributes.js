// Attributes for the Draco 3D library
const dracoAttributesInfo = {
    POSITION: { defaultType: Float32Array, stride: 3 },
    NORMAL: { defaultType: Float32Array, stride: 3 },
    COLOR: { defaultType: Uint8Array, stride: 3 },
    TEX_COORD: { defaultType: Uint8Array, stride: 2 },
    GENERIC: { defaultType: Uint8Array, stride: 3 },
};
module.exports = { dracoAttributesInfo }
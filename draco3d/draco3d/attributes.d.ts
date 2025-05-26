type TypedArray = Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array;
export interface DracoAttributes {
    POSITION?: TypedArray;
    NORMAL?: TypedArray;
    COLOR?: TypedArray;
    TEX_COORD?: TypedArray;
    SCALE_3DGS?: TypedArray;
    ROTATION_3DGS?: TypedArray;
    OPACITY_3DGS?: TypedArray;
    FEATURE_DC_3DGS?: TypedArray;
    FEATURE_REST_3DGS?: TypedArray;
    GENERIC?: TypedArray;
}

type TypedArrayConstructor = Float32ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;
export interface DracoAttributesConstructor {
    POSITION?: TypedArrayConstructor;
    NORMAL?: TypedArrayConstructor;
    COLOR?: TypedArrayConstructor;
    TEX_COORD?: TypedArrayConstructor;
    SCALE_3DGS?: TypedArrayConstructor;
    ROTATION_3DGS?: TypedArrayConstructor;
    OPACITY_3DGS?: TypedArrayConstructor;
    FEATURE_DC_3DGS?: TypedArrayConstructor;
    FEATURE_REST_3DGS?: TypedArrayConstructor;
    GENERIC?: TypedArrayConstructor;
}

type intager = number;
export interface DracoAttributeInfo {
    stride: intager,
    defaultType: TypedArrayConstructor
}

export interface DracoAttributesInfo {
    POSITION: DracoAttributeInfo;
    NORMAL: DracoAttributeInfo;
    COLOR: DracoAttributeInfo;
    TEX_COORD: DracoAttributeInfo;
    SCALE_3DGS: DracoAttributeInfo;
    ROTATION_3DGS: DracoAttributeInfo;
    OPACITY_3DGS: DracoAttributeInfo;
    FEATURE_DC_3DGS: DracoAttributeInfo;
    FEATURE_REST_3DGS: DracoAttributeInfo;
    GENERIC: DracoAttributeInfo;
}

const dracoAttributesInfo: DracoAttributesInfo;
export { dracoAttributesInfo };
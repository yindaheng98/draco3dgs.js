type TypedArray = Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array;
export interface DracoAttributes {
    POSITION?: TypedArray;
    NORMAL?: TypedArray;
    COLOR?: TypedArray;
    TEX_COORD?: TypedArray;
    GENERIC?: TypedArray;
}

type TypedArrayConstructor = Float32ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;
export interface DracoAttributesConstructor {
    POSITION?: TypedArrayConstructor;
    NORMAL?: TypedArrayConstructor;
    COLOR?: TypedArrayConstructor;
    TEX_COORD?: TypedArrayConstructor;
    GENERIC?: TypedArrayConstructor;
}

type intager = number;
export interface DracoAttributeInfo {
    stride: intager,
    defaultType: TypedArrayConstructor
}

export interface DracoAttributesInfo {
    POSITION?: DracoAttributeInfo;
    NORMAL?: DracoAttributeInfo;
    COLOR?: DracoAttributeInfo;
    TEX_COORD?: DracoAttributeInfo;
    GENERIC?: DracoAttributeInfo;
}

const dracoAttributesInfo: DracoAttributesInfo;
export { dracoAttributesInfo };
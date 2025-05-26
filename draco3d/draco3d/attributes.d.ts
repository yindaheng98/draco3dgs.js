type TypedArray = Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array;
export interface DracoAttributes {
    POSITION: TypedArray | null;
    NORMAL: TypedArray | null;
    COLOR: TypedArray | null;
    TEX_COORD: TypedArray | null;
    GENERIC: TypedArray | null;
}

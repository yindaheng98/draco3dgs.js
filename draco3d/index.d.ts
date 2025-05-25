import attributes from './draco3d/attributes';

interface DecodedGeometry {
    numPoints: number;
    attributes: {
        [key: string]: Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | null;
    };
    numFaces: number;
    indices: Uint32Array | null;
}

declare class DracoDecoder {
    constructor();
    decode(buffer: ArrayBuffer): Promise<DecodedGeometry>;
}

declare class DracoEncoder {
    constructor();
    encode(geometry: DecodedGeometry): Promise<ArrayBuffer>;
    SetEncodingMethod(method: string): void;
    SetAttributeQuantization(att_name: string, quantization_bits: number): void;
    SetSpeedOptions(encoding_speed: number, decoding_speed: number): void;
    SetTrackEncodedProperties(flag: boolean): void;
}

export {
    DracoEncoder,
    DracoDecoder,
    attributes
};

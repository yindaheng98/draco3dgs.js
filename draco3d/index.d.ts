import { DracoAttributes } from './draco3d/attributes';

interface DecodedGeometry {
    numPoints: number;
    attributes: DracoAttributes;
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
    DracoAttributes,
    DecodedGeometry,
};

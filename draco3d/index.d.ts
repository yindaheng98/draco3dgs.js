import { DracoAttributes, DracoAttributesConstructor, DracoAttributesInfo, dracoAttributesInfo } from './draco3d/attributes';

export interface DecodedGeometry {
    numPoints: number;
    attributes: DracoAttributes;
    numFaces: number;
    indices: Uint32Array | null;
}

export class DracoDecoder {
    constructor(attributeTypes?: DracoAttributesConstructor);
    GetArrtibutesType(): DracoAttributesConstructor;
    decode(buffer: ArrayBuffer): Promise<DecodedGeometry>;
}

export class DracoEncoder {
    constructor(attributeTypes?: DracoAttributesConstructor);
    GetArrtibutesType(): DracoAttributesConstructor;
    encode(geometry: DecodedGeometry): Promise<ArrayBuffer>;
    SetEncodingMethod(method: string): void;
    SetAttributeQuantization(att_name: string, quantization_bits: number): void;
    SetSpeedOptions(encoding_speed: number, decoding_speed: number): void;
    SetTrackEncodedProperties(flag: boolean): void;
}

export {
    DracoAttributes,
    dracoAttributesInfo,
};

interface AttributeDefinition {
    type: Float32ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;
    stride: number;
}

interface DracoAttributeDefinitions {
    POSITION: AttributeDefinition;
    NORMAL: AttributeDefinition;
    COLOR: AttributeDefinition;
    TEX_COORD: AttributeDefinition;
    GENERIC: AttributeDefinition;
}

declare const attributes: DracoAttributeDefinitions;
export = attributes;

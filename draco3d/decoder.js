const assert = require('assert');
const createDecoderModule = require('./draco3d/draco_decoder');
const { dracoAttributesInfo } = require('./draco3d/attributes');

class DracoDecoder {
    #decoderModule;
    #attributeTypes;
    constructor(attributeTypes = {}) {
        this.#decoderModule = null;
        this.#attributeTypes = {};
        for (const attrName of Object.keys(dracoAttributesInfo)) {
            if (attributeTypes[attrName])
                this.#attributeTypes[attrName] = attributeTypes[attrName];
            else
                this.#attributeTypes[attrName] = dracoAttributesInfo[attrName].defaultType;
        }
    }

    types() {
        return { ...this.#attributeTypes };
    }

    async initialize() {
        if (!this.#decoderModule)
            this.#decoderModule = await createDecoderModule({});
        return this.#decoderModule;
    }

    async decode(buffer) {
        const decoderModule = await this.initialize();

        // Decode the buffer to a Draco geometry
        const decoder = new decoderModule.Decoder();
        const decoderBuffer = new decoderModule.DecoderBuffer();
        decoderBuffer.Init(new Int8Array(buffer), buffer.byteLength);

        const geometryType = decoder.GetEncodedGeometryType(decoderBuffer);
        let dracoGeometry;
        let status;

        if (geometryType === decoderModule.TRIANGULAR_MESH) {
            dracoGeometry = new decoderModule.Mesh();
            status = decoder.DecodeBufferToMesh(decoderBuffer, dracoGeometry);
        } else if (geometryType === decoderModule.POINT_CLOUD) {
            dracoGeometry = new decoderModule.PointCloud();
            status = decoder.DecodeBufferToPointCloud(decoderBuffer, dracoGeometry);
        } else {
            throw new Error('Unknown geometry type');
        }

        if (!status.ok() || dracoGeometry.ptr === 0) {
            throw new Error('Decoding failed: ' + status.error_msg());
        }

        // Extract attributes from the decoded geometry
        const numPoints = dracoGeometry.num_points();
        const attributes = {};
        for (const attrName of Object.keys(this.#attributeTypes)) {
            const decoderAttr = decoderModule[attrName];
            const attrId = decoder.GetAttributeId(dracoGeometry, decoderAttr);

            if (attrId < 0) continue;

            const attribute = decoder.GetAttribute(dracoGeometry, attrId);
            const numComponents = attribute.num_components();
            const numValues = numPoints * numComponents;
            let attributeData = null;
            switch (this.#attributeTypes[attrName]) {
                case Float32Array:
                    attributeData = new decoderModule.DracoFloat32Array();
                    decoder.GetAttributeFloatForAllPoints(dracoGeometry, attribute, attributeData);
                    break;
                case Int8Array:
                    attributeData = new decoderModule.DracoInt8Array();
                    decoder.GetAttributeInt8ForAllPoints(dracoGeometry, attribute, attributeData);
                    break;
                case Int16Array:
                    attributeData = new decoderModule.DracoInt16Array();
                    decoder.GetAttributeInt16ForAllPoints(dracoGeometry, attribute, attributeData);
                    break;
                case Int32Array:
                    attributeData = new decoderModule.DracoInt32Array();
                    decoder.GetAttributeInt32ForAllPoints(dracoGeometry, attribute, attributeData);
                    break;
                case Uint8Array:
                    attributeData = new decoderModule.DracoUInt8Array();
                    decoder.GetAttributeUInt8ForAllPoints(dracoGeometry, attribute, attributeData);
                    break;
                case Uint16Array:
                    attributeData = new decoderModule.DracoUInt16Array();
                    decoder.GetAttributeUInt16ForAllPoints(dracoGeometry, attribute, attributeData);
                    break;
                case Uint32Array:
                    attributeData = new decoderModule.DracoUInt32Array();
                    decoder.GetAttributeUInt32ForAllPoints(dracoGeometry, attribute, attributeData);
                    break;
                default:
                    throw new Error('Unsupported attribute type');
            }

            assert(numValues === attributeData.size(), 'Wrong attribute size.');
            const array = new this.#attributeTypes[attrName](numValues);
            for (let i = 0; i < numValues; ++i) {
                array[i] = attributeData.GetValue(i);
            }

            attributes[attrName] = array;
            decoderModule.destroy(attributeData);
        }

        // Get indices if it's a mesh
        let indices = null;
        let numFaces = 0;
        if (geometryType === decoderModule.TRIANGULAR_MESH) {
            numFaces = dracoGeometry.num_faces();
            const numIndices = numFaces * 3;
            indices = new Uint32Array(numIndices);

            const ia = new decoderModule.DracoInt32Array();
            for (let i = 0; i < numFaces; ++i) {
                decoder.GetFaceFromMesh(dracoGeometry, i, ia);
                const index = i * 3;
                indices[index] = ia.GetValue(0);
                indices[index + 1] = ia.GetValue(1);
                indices[index + 2] = ia.GetValue(2);
            }
            decoderModule.destroy(ia);
        }

        // Cleanup
        decoderModule.destroy(decoderBuffer);
        decoderModule.destroy(decoder);
        decoderModule.destroy(dracoGeometry);

        return {
            numPoints,
            attributes,
            numFaces,
            indices,
        };
    }
}

module.exports = DracoDecoder;

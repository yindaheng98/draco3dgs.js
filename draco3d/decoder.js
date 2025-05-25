const assert = require('assert');
const createDecoderModule = require('./draco3d/draco_decoder');
const dracoAttributes = require('./draco3d/attributes');

class DracoDecoder {
    constructor() {
        this.decoderModule = null;
    }

    async initialize() {
        if (!this.decoderModule)
            this.decoderModule = await createDecoderModule({});
        return this.decoderModule;
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
        for (const attrName of Object.keys(dracoAttributes)) {
            const decoderAttr = decoderModule[attrName];
            const attrId = decoder.GetAttributeId(dracoGeometry, decoderAttr);

            if (attrId < 0) {
                attributes[attrName] = null;
                continue;
            };

            const attribute = decoder.GetAttribute(dracoGeometry, attrId);
            const numComponents = attribute.num_components();
            const numValues = numPoints * numComponents;
            const attributeData = new decoderModule.DracoFloat32Array();

            decoder.GetAttributeFloatForAllPoints(dracoGeometry, attribute, attributeData);

            assert(numValues === attributeData.size(), 'Wrong attribute size.');
            const array = new dracoAttributes[attrName].type(numValues);
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

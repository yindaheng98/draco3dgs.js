const assert = require('assert');
const createEncoderModule = require('./draco3d/draco_encoder');
const { dracoAttributesInfo } = require('./draco3d/attributes');

class DracoEncoder {
    #encoderModule;
    #attributeTypes;
    constructor(attributeTypes = {}) {
        this.#encoderModule = null;
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

    async #initialize() {
        if (!this.#encoderModule)
            this.#encoderModule = await createEncoderModule({});
        return this.#encoderModule;
    }

    async encode(geometry) {
        const { numPoints, attributes, numFaces, indices } = geometry;
        assert(numPoints > 0, 'Number of points must be greater than zero.');
        assert(attributes && typeof attributes === 'object', 'Attributes must be an object.');
        const encoderModule = await this.#initialize();

        const encoder = new encoderModule.Encoder();
        let builder = null;
        geometry = null;
        if (numFaces > 0) {
            builder = new encoderModule.MeshBuilder();
            geometry = new encoderModule.Mesh();
        } else {
            builder = new encoderModule.PointCloudBuilder();
            geometry = new encoderModule.PointCloud();
        }

        // Add attributes to mesh
        for (const attrName of Object.keys(this.#attributeTypes)) {
            if (!attributes[attrName]) continue;
            const attributeData = attributes[attrName];
            assert(attributeData instanceof this.#attributeTypes[attrName], 'Wrong attribute type.');
            const stride = dracoAttributesInfo[attrName].stride;
            const numValues = numPoints * stride;
            assert(numValues === attributeData.length, 'Wrong attribute size.');
            const encoderAttr = encoderModule[attrName];
            switch (this.#attributeTypes[attrName]) {
                case Float32Array:// this type has two different methods to add attributes
                    if (numFaces > 0) {
                        builder.AddFloatAttributeToMesh(geometry, encoderAttr, numPoints, stride, attributeData);
                    } else {
                        builder.AddFloatAttribute(geometry, encoderAttr, numPoints, stride, attributeData);
                    }
                    break;
                case Int8Array:
                    builder.AddInt8Attribute(geometry, encoderAttr, numPoints, stride, attributeData);
                    break;
                case Int16Array:
                    builder.AddInt16Attribute(geometry, encoderAttr, numPoints, stride, attributeData);
                    break;
                case Int32Array:// this type has two different methods to add attributes
                    if (numFaces > 0) {
                        builder.AddInt32AttributeToMesh(geometry, encoderAttr, numPoints, stride, attributeData);
                    } else {
                        builder.AddInt32Attribute(geometry, encoderAttr, numPoints, stride, attributeData);
                    }
                    break;
                // The following types has only one method to add attributes
                case Uint8Array:
                    builder.AddUInt8Attribute(geometry, encoderAttr, numPoints, stride, attributeData);
                    break;
                case Uint16Array:
                    builder.AddUInt16Attribute(geometry, encoderAttr, numPoints, stride, attributeData);
                    break;
                case Uint32Array:
                    builder.AddUInt32Attribute(geometry, encoderAttr, numPoints, stride, attributeData);
                    break;
                default:
                    throw new Error('Unsupported attribute type: ' + this.#attributeTypes[attrName]);
            }
        }

        // Add faces to mesh
        if (numFaces > 0) {
            assert(indices instanceof Uint32Array, 'Indices must be a Uint32Array');
            builder.AddFacesToMesh(geometry, numFaces, indices);
        }

        // Set encoding options
        this.#SetEncoder(encoder, encoderModule);

        // Encode
        const encodedData = new encoderModule.DracoInt8Array();
        let encodedLen = 0;
        if (numFaces > 0) {
            encodedLen = encoder.EncodeMeshToDracoBuffer(geometry, encodedData);
        } else {
            encodedLen = encoder.EncodePointCloudToDracoBuffer(geometry, encodedData);
        }

        if (encodedLen <= 0) {
            throw new Error('Encoding failed');
        }

        // Copy encoded data to buffer
        const outputBuffer = new ArrayBuffer(encodedLen);
        const outputData = new Int8Array(outputBuffer);
        for (let i = 0; i < encodedLen; ++i) {
            outputData[i] = encodedData.GetValue(i);
        }

        // Cleanup
        encoderModule.destroy(encodedData);
        encoderModule.destroy(encoder);
        encoderModule.destroy(builder);
        encoderModule.destroy(geometry);

        return outputBuffer;
    }

    #SetEncodingMethod = null;
    SetEncodingMethod(method) {
        this.#SetEncodingMethod = (encoder, encoderModule) => encoder.SetEncodingMethod(encoderModule[method]);
    }
    #SetAttributeQuantization = {};
    SetAttributeQuantization(attrName, quantization_bits) {
        assert(this.#attributeTypes[attrName], 'Attribute not supported: ' + attrName);
        this.#SetAttributeQuantization[attrName] = (encoder, encoderModule) => encoder.SetAttributeQuantization(encoderModule[attrName], quantization_bits);
    }
    #SetSpeedOptions = null;
    SetSpeedOptions(encoding_speed, decoding_speed) {
        this.#SetSpeedOptions = (encoder, encoderModule) => encoder.SetSpeedOptions(encoding_speed, decoding_speed);
    }
    #SetTrackEncodedProperties = null;
    SetTrackEncodedProperties(flag) {
        this.#SetTrackEncodedProperties = (encoder, encoderModule) => encoder.SetTrackEncodedProperties(flag);
    }
    #SetEncoder(encoder, encoderModule) {
        if (this.#SetEncodingMethod) this.#SetEncodingMethod(encoder, encoderModule);
        for (const call of Object.values(this.#SetAttributeQuantization)) call(encoder, encoderModule);
        if (this.#SetSpeedOptions) this.#SetSpeedOptions(encoder, encoderModule);
        if (this.#SetTrackEncodedProperties) this.#SetTrackEncodedProperties(encoder, encoderModule);
    }
}

module.exports = DracoEncoder;

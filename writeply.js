const fs = require('fs');
const { dracoAttributesInfo } = require('./draco3d');
const { assert } = require('console');

async function writeply(filename, data, types) {
    const { attributes, indices, numPoints, numFaces } = data;
    const isMesh = numFaces > 0 && indices !== null;

    // Prepare header
    let header = 'ply\n';
    header += 'format ascii 1.0\n';
    header += `element vertex ${numPoints}\n`;

    // Add vertex properties
    for (const [attrName, attrType] of Object.entries(types)) {
        if (!attributes[attrName]) continue;
        const attrData = attributes[attrName];
        assert(attrData instanceof attrType, `Wrong attribute type for ${attrName}`);
        assert(attrData.length / numPoints === dracoAttributesInfo[attrName].stride, `Wrong attribute size for ${attrName}`);
        let typeName = '';
        switch (attrType) {
            case Float32Array:
                typeName = 'float';
                break;
            case Uint8Array:
                typeName = 'uchar';
                break;
            case Uint16Array:
                typeName = 'ushort';
                break;
            case Uint32Array:
                typeName = 'uint';
                break;
            case Int8Array:
                typeName = 'char';
                break;
            case Int16Array:
                typeName = 'short';
                break;
            case Int32Array:
                typeName = 'int';
                break;
            default:
                throw new Error(`Unsupported attribute type: ${attrType}`);
        }
        switch (attrName) {
            case 'POSITION':
                assert(attrData instanceof Float32Array, 'Position attribute must be Float32Array');
                header += 'property ' + typeName + ' x\n';
                header += 'property ' + typeName + ' y\n';
                header += 'property ' + typeName + ' z\n';
                break;
            case 'NORMAL':
                assert(attrData instanceof Float32Array, 'Normal attribute must be Float32Array');
                header += 'property ' + typeName + ' nx\n';
                header += 'property ' + typeName + ' ny\n';
                header += 'property ' + typeName + ' nz\n';
                break;
            case 'COLOR':
                assert(attrData instanceof Uint8Array, 'Color attribute must be Uint8Array');
                header += 'property ' + typeName + ' red\n';
                header += 'property ' + typeName + ' green\n';
                header += 'property ' + typeName + ' blue\n';
                break;
            default:
                const numComponents = dracoAttributesInfo[attrName].stride;
                for (let i = 0; i < numComponents; i++) {
                    header += `property float ${attrName.toLowerCase()}_${i}\n`;
                }
        }
    }

    // Add face properties if it's a mesh
    if (isMesh) {
        header += `element face ${numFaces}\n`;
        header += 'property list uint8 uint32 vertex_indices\n';
    }

    header += 'end_header\n';

    // Write header
    await fs.promises.writeFile(filename, header);

    // Write vertex data
    const vertexData = [];
    for (let i = 0; i < numPoints; i++) {
        const vertex = [];
        for (const [attrName, attrData] of Object.entries(attributes)) {
            if (attrData === null) continue;
            const numComponents = dracoAttributesInfo[attrName].stride;
            for (let j = 0; j < numComponents; j++) {
                vertex.push(attrData[i * numComponents + j]);
            }
        }
        vertexData.push(vertex.join(' '));
    }
    await fs.promises.appendFile(filename, vertexData.join('\n') + '\n');

    // Write face data if it's a mesh
    if (isMesh) {
        const faceData = [];
        for (let i = 0; i < numFaces; i++) {
            const index = i * 3;
            faceData.push(`3 ${indices[index]} ${indices[index + 1]} ${indices[index + 2]}`);
        }
        await fs.promises.appendFile(filename, faceData.join('\n') + '\n');
    }
}

module.exports = writeply;

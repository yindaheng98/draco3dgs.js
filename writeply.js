const fs = require('fs');
const { attributes: attributeTypes } = require('./draco3d');
const { assert } = require('console');

async function writeply(filename, data) {
    const { attributes, indices, numPoints, numFaces } = data;
    const isMesh = numFaces > 0 && indices !== null;

    // Prepare header
    let header = 'ply\n';
    header += 'format ascii 1.0\n';
    header += `element vertex ${numPoints}\n`;

    // Add vertex properties
    for (const [attrName, attrData] of Object.entries(attributes)) {
        if (attrData === null) continue;
        assert(attrData instanceof attributeTypes[attrName].type, `Wrong attribute type for ${attrName}`);
        assert(attrData.length / numPoints === attributeTypes[attrName].stride, `Wrong attribute size for ${attrName}`);
        switch (attrName) {
            case 'POSITION':
                assert(attrData instanceof Float32Array, 'Position attribute must be Float32Array');
                header += 'property float x\n';
                header += 'property float y\n';
                header += 'property float z\n';
                break;
            case 'NORMAL':
                assert(attrData instanceof Float32Array, 'Normal attribute must be Float32Array');
                header += 'property float nx\n';
                header += 'property float ny\n';
                header += 'property float nz\n';
                break;
            case 'COLOR':
                assert(attrData instanceof Uint8Array, 'Color attribute must be Uint8Array');
                header += 'property uchar red\n';
                header += 'property uchar green\n';
                header += 'property uchar blue\n';
                break;
            default:
                const numComponents = attributeTypes[attrName].stride;
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
            const numComponents = attributeTypes[attrName].stride;
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

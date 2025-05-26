const fs = require('fs');
const { DracoEncoder, DracoDecoder, dracoAttributesInfo } = require('./draco3d');
const writeply = require('./writeply');

async function main() {
    try {
        // Read the input file
        const inputBuffer = await fs.promises.readFile('./flame_steak.drc');
        console.log("Input file size:", inputBuffer.byteLength, "bytes");

        // Decode the file
        const decoder = new DracoDecoder();
        const decodedData = await decoder.decode(inputBuffer);

        console.log("Decoded data:");
        console.log("Number of points:", decodedData.numPoints);
        console.log("Number of faces:", decodedData.numFaces);
        console.log("Available attributes:", Object.keys(decodedData.attributes));

        // Save decoded data to PLY file
        await writeply('./flame_steak.ply', decodedData, decoder.GetArrtibutesType());
        console.log("Decoded data saved as flame_steak.ply");

        // Encode the data back
        const encoder = new DracoEncoder();
        encoder.SetAttributeQuantization('POSITION', 10);
        encoder.SetSpeedOptions(10, 10);
        encoder.SetAttributeQuantization('SCALE_3DGS', 6);
        encoder.SetAttributeQuantization('ROTATION_3DGS', 6);
        encoder.SetAttributeQuantization('OPACITY_3DGS', 4);
        encoder.SetAttributeQuantization('FEATURE_DC_3DGS', 6);
        encoder.SetAttributeQuantization('FEATURE_REST_3DGS', 4);
        const colorType = decoder.GetArrtibutesType().COLOR;
        if (!decodedData.attributes.COLOR && colorType && typeof colorType.from === 'function') {
            decodedData.attributes.COLOR = colorType.from(Array.from({ length: dracoAttributesInfo.COLOR.stride * decodedData.numPoints }, () => Math.floor(Math.random() * 255)));
        }
        // decodedData.numFaces = 0;
        const encodedBuffer = await encoder.encode(decodedData);

        console.log("Encoded size:", encodedBuffer.byteLength, "bytes");

        // Write the encoded data to a file
        await fs.promises.writeFile('./flame_steak.drc', Buffer.from(encodedBuffer));
        console.log("Encoded file saved as flame_steak.drc");

    } catch (error) {
        console.error("Error:", error);
    }
}

main();

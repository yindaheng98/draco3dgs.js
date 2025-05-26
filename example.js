const fs = require('fs');
const { DracoEncoder, DracoDecoder, dracoAttributesInfo } = require('./draco3d');
const writeply = require('./writeply');

async function main() {
    try {
        // Read the input file
        const inputBuffer = await fs.promises.readFile('./bunny.drc');
        console.log("Input file size:", inputBuffer.byteLength, "bytes");

        // Decode the file
        const decoder = new DracoDecoder();
        const decodedData = await decoder.decode(inputBuffer);

        console.log("Decoded data:");
        console.log("Number of points:", decodedData.numPoints);
        console.log("Number of faces:", decodedData.numFaces);
        console.log("Available attributes:", Object.keys(decodedData.attributes));

        // Save decoded data to PLY file
        await writeply('./bunny.ply', decodedData, decoder.GetArrtibutesType());
        console.log("Decoded data saved as bunny.ply");

        // Encode the data back
        const encoder = new DracoEncoder();
        encoder.SetAttributeQuantization('POSITION', 10);
        encoder.SetSpeedOptions(5, 5);
        encoder.SetAttributeQuantization('COLOR', 8);
        const colorType = decoder.GetArrtibutesType().COLOR;
        if (!decodedData.attributes.COLOR && colorType && typeof colorType.from === 'function') {
            decodedData.attributes.COLOR = colorType.from(Array.from({ length: dracoAttributesInfo.COLOR.stride * decodedData.numPoints }, () => Math.floor(Math.random() * 255)));
        }
        // decodedData.numFaces = 0;
        const encodedBuffer = await encoder.encode(decodedData);

        console.log("Encoded size:", encodedBuffer.byteLength, "bytes");

        // Write the encoded data to a file
        await fs.promises.writeFile('./bunny.drc', Buffer.from(encodedBuffer));
        console.log("Encoded file saved as bunny.drc");

    } catch (error) {
        console.error("Error:", error);
    }
}

main();

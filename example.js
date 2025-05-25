const fs = require('fs');
const DracoEncoder = require('./draco3d/encoder');
const DracoDecoder = require('./draco3d/decoder');

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

        // Encode the data back
        const encoder = new DracoEncoder();
        const encodedBuffer = await encoder.encode(
            decodedData.numPoints,
            decodedData.attributes,
            decodedData.numFaces,
            decodedData.indices,
        );

        console.log("Encoded size:", encodedBuffer.byteLength, "bytes");

        // Write the encoded data to a file
        await fs.promises.writeFile('./bunny_encoded.drc', Buffer.from(encodedBuffer));
        console.log("Encoded file saved as bunny_encoded.drc");

    } catch (error) {
        console.error("Error:", error);
    }
}

main();

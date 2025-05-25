# JavaScript Wrapper and Typescript type definition for Draco

## Install `emsdk`

### Linux

```sh
cd ./submodules/emsdk && ./emsdk install latest && ./emsdk activate latest && source ./emsdk_env.sh && cd ../../
```

### Windows

```sh
cd ./submodules/emsdk && emsdk.bat install latest && emsdk.bat activate latest && emsdk_env.bat && cd ../../
```

## Build WASM

```sh
git submodule update --init --recursive
mkdir -p build && cd build
export EMSCRIPTEN="../submodules/emsdk/upstream/emscripten"
cmake ../submodules/draco -DCMAKE_TOOLCHAIN_FILE=../submodules/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DDRACO_WASM=ON
make
cd ../
```

Link WASM

```sh
mkdir -p draco3d
cp build/draco_encoder.js build/draco_encoder.wasm draco3d/draco3d
cp build/draco_decoder.js build/draco_decoder.wasm draco3d/draco3d
```

## Build Executable (Optional)

```sh
git submodule update --init --recursive
mkdir -p build && cd build
cmake ../submodules/draco
cmake --build . --config Release --target draco_encoder
cmake --build . --config Release --target draco_decoder
cd ../
```

## Test Codec

```sh
npm run test
npm run test # run this twice you should get a same bunny.drc
```
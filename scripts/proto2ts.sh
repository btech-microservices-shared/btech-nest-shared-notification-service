#!/bin/bash

OUT_DIR="src/application/interfaces"

TS_PROTO_OPTS="nestJs=true --experimental_allow_proto3_optional"

PLUGIN_PATH="./node_modules/.bin/protoc-gen-ts_proto"

PROTO_FILES=("$@")

if [ ${#PROTO_FILES[@]} -eq 0 ]; then
  echo "No proto files found"
  exit 0
fi

if [ ! -d "$OUT_DIR" ]; then
  mkdir -p "$OUT_DIR"
fi

protoc \
    --plugin="$PLUGIN" \
    --ts_proto_out="$OUT_DIR" \
    --ts_proto_opt="$TS_PROTO_OPTS" \
    "${PROTO_FILES[@]}"

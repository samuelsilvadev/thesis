#!/usr/bin/env bash
set -e

./bin/dev-api.sh & API_PID=$!
./bin/dev-fe.sh & FE_PID=$!

trap 'kill $API_PID $FE_PID' EXIT

wait
#!/usr/bin/env bash
set -e

echo "Starting frontend development server..."

cd frontend
echo Running from: $PWD

echo "Installing dependencies..."
npm install

echo "Running server..."
npm run dev
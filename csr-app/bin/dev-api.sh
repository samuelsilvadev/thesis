#!/usr/bin/env bash
set -e

echo "Starting API development server..."

cd backend
echo Running from: $PWD

echo "Installing dependencies..."
uv sync --active

echo "Running server..."
uv run uvicorn app.main:app --reload
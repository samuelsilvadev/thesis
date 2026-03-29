#!/usr/bin/env bash
set -e

echo "Starting development server..."
echo Running from: $PWD

echo "Installing dependencies..."
uv sync

echo "Migrating database..."
uv run python manage.py migrate

echo "Running server..."
uv run python manage.py runserver
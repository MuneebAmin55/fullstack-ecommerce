#!/usr/bin/env bash
set -o errexit

echo "==> Python version: $(python --version)"
pip install -r requirements.txt

# Ensure media directory exists and copy legacy images from static/images
mkdir -p media
cp -n static/images/* media/ 2>/dev/null || true

python manage.py collectstatic --no-input
python manage.py migrate --noinput

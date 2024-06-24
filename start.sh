#!/bin/bash

# Start Flask app in the background
gunicorn --bind 0.0.0.0:8000 app:app &

# Start React/Vite server
cd /var/www/react-vite
npm start

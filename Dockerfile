# Dockerfile for React
# FROM node:16-alpine

# WORKDIR /app

# COPY react-vite/package.json react-vite/package-lock.json ./

# RUN npm install

# COPY react-vite ./

# EXPOSE 3000

# CMD ["npm", "start"]


# Stage 1: Build React App
FROM node:16-alpine AS react-build

WORKDIR /app

COPY react-vite/package.json react-vite/package-lock.json ./

RUN npm install

COPY react-vite ./

RUN npm run build

# Stage 2: Set up Flask App
FROM python:3.9.18-alpine3.18

# Install necessary packages
RUN apk add build-base postgresql-dev gcc python3-dev musl-dev

# Set environment variables
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

# Set working directory
WORKDIR /var/www

# Copy and install Python dependencies
COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

# Copy Flask app source code
COPY . .

# Copy React build artifacts to a directory Flask can serve
COPY --from=react-build /app/dist /var/www/static/react

# Expose necessary ports
EXPOSE 3000
EXPOSE 8000

# Start Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]

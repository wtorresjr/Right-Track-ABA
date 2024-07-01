
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
ARG FLASK_DEBUG
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



# Stage 1: Build React app
# FROM node:18.19.0 AS react-build
# WORKDIR /app
# COPY react-vite/package.json react-vite/package-lock.json ./
# RUN npm install
# COPY react-vite ./
# RUN npm run build

# # Stage 2: Set up Flask App
# FROM python:3.9-slim-buster

# # Install necessary packages
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libpq-dev \
#     python3-dev \
#     gcc \
#     curl \
#     && rm -rf /var/lib/apt/lists/*

# # Install Node.js and npm
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
#     apt-get install -y nodejs

# # Set environment variables
# ARG FLASK_APP
# ARG FLASK_DEBUG
# ARG DATABASE_URL
# ARG SCHEMA
# ARG SECRET_KEY

# # Set working directory
# WORKDIR /var/www

# # Copy and install Python dependencies
# COPY requirements.txt .
# RUN pip install --upgrade pip && \
#     pip install -r requirements.txt && \
#     pip install psycopg2

# # Copy Flask app source code
# COPY . .

# # Copy React build artifacts to a directory Flask can serve
# COPY --from=react-build /app/dist /var/www/static/react

# # Expose necessary ports
# EXPOSE 3000
# EXPOSE 8000


# # Start Flask app
# # CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]

# # Copy startup script
# COPY start.sh /start.sh

# # # Make startup script executable
# RUN chmod +x /start.sh

# # # Set CMD to run the startup script
# CMD ["/start.sh"]




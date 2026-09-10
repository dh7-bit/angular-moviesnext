FROM php:8.5-cli

WORKDIR /var/www

# Install system dependencies and SQLite extension
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

# Copy Composer binary from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 1. Copy Composer configuration files first
COPY composer.json composer.lock ./

# 2. Copy the rest of the project
COPY . .

# 3. Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
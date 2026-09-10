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

# 1. Copy composer configuration files first
COPY composer.json composer.lock ./

# 2. Copy the rest of your project files (including artisan!) BEFORE running composer install
COPY . .

# 3. Now composer install can successfully run package discovery using artisan
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 4. Clear and optimize caches
RUN php artisan optimize:clear

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
FROM php:8.2-fpm-alpine

# تثبيت الإضافات المطلوبة لـ Laravel
RUN apk add --no-cache libpng-dev libjpeg-turbo-dev freetype-dev zip libzip-dev unzip git mariadb-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip exif

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .
RUN composer install --no-dev --optimize-autoloader

CMD ["php-fpm"]

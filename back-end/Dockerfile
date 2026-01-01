FROM php:8.2-apache

# تثبيت إضافات PHP للتعامل مع MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# نسخ كل ملفات الباك-إيند للسيرفر داخل الحاوية
COPY . /var/www/html/

# تفعيل موديل الـ Rewrite عشان الـ URLs تشتغل صح
RUN a2enmod rewrite

# ضبط الصلاحيات للملفات
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
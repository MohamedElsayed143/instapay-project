-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS instapay;
USE instapay;

-- 1. جدول المستخدمين (Users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `balance` decimal(10,2) DEFAULT 5000.00,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. جدول الفواتير (Bill Payments)
CREATE TABLE IF NOT EXISTS `bill_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `service_type` varchar(50) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. جدول طلبات الدفع (Payment Requests)
CREATE TABLE IF NOT EXISTS `payment_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requester_id` int(11) NOT NULL,
  `payer_phone` varchar(15) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. جدول المعاملات (Transactions)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `receiver_phone` varchar(15) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `service_name` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `account_reference` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. جدول الإشعارات (Notifications)
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'transaction',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `request_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 28, 2025 at 08:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `instapay`
--

-- --------------------------------------------------------

--
-- Table structure for table `bill_payments`
--

CREATE TABLE `bill_payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `service_type` enum('electricity','water','mobile','internet') NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `bill_payments`:
--   `user_id`
--       `users` -> `id`
--

--
-- Dumping data for table `bill_payments`
--

INSERT INTO `bill_payments` (`id`, `user_id`, `service_type`, `account_number`, `amount`, `payment_date`) VALUES
(9, 2, 'electricity', '01032886679', 50.00, '2025-12-21 09:54:51'),
(12, 2, '', '01025299107', 50.00, '2025-12-21 10:04:20'),
(13, 2, 'electricity', '0102525444', 50.00, '2025-12-21 10:14:37'),
(14, 2, 'electricity', '01012345688', 1.00, '2025-12-21 10:18:00'),
(15, 2, 'electricity', '0102524554', 1.00, '2025-12-21 10:24:47'),
(16, 2, 'electricity', '01025555', 20.00, '2025-12-21 10:30:10'),
(17, 1, 'mobile', '010245789522', 50.00, '2025-12-21 10:35:15'),
(18, 1, 'electricity', '01024578852', 50.00, '2025-12-21 10:35:32'),
(19, 1, 'internet', '01023546789', 50.00, '2025-12-21 10:35:47'),
(20, 2, 'electricity', '01024578855', 78.00, '2025-12-21 10:36:26'),
(21, 2, 'water', '010124566666', 50.00, '2025-12-21 10:36:50'),
(22, 2, 'water', '0102457888', 10.00, '2025-12-21 10:39:20'),
(23, 2, 'water', '012144577557', 10.00, '2025-12-21 10:40:10'),
(24, 2, 'water', '01024555', 10.00, '2025-12-21 10:41:21'),
(25, 2, 'electricity', '01024555', 10.00, '2025-12-21 10:44:20'),
(26, 2, 'mobile', '0100222222', 10.00, '2025-12-21 10:45:18'),
(27, 1, 'electricity', '0102455678', 10.00, '2025-12-21 10:49:57'),
(28, 2, 'electricity', '01024567778', 10.00, '2025-12-21 10:55:50'),
(29, 2, 'electricity', '010555555', 10.00, '2025-12-21 10:56:34'),
(30, 2, 'electricity', '01025', 10.00, '2025-12-21 15:10:06'),
(31, 2, 'electricity', '01025244455', 100.00, '2025-12-21 15:55:47');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'transaction',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `request_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `notifications`:
--   `request_id`
--       `payment_requests` -> `id`
--   `user_id`
--       `users` -> `id`
--

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `description`, `amount`, `type`, `is_read`, `created_at`, `request_id`) VALUES
(1, 2, 'Money Sent', 'Amount transferred:  1000 ج.م إلى faten', '-1000', 'transaction', 1, '2025-12-19 09:55:48', NULL),
(2, 1, 'Payment Received', 'You received:  1000 ج.م من mohamed sayed', '+1000', 'transaction', 1, '2025-12-19 09:55:48', NULL),
(3, 1, 'Money Sent', 'Amount transferred:  500 ج.م إلى mohamed sayed', '-500', 'transaction', 1, '2025-12-19 10:28:40', NULL),
(4, 2, 'Payment Received', 'You received:  500 ج.م من faten', '+500', 'transaction', 1, '2025-12-19 10:28:40', NULL),
(5, 2, 'Money Sent', 'Amount transferred:  1000 ج.م إلى faten', '-1000', 'transaction', 1, '2025-12-19 10:33:44', NULL),
(6, 1, 'Payment Received', 'You received:  1000 ج.م من mohamed sayed', '+1000', 'transaction', 1, '2025-12-19 10:33:44', NULL),
(7, 1, 'Money Sent', 'Amount transferred:  1000 ج.م إلى mohamed sayed', '-1000', 'transaction', 1, '2025-12-19 10:40:21', NULL),
(8, 2, 'Payment Received', 'You received:  1000 ج.م من faten', '+1000', 'transaction', 1, '2025-12-19 10:40:21', NULL),
(9, 2, 'Money Sent', 'Amount transferred:  500 ج.م إلى faten', '-500', 'transaction', 1, '2025-12-19 11:24:45', NULL),
(10, 1, 'Payment Received', 'You received:  500 ج.م من mohamed sayed', '+500', 'transaction', 1, '2025-12-19 11:24:45', NULL),
(11, 2, 'Money Sent', 'Amount transferred:  500 ج.م إلى faten', '-500', 'transaction', 1, '2025-12-19 11:32:26', NULL),
(12, 1, 'Payment Received', 'You received:  500 ج.م من mohamed sayed', '+500', 'transaction', 1, '2025-12-19 11:32:26', NULL),
(13, 2, 'Money Sent', 'Amount transferred:  500 ج.م إلى faten', '-500', 'transaction', 1, '2025-12-19 11:35:09', NULL),
(14, 1, 'Payment Received', 'You received:  500 ج.م من mohamed sayed', '+500', 'transaction', 1, '2025-12-19 11:35:09', NULL),
(15, 1, 'Money Sent', 'Amount transferred:  1000 ج.م إلى mohamed sayed', '-1000', 'transaction', 1, '2025-12-19 11:43:36', NULL),
(16, 2, 'Payment Received', 'You received:  1000 ج.م من faten', '+1000', 'transaction', 1, '2025-12-19 11:43:36', NULL),
(17, 1, 'Money Sent', 'Amount transferred:  500 ج.م إلى mohamed sayed', '-500', 'transaction', 1, '2025-12-19 11:51:32', NULL),
(18, 2, 'Payment Received', 'You received:  500 ج.م من faten', '+500', 'transaction', 1, '2025-12-19 11:51:32', NULL),
(19, 2, 'Money Sent', 'Amount transferred:  500 ج.م إلى faten', '-500', 'transaction', 1, '2025-12-19 12:30:10', NULL),
(20, 1, 'Payment Received', 'You received:  500 ج.م من mohamed sayed', '+500', 'transaction', 1, '2025-12-19 12:30:10', NULL),
(21, 1, 'Money Sent', 'Amount transferred:  1000 ج.م إلى mohamed sayed', '-1000', 'transaction', 1, '2025-12-19 12:34:44', NULL),
(22, 2, 'Payment Received', 'You received:  1000 ج.م من faten', '+1000', 'transaction', 1, '2025-12-19 12:34:44', NULL),
(23, 1, 'Money Sent', 'Amount transferred:  1000 ج.م إلى mohamed sayed', '-1000', 'transaction', 1, '2025-12-19 12:45:01', NULL),
(24, 2, 'Payment Received', 'You received:  1000 ج.م من faten', '+1000', 'transaction', 1, '2025-12-19 12:45:01', NULL),
(25, 2, 'Payment Request', 'User (01025299107) is requesting 500 EGP from you.', '500', 'payment_request', 1, '2025-12-19 18:15:26', 2),
(26, 1, 'Payment Request', 'User (01032886679) is requesting 500 EGP from you.', '500', 'payment_request', 1, '2025-12-19 18:20:44', 3),
(27, 1, 'Payment Request', 'User (01032886679) is requesting 500 EGP from you.', '500', 'payment_request', 1, '2025-12-19 18:25:53', 4),
(28, 2, 'Payment Received', 'Accepted your request and sent 500.00 EGP.', '500.00', 'received_funds', 1, '2025-12-19 18:34:05', NULL),
(29, 1, 'Payment Sent', 'You paid 500.00 EGP successfully.', '500.00', 'sent_funds', 1, '2025-12-19 18:34:05', NULL),
(30, 2, 'Request Rejected', 'Rejected your payment request of 500.00 EGP.', '500.00', 'payment_rejected', 1, '2025-12-19 18:34:09', NULL),
(31, 2, 'Payment Request', 'User (01025299107) is requesting 500 EGP from you.', '500', 'payment_request', 1, '2025-12-19 18:38:27', 5),
(32, 1, 'Request Rejected', 'Rejected your payment request of 500.00 EGP.', '500.00', 'payment_rejected', 1, '2025-12-19 18:38:53', 2),
(33, 1, 'Payment Received', 'Accepted your request and sent 500.00 EGP.', '500.00', 'received_funds', 1, '2025-12-19 18:38:55', 5),
(34, 2, 'Payment Sent', 'You paid 500.00 EGP successfully.', '500.00', 'sent_funds', 1, '2025-12-19 18:38:55', 5),
(35, 2, 'Payment Request', 'User (01025299107) is requesting 500 EGP from you.', '500', 'payment_request', 1, '2025-12-19 18:40:49', 6),
(36, 1, 'Request Rejected', 'Rejected your payment request of 500.00 EGP.', '500.00', 'payment_rejected', 1, '2025-12-19 18:41:38', 6),
(37, 2, 'Money Sent', 'Amount transferred:  500 ج.م إلى faten', '-500', 'payment_sent', 1, '2025-12-19 18:42:09', NULL),
(38, 1, 'Payment Received', 'You received:  500 ج.م من mohamed sayed', '+500', 'payment_received', 1, '2025-12-19 18:42:09', NULL),
(39, 2, 'Money Sent', 'Amount transferred:  500 ج.م إلى faten', '-500', 'payment_sent', 1, '2025-12-19 18:45:31', NULL),
(40, 1, 'Payment Received', 'You received:  500 ج.م من mohamed sayed', '+500', 'payment_received', 1, '2025-12-19 18:45:31', NULL),
(41, 1, 'Money Sent', 'You transferred 500 EGP to mohamed sayed', '500', 'sent_funds', 1, '2025-12-19 18:53:58', NULL),
(42, 2, 'Money Received', 'You received 500 EGP from faten', '500', 'received_funds', 1, '2025-12-19 18:53:58', NULL),
(43, 2, 'Payment Request', 'User (01025299107) is requesting 1000 EGP from you.', '1000', 'payment_request', 1, '2025-12-19 18:54:26', 7),
(44, 1, 'Payment Received', 'Accepted your request and sent 1000.00 EGP.', '1000.00', 'received_funds', 1, '2025-12-19 18:55:07', 7),
(45, 2, 'Payment Sent', 'You paid 1000.00 EGP successfully.', '1000.00', 'sent_funds', 1, '2025-12-19 18:55:07', 7),
(46, 2, 'Money Sent', 'You transferred 500 EGP to faten', '500', 'sent_funds', 1, '2025-12-19 19:00:57', NULL),
(47, 1, 'Money Received', 'You received 500 EGP from mohamed sayed', '500', 'received_funds', 1, '2025-12-19 19:00:57', NULL),
(48, 1, 'Money Sent', 'You transferred 1000 EGP to mohamed sayed', '1000', 'sent_funds', 1, '2025-12-19 19:01:36', NULL),
(49, 2, 'Money Received', 'You received 1000 EGP from faten', '1000', 'received_funds', 1, '2025-12-19 19:01:36', NULL),
(50, 1, 'Payment Request', 'User (01032886679) is requesting 500 EGP from you.', '500', 'payment_request', 1, '2025-12-19 19:02:28', 8),
(51, 2, 'Payment Received', 'Accepted your request and sent 500.00 EGP.', '500.00', 'received_funds', 1, '2025-12-19 19:03:11', 8),
(52, 1, 'Payment Sent', 'You paid 500.00 EGP successfully.', '500.00', 'sent_funds', 1, '2025-12-19 19:03:11', 8),
(54, 1, 'Money Received', 'You received 1000 EGP from dina', '1000', 'received_funds', 1, '2025-12-19 20:41:06', NULL),
(55, 1, 'Payment Request', 'User (01026445387) is requesting 1000 EGP from you.', '1000', 'payment_request', 1, '2025-12-19 20:42:15', NULL),
(57, 1, 'Payment Sent', 'You paid 1000.00 EGP successfully.', '1000.00', 'sent_funds', 1, '2025-12-19 20:43:06', NULL),
(59, 1, 'Money Received', 'You received 500 EGP from dina', '500', 'received_funds', 1, '2025-12-19 20:59:40', NULL),
(61, 1, 'Payment Received', 'Accepted your request and sent 1000.00 EGP.', '1000.00', 'received_funds', 1, '2025-12-19 21:02:24', 10),
(63, 2, 'Money Sent', 'You transferred 500 EGP to faten', '500', 'sent_funds', 1, '2025-12-20 10:54:03', NULL),
(64, 1, 'Money Received', 'You received 500 EGP from mohamed elsayed', '500', 'received_funds', 1, '2025-12-20 10:54:03', NULL),
(65, 2, 'Money Sent', 'You transferred 50 EGP to faten', '50', 'sent_funds', 1, '2025-12-20 12:22:39', NULL),
(66, 1, 'Money Received', 'You received 50 EGP from mohamed elsayed', '50', 'received_funds', 1, '2025-12-20 12:22:39', NULL),
(67, 1, 'Payment Request', 'User (01032886679) is requesting 50 EGP from you.', '50', 'payment_request', 1, '2025-12-20 12:22:55', 11),
(68, 2, 'Money Sent', 'You transferred 50 EGP to faten', '50', 'sent_funds', 1, '2025-12-20 12:25:28', NULL),
(69, 1, 'Money Received', 'You received 50 EGP from mohamed elsayed', '50', 'received_funds', 1, '2025-12-20 12:25:28', NULL),
(70, 2, 'Money Sent', 'You transferred 50 EGP to faten', '50', 'sent_funds', 1, '2025-12-20 12:28:56', NULL),
(71, 1, 'Money Received', 'You received 50 EGP from mohamed elsayed', '50', 'received_funds', 1, '2025-12-20 12:28:56', NULL),
(72, 2, 'Money Sent', 'You transferred 100 EGP to dina', '100', 'sent_funds', 1, '2025-12-20 12:34:46', NULL),
(74, 1, 'Payment Request', 'User (01098945982) is requesting 500 EGP from you.', '500', 'payment_request', 1, '2025-12-20 14:59:59', NULL),
(76, 2, 'Money Sent', 'Sent to faten mohamed', '50', 'sent_funds', 1, '2025-12-20 15:19:22', NULL),
(77, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-20 15:19:22', NULL),
(78, 2, 'Money Sent', 'Sent to faten mohamed', '100', 'sent_funds', 1, '2025-12-20 15:41:14', NULL),
(79, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-20 15:41:14', NULL),
(80, 1, 'Payment Request', 'User (01032886679) is requesting 100 EGP from you.', '100', 'payment_request', 1, '2025-12-20 15:42:22', 13),
(81, 2, 'Payment Received', 'Received 100.00 EGP from your request', '100.00', 'received_funds', 1, '2025-12-20 16:20:45', 13),
(82, 1, 'Payment Sent', 'Paid request of 100.00 EGP successfully', '100.00', 'sent_funds', 1, '2025-12-20 16:20:45', 13),
(83, 1, 'Money Sent', 'Sent to mohamed elsayed', '150', 'sent_funds', 1, '2025-12-20 16:21:18', NULL),
(84, 2, 'Money Received', 'Received from faten mohamed', '150', 'received_funds', 1, '2025-12-20 16:21:18', NULL),
(85, 2, 'Payment Request', 'User (01025299107) is requesting 100 EGP from you.', '100', 'payment_request', 1, '2025-12-20 16:22:15', 14),
(86, 2, 'Payment Request', 'User (01025299107) is requesting 100 EGP from you.', '100', 'payment_request', 1, '2025-12-20 16:22:36', 15),
(87, 1, 'Payment Received', 'Received 100.00 EGP from your request', '100.00', 'received_funds', 1, '2025-12-20 16:23:15', 15),
(88, 2, 'Payment Sent', 'Paid request of 100.00 EGP successfully', '100.00', 'sent_funds', 1, '2025-12-20 16:23:15', 15),
(89, 1, 'Request Rejected', 'Your request for 100.00 EGP was rejected', '100.00', 'payment_rejected', 1, '2025-12-20 16:23:17', 14),
(90, 2, 'Money Sent', 'Sent to faten mohamed', '100', 'sent_funds', 1, '2025-12-20 16:25:01', NULL),
(91, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-20 16:25:01', NULL),
(92, 2, 'Money Sent', 'Sent to faten mohamed', '100', 'sent_funds', 1, '2025-12-20 16:41:43', NULL),
(93, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-20 16:41:43', NULL),
(94, 2, 'Money Sent', 'Sent to faten mohamed', '100', 'sent_funds', 1, '2025-12-20 16:51:34', NULL),
(95, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-20 16:51:34', NULL),
(96, 1, 'Payment Request', 'User (01032886679) is requesting 100 EGP from you.', '100', 'payment_request', 1, '2025-12-20 16:52:06', 16),
(97, 2, 'Money Sent', 'Sent to faten mohamed', '50', 'sent_funds', 1, '2025-12-20 16:52:35', NULL),
(98, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-20 16:52:35', NULL),
(99, 2, 'Money Sent', 'Sent to faten mohamed', '100', 'sent_funds', 1, '2025-12-20 16:58:46', NULL),
(100, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-20 16:58:46', NULL),
(101, 2, 'Money Sent', 'Sent to faten mohamed', '200', 'sent_funds', 1, '2025-12-20 17:01:01', NULL),
(102, 1, 'Money Received', 'Received from mohamed elsayed', '200', 'received_funds', 1, '2025-12-20 17:01:01', NULL),
(103, 2, 'Money Sent', 'Sent to faten mohamed', '100', 'sent_funds', 1, '2025-12-21 09:55:31', NULL),
(104, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-21 09:55:31', NULL),
(105, 2, 'Money Sent', 'Sent to faten mohamed', '50', 'sent_funds', 1, '2025-12-21 10:03:27', NULL),
(106, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 10:03:27', NULL),
(107, 2, 'Money Sent', 'Sent to faten mohamed', '50', 'sent_funds', 1, '2025-12-21 10:04:20', NULL),
(108, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 10:04:20', NULL),
(109, 2, 'Money Sent', 'Sent to faten mohamed', '50', 'sent_funds', 1, '2025-12-21 10:14:17', NULL),
(110, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 10:14:17', NULL),
(111, 2, 'Money Sent', 'Sent to faten mohamed', '20', 'sent_funds', 1, '2025-12-21 10:15:13', NULL),
(112, 1, 'Money Received', 'Received from mohamed elsayed', '20', 'received_funds', 1, '2025-12-21 10:15:13', NULL),
(113, 2, 'Money Sent', 'Sent to faten mohamed', '50', 'sent_funds', 1, '2025-12-21 10:17:31', NULL),
(114, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 10:17:31', NULL),
(115, 2, 'Money Sent', 'Sent to faten mohamed', '29', 'sent_funds', 1, '2025-12-21 10:21:28', NULL),
(116, 1, 'Money Received', 'Received from mohamed elsayed', '29', 'received_funds', 1, '2025-12-21 10:21:28', NULL),
(117, 2, 'Money Sent', 'Sent to faten mohamed', '20', 'sent_funds', 1, '2025-12-21 10:30:28', NULL),
(118, 1, 'Money Received', 'Received from mohamed elsayed', '20', 'received_funds', 1, '2025-12-21 10:30:28', NULL),
(119, 1, 'Payment Request', 'User (01032886679) is requesting 1000 EGP from you.', '1000', 'payment_request', 1, '2025-12-21 10:31:58', 17),
(120, 2, 'Payment Received', 'Received 1000.00 EGP from your request', '1000.00', 'received_funds', 1, '2025-12-21 10:32:25', 17),
(121, 1, 'Payment Sent', 'Paid request of 1000.00 EGP successfully', '1000.00', 'sent_funds', 1, '2025-12-21 10:32:25', 17),
(122, 2, 'Request Rejected', 'Your request for 100.00 EGP was rejected', '100.00', 'payment_rejected', 1, '2025-12-21 10:32:48', 16),
(123, 2, 'Payment Received', 'Received 50.00 EGP from your request', '50.00', 'received_funds', 1, '2025-12-21 10:32:54', 11),
(124, 1, 'Payment Sent', 'Paid request of 50.00 EGP successfully', '50.00', 'sent_funds', 1, '2025-12-21 10:32:54', 11),
(125, 1, 'Money Sent', 'Sent to mohamed elsayed', '469', 'sent_funds', 1, '2025-12-21 10:34:00', NULL),
(126, 2, 'Money Received', 'Received from faten mohamed', '469', 'received_funds', 1, '2025-12-21 10:34:00', NULL),
(127, 2, 'Money Sent', 'Sent to faten', '50', 'sent_funds', 1, '2025-12-21 10:44:37', NULL),
(128, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 10:44:37', NULL),
(129, 2, 'Money Sent', 'Sent to faten', '10', 'sent_funds', 1, '2025-12-21 10:48:50', NULL),
(130, 1, 'Money Received', 'Received from mohamed elsayed', '10', 'received_funds', 1, '2025-12-21 10:48:50', NULL),
(131, 1, 'Payment Request', 'User (01032886679) is requesting 500 EGP from you.', '500', 'payment_request', 1, '2025-12-21 10:49:01', 18),
(132, 2, 'Payment Received', 'Received 500.00 EGP from your request', '500.00', 'received_funds', 1, '2025-12-21 10:49:43', 18),
(133, 1, 'Payment Sent', 'Paid request of 500.00 EGP successfully', '500.00', 'sent_funds', 1, '2025-12-21 10:49:43', 18),
(134, 1, 'Money Sent', 'Sent to mohamed elsayed', '30', 'sent_funds', 1, '2025-12-21 10:50:11', NULL),
(135, 2, 'Money Received', 'Received from faten', '30', 'received_funds', 1, '2025-12-21 10:50:11', NULL),
(136, 2, 'Money Sent', 'Sent to faten', '50', 'sent_funds', 1, '2025-12-21 14:55:11', NULL),
(137, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 14:55:11', NULL),
(138, 2, 'Money Sent', 'Sent to faten', '50', 'sent_funds', 1, '2025-12-21 15:16:25', NULL),
(139, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 15:16:25', NULL),
(140, 1, 'Payment Request', 'User (01032886679) is requesting 200 EGP from you.', '200', 'payment_request', 1, '2025-12-21 15:16:38', 19),
(141, 2, 'Payment Received', 'Received 200.00 EGP from your request', '200.00', 'received_funds', 1, '2025-12-21 15:17:16', 19),
(142, 1, 'Payment Sent', 'Paid request of 200.00 EGP successfully', '200.00', 'sent_funds', 1, '2025-12-21 15:17:16', 19),
(143, 2, 'Money Sent', 'Sent to faten', '100', 'sent_funds', 1, '2025-12-21 15:50:21', NULL),
(144, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-21 15:50:21', NULL),
(145, 2, 'Money Sent', 'Sent to faten', '50', 'sent_funds', 1, '2025-12-21 17:01:09', NULL),
(146, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 17:01:09', NULL),
(147, 2, 'Money Sent', 'Sent to dina', '50', 'sent_funds', 1, '2025-12-21 17:06:42', NULL),
(149, 1, 'Payment Request', 'User (01032886679) is requesting 200 EGP from you.', '200', 'payment_request', 1, '2025-12-21 17:19:36', 20),
(150, 2, 'Payment Received', 'Received 200.00 EGP from your request', '200.00', 'received_funds', 1, '2025-12-21 17:20:10', 20),
(151, 1, 'Payment Sent', 'Paid request of 200.00 EGP successfully', '200.00', 'sent_funds', 1, '2025-12-21 17:20:10', 20),
(153, 2, 'Money Received', 'Received from ahmed', '100', 'received_funds', 1, '2025-12-21 17:23:19', NULL),
(154, 2, 'Payment Request', 'User (01098945982) is requesting 50 EGP from you.', '50', 'payment_request', 1, '2025-12-21 17:23:56', NULL),
(156, 2, 'Money Sent', 'Sent to faten', '10', 'sent_funds', 1, '2025-12-21 20:33:56', NULL),
(157, 1, 'Money Received', 'Received from mohamed elsayed', '10', 'received_funds', 1, '2025-12-21 20:33:56', NULL),
(158, 1, 'Payment Request', 'New money request received', '500', 'payment_request', 1, '2025-12-21 20:44:24', 22),
(159, 2, 'Payment Received', 'You received a payment', '500.00', 'received_funds', 1, '2025-12-21 20:45:16', NULL),
(160, 2, 'Money Sent', 'Sent to faten', '100', 'sent_funds', 1, '2025-12-21 21:14:40', NULL),
(161, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-21 21:14:40', NULL),
(162, 2, 'Money Sent', 'Sent to faten', '50', 'sent_funds', 1, '2025-12-21 21:15:04', NULL),
(163, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-21 21:15:04', NULL),
(164, 1, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-21 21:16:07', 23),
(165, 2, 'Payment Received', 'You received a payment', '100.00', 'received_funds', 1, '2025-12-21 21:16:24', NULL),
(167, 2, 'Money Received', 'Received from ali', '100', 'received_funds', 1, '2025-12-22 09:32:12', NULL),
(168, 2, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-22 09:32:33', NULL),
(170, 2, 'Money Sent', 'Sent to faten', '100', 'sent_funds', 1, '2025-12-22 11:31:28', NULL),
(171, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-22 11:31:28', NULL),
(172, 1, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-22 11:32:03', 25),
(173, 2, 'Payment Received', 'You received a payment', '100.00', 'received_funds', 1, '2025-12-22 11:34:01', NULL),
(174, 1, 'Payment Request', 'New money request received', '50', 'payment_request', 1, '2025-12-22 16:01:16', 26),
(175, 2, 'Payment Received', 'You received a payment', '50.00', 'received_funds', 1, '2025-12-22 16:03:05', NULL),
(176, 2, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-22 16:03:20', 27),
(177, 1, 'Money Sent', 'Sent to mohamed elsayed', '50', 'sent_funds', 1, '2025-12-22 16:04:54', NULL),
(178, 2, 'Money Received', 'Received from faten', '50', 'received_funds', 1, '2025-12-22 16:04:54', NULL),
(179, 1, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-22 16:05:48', 28),
(180, 1, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-22 16:14:14', 29),
(181, 2, 'Payment Received', 'You received a payment', '100.00', 'received_funds', 1, '2025-12-22 16:14:26', NULL),
(183, 2, 'Money Received', 'Received from ahmed ', '1000', 'received_funds', 1, '2025-12-22 16:29:52', NULL),
(184, 2, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-22 16:32:03', NULL),
(186, 1, 'Money Sent', 'Sent to mohamed elsayed', '100', 'sent_funds', 1, '2025-12-23 12:12:48', NULL),
(187, 2, 'Money Received', 'Received from faten123', '100', 'received_funds', 1, '2025-12-23 12:12:48', NULL),
(188, 2, 'Money Sent', 'Sent to mohamed', '50', 'sent_funds', 1, '2025-12-23 12:13:42', NULL),
(190, 1, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-23 13:14:52', 31),
(191, 2, 'Money Sent', 'Sent to faten123', '50', 'sent_funds', 1, '2025-12-23 13:32:05', NULL),
(192, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-23 13:32:05', NULL),
(193, 1, 'Payment Request', 'New money request received', '500', 'payment_request', 1, '2025-12-23 13:32:22', 32),
(194, 2, 'Payment Received', 'You received a payment', '500.00', 'received_funds', 1, '2025-12-23 13:43:25', NULL),
(195, 2, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-23 13:59:07', 33),
(196, 1, 'Money Sent', 'Sent to mohamed elsayed', '100', 'sent_funds', 1, '2025-12-23 13:59:17', NULL),
(197, 2, 'Money Received', 'Received from faten123', '100', 'received_funds', 1, '2025-12-23 13:59:17', NULL),
(198, 1, 'Payment Received', 'You received a payment', '100.00', 'received_funds', 1, '2025-12-23 13:59:38', NULL),
(199, 1, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-23 14:24:26', 34),
(200, 2, 'Payment Received', 'You received a payment', '100.00', 'received_funds', 1, '2025-12-23 14:24:40', NULL),
(201, 2, 'Money Sent', 'Sent to faten123', '50', 'sent_funds', 1, '2025-12-25 21:30:42', NULL),
(202, 1, 'Money Received', 'Received from mohamed elsayed', '50', 'received_funds', 1, '2025-12-25 21:30:42', NULL),
(203, 1, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-25 21:31:40', 35),
(204, 2, 'Payment Received', 'You received a payment', '100.00', 'received_funds', 1, '2025-12-25 21:34:15', NULL),
(205, 1, 'Money Sent', 'Sent to mohamed elsayed', '100', 'sent_funds', 1, '2025-12-25 21:47:53', NULL),
(206, 2, 'Money Received', 'Received from faten123', '100', 'received_funds', 1, '2025-12-25 21:47:53', NULL),
(207, 1, 'Money Sent', 'Sent to mohamed elsayed', '50', 'sent_funds', 1, '2025-12-25 23:22:59', NULL),
(208, 2, 'Money Received', 'Received from faten123', '50', 'received_funds', 1, '2025-12-25 23:22:59', NULL),
(209, 2, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-25 23:38:31', 36),
(210, 1, 'Payment Received', 'You received a payment', '100.00', 'received_funds', 1, '2025-12-25 23:38:53', NULL),
(211, 2, 'Money Sent', 'Sent to faten123', '100', 'sent_funds', 1, '2025-12-26 21:02:08', NULL),
(212, 1, 'Money Received', 'Received from mohamed elsayed', '100', 'received_funds', 1, '2025-12-26 21:02:08', NULL),
(214, 2, 'Money Received', 'Received from mohmd', '1000', 'received_funds', 1, '2025-12-27 14:04:28', NULL),
(215, 1, 'Payment Request', 'New money request received', '100', 'payment_request', 1, '2025-12-27 14:10:45', 37),
(216, 2, 'Payment Request', 'New money request received', '1000', 'payment_request', 1, '2025-12-27 14:11:34', 38);

-- --------------------------------------------------------

--
-- Table structure for table `payment_requests`
--

CREATE TABLE `payment_requests` (
  `id` int(11) NOT NULL,
  `requester_id` int(11) NOT NULL,
  `payer_phone` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `payment_requests`:
--   `requester_id`
--       `users` -> `id`
--

--
-- Dumping data for table `payment_requests`
--

INSERT INTO `payment_requests` (`id`, `requester_id`, `payer_phone`, `amount`, `status`, `created_at`) VALUES
(1, 1, '01032886679', 500.00, 'pending', '2025-12-19 18:11:09'),
(2, 1, '01032886679', 500.00, 'rejected', '2025-12-19 18:15:26'),
(3, 2, '01025299107', 500.00, 'rejected', '2025-12-19 18:20:44'),
(4, 2, '01025299107', 500.00, 'accepted', '2025-12-19 18:25:53'),
(5, 1, '01032886679', 500.00, 'accepted', '2025-12-19 18:38:27'),
(6, 1, '01032886679', 500.00, 'rejected', '2025-12-19 18:40:49'),
(7, 1, '01032886679', 1000.00, 'accepted', '2025-12-19 18:54:26'),
(8, 2, '01025299107', 500.00, 'accepted', '2025-12-19 19:02:28'),
(10, 1, '01026445387', 1000.00, 'accepted', '2025-12-19 21:01:28'),
(11, 2, '01025299107', 50.00, 'accepted', '2025-12-20 12:22:55'),
(13, 2, '01025299107', 100.00, 'accepted', '2025-12-20 15:42:22'),
(14, 1, '01032886679', 100.00, 'rejected', '2025-12-20 16:22:15'),
(15, 1, '01032886679', 100.00, 'accepted', '2025-12-20 16:22:36'),
(16, 2, '01025299107', 100.00, 'rejected', '2025-12-20 16:52:06'),
(17, 2, '01025299107', 1000.00, 'accepted', '2025-12-21 10:31:58'),
(18, 2, '01025299107', 500.00, 'accepted', '2025-12-21 10:49:01'),
(19, 2, '01025299107', 200.00, 'accepted', '2025-12-21 15:16:38'),
(20, 2, '01025299107', 200.00, 'accepted', '2025-12-21 17:19:36'),
(22, 2, '01025299107', 500.00, 'accepted', '2025-12-21 20:44:24'),
(23, 2, '01025299107', 100.00, 'accepted', '2025-12-21 21:16:07'),
(25, 2, '01025299107', 100.00, 'accepted', '2025-12-22 11:32:03'),
(26, 2, '01025299107', 50.00, 'accepted', '2025-12-22 16:01:16'),
(27, 1, '01032886679', 100.00, 'rejected', '2025-12-22 16:03:20'),
(28, 2, '01025299107', 100.00, 'rejected', '2025-12-22 16:05:48'),
(29, 2, '01025299107', 100.00, 'accepted', '2025-12-22 16:14:14'),
(31, 2, '01025299107', 100.00, 'rejected', '2025-12-23 13:14:52'),
(32, 2, '01025299107', 500.00, 'accepted', '2025-12-23 13:32:22'),
(33, 1, '01032886679', 100.00, 'accepted', '2025-12-23 13:59:07'),
(34, 2, '01025299107', 100.00, 'accepted', '2025-12-23 14:24:26'),
(35, 2, '01025299107', 100.00, 'accepted', '2025-12-25 21:31:40'),
(36, 1, '01032886679', 100.00, 'accepted', '2025-12-25 23:38:31'),
(37, 2, '01025299107', 100.00, 'rejected', '2025-12-27 14:10:45'),
(38, 1, '01032886679', 1000.00, 'rejected', '2025-12-27 14:11:34');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `receiver_phone` varchar(15) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('bill','transfer','receive') NOT NULL,
  `service_name` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `account_reference` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `transactions`:
--   `receiver_id`
--       `users` -> `id`
--   `sender_id`
--       `users` -> `id`
--

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `sender_id`, `receiver_id`, `receiver_phone`, `user_id`, `type`, `service_name`, `amount`, `account_reference`, `created_at`) VALUES
(16, 1, 2, '01032886679', 2, 'transfer', NULL, 100.00, NULL, '2025-12-20 16:20:45'),
(17, NULL, NULL, '', 1, 'transfer', 'Transfer to mohamed elsayed', 150.00, '01032886679', '2025-12-20 16:21:18'),
(18, 2, 1, '01025299107', 2, 'transfer', NULL, 100.00, NULL, '2025-12-20 16:23:15'),
(20, NULL, NULL, '', 2, 'transfer', 'Transfer to faten mohamed', 100.00, '01025299107', '2025-12-20 16:25:01'),
(23, NULL, NULL, '', 2, 'transfer', 'Transfer to faten mohamed', 100.00, '01025299107', '2025-12-20 16:41:43'),
(24, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten mohamed', 50.00, '01025299107', '2025-12-21 10:14:17'),
(25, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten mohamed', 20.00, '01025299107', '2025-12-21 10:15:13'),
(26, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten mohamed', 50.00, '01025299107', '2025-12-21 10:17:31'),
(27, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten mohamed', 29.00, '01025299107', '2025-12-21 10:21:28'),
(28, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten mohamed', 20.00, '01025299107', '2025-12-21 10:30:28'),
(29, 1, 2, '01032886679', 2, 'transfer', NULL, 1000.00, NULL, '2025-12-21 10:32:25'),
(30, 1, 2, '01032886679', 2, 'transfer', NULL, 50.00, NULL, '2025-12-21 10:32:54'),
(31, 1, 2, '01032886679', 2, 'transfer', 'Transfer to mohamed elsayed', 469.00, '01032886679', '2025-12-21 10:34:00'),
(33, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten', 50.00, '01025299107', '2025-12-21 10:44:37'),
(35, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten', 10.00, '01025299107', '2025-12-21 10:48:50'),
(36, 1, 2, '01032886679', 2, 'transfer', NULL, 500.00, NULL, '2025-12-21 10:49:43'),
(38, 1, 2, '01032886679', 2, 'transfer', 'Transfer to mohamed elsayed', 30.00, '01032886679', '2025-12-21 10:50:11'),
(41, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten', 50.00, '01025299107', '2025-12-21 14:55:11'),
(43, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten', 50.00, '01025299107', '2025-12-21 15:16:25'),
(44, 1, 2, '01032886679', 2, 'transfer', NULL, 200.00, NULL, '2025-12-21 15:17:16'),
(45, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten', 100.00, '01025299107', '2025-12-21 15:50:21'),
(47, 2, 1, '01025299107', 2, 'transfer', 'Transfer to faten', 50.00, '01025299107', '2025-12-21 17:01:09'),
(49, 1, 2, '01032886679', 0, 'transfer', NULL, 200.00, NULL, '2025-12-21 17:20:10'),
(52, 2, 1, '01025299107', 0, 'transfer', 'Transfer to faten', 10.00, '01025299107', '2025-12-21 20:33:56'),
(55, 1, 2, '', 0, 'transfer', NULL, 500.00, NULL, '2025-12-21 20:45:16'),
(56, 2, 1, '01025299107', 0, 'transfer', 'Transfer to faten', 100.00, '01025299107', '2025-12-21 21:14:40'),
(57, 2, 1, '01025299107', 0, 'transfer', 'Transfer to faten', 50.00, '01025299107', '2025-12-21 21:15:04'),
(59, 1, 2, '', 0, 'transfer', NULL, 100.00, NULL, '2025-12-21 21:16:24'),
(63, 2, 1, '01025299107', 0, 'transfer', 'Transfer to faten', 100.00, '01025299107', '2025-12-22 11:31:28'),
(65, 1, 2, '', 0, 'transfer', NULL, 100.00, NULL, '2025-12-22 11:34:01'),
(66, 1, 2, '', 0, 'transfer', NULL, 50.00, NULL, '2025-12-22 16:03:05'),
(67, 1, 2, '01032886679', 0, 'transfer', 'Transfer to mohamed elsayed', 50.00, '01032886679', '2025-12-22 16:04:54'),
(68, 1, 2, '', 0, 'transfer', NULL, 100.00, NULL, '2025-12-22 16:14:26'),
(72, 1, 2, '01032886679', 0, 'transfer', 'Transfer to mohamed elsayed', 100.00, '01032886679', '2025-12-23 12:12:48'),
(77, 2, 1, '01025299107', 0, 'transfer', 'Transfer to faten123', 50.00, '01025299107', '2025-12-23 13:32:05'),
(79, 1, 2, '', 0, 'transfer', NULL, 500.00, NULL, '2025-12-23 13:43:25'),
(81, 1, NULL, '', 1, 'bill', 'electricity', 50.00, '1000000', '2025-12-23 13:57:06'),
(82, 1, 2, '01032886679', 0, 'transfer', 'Transfer to mohamed elsayed', 100.00, '01032886679', '2025-12-23 13:59:17'),
(83, 2, 1, '', 0, 'transfer', NULL, 100.00, NULL, '2025-12-23 13:59:38'),
(85, 1, 2, '', 0, 'transfer', NULL, 100.00, NULL, '2025-12-23 14:24:40'),
(86, 2, 1, '01025299107', 0, 'transfer', 'Transfer to faten123', 50.00, '01025299107', '2025-12-25 21:30:42'),
(88, 1, 2, '', 0, 'transfer', NULL, 100.00, NULL, '2025-12-25 21:34:15'),
(90, 1, 2, '01032886679', 0, 'transfer', 'Transfer to mohamed elsayed', 100.00, '01032886679', '2025-12-25 21:47:53'),
(92, 1, NULL, '', 1, 'bill', 'electricity', 50.00, '010002255', '2025-12-25 22:50:58'),
(94, 1, 2, '01032886679', 0, 'transfer', 'Transfer to mohamed elsayed', 50.00, '01032886679', '2025-12-25 23:22:59'),
(95, 2, 1, '', 0, 'transfer', NULL, 100.00, NULL, '2025-12-25 23:38:53'),
(96, 2, 1, '01025299107', 0, 'transfer', 'Transfer to faten123', 100.00, '01025299107', '2025-12-26 21:02:08'),
(97, 2, NULL, '', 2, 'bill', 'electricity', 50.00, '01022455', '2025-12-27 14:01:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `balance` decimal(10,2) DEFAULT 5000.00,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `users`:
--

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone`, `password`, `created_at`, `balance`, `deleted_at`, `updated_at`, `avatar`, `role`) VALUES
(1, 'faten123', '01025299107', '$2y$10$i5/fJhMvHqZqlcKqq6jZQe51kYmPj3LH0xzKqlz76I/W2ZChhNex.', '2025-12-18 12:08:43', 3690.00, NULL, '2025-12-26 21:02:08', 'avatar_1_1766498331.jpeg', 'user'),
(2, 'mohamed elsayed', '01032886679', '$2y$10$Y8rhUDWKipcpYrElHJRzYunKjV/grQqw2gtCAkB5rb836AXJlvk/a', '2025-12-18 12:10:49', 7320.00, NULL, '2025-12-27 14:04:28', 'avatar_2_1766698314.jpeg', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bill_payments`
--
ALTER TABLE `bill_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_notification_request` (`request_id`);

--
-- Indexes for table `payment_requests`
--
ALTER TABLE `payment_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requester_id` (`requester_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_sender` (`sender_id`),
  ADD KEY `fk_receiver` (`receiver_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bill_payments`
--
ALTER TABLE `bill_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=217;

--
-- AUTO_INCREMENT for table `payment_requests`
--
ALTER TABLE `payment_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill_payments`
--
ALTER TABLE `bill_payments`
  ADD CONSTRAINT `bill_payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_request` FOREIGN KEY (`request_id`) REFERENCES `payment_requests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_requests`
--
ALTER TABLE `payment_requests`
  ADD CONSTRAINT `payment_requests_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

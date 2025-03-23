-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 23, 2025 at 07:02 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hairdresserdb`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `GetAvailableDates`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAvailableDates` (IN `input_year` INT, IN `input_month` INT, IN `hairstylist_id_param` INT, IN `service_id_param` INT)   BEGIN
    DECLARE service_duration INT;
    
    -- Get the service duration from the database
    SELECT duration INTO service_duration
    FROM Services
    WHERE service_id = service_id_param;
    
    WITH MonthDates AS (
        SELECT DATE(CONCAT(input_year, '-', input_month, '-', day)) AS appointment_date
        FROM (SELECT 1 AS day UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
              UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
              UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 
              UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 
              UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 
              UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 
              UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 
              UNION ALL SELECT 29 UNION ALL SELECT 30 UNION ALL SELECT 31) AS days
        WHERE DAY(LAST_DAY(CONCAT(input_year, '-', input_month, '-01'))) >= day
    ),
    TimeSlots AS (
        SELECT MAKETIME(hour, minute, 0) AS slot_time
        FROM (
            SELECT 9 AS hour UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
            UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16
            UNION ALL SELECT 17 UNION ALL SELECT 18
        ) AS hours,
        (SELECT 0 AS minute UNION ALL SELECT 30) AS minutes
    ),
    BookedSlots AS (
        SELECT a.appointment_date, 
               a.appointment_time, 
               (a.appointment_time + INTERVAL s.duration MINUTE) AS end_time
        FROM Appointments a
        JOIN Services s ON a.service_id = s.service_id
        WHERE a.status IN ('confirmed', 'pending')
          AND a.hairstylist_id = hairstylist_id_param
    ),
    AvailableDates AS (
        SELECT md.appointment_date
        FROM MonthDates md
        WHERE md.appointment_date >= CURDATE()
        AND EXISTS (
            -- Ensure there is at least one free slot
            SELECT 1 FROM TimeSlots ts
            WHERE NOT EXISTS (
                SELECT 1 FROM BookedSlots b
                WHERE md.appointment_date = b.appointment_date
                AND ts.slot_time >= b.appointment_time
                AND ts.slot_time < b.end_time
            )
        )
    ),
    AvailableTimeSlots AS (
        SELECT ts.slot_time, ad.appointment_date
        FROM AvailableDates ad
        CROSS JOIN TimeSlots ts
        WHERE NOT EXISTS (
            SELECT 1 
            FROM BookedSlots b
            WHERE ad.appointment_date = b.appointment_date
              AND ts.slot_time < b.end_time
              AND (ts.slot_time + INTERVAL service_duration MINUTE) > b.appointment_time
        )
        AND (ts.slot_time + INTERVAL service_duration MINUTE) <= MAKETIME(18, 0, 0)
        AND (
            ad.appointment_date > CURDATE()
            OR (
                ad.appointment_date = CURDATE() 
                AND (ts.slot_time + INTERVAL service_duration MINUTE) > CURTIME()
            )
        )
    )
    SELECT DISTINCT ad.appointment_date
    FROM AvailableDates ad
    WHERE EXISTS (
        SELECT 1 FROM AvailableTimeSlots ats
        WHERE ats.appointment_date = ad.appointment_date
    )
    ORDER BY ad.appointment_date;
END$$

DROP PROCEDURE IF EXISTS `GetAvailableTimeSlots`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAvailableTimeSlots` (IN `appointment_date` DATE, IN `service_duration` INT, IN `hairstylist_id_param` INT)   BEGIN
    WITH TimeSlots AS (
        SELECT MAKETIME(hour, minute, 0) AS slot_time
        FROM (
            SELECT 9 AS hour UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
            UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16
            UNION ALL SELECT 17 UNION ALL SELECT 18
        ) AS hours,
        (SELECT 0 AS minute UNION ALL SELECT 30) AS minutes
    ),
    BookedSlots AS (
        SELECT 
            a.appointment_time,
            (a.appointment_time + INTERVAL s.duration MINUTE) AS end_time
        FROM Appointments a
        JOIN Services s ON a.service_id = s.service_id
        WHERE a.appointment_date = appointment_date
          AND a.status IN ('confirmed', 'pending')
          AND a.hairstylist_id = hairstylist_id_param
    )
    SELECT ts.slot_time
    FROM TimeSlots ts
    WHERE NOT EXISTS (
        SELECT 1 
        FROM BookedSlots b
        WHERE ts.slot_time < b.end_time
          AND (ts.slot_time + INTERVAL service_duration MINUTE) > b.appointment_time
    )
    AND (ts.slot_time + INTERVAL service_duration MINUTE) <= MAKETIME(18, 0, 0)
    AND (
        appointment_date > CURDATE()
        OR (
            appointment_date = CURDATE() 
            AND (ts.slot_time + INTERVAL service_duration MINUTE) > CURTIME()
        )
    )
    ORDER BY ts.slot_time;
END$$

DROP PROCEDURE IF EXISTS `GetFastestAppointments`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFastestAppointments` (IN `page_number` INT, IN `page_size` INT, IN `service_id_param` INT, IN `hairstylist_id_param` INT)   BEGIN
    DECLARE offset_value INT;
    SET offset_value = (page_number - 1) * page_size;

    WITH RECURSIVE Dates AS (
        SELECT CURDATE() AS appointment_date
        UNION ALL
        SELECT appointment_date + INTERVAL 1 DAY
        FROM Dates
        WHERE appointment_date + INTERVAL 1 DAY <= CURDATE() + INTERVAL 30 DAY
    ),
    TimeSlots AS (
        SELECT MAKETIME(hour, minute, 0) AS slot_time
        FROM (
            SELECT 9 AS hour UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
            UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16
            UNION ALL SELECT 17 UNION ALL SELECT 18  -- Last working hour
        ) AS hours,
        (SELECT 0 AS minute UNION ALL SELECT 30) AS minutes
    ),
    BookedSlots AS (
        SELECT a.appointment_date, a.appointment_time, 
               (a.appointment_time + INTERVAL s.duration MINUTE) AS end_time
        FROM Appointments a
        JOIN Services s ON a.service_id = s.service_id
        WHERE a.status IN ('confirmed', 'pending')
          AND a.service_id = service_id_param
          AND a.hairstylist_id = hairstylist_id_param
    )
    SELECT d.appointment_date, ts.slot_time
    FROM Dates d
    CROSS JOIN TimeSlots ts
    WHERE NOT EXISTS (
        SELECT 1
        FROM BookedSlots b
        WHERE d.appointment_date = b.appointment_date
          AND ts.slot_time >= b.appointment_time
          AND ts.slot_time < b.end_time
    )
      AND (d.appointment_date > CURDATE() 
           OR (d.appointment_date = CURDATE() AND ts.slot_time > CURTIME()))
      -- Ensure slots do not go beyond 18:00
      AND ts.slot_time < '18:00:00'
      AND WEEKDAY(d.appointment_date) != 0
    ORDER BY d.appointment_date, ts.slot_time
    LIMIT page_size OFFSET offset_value;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `service_id` int NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','completed','canceled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `hairstylist_id` int NOT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `user_id` (`user_id`),
  KEY `service_id` (`service_id`),
  KEY `hairstylist_id` (`hairstylist_id`)
) ENGINE=MyISAM AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `user_id`, `service_id`, `appointment_date`, `appointment_time`, `status`, `created_at`, `hairstylist_id`) VALUES
(111, 9, 1, '2025-03-28', '11:30:00', 'confirmed', '2025-03-23 18:43:32', 1),
(110, 9, 1, '2025-03-27', '14:30:00', 'confirmed', '2025-03-23 18:41:49', 1),
(109, 9, 1, '2025-03-26', '10:00:00', 'confirmed', '2025-03-23 18:41:31', 1),
(108, 2, 1, '2025-03-27', '14:00:00', 'confirmed', '2025-03-23 18:39:04', 1),
(107, 2, 1, '2025-03-28', '11:00:00', 'confirmed', '2025-03-23 18:03:48', 1),
(106, 2, 1, '2025-03-25', '09:00:00', 'confirmed', '2025-03-23 17:55:46', 1),
(105, 2, 1, '2025-03-26', '09:30:00', 'confirmed', '2025-03-23 17:55:17', 1),
(104, 2, 1, '2025-03-27', '13:30:00', 'confirmed', '2025-03-23 17:51:13', 1),
(103, 2, 1, '2025-03-27', '13:00:00', 'confirmed', '2025-03-23 17:50:59', 1),
(102, 2, 1, '2025-03-28', '10:30:00', 'confirmed', '2025-03-23 17:50:27', 1),
(101, 15, 1, '2025-03-27', '12:30:00', 'confirmed', '2025-03-23 16:29:36', 1),
(100, 10, 1, '2025-03-28', '10:00:00', 'confirmed', '2025-03-23 16:26:45', 1),
(99, 2, 1, '2025-03-27', '12:00:00', 'confirmed', '2025-03-23 16:26:19', 1),
(98, 2, 1, '2025-03-27', '11:30:00', 'confirmed', '2025-03-23 16:24:32', 1),
(97, 2, 1, '2025-03-27', '11:00:00', 'confirmed', '2025-03-23 16:07:24', 1),
(96, 2, 1, '2025-03-27', '10:30:00', 'confirmed', '2025-03-23 16:07:06', 1),
(95, 2, 1, '2025-03-28', '09:00:00', 'confirmed', '2025-03-23 16:03:14', 1),
(94, 2, 1, '2025-03-27', '10:00:00', 'confirmed', '2025-03-23 16:02:43', 1),
(93, 2, 1, '2025-03-28', '09:30:00', 'confirmed', '2025-03-23 16:01:42', 1),
(92, 2, 1, '2025-03-27', '09:30:00', 'confirmed', '2025-03-23 16:01:29', 1),
(91, 2, 1, '2025-03-27', '09:00:00', 'confirmed', '2025-03-23 15:57:31', 1),
(90, 2, 1, '2025-03-26', '09:00:00', 'confirmed', '2025-03-23 15:57:11', 1),
(112, 2, 1, '2025-03-28', '12:00:00', 'confirmed', '2025-03-23 18:44:19', 1),
(113, 13, 1, '2025-03-29', '09:00:00', 'confirmed', '2025-03-23 18:47:22', 1),
(114, 11, 2, '2025-03-29', '14:00:00', 'confirmed', '2025-03-23 18:58:25', 1),
(115, 2, 1, '2025-03-25', '09:30:00', 'confirmed', '2025-03-23 19:02:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `hairstylists`
--

DROP TABLE IF EXISTS `hairstylists`;
CREATE TABLE IF NOT EXISTS `hairstylists` (
  `hairstylist_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`hairstylist_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hairstylists`
--

INSERT INTO `hairstylists` (`hairstylist_id`, `full_name`, `email`, `phone`) VALUES
(1, 'Александар', '/', '/'),
(2, 'Марина', '/', '/');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salon`
--

DROP TABLE IF EXISTS `salon`;
CREATE TABLE IF NOT EXISTS `salon` (
  `salon_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`salon_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `duration` int NOT NULL COMMENT 'Duration in minutes',
  PRIMARY KEY (`service_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `name`, `description`, `price`, `duration`) VALUES
(1, 'Шишање', '/', 400.00, 30),
(2, 'Фарбање', '/', 1000.00, 60);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `firebase_token` text,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password_hash`, `role`, `created_at`, `firebase_token`) VALUES
(2, 'Nikola Petrovski', 'nikpetrovski007@gmail.com', '+38971326943', 'Yd0xOzTCxkBV5CmZ8znGIYrbZ5k74Cj7Ov/m1IgyO8c=', 'customer', '2025-03-11 14:08:42', 'e3FJHJi2we-cAqRPNLpsG0:APA91bFgOqKsdspBxoGYQY9GLRbkIpozUCtEkpDqX2BcKsupzcLdffnFGrksdEbCQmQ9hwv1LZ0r8HHMO6zIgz3Ur4L269OQruF7Uqy17_5ujEuDM-17LdI'),
(11, 'Marija Kotevska', 'marijakotevska419@gmail.com', '+38971328116', 'OZab8+fN/P1ngI4sSQFgZoDY2il0qQ2Bnf69uKgWRxY=', 'customer', '2025-03-17 17:01:09', 'ejm97q0YtHDII9YpYokubr:APA91bEwBDTTZZv8hJAR2iba3dKk8_GFpp5wTYi5tXaEAXVS7xLtxwch591YIKTEurehsjtkcdI6DFRKQZJfqOrYNxtqBej9oaVpWZnVeVt1PpAp8KDgBDE'),
(9, 'Valentina Petrovska', 'valentina_petrovska@hotmail.com', '+38978277172', 'prEk6ko+YFCmksRwwmHF31PuhYol/LRStZ7RPM7BoXo=', 'customer', '2025-03-16 19:57:06', 'ckPnhpOYgPQkt5ZgI854p8:APA91bEAt3byTE0fJ1rLlgLiGB2UKFEMTMnmYyuEXXMBIr80UwYzCOtX8MEgVGtwtHp7-Qqa8ohWKIqlc2UHWGikZKHOoHX7mO7RXWx_RgUBn4IMH5wNpak'),
(10, 'Nikola Petrovski', 'nikola.petrovski2002@gmail.com', '+38971231221', 'Yd0xOzTCxkBV5CmZ8znGIYrbZ5k74Cj7Ov/m1IgyO8c=', 'customer', '2025-03-16 22:21:42', 'fgPQkJAvHv1Zkt73O5-rKh:APA91bEUGWnvZMNmfZ111mUw2sigdY3HSj5W2oN5HGAyZ_TicdnNDh1RdWAUzujeI7_QF8NBi1DQvxvctJF2_Rb038BR29XaVzWly0eVqFJSBxlTo3VzQz0'),
(12, 'Andrej Todevski', 'andrej.todevski@gmail.com', '+38972214199', '66zOD4lSlbfLwBbIHkUwTEoTsMFPwVZlDl6rzkoZZ64=', 'customer', '2025-03-17 17:33:35', NULL),
(13, 'nikola petrovski', 'pavel.petrovski0207@gmail.com', '+38970877020', 'B7uZjW5A1NIhsfZdmg8mu/jWTMvHV2DKK7eAi5Gmc3c=', 'customer', '2025-03-20 18:20:18', NULL),
(14, 'Andrej Janceski', 'janceski.andrej.aj@gmail.com', '+38970961090', 'TvrD/d23o30wOgJuxLDtiGuY2ZKlqqPtAn6qEWjypuQ=', 'customer', '2025-03-20 19:19:54', NULL),
(15, 'Vlatko Petrovski', 'vlatko.petrovski@gmail.com', '+38971303306', 's8YmvJTBKyiXHyLdLvPmATN/rbVGzB3cFlgH7eZiv30=', 'customer', '2025-03-21 19:32:15', 'eMLThikClggr5s9jNjLvIz:APA91bF_xv3Q9FPYLiia1HGWVKqKOJB1XxjHOGXB2m_817zgmmAXKlJMEx5Vh1siaMInxqkowc-R-UPla_c8LIU-CfigJ_csjKkGp6wfL_oaPkNpi8q_7tA'),
(16, 'Matej Todevski', 'matej.todevski1@gmail.com', '+38972214198', 'OqFJCVM2i/A6EuN2Ii3vYY79PIIc9NHbnAWDKnRYlNc=', 'customer', '2025-03-22 16:36:50', NULL),
(17, 'Sashka Trajkovski', 'sashka.trajkovski@yahoo.com', '+38972268385', 'pjcBNRlmRLPfPHLhxhZk8aEdBseD6dpSZkdYqRl3jqw=', 'customer', '2025-03-23 15:02:42', 'eXa1i8C3dL-mLtMv-Zv-gg:APA91bG0hM3BX0SyLBgnGgFsoAGHf1jI1ayG0WbBOtY0BeoLg_1tSARJ0R6DS3FZ3a5QvRBvKIjjApUqb1TM3RBglrDjVxITBKXVfBX0FD2aA-XdX33J1No');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

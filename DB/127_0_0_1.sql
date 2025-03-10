CREATE DATABASE hairdresserdb;

USE hairdresserdb;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 25, 2025 at 01:07 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

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
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAvailableDates` (IN `input_year` INT, IN `input_month` INT, IN `hairstylist_id_param` INT)   BEGIN
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
    BookedSlots AS (
        SELECT a.appointment_date, 
               a.appointment_time, 
               (a.appointment_time + INTERVAL s.duration MINUTE) AS end_time
        FROM Appointments a
        JOIN Services s ON a.service_id = s.service_id
        WHERE a.status IN ('confirmed', 'pending')
          AND a.hairstylist_id = hairstylist_id_param
    )
    SELECT md.appointment_date
    FROM MonthDates md
    WHERE md.appointment_date >= CURDATE()
      AND EXISTS (
        SELECT 1
        FROM (
            SELECT MAKETIME(hour, minute, 0) AS slot_time
            FROM (
                SELECT 9 AS hour UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
                UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16
                UNION ALL SELECT 17 UNION ALL SELECT 18
            ) AS hours,
            (SELECT 0 AS minute UNION ALL SELECT 30) AS minutes
        ) ts
        WHERE NOT EXISTS (
            SELECT 1 FROM BookedSlots b
            WHERE md.appointment_date = b.appointment_date
              AND ts.slot_time >= b.appointment_time
              AND ts.slot_time < b.end_time
        )
        AND MAKETIME(18, 0, 0) >= ts.slot_time  -- Add working hours constraint
      )
    ORDER BY md.appointment_date;
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
        SELECT a.appointment_date, a.appointment_time, 
               (a.appointment_time + INTERVAL s.duration MINUTE) AS end_time
        FROM Appointments a
        JOIN Services s ON a.service_id = s.service_id
        WHERE a.status IN ('confirmed', 'pending')
          AND a.service_id = service_id_param
          AND a.hairstylist_id = hairstylist_id_param
    )
    SELECT md.appointment_date, ts.slot_time
    FROM (SELECT DISTINCT appointment_date FROM appointments WHERE appointment_date >= CURDATE()) AS md
    JOIN TimeSlots ts ON NOT EXISTS (
        SELECT 1 FROM BookedSlots b
        WHERE md.appointment_date = b.appointment_date
        AND ts.slot_time >= b.appointment_time
        AND ts.slot_time < b.end_time
    )
    ORDER BY md.appointment_date, ts.slot_time
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
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `user_id`, `service_id`, `appointment_date`, `appointment_time`, `status`, `created_at`, `hairstylist_id`) VALUES
(1, 1, 1, '2025-02-22', '12:00:00', 'pending', '2025-02-21 09:13:01', 1),
(2, 1, 2, '2025-02-25', '12:00:00', 'pending', '2025-02-22 18:51:03', 2),
(3, 1, 1, '2025-02-25', '12:30:00', 'confirmed', '2025-02-24 14:00:36', 1),
(4, 1, 2, '2025-02-25', '09:00:00', 'confirmed', '2025-02-24 14:01:33', 2),
(5, 0, 1, '2025-02-26', '09:30:00', 'confirmed', '2025-02-24 16:14:24', 1),
(6, 0, 1, '2025-02-25', '09:00:00', 'confirmed', '2025-02-24 20:57:19', 2),
(7, 0, 1, '2025-02-25', '09:30:00', 'confirmed', '2025-02-24 22:31:53', 1),
(8, 0, 1, '2025-02-25', '09:00:00', 'confirmed', '2025-02-24 22:34:35', 1),
(9, 0, 2, '2025-02-26', '12:00:00', 'confirmed', '2025-02-24 22:49:30', 1),
(10, 0, 2, '2025-02-25', '13:00:00', 'confirmed', '2025-02-24 22:50:12', 2),
(11, 0, 1, '2025-02-25', '14:30:00', 'confirmed', '2025-02-24 23:12:51', 1);

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
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Nikola Petrovski', 'mailto:nikpetrovski007@gmail.com', '+389 71 326 943', 'Useruser246_', 'customer', '2025-02-24 14:02:44');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 19, 2023 at 04:08 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bags_community`
--

-- --------------------------------------------------------

--
-- Structure for view `items`
--

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `items`  AS SELECT `write_review`.`username` AS `username`, `sub_kategori`.`nama_sub_kategori` AS `subkat`, `write_review`.`tanggal` AS `tanggal`, `review`.`teks_review` AS `teks_review`, `review`.`angka_review` AS `angka_review`, `tas`.`foto` AS `foto`, `merek`.`nama_merek` AS `nama_merek`, `tas`.`tas_id` AS `tas_id` FROM (((((`write_review` join `review` on(`write_review`.`review_id` = `review`.`review_id`)) join `tas` on(`tas`.`tas_id` = `review`.`tas_id`)) join `merek` on(`tas`.`merek_id` = `merek`.`merek_id`)) join `sub_kategori` on(`sub_kategori`.`sub_kategori_id` = `tas`.`sub_kategori_id`)) join `kategori` on(`kategori`.`kategori_id` = `sub_kategori`.`kategori_id`)) ;

--
-- VIEW `items`
-- Data: None
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

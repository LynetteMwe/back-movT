-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2022 at 06:56 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `logt`
--

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `username`, `contact`, `email`, `password`, `token`, `resetToken`, `resetTokenExpiry`, `createdAt`, `updatedAt`) VALUES
(1, 'Rosy2', '070923113824', 'rosy2@gmail.com', '$2b$10$XamBYCdbmXwJ.J9vAlH1vOfAqgO0NcvcdBQd7rwYiiw0spL/KLpQe', '$2b$10$hGqwLvI.RZC3zzfAfeN71OGGTBc4dTNKKr5DPDX/2VXIfHnT49itW', NULL, NULL, '2022-10-06 01:21:54', '2022-10-06 01:21:54'),
(2, 'Rosy3', '0709323113824', 'rosy3@gmail.com', '$2b$10$ukiN8MKUGbL2s3bDUqfxxuKggiQljpJ7vTa5BLx1hykQ03sr2nPOy', '$2b$10$jJg3r3PYKer.g9W3aFJXmeNtFotPI7/Jz6UzLqylyvdxdpjUWZW.2', NULL, NULL, '2022-10-06 01:22:07', '2022-10-06 01:22:07'),
(3, 'Rick', '070923113821', 'rick@gmail.com', '$2b$10$R08EhmwFyzZsQve/NZAzO.A6Qcr5BiPkIa0WqIiTU4sLnL/lacv/G', '$2b$10$uqYu/j54e62qRWJzxgbC3eP4x5OBdGX1ge5pR10vQ0ILApanOPI3i', NULL, NULL, '2022-10-06 01:43:22', '2022-10-26 15:01:54'),
(5, 'Ralph', '0722231138', 'ralph@gmail.com', '$2b$10$fnnJUV/30HlzVC3YtF2Yy.Z.TeQggIgF0GnPYk/5pIclitCTtuajq', '$2b$10$gW77pzOjS1jXBxhE6gethe2p6blJH72Br6aeECoVRq8CcyH/KWm0m', NULL, NULL, '2022-10-07 07:28:26', '2022-10-07 07:28:26'),
(6, 'Cli', '0712231138', 'cli@gmail.com', '$2b$10$hIXe0cLmSbgtV6L10WfNP.RxmfmjawMVNYYun4KV4693.mdnQQjEe', '$2b$10$sWkd0b411Irxv.vB1VH.uuMBD.x/4r3zH8UljYUd6yN/y1Ifuw9lu', NULL, NULL, '2022-10-07 07:29:05', '2022-10-07 07:29:05'),
(7, 'Cli2', '07212231138', 'cli2@gmail.com', '$2b$10$V//cAyhoPl5.IqUZmU7WWeufJefWTvS9jRjaLvb/PMfAqRK.vNOKu', '$2b$10$v0SsZ25eDJ36NhGmykPTDu9zq371jHrQhTUipcuf5ah7liBK525la', NULL, NULL, '2022-10-07 07:32:28', '2022-10-07 07:32:28'),
(8, 'Mwe', '0752231138', 'mwe@gmail.com', '$2b$10$aZ90.4daSIBnbT6s/EaAs.hvy4QyS2Stv5hqqPBWpOzHq/I8fiYE2', '$2b$10$NePWWGV8zfwhcXi3ha0qqu/DdvdY7phkdEE1U87hyeN1e6afZHDyO', NULL, NULL, '2022-10-07 07:47:52', '2022-10-07 07:47:52'),
(9, 'client1', '12345', 'user1@mail.com', '$2b$10$3XB.3bpjSxfwOYV7TI09..WAOJjJ2E6uvoEFvv2ioxEf/SOms1nj.', '$2b$10$n15OWiVIYFJNDrPTUgm.C.hekdJXCDMhvnTYnD4v7rqVy0faHCrc6', NULL, NULL, '2022-10-11 04:20:06', '2022-10-11 04:20:06'),
(11, 'client2', '123453', 'client2@mail.com', '$2b$10$rDnbrUVhQd23ljqiTXmBweNWExmjW9tJpFDhLVNpPygcxCfvt5qRu', '$2b$10$3ZQiQ1lLXmGRA/61E0gDee8d32vODLQ1.LzAWnfh3kVvTdfwQM0nC', NULL, NULL, '2022-10-11 04:20:43', '2022-10-11 04:20:43'),
(13, 'client3', '1223453', 'client3@mail.com', '$2b$10$o6HI3HkYLHuwRi1maM.jQuPZH1y3aQOkXBvMN2SRS.govwbRPPwAO', '$2b$10$B71Bx3C9cA96GCEUUH25/OwXZkb4wgQmnCFP0sODWUkYS0BZ1wWfy', NULL, NULL, '2022-10-11 04:44:24', '2022-10-11 04:44:24'),
(32, 'client6', '12234536', 'client6@mail.com', '$2b$10$LmDr0O2zAtJsILn2BbLZauNNqEhOoZl2k5thLdWwOeAyPSJGN6mjG', '$2b$10$QyA0Ghh12bnGD4vts/pdXOJ3UulzAzE9ysnbYXpNCL0x6Gerqp.oK', NULL, NULL, '2022-10-11 19:27:58', '2022-10-11 19:27:58'),
(34, 'user', '8643759', 'user@mail.com', '$2b$10$N.EkJy1BrKiueIwCTyvj7ekp7K4X/XtKBJGmSJ5i9j7Zz92NyQn9C', '$2b$10$bd2aUfI7dcgNd9nDO8BORuT/2Jhyy8NLkCw5u3Q7Gol5hxE2EFOLG', NULL, NULL, '2022-10-12 16:48:40', '2022-10-12 16:48:40'),
(35, 'test', '19547', 'test@gmail.com', '$2b$10$.wzjwW3zEmlIvbuTlEQ6WexFivb..iRExfNav.2S9JAlsNR0ATYpq', '$2b$10$oSZ0Bzr30gPWb.89W8MKPeIo1Zhc3Gt8wJkMCr2zvZQMaz1nVrfP6', NULL, NULL, '2022-10-13 06:28:24', '2022-10-13 06:28:24'),
(37, 'userB', '05387952', 'userB@gmail.com', '$2b$10$8YtTOpz6psorKPmd3SXrHuYNn/afP.oSJJ0uOBSbcL8P8kzGyOari', '$2b$10$dhmnUSrc9v7sXopLr//gsu8A9Qsob0r32I8P6jllqGqzy8vwl77Ca', NULL, NULL, '2022-10-17 14:21:42', '2022-10-17 14:21:42'),
(40, 'userC', '053879528', 'userC@gmail.com', '$2b$10$q9p5LvVPaIlpXJewNc26BuLKHBVeTi8e1EWL4GrM9m9m6817X9ZMm', '$2b$10$ZugaxcbHu6e/VJ/a6DqkhOW0mUblhFwJrYNTxIiX216/QZtHP1FmG', NULL, NULL, '2022-10-17 14:23:05', '2022-10-17 14:23:05'),
(43, 'test5', '896532', 'test5@gmail.com', '$2b$10$2luISP2Gy7UGMQlTGEhBKuH.dR5Mi.KqzYbuyRRM6ZcMfiOWPpsZe', '$2b$10$/BXPXP03nkrRXwzgwk24te2nycMel9gGD1RpFciUBsI9ZMT9f/q1O', NULL, NULL, '2022-10-17 14:45:25', '2022-10-17 14:45:25'),
(44, 'hello ', '6666444', 'hello@gmail.com', '$2b$10$KrC5m/yCv6erJDU81caoIO/4ES8npSLKU6HXa21WvVGJQkLNvUocy', '$2b$10$X.jG9g3QKXcBFnNWNT.xfe43K1PtjT3hVf3hd7GOkAhnaXxgGYHT6', NULL, NULL, '2022-10-17 15:08:13', '2022-10-17 15:08:13'),
(45, 'client7', '12234537', 'client7@mail.com', '$2b$10$kPJTy/1EPzrC9fWR2wWnYeMkcO9nede9qxRu8jAaQsmq5zcNsod.C', '$2b$10$RSdasFnRqL/45R6DUMy4yuZDFdYXymJi1AK3eGyo6npy74TmiaOf2', NULL, NULL, '2022-10-17 15:18:14', '2022-10-17 15:18:14'),
(46, 'tete', '774114', 'tete@gmail.com', '$2b$10$pZUgw1GrjB6PGI1ZmkOd0.M4SGwiZKAO2R2rKZ/n9w6JvBDDLUCXG', '$2b$10$/dt1.pQT1VmjSU0NAcsn/uQMisWAMBlPJT6AqjMB1/gjGsU.IHAVC', NULL, NULL, '2022-10-18 03:43:49', '2022-10-18 03:43:49'),
(47, 'foo', '323232', 'foo@gmail.com', '$2b$10$yw7I8oxzhgBAXO7UJq6Kje/usgtfJNLxq/.gIEBe6IJnl16zEuRpa', '$2b$10$f3sNq19A785S/0q0UCUPKu7cLUnCInOekeqBZyYHTjqFpSnfUlcs2', NULL, NULL, '2022-10-18 05:40:47', '2022-10-18 05:40:47'),
(48, 'client46', '1223453746', 'client46@gmail.com', '$2b$10$/r2xASPqUKgzEklrQAZXJuPPk2ulkzfYOiCIvS9W4jydCYj20g7uW', '$2b$10$vM3vRSehgnI0f2o8qc/cR.vRmAm7wYIc46UFXva31XhbWeiMHL2X6', NULL, NULL, '2022-10-24 07:25:07', '2022-10-24 07:25:07'),
(50, 'regy', '4236978', 'regy@gmail.com', '$2b$10$wqGdHvqwej7kRkJSExwDJeRBiKeMEhiFyC/bVQoyiBLLhXI/a75y6', '$2b$10$CEIg9n6bX7VospCIAtATbuZjHhfYFerKck03DH9qEzQ1ekbgW/wkS', NULL, NULL, '2022-10-24 07:42:48', '2022-10-24 07:42:48');

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE IF NOT EXISTS `drivers` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `vehicle_plate_no` varchar(255) DEFAULT NULL,
  `service_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`id`, `username`, `contact`, `email`, `password`, `token`, `resetToken`, `resetTokenExpiry`, `createdAt`, `updatedAt`, `vehicle_plate_no`, `service_type`) VALUES
(1, 'Rich', '+25472038954', 'Rich@gmail.com', '$2b$10$QmZRiFpho260Yz984ZjuO.FcgMIKgx65/nhOyEJQwvFSCW9laKoIe', '$2b$10$g.KA74/7CjRzVBKwrSxNZOt2NkJ6cUN.xFE2/eMbl0r1.nJgb56YS', NULL, NULL, '2022-10-02 07:52:42', '2022-10-27 04:44:00', NULL, NULL),
(2, 'Rech', '+2547238954', 'Rech@gmail.com', '$2b$10$ZVaon5ETlyf39t9010Uflu7wy/gicDnwAfY.G.BNYkZOvZx/qRguC', '$2b$10$5g.gRF2QK9gJN09MDd2ZFO9SAkPtTnFVahq2kp6pVVYA/Pwj5uPfm', NULL, NULL, '2022-10-02 22:08:46', '2022-10-02 22:08:46', NULL, NULL),
(4, 'Syo', '+25470238954', 'Syo@gmail.com', '$2b$10$iZJJExY.0DLWQ74Na3W2.u2DwB13TEzfFPSnqpjls6ocZXcvRBdrK', '$2b$10$reF6AE6cexqbByrO4yuUj.T1FSvYsVjmJ3bJOIBPbN/IC79YrYMfe', NULL, NULL, '2022-10-03 12:10:46', '2022-10-03 12:10:46', NULL, NULL),
(6, 'Driver', '+25470138954', 'driver@gmail.com', '$2b$10$ZaZ2M35CArz93JJlFCtT8OYo6LWcdjXpF2ZXo855/OX.W9r6lFAXG', '$2b$10$QYvero0L5Wyvxrrdtj.CqeHjs.KRWskWdDEWt2VEkgvKKq3Hxzh6q', NULL, NULL, '2022-10-04 12:46:20', '2022-10-04 12:46:20', NULL, NULL),
(8, 'Driver1', '+254701138954', 'driver1@gmail.com', '$2b$10$8E4v6Yp1M3kjng.FJKyU1OnCO//nX9pMxjbvWPRC.1PbYMiPNXxSa', '$2b$10$.57nPe6P7rEcc4j84HQn9OMdyC8MZRPXzmRpX/VhermKp3bR3PSQO', NULL, NULL, '2022-10-04 12:46:34', '2022-10-04 12:46:34', NULL, NULL),
(9, 'Driver2', '+2547011238954', 'driver2@gmail.com', '$2b$10$FQ6hHpjB95mJkE/qdjEife0NWL.Whz/5htP.kZ.WZoKzBSJvizGSO', '$2b$10$fF68K3CS6FZgnpPDQYao6O79iwtGKdE7a5GGlCLDG.a40Hd3Do4dq', NULL, NULL, '2022-10-04 12:49:35', '2022-10-04 12:49:35', NULL, NULL),
(10, 'Drive', '+25470011238954', 'drive@gmail.com', '$2b$10$vU06IDR.jCYwTqGnvnJbFOAbrlQE3zqdC9h1fZRp9gaY7WZ849On.', '$2b$10$XzzFmWszOrR5AcEXZFmDle20E3BMfIuLL3FcFpl.lN9mYYfirz..K', NULL, NULL, '2022-10-06 01:40:36', '2022-10-06 01:40:36', NULL, NULL),
(16, 'driver3', '12334567', 'driver3@mail.com', '$2b$10$I39jjT3iqBWXccJU8wTpf.mvFkwOkzgCLUWDe2.u27Bvh4PWLQ92e', NULL, NULL, NULL, '2022-10-11 04:50:03', '2022-10-26 15:13:04', NULL, NULL),
(21, 'driver4', '123345674', 'driver4@mail.com', '$2b$10$tNsHTkDP3bgUtDS1XMURsuNVqipeKzf60n7hqYF3bx2Etn4QDQvqS', '$2b$10$pF/GMlnITU08oZ4nLB1HSuivJZvY38vaspYc6J2MvxUNJ1FRKa/YK', NULL, NULL, '2022-10-11 19:32:38', '2022-10-11 19:32:38', NULL, NULL),
(29, 'Test4', '1233456744', 'test4@mail.com', '$2b$10$FuTbomuwUQE5ZN3dx3cSxOmMMleI0g9xOGZ1yIGN/HRHMgis4/yQW', '$2b$10$dfMDeHZMzvhvh7dHgkJW1.woV/seHu1oIryIgQmRuinxrbhLszZVi', NULL, NULL, '2022-10-27 04:38:22', '2022-10-27 04:38:22', 'KAG 577N', 'delivery-lorry'),
(30, 'Test6', '1233456746', 'test6@mail.com', '$2b$10$r1rg1cOYuWIaMQCuOrrSQeYzIJlMw0tBENiwzoHRzpKboUNAW3dNi', '$2b$10$VSdi14vF9gEFXhVkXyDkzOUuysxX6Hst9cjAdS2xH9bSk4pVxN6u.', NULL, NULL, '2022-10-27 04:42:49', '2022-10-27 04:42:49', 'KBG 577N', 'delivery-pickup');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL,
  `ClientId` int(11) DEFAULT NULL,
  `DriverId` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `ClientId`, `DriverId`, `message`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'Driver is here', 1, '2022-10-06 01:32:13', '2022-10-06 01:32:13'),
(4, 1, 8, 'Driver is here', 1, '2022-10-06 01:46:07', '2022-10-06 01:46:07'),
(5, 3, 8, 'Driver is here', 1, '2022-10-06 01:55:11', '2022-10-06 01:55:11'),
(7, 1, 9, 'Driver is here', NULL, '2022-10-06 01:56:17', '2022-10-06 01:56:17'),
(8, 1, 6, 'Driver is here', 0, '2022-10-06 02:01:31', '2022-10-06 02:01:31'),
(9, NULL, NULL, 'Package arrived.', 0, '2022-10-16 11:02:17', '2022-10-16 11:02:17'),
(10, NULL, NULL, 'Package arrived.', 0, '2022-10-16 11:02:30', '2022-10-16 11:02:30'),
(12, 2, 2, 'Package arrived.', 1, '2022-10-16 11:06:44', '2022-10-16 11:06:44'),
(20, 3, 4, 'Package arrived...', 1, '2022-10-27 04:55:05', '2022-10-27 04:55:05');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL,
  `ClientId` int(11) NOT NULL,
  `DriverId` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `origin` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `amount` double NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `ClientId`, `DriverId`, `description`, `origin`, `destination`, `amount`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'Building Materials Sand', 'Ongata Rongai', 'Kiserian', 200, 1, '2022-10-16 13:37:33', '2022-10-16 13:37:33'),
(3, 1, 2, 'Building Materials Sand', 'Ongata Rongai', 'Kiserian', 200, 1, '2022-10-16 13:38:12', '2022-10-16 13:38:12'),
(11, 1, 6, 'Building Materials Sand', 'Ongata Rongai', 'Kiserian', 200, 1, '2022-10-16 13:57:04', '2022-10-16 13:57:04'),
(12, 1, 8, 'Building Materials Sand', 'Ongata Rongai', 'Kiserian', 200, 1, '2022-10-16 13:57:20', '2022-10-16 13:57:20'),
(13, 2, 8, 'Building Materials Sand', 'Ongata Rongai', 'Kiserian', 200, 1, '2022-10-19 05:36:16', '2022-10-19 05:36:16'),
(14, 2, 2, 'Building Materials Sand', 'Ongata Rongai', 'Kiserian', 200, 1, '2022-10-19 05:47:38', '2022-10-19 05:47:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `contact` (`contact`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `contact` (`contact`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Notifications_DriverId_ClientId_unique` (`ClientId`,`DriverId`),
  ADD KEY `DriverId` (`DriverId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `Orders_DriverId_ClientId_unique` (`ClientId`,`DriverId`),
  ADD KEY `DriverId` (`DriverId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`DriverId`) REFERENCES `drivers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`DriverId`) REFERENCES `drivers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

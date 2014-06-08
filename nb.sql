-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 08, 2014 at 08:39 PM
-- Server version: 5.5.24-log
-- PHP Version: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `nb`
--

-- --------------------------------------------------------

--
-- Table structure for table `device`
--

CREATE TABLE IF NOT EXISTS `device` (
  `student_id` int(11) NOT NULL,
  `device_id` varchar(200) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `device_id` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `device`
--

INSERT INTO `device` (`student_id`, `device_id`, `enabled`) VALUES
(21024909, 'APA91bGiwQILCsIg55nPPS4IVzS0Ix0yNEHYbkWl5sYFMCFjlqyraAUY32E3k9idKjOn2Lvgfnzl-D_jbzsxoCVX1ozNOnZh0Z8vwmTf1Hbs1Pi2T2T47Me97L1kc24AXksGy6XBI7yP6n3b9OM0080WJIE8ZLAaKg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `lecturer`
--

CREATE TABLE IF NOT EXISTS `lecturer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(10) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `picture` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `lecturer`
--

INSERT INTO `lecturer` (`id`, `title`, `fname`, `lname`, `email`, `password`, `picture`) VALUES
(1, 'Mr', 'Logan', 'Govender', 'logan@dut.ac.za', 'logan', NULL),
(2, 'Mr', 'Kevin', 'Moorgas', 'kevinm@dut.ac.za', 'kevin', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lecturer_cs`
--

CREATE TABLE IF NOT EXISTS `lecturer_cs` (
  `subject_id` varchar(10) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  PRIMARY KEY (`subject_id`,`lecturer_id`),
  KEY `subject_id` (`subject_id`),
  KEY `lecturer_id` (`lecturer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lecturer_cs`
--

INSERT INTO `lecturer_cs` (`subject_id`, `lecturer_id`) VALUES
('DSYS102', 1),
('ELEN103', 1),
('MCSYS401', 2);

-- --------------------------------------------------------

--
-- Table structure for table `notice`
--

CREATE TABLE IF NOT EXISTS `notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(80) NOT NULL,
  `body` varchar(300) NOT NULL,
  `type` varchar(10) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;

--
-- Dumping data for table `notice`
--

INSERT INTO `notice` (`id`, `title`, `body`, `type`, `timestamp`) VALUES
(5, 'Posting to all', 'Posting to ALL', 'general', '2014-05-30 20:19:27'),
(6, 'hello', 'testing', 'general', '2014-05-30 20:20:29'),
(8, 'hello', 'hello echo', 'general', '2014-05-31 13:50:51'),
(10, 'testing', 'test', 'general', '2014-05-31 22:56:38'),
(11, 'asd', 'asd', 'general', '2014-05-31 23:00:59'),
(12, 'sad', 'asd', 'general', '2014-05-31 23:03:05'),
(13, 'sd', 'kj', 'general', '2014-05-31 23:05:22'),
(14, 'as', 'ds', 'general', '2014-06-01 19:08:16'),
(15, 'Files uploaded', 'New files have been uploaded to 1/subjects/DSYS102/test', 'upload', '2014-06-01 20:19:07'),
(16, 'Files uploaded', 'New files have been uploaded to 1/subjects/DSYS102', 'upload', '2014-06-03 21:52:50'),
(17, 'Files uploaded', 'New files have been uploaded to 1/subjects/DSYS102', 'upload', '2014-06-03 21:54:38'),
(18, 'Files uploaded', 'New files have been uploaded to 1/subjects/DSYS102', 'upload', '2014-06-03 21:56:16'),
(19, 'Marks uploaded', 'Marks have been uploaded for Digital Systems I', 'marks', '2014-06-03 22:01:05'),
(20, 'Marks uploaded', 'Marks have been uploaded for Digital Systems I', 'marks', '2014-06-07 13:23:03'),
(21, 'Marks uploaded', 'Marks have been uploaded for Digital Systems I', 'marks', '2014-06-07 16:50:07');

-- --------------------------------------------------------

--
-- Table structure for table `notice_ls`
--

CREATE TABLE IF NOT EXISTS `notice_ls` (
  `lecturer_id` int(11) NOT NULL,
  `subject_id` varchar(15) NOT NULL,
  `notice_id` int(11) NOT NULL,
  PRIMARY KEY (`lecturer_id`,`subject_id`,`notice_id`),
  KEY `subject_id` (`subject_id`),
  KEY `notice_id` (`notice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notice_ls`
--

INSERT INTO `notice_ls` (`lecturer_id`, `subject_id`, `notice_id`) VALUES
(1, 'ALL', 5),
(2, 'MCSYS401', 6),
(1, 'ALL', 8),
(1, 'ALL', 10),
(1, 'ALL', 11),
(1, 'ALL', 12),
(1, 'ALL', 13),
(1, 'ALL', 14),
(1, 'DSYS102', 15),
(1, 'DSYS102', 16),
(1, 'DSYS102', 17),
(1, 'DSYS102', 18),
(1, 'DSYS102', 19),
(1, 'DSYS102', 20),
(1, 'DSYS102', 21);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE IF NOT EXISTS `student` (
  `id` int(11) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `picture` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `fname`, `lname`, `email`, `password`, `picture`) VALUES
(111111, 'test', 'test', '111111@dut4life.ac.za', '111111', NULL),
(20823303, 'Hayden', 'Sookchand', '20823303@dut4life.ac.za', '20823303', NULL),
(21024909, 'Farhaad', 'Bux', '21024909@dut4life.ac.za', 'farhaad', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_ls`
--

CREATE TABLE IF NOT EXISTS `student_ls` (
  `student_id` int(11) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `subject_id` varchar(15) NOT NULL,
  PRIMARY KEY (`student_id`,`lecturer_id`,`subject_id`),
  KEY `lecturer_id` (`lecturer_id`),
  KEY `subject_id` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student_ls`
--

INSERT INTO `student_ls` (`student_id`, `lecturer_id`, `subject_id`) VALUES
(20823303, 1, 'DSYS102'),
(21024909, 1, 'DSYS102'),
(21024909, 2, 'MCSYS401');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE IF NOT EXISTS `subject` (
  `id` varchar(15) NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`id`, `name`) VALUES
('ALL', 'ALL'),
('CSEL101', 'Computer Skills I'),
('CSKI103', 'Communication Skills I'),
('DSYS102', 'Digital Systems I'),
('ELEN103', 'Electronic Engineering I'),
('MCSYS401', 'Microcontroller Systems 4');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `device`
--
ALTER TABLE `device`
  ADD CONSTRAINT `device_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lecturer_cs`
--
ALTER TABLE `lecturer_cs`
  ADD CONSTRAINT `lecturer_cs_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Lecturer_CS_ibfk_3` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturer` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notice_ls`
--
ALTER TABLE `notice_ls`
  ADD CONSTRAINT `notice_ls_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notice_ls_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notice_ls_ibfk_3` FOREIGN KEY (`notice_id`) REFERENCES `notice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_ls`
--
ALTER TABLE `student_ls`
  ADD CONSTRAINT `student_ls_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_ls_ibfk_2` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_ls_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

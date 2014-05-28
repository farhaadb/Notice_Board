-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 28, 2014 at 10:06 PM
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
-- Table structure for table `course`
--

CREATE TABLE IF NOT EXISTS `course` (
  `id` varchar(10) NOT NULL,
  `name` varchar(60) NOT NULL,
  `dept_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dept_id` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `name`, `dept_id`) VALUES
('NDCSY2', 'ND - Computer Systems', 1),
('NDELC2', 'ND - Light Current', 1);

-- --------------------------------------------------------

--
-- Table structure for table `course_subject`
--

CREATE TABLE IF NOT EXISTS `course_subject` (
  `course_id` varchar(10) NOT NULL,
  `subject_id` varchar(10) NOT NULL,
  PRIMARY KEY (`course_id`,`subject_id`),
  KEY `subject_id` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course_subject`
--

INSERT INTO `course_subject` (`course_id`, `subject_id`) VALUES
('NDCSY2', 'CSEL101'),
('NDELC2', 'CSEL101'),
('NDCSY2', 'CSKI103'),
('NDELC2', 'CSKI103'),
('NDCSY2', 'DSYS102'),
('NDELC2', 'DSYS102'),
('NDCSY2', 'ELEN103'),
('NDELC2', 'ELEN103');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE IF NOT EXISTS `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `Index` (`faculty_id`),
  KEY `faculty_id` (`faculty_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`id`, `name`, `faculty_id`) VALUES
(1, 'Electronic Engineering', 1),
(2, 'Mechanical Engineering', 1),
(3, 'Information Technology', 2),
(4, 'Management Accounting', 2);

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE IF NOT EXISTS `devices` (
  `student_id` int(11) NOT NULL,
  `device_id` varchar(60) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `device_id` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE IF NOT EXISTS `faculty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `name`) VALUES
(1, 'Engineering and the Built Environment'),
(2, 'Accounting and Informatics');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `lecturer`
--

INSERT INTO `lecturer` (`id`, `title`, `fname`, `lname`, `email`, `password`, `picture`) VALUES
(1, 'Mr', 'Logan', 'Govender', 'logan@dut.ac.za', 'logan', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lecturer_cs`
--

CREATE TABLE IF NOT EXISTS `lecturer_cs` (
  `course_id` varchar(10) NOT NULL,
  `subject_id` varchar(10) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  PRIMARY KEY (`course_id`,`subject_id`,`lecturer_id`),
  KEY `subject_id` (`subject_id`),
  KEY `lecturer_id` (`lecturer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lecturer_cs`
--

INSERT INTO `lecturer_cs` (`course_id`, `subject_id`, `lecturer_id`) VALUES
('NDCSY2', 'DSYS102', 1),
('NDCSY2', 'ELEN103', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notice`
--

CREATE TABLE IF NOT EXISTS `notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(80) NOT NULL,
  `body` varchar(300) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `notice`
--

INSERT INTO `notice` (`id`, `title`, `body`, `timestamp`) VALUES
(1, 'Test postponed.', 'Test postponed due to strike. New test date to be given in the coming days.', '2014-05-04 00:00:00');

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
(1, 'DSYS102', 1);

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
  `picture` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `fname`, `lname`, `email`, `password`, `picture`) VALUES
(111111, 'Hayden', 'Sookchand', 'hayden@yahoo.com', 'hayden', ''),
(2123165, 'test', 'testt', 'test@test.com', 'test', ''),
(21024909, 'Farhaad', 'Bux', '21024909@dut4life.ac.za', 'farhaad', '');

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
(111111, 1, 'DSYS102'),
(2123165, 1, 'DSYS102'),
(21024909, 1, 'DSYS102');

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
('ELEN103', 'Electronic Engineering I');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `Course_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `course_subject`
--
ALTER TABLE `course_subject`
  ADD CONSTRAINT `Course_Subject_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Course_Subject_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `Department_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lecturer_cs`
--
ALTER TABLE `lecturer_cs`
  ADD CONSTRAINT `Lecturer_CS_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course_subject` (`course_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Lecturer_CS_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `course_subject` (`subject_id`) ON UPDATE CASCADE,
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

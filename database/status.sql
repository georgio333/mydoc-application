-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 19. Dez 2019 um 22:48
-- Server-Version: 5.7.14
-- PHP-Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `status`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `personal`
--

CREATE TABLE `personal` (
  `id` varchar(100) NOT NULL,
  `kurzname` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `personal`
--

INSERT INTO `personal` (`id`, `kurzname`) VALUES
('82f604c0-22a9-11ea-8640-4d710d2b9bad', 'Eduard'),
('8661df80-22a9-11ea-8640-4d710d2b9bad', 'Juri');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `progress`
--

CREATE TABLE `progress` (
  `Nummer` varchar(100) NOT NULL,
  `LieferadresseName2` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `LieferadresseName3` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `LieferadresseStraße` varchar(40) DEFAULT NULL,
  `LieferadressePLZ` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `LieferadresseOrt` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `Erstanlagedatum` datetime NOT NULL,
  `Änderungsdatum` datetime DEFAULT NULL,
  `Beschreibung` text CHARACTER SET utf8 COLLATE utf8_bin,
  `employee` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `Belegnummer` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Auftragsnummer` varchar(16) DEFAULT NULL,
  `Status` tinyint(4) DEFAULT NULL,
  `Termin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `progress`
--

INSERT INTO `progress` (`Nummer`, `LieferadresseName2`, `LieferadresseName3`, `LieferadresseStraße`, `LieferadressePLZ`, `LieferadresseOrt`, `Erstanlagedatum`, `Änderungsdatum`, `Beschreibung`, `employee`, `Belegnummer`, `Auftragsnummer`, `Status`, `Termin`) VALUES
('1', 'Juri', 'Müller', 'Detmolder Str.13', '10715', 'berlin', '2016-10-03 12:00:00', '2016-10-06 00:00:00', 'spült kein Weichspüler ein', 'Juri', 'AZ111000', '1256798475', 24, '2019-12-17 00:00:00'),
('cc1f1900-22b0-11ea-81b2-c3689f558c96', 'Mike', 'Schubert', 'Detmolder Str.13', '10715', 'berlin', '2019-12-19 11:42:12', '2019-12-19 11:42:12', NULL, 'Juri', 'A12345', NULL, 24, '2019-12-19 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

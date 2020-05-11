-- Reflect the setup params in config.py.
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
CREATE DATABASE korp;
USE korp;

-- Temporarily remove default restrictions on creating zero-value dates.
-- This allows us to create the two timedata tables below without error.
set session sql_mode = '';

CREATE TABLE `timedata` (
  `corpus` varchar(64) NOT NULL DEFAULT '',
  `datefrom` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `dateto` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `tokens` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`corpus`,`datefrom`,`dateto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `timedata_date` (
  `corpus` varchar(64) NOT NULL DEFAULT '',
  `datefrom` date NOT NULL DEFAULT '0000-00-00',
  `dateto` date NOT NULL DEFAULT '0000-00-00',
  `tokens` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`corpus`,`datefrom`,`dateto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

-- Insert time data values for selected corpora into. Copied over from old db.
-- I don't know how this data has been obtained/generated. [sg]
SET NAMES utf8;

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('SAXOS', '20150130000000', '20150130235959', 354);
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('SAXOS', '20150130', '20150130', 354);

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('SAXOA', '20110130000000', '20110130235959', 354);
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('SAXOA', '20110130', '20110130', 354398);

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERIA', '20130130000000', '20130130235959', 3839);
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERIA', '20130130', '20130130', 3839);

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERIAM', '20140130000000', '20140130235959',3839 );
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERIAM', '20140130', '20140130',3839 );

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERIAMA', '20140131000000', '20140131235959',3839 );
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERIAMA', '20140131', '20140131',3839 );

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('DUDSDFKBILLET', '20170130000000', '20170130235959',3839 );
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('DUDSDFKBILLET', '20170130', '20170130',3839 );

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERI3', '20170130000000', '20170130235959',3838 );
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERI3', '20170130', '20170130',3838 );

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERI3C', '20140130000000', '20170130235959',3838 );
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPBYGGERI3C', '20140130', '20170130',3838 );

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATEAKTUELNATURVIDENSKAB', '20000101000000', '20090101235959',113589 );
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATEAKTUELNATURVIDENSKAB', '20000101', '20090101', 113589 );

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATEDMU', '20050101000000', '20090101235959', 994081);
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATEDMU', '20050101', '20090101',994081 );

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATEHOVEDLAND', '20030101000000', '20090101235959', 407604);
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATEHOVEDLAND', '20030101', '20090101',407604);

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATEOEKRAAD', '20030101000000', '20090101235959',111298 );
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATEOEKRAAD', '20030101', '20090101',111298);

INSERT INTO `timedata` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATE', '20050101000000', '20090101235959', 994081);
INSERT INTO `timedata_date` (corpus, datefrom, dateto, tokens) VALUES
('LSPCLIMATE', '20050101', '20090101',994081 );

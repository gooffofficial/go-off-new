DROP DATABASE test_server;

CREATE DATABASE test_server;
USE test_server;

CREATE TABLE t (
    id int,
    username varchar(255),
    userpassword varchar(255),
    nameofperson varchar(255),
    age int,
    location varchar(255),
    gender int
);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (0, 'GloRobinson', 'xslkfskl', 'Glo', 20, 'CA', 2);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (1, 'DPadilla', 'xsjfsklfj', 'Danielle', 21, 'CA', 2);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (2, 'SN23', 'nfkeken', 'Sabeer', 19, 'CA', 1);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (3, 'EmmaENelson', 'fjnendk', 'Emma', 20, 'CN', 2);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (4, 'SamL', 'gherigbe', 'Sam', 20, 'NY', 1);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (5, 'Steph', 'thhddbvdj', 'Stephanie', 20, 'NY', 2);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (6, 'ClamChaoder', 'retnid', 'Eric', 20, 'NY', 1);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (7, 'JaliGr', 'nkejwfsa', 'Jali', 20, 'WS', 2);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (8, 'KTBU', 'nmvkd', 'Kaylie', 20, 'CN', 2);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (9, 'DJ Justice', 'nfkdvk', 'Jess', 20, 'Havent won a stanley cup in 50 years', 2);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (10, 'San Franzisco', 'mcdsnjns', 'Franz', 24, 'MA', 2);

INSERT INTO t 
(id, username, userpassword, nameofperson, age, location, gender)
VALUES (11, 'person', 'mcdsnjns', 'person', 34, 'MA', 1);

CREATE TABLE c (
	id INT, 
    username VARCHAR(255),
    comments VARCHAR(255),
    conversation INT,
    timeanddate DATETIME,
    reported INT);

SELECT * FROM t;
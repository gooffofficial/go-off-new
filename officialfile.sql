DROP DATABASE test_server;

CREATE DATABASE test_server;
USE test_server;

SET SQL_SAFE_UPDATES = 0;

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


CREATE TABLE comments (
	userID INT, 
    username VARCHAR(255),
    commentMade VARCHAR(255),
    conversationID INT,
    timeanddate DATETIME,
    reported INT);

CREATE TABLE convo (
	conversationID INT,
    TimeStart DATE,
    TimeEnd DATE);
    
CREATE TABLE connect (
    userID INT,
    conversationID INT);

INSERT INTO convo 
(conversationID, timeStart, timeEnd)
VALUES (0, 2020-05-27, 2020-05-27);

INSERT INTO comments 
(userID, username, commentMade, conversationID, timeanddate, reported)
VALUES (0, 'GloRobinson', 'I cannot believe that Go Off! has 11 members!', 0, 2020-05-27, 0);

INSERT INTO comments 
(userID, username, commentMade, conversationID, timeanddate, reported)
VALUES (0, 'GloRobinson', 'Great news everybody', 0, 2020-05-27, 0);

INSERT INTO comments 
(userID, username, commentMade, conversationID, timeanddate, reported)
VALUES (7, 'JaliGr', 'Was that a futurama reference?', 0, 2020-05-27, 0);

INSERT INTO comments 
(userID, username, commentMade, conversationID, timeanddate, reported)
VALUES (3, 'EmmaENelson', 'We are whalers on the moon', 0, 2020-05-27, 0);

INSERT INTO comments 
(userID, username, commentMade, conversationID, timeanddate, reported)
VALUES (0, 'GloRobinson', 'We carry a harpoon!', 0, 2020-05-27, 0);

INSERT INTO comments 
(userID, username, commentMade, conversationID, timeanddate, reported)
VALUES (7, 'JaliGr', 'But there aint no whales', 0, 2020-05-27, 0);

INSERT INTO comments 
(userID, username, commentMade, conversationID, timeanddate, reported)
VALUES (7, 'JaliGr', 'So we tell tall tales', 0, 2020-05-27, 0);

INSERT INTO comments 
(userID, username, commentMade, conversationID, timeanddate, reported)
VALUES (3, 'EmmaENelson', 'And cry impending doom :)', 0, 2020-05-27, 1);


INSERT INTO connect
(userID, conversationID)
VALUES (0, 0);
	
INSERT INTO connect
(userID, conversationID)
VALUES (3, 0);

INSERT INTO connect
(userID, conversationID)
VALUES (7, 0);    


-- SELECT 
--     username, 
--     age, 
--     location
-- FROM
--     t
-- WHERE
--     id = 2;
    
-- UPDATE t 
-- SET 
--     location = 'NY'
-- WHERE
--     location = 'CA';

    
SELECT * FROM t;
SELECT * FROM comments;
SELECT * FROM convo;
SELECT * FROM connect;
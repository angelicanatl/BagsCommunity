-- BAGS COMMUNITY


-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

DROP TABLE pengguna;

CREATE TABLE pengguna
( nama_lengkap VARCHAR(50) NOT NULL,
email VARCHAR(50) NOT NULL,
username VARCHAR(15) NOT NULL,
password VARCHAR(20) NOT NULL
);

CREATE INDEX pengguna
ON pengguna (username);

--
-- Dumping data for table `usergroups`
--

-- ADMIN
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Admin123', '12345678', 'ADMIN', 'admin@gmail.com');
-- PENGGUNA 1 ANGEL
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Angel', '12345678', 'Angelica Natalie', 'angelica@gmail.com');
-- PENGGUNA 2 JOAN
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Joan', '12345678', 'Joan Arc', 'joan@gmail.com');


-- --------------------------------------------------------

--
-- Table structure for table `follow`
--

CREATE TABLE follow
(	username1 VARCHAR(15) NOT NULL ,
	username2 VARCHAR(15) NOT NULL, 
	FOREIGN KEY (username1) 
    REFERENCES pengguna(username),
	FOREIGN KEY (username2) 
    REFERENCES pengguna(username)
);

--
-- Dumping data for table `follow`
--

INSERT INTO follow (username1,username2) VALUES('Angel' , 'Joan');
INSERT INTO follow (username1,username2) VALUES('Joan' , 'Angel');

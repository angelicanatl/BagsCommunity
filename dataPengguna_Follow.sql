-- BAGS COMMUNITY


-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--
 DROP TABLE pengguna;
 DROP TABLE follow;
-- DROP TABLE review;
-- DROP TABLE write_review;

CREATE TABLE pengguna
( 	nama_lengkap VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	username VARCHAR(15) NOT NULL PRIMARY KEY,
	password VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

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
(	username1 VARCHAR(15) NOT NULL,
	username2 VARCHAR(15) NOT NULL, 
	FOREIGN KEY (username1) 
    REFERENCES pengguna(username)
	ON DELETE CASCADE,
	FOREIGN KEY (username2) 
    REFERENCES pengguna(username)
	ON DELETE CASCADE
);

--
-- Dumping data for table `follow`
--

INSERT INTO follow (username1,username2) VALUES('Angel' , 'Joan');
INSERT INTO follow (username1,username2) VALUES('Joan' , 'Angel');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE review
(	review_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	INDEX rev_id(review_id),
	angka_review INTEGER NOT NULL,
	teks_review varchar(300),
	tas_id INTEGER NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `write_review`
--

CREATE TABLE write_review
(	tanggal datetime NOT NULL,
	username VARCHAR(15) NOT NULL,
	review_id INTEGER NOT NULL,
	FOREIGN KEY (review_id)
		references review(review_id)
		ON DELETE CASCADE
);
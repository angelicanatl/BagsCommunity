-- BAGS COMMUNITY


-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--
-- DROP TABLE follow;
--  DROP TABLE pengguna;
--  DROP TABLE merek;
--  DROP TABLE designer;
-- DROP TABLE sub_kategori;
--  DROP TABLE kategori;
-- DROP TABLE write_review;
--  DROP TABLE review;

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
-- Table structure for table `merek`
--

CREATE TABLE merek
(	merek_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nama_merek varchar(30)
);

--
-- Dumping data for table `merek`
--
INSERT INTO merek (nama_merek) VALUES('Dior');

-- --------------------------------------------------------

--
-- Table structure for table `designer`
--
CREATE TABLE designer
(	designer_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nama_designer varchar(30)
);

--
-- Dumping data for table `designer`
--
INSERT INTO designer (nama_designer) VALUES('Christian Dior');

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--
CREATE TABLE kategori
(	kategori_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nama_kategori varchar(30)
);

--
-- Dumping data for table `kategori`
--
INSERT INTO kategori (nama_kategori) VALUES('Backpack');
INSERT INTO kategori (nama_kategori) VALUES('Koper');
INSERT INTO kategori (nama_kategori) VALUES('Handbag');

-- --------------------------------------------------------

--
-- Table structure for table `sub_kategori`
--
CREATE TABLE sub_kategori
(	sub_kategori_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nama_sub_kategori varchar(30),
	kategori_id INTEGER NOT NULL, 
		FOREIGN KEY (kategori_id) 
		REFERENCES kategori(kategori_id)
		ON DELETE CASCADE
);

--
-- Dumping data for table `sub_kategori`
--

INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('School Backpack',1);
INSERT INTO sub_kategori (nama_sub_kategori,kategori_id) VALUES('Crossbody Backpack',1);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Mini backpack',1);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Clutch', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tas`
--

CREATE TABLE tas
(	tas_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	panjang INTEGER NOT NULL,
	lebar INTEGER NOT NULL,
	tinggi INTEGER NOT NULL,
	warna_utama varchar(30) NOT NULL,
	tampak_depan BLOB NULL, -- SEMENTARA NULL DULU
	tampak_belakang BLOB NULL, -- SEMENTARA NULL DULU
	tampak_kiri BLOB NULL, -- SEMENTARA NULL DULU
	tampak_kanan BLOB NULL, -- SEMENTARA NULL DULU
    tampak_dalam BLOB NULL, -- SEMENTARA NULL DULU
	merek_id INTEGER,
	designer_id INTEGER,
	sub_kategori_id INTEGER,
	FOREIGN KEY (merek_id) 
    REFERENCES merek(merek_id),
	FOREIGN KEY (designer_id) 
    REFERENCES designer(designer_id),
	FOREIGN KEY (sub_kategori_id) 
    REFERENCES sub_kategori(sub_kategori_id)
);

--
-- Dumping data for table `tas`
--

-- BELOM ADA FOTO!
INSERT INTO tas (panjang,lebar,tinggi,warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	20, 17, 8, 'hitam', 1, 1, 4
);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE review
(	review_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	angka_review INTEGER NOT NULL,
	teks_review varchar(300),
	tas_id INTEGER NOT NULL,
	FOREIGN KEY (tas_id) 
    REFERENCES tas(tas_id)
);

--
-- Dumping data for table `review`
--

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Bagus bgt tasnya recommended pokoknya', 1);

-- --------------------------------------------------------

--
-- Table structure for table `write_review`
--

CREATE TABLE write_review
(	tanggal datetime NOT NULL,
	username VARCHAR(15) NOT NULL,
	review_id INTEGER NOT NULL,
	FOREIGN KEY (username) 
    REFERENCES pengguna(username),
	FOREIGN KEY (review_id) 
    REFERENCES review(review_id)
);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2015-04-03 14:00:45', 'Joan',1);




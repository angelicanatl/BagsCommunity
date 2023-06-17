-- BAGS COMMUNITY


-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

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

-- PENGGUNA 
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Angel', '12345678', 'Angelica Natalie', 'angelica@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Joan', '12345678', 'Joan Arc', 'joan@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Naomixue', 'zxcvbnm', 'Naomi Elianora', 'naomiii@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Diyanss', 'asdfgh', 'Dian Estri', 'oskangwur@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('dree_andrea', '234567890', 'Andrea Miranti', 'miranti@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('keth', 'lkjhgfdsa', 'Ketherine Goenawan', 'kg@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('reineaura_', 'reinee', 'Reine Aura', 'rein@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('clarissa.nadia', 'nad', 'Clarissa Nadia', 'nadia@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Galyndeo', 'gggg', 'Ghabriel Galyndeo', 'galyndeo@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('vincentmarkk', 'qwerty', 'Vincent Mark', 'vmark@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Miros', 'miross', 'Miroslav Matthew', 'mir@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('thur', 'thur', 'William Arthur', 'thur@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('Vicsprat', 'vicoo', 'Vico Pratama', 'vics@gmail.com');
INSERT INTO pengguna (username,password,nama_lengkap,email) VALUES('KC', 'kcc', 'Kevin Christian', 'kc@gmail.com');
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
INSERT INTO follow (username1,username2) VALUES('keth' , 'Angel');
INSERT INTO follow (username1,username2) VALUES('Naomixue' , 'Joan');
INSERT INTO follow (username1,username2) VALUES('Diyanss' , 'Joan');
INSERT INTO follow (username1,username2) VALUES('dree_andrea' , 'Joan');
INSERT INTO follow (username1,username2) VALUES('keth' , 'Joan');
INSERT INTO follow (username1,username2) VALUES('clarissa.nadia' , 'Joan');
INSERT INTO follow (username1,username2) VALUES('Vicsprat' , 'Joan');
INSERT INTO follow (username1,username2) VALUES('keth' , 'Galyndeo');
INSERT INTO follow (username1,username2) VALUES('Joan' , 'Diyanss');
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
INSERT INTO merek (nama_merek) VALUES('Chanel');
INSERT INTO merek (nama_merek) VALUES('Fjallraven Kanken');
INSERT INTO merek (nama_merek) VALUES('Balenciaga');
INSERT INTO merek (nama_merek) VALUES('Tumi');
INSERT INTO merek (nama_merek) VALUES('Coach');
INSERT INTO merek (nama_merek) VALUES('Herschel');
INSERT INTO merek (nama_merek) VALUES('Lojel');
INSERT INTO merek (nama_merek) VALUES('Nike');
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
INSERT INTO designer (nama_designer) VALUES('Christian Dior'); -- dior
INSERT INTO designer (nama_designer) VALUES('Karl Lagerfeld'); -- chanel 
INSERT INTO designer (nama_designer) VALUES('Åke Nordin'); -- kanken 
INSERT INTO designer (nama_designer) VALUES('Demna Gvasalia'); -- balenciaga 
INSERT INTO designer (nama_designer) VALUES('Victor Sanz'); -- tumi
INSERT INTO designer (nama_designer) VALUES('Stuart Vevers'); -- coach
INSERT INTO designer (nama_designer) VALUES('Jamie Cormack'); -- herschel
INSERT INTO designer (nama_designer) VALUES('Chih Chang Chiang'); -- lojel
INSERT INTO designer (nama_designer) VALUES('Tinker Linn Hatfield, Jr.'); -- Nike
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
INSERT INTO kategori (nama_kategori) VALUES('Purse'); 
INSERT INTO kategori (nama_kategori) VALUES('Travel'); 
INSERT INTO kategori (nama_kategori) VALUES('Sport'); 
INSERT INTO kategori (nama_kategori) VALUES('Camera'); 
INSERT INTO kategori (nama_kategori) VALUES('Shopping bag'); 
INSERT INTO kategori (nama_kategori) VALUES('Belt bag'); 
INSERT INTO kategori (nama_kategori) VALUES('Laptop bag');  
INSERT INTO kategori (nama_kategori) VALUES('Sling bag');  
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
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Cabin size',2); 
INSERT INTO sub_kategori (nama_sub_kategori,kategori_id) VALUES('Medium size',2); 
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Large size',2);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Clutch', 3);  
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Bucket', 3); 
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Envelope', 3);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Coin purse', 4); 
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Wallet', 4);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Briefcase', 5);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Duffel', 6); 
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Gym sacks', 6);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Pouch', 7);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Plastic', 8);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Waist', 9);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('14 inch', 10);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('16 inch', 10);
INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES('Slingbag', 11);
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
	foto varchar(100),  
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

INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	20, 17, 8, '/images/1/ladydior.png', 'hitam', 1, 1, 7);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	25, 15, 6, '/images/2/chaneldoubleflap.png', 'hitam', 2, 2, 7);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	29, 20, 13, '/images/3/fjallraven.png', 'biru', 3, 3, 3);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	9, 14, 7, '/images/4/crossbodybalenciaga.png', 'hitam', 4, 4, 2);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	56, 45, 25, '/images/5/tumiluggage.png', 'pink', 5, 5, 4);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	60, 50, 30, '/images/6/tumimedium.png', 'merah', 5, 5, 5);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	22, 11, 23, '/images/7/coachbucket.png', 'hitam', 6, 6, 8);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	48, 27, 17, '/images/8/herschelschool.png', 'hitam', 7, 7, 1);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	77, 55, 35, '/images/9/lojellarge.png', 'kuning', 8, 8, 6);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	10, 10, 8, '/images/10/coin.png', 'pink', 6, 6, 10);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	51, 36, 5, '/images/11/gymsack.png', 'hitam', 9, 9, 14);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	8, 8, 4, '/images/12/balenciagamini.png', 'silver', 4, 4, 20);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	34, 25, 8, '/images/13/coachlaptop.png', 'cream', 6, 6, 18);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	34, 25, 8, '/images/14/balenwaist.png', 'hitam', 4, 4, 17);
INSERT INTO tas (panjang,lebar,tinggi, foto, warna_utama,merek_id,designer_id,sub_kategori_id) VALUES (
	40, 30, 15, '/images/15/shop.png', 'hitam', 4, 4, 16);
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
	5, 'Bagus bgt tasnya recommended pokoknya!!!!', 1);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	4, 'Lumayan sih tapi cukup mahal', 1);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	3, 'Ga dulu deh', 1);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	4, 'Worth to buy', 1);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Classic item', 1);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Very recommended', 2);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Mahalll tapi kualitas oke banget', 2);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	4, 'Banyak barang kwnya, masa jadi dikira barang kw??? :(', 2);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	2, 'Kulitnya cepat rusak', 2);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Classic chanel bangett', 2);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Bagusssssssssssssss', 3);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	4, 'Warnanya cantik', 3);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Kecil tapi muat banyak', 3);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	2, 'Ok', 4);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	2, '-', 4);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	3, 'Mantap', 4);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'Y', 4);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Saya suka pink!!! <3', 5);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	4, 'Merahnya bagus', 6);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'Merahnya serem kaya darah:()', 6);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	3, 'Cepet kotor', 8);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	2, 'Ribet buka tasnya.', 8);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	5, 'Kuning. keren', 9);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	4, 'PINKKKKKKKKKKKKKKKKKKKKK!! <3 tpi kecil', 10);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'gasuka pink.', 10);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'pasaran.', 11);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	2, 'banyak yg pake.', 11);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'talinya lepas.', 11);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	3, 'g dulu.', 11);

	
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'gaada yg cukup sumpa.', 12);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	2, 'ga worth it sama sekali', 12);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'beli yg laen deh', 12);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	3, 'ga makasih', 12);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	3, 'Vibes bapak-bapak.', 14);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	4, 'jadi keren gini gua', 14);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	3, 'kecil amat dah', 14);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'g dulu.', 14);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'nanges', 14);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'huh.', 14);

INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'Gangerti konsepnya gimana', 15);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'Apaan neh', 15);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	2, 'Kek shopping bag ikea', 15);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'Mahal tapi kok gini', 15);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'nanges', 15);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, '???', 15);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'apaan sih', 15);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'gajelassssssssssssss', 15);
INSERT INTO review (angka_review, teks_review, tas_id) VALUES (
	1, 'skip', 15);
-- --------------------------------------------------------

--
-- Table structure for table `write_review`
--

CREATE TABLE write_review
(	tanggal date NOT NULL,
	username VARCHAR(15) NOT NULL,
	review_id INTEGER NOT NULL,
	FOREIGN KEY (username) 
    REFERENCES pengguna(username),
	FOREIGN KEY (review_id) 
    REFERENCES review(review_id)
);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-03', 'Joan',1);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-03', 'Angel',2);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-02-03', 'keth',3);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-03', 'reineaura_',4);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-09', 'clarissa.nadia',5);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-12', 'Naomixue',6);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-06-06', 'Joan',7);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-09', 'keth',8);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-18', 'Diyanss',9);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-10', 'Angel',10);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-13', 'Angel',11);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-18', 'Joan',12);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-11', 'dree_andrea',13);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-21', 'vincentmarkk',14);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-23', 'Miros',15);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-26', 'thur',16);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-28', 'Vicsprat',17);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-06-01', 'Joan',18);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-09', 'KC',19);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-09', 'Diyanss',20);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-30', 'thur',21);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-25', 'Galyndeo',22);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-29', 'Galyndeo',23);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-06-11', 'Joan',24);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-01-01', 'Keth',25);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-21', 'vincentmarkk',26);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-27', 'Miros',27);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-22', 'thur',28);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-14', 'Galyndeo',29);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-21', 'Naomixue',30);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-27', 'diyanss',31);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-22', 'Joan',32);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-01-14', 'Angel',33);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-19', 'vincentmarkk',34);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-28', 'Miros',35);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-22', 'thur',36);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-01-10', 'Galyndeo',37);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-04-18', 'KC',38);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-01', 'Vicsprat',39);

INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-06-10', 'Naomixue',40);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-13', 'diyanss',41);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-28', 'dree_andrea',42);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-02-07', 'Galyndeo',43);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-01-09', 'Joan',44);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-03-14', 'Vicsprat',45);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-05-17', 'vincentmarkk',46);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-01-12', 'Miros',47);
INSERT INTO write_review (tanggal, username,review_id) VALUES ('2023-01-05', 'Keth',48);
-- --------------------------------------------------------

--
-- View structure for statistik tas
--


-- CREATE VIEW stat_kat AS
-- SELECT 
-- 	write_review.tanggal, 
-- 	write_review.username, 
-- 	review.review_id, 
-- 	review.angka_review, 
-- 	review.teks_review, 
-- 	tas.tas_id, 
-- 	sub_kategori.kategori_id, 
-- 	kategori.nama_kategori
-- FROM 
-- 	write_review
-- JOIN review ON write_review.review_id=review.review_id
-- JOIN tas ON review.tas_id=tas.tas_id 
-- JOIN sub_kategori ON tas.sub_kategori_id=sub_kategori.sub_kategori_id
-- JOIN kategori ON sub_kategori.kategori_id=kategori.kategori_id

-- CREATE VIEW stat_subkat AS
-- SELECT
--     write_review.tanggal,
--     write_review.username,
--     review.review_id,
--     review.angka_review,
--     review.teks_review,
--     tas.tas_id,
--     tas.sub_kategori_id,
--     sub_kategori.nama_sub_kategori
-- FROM
--     write_review
-- JOIN review ON write_review.review_id = review.review_id
-- JOIN tas ON review.tas_id = tas.tas_id
-- JOIN sub_kategori ON tas.sub_kategori_id = sub_kategori.sub_kategori_id

-- CREATE VIEW stat_merek AS
-- SELECT
--     write_review.tanggal,
--     write_review.username,
--     review.review_id,
--     review.angka_review,
--     review.teks_review,
--     tas.tas_id,
--     tas.merek_id,
--     merek.nama_merek
-- FROM
--     write_review
-- JOIN review ON write_review.review_id = review.review_id
-- JOIN tas ON review.tas_id = tas.tas_id
-- JOIN merek ON tas.merek_id = merek.merek_id

-- CREATE VIEW stat_designer AS
-- SELECT
--     write_review.tanggal,
--     write_review.username,
--     review.review_id,
--     review.angka_review,
--     review.teks_review,
--     tas.tas_id,
--     tas.designer_id,
--     designer.nama_designer
-- FROM
--     write_review
-- JOIN review ON write_review.review_id = review.review_id
-- JOIN tas ON review.tas_id = tas.tas_id
-- JOIN designer ON tas.designer_id = designer.designer_id

-- --------------------------------------------------------

-- CREATE VIEW items AS
-- SELECT 
-- `write_review`.`username`, 
-- `sub_kategori`.`nama_sub_kategori` as 'subkat', 
-- `write_review`.`tanggal` as 'tanggal', 
-- `review`.`teks_review`, 
-- `review`.`angka_review`, 
-- `tas`.`foto`, 
-- `merek`.`nama_merek`, 
-- `tas`.`tas_id`
-- FROM 
-- 	`write_review` 
-- JOIN `review` ON `write_review`.`review_id` = `review`.`review_id` 
-- JOIN `tas` ON `tas`.`tas_id` = `review`.`tas_id` 
-- JOIN `merek` ON `tas`.`merek_id` = `merek`.`merek_id` 
-- JOIN `sub_kategori` ON `sub_kategori`.`sub_kategori_id` = `tas`.`sub_kategori_id` 
-- JOIN `kategori` ON `kategori`.`kategori_id` = `sub_kategori`.`kategori_id`
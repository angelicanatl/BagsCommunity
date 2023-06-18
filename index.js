import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import crypto from 'crypto';
import session from 'express-session';
import memoryStore from 'memorystore';
import multer from 'multer';
import path from 'path' ;
import parse from 'csv-parser';
import fs from 'fs';
import { get } from 'http';
// import path from 'path';

const PORT = 8080;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, (err) => {
    if (err){
        console.error('Server error');
    } else {
        console.log(`Server is ready, listening on port ${PORT}`);
    }
});

const conn = mysql.createConnection({
    user: 'root',
    password: '',
    database: 'bags_community',
    host: 'localhost'
});

const SessionStore = memoryStore(session);

app.use(session({
    store: new SessionStore({
        checkPeriod: 10*60*60*1000   //ms
    }),
    name: 'nama',
    secret: 'rahasiasecret',
    resave: false,
    saveUninitialized: true
}));
app.get(['/','/login'], (req, res) => {
    //logout
    if(req.session.username){
        req.session.destroy;
    }
    //login
    res.render('login', {
        cek: true
    });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

let sessions;
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const hashed_pass = crypto.createHash('sha256').update(password).digest('base64');
        // console.log(hashed_pass);
        await cekPengguna(conn, username, hashed_pass).then((nama) => {
            if (!nama[0]){
                console.log("Username atau Password yang dimasukkan salah.")
                    res.render('login', {
                        cek: false
                });
            } else {
                sessions = req.session;
                sessions.username = username;
                sessions.nama = nama[0].nama_lengkap;
                if (sessions.username == 'Admin123'){
                    sessions.url = '/AdminProfile';
                } else {
                    sessions.url = '/UserProfile';
                }
                res.redirect('Dashboard?p=1');
            }
        })
    } else {
        res.redirect('/');
    }
})

const cekPengguna = (conn, username, password) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_lengkap FROM pengguna WHERE username=? AND password=?", [username, password], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.post('/signup', (req, res) => {
    const data = req.body;
    if (data){
        cekUsername(conn, data.username).then((result) => {
            if (result[0].count == 0){
                addPengguna(conn,data).then((result) => {
                    res.render('login', {
                        cek: true
                    });
                });
            } else {
                res.redirect('/signup');
            }
        });
    } else {
        res.redirect('/signup');
    }
});

app.post('/cekUsername', (req, res) => {
    const cek = req.body.new;
    cekUsername(conn, cek).then((result) => {
        const warn = {
            message: 'invalid'
        }
        if (result[0].count > 0){
            res.send(warn);
        }else{
            res.send();
        }
    });
})

const cekUsername = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT COUNT(nama_lengkap) as count FROM pengguna WHERE username=?", [username], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const addPengguna = (conn, data) => {
    const hashed_pass = crypto.createHash('sha256').update(data.password).digest('base64');
    console.log(hashed_pass);
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO pengguna VALUES (?,?,?,?)", [data.nama, data.email, data.username, hashed_pass], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

//middleware
const auth = (req, res, next) => {
    if(!req.session.username){
        res.render('login', {
            cek: true
        });
    }else{
        next();
    }
}

app.get('/about', auth, (req, res) => {
    res.render('about', {
        username: sessions.username,
        url: sessions.url
    });
});

//-----------------------------------------------------Dashboard--------------------------------------------------------------
const listNewestReview  = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM items ORDER BY tanggal DESC LIMIT 20", (err, result) => {
            if(err){
                reject(err);
            } else{
                // console.log(result);
                resolve(result);
            }
        })
    })
}

const itemCount = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT COUNT(tas_id) AS 'total' FROM (SELECT * FROM items ORDER BY tanggal DESC LIMIT 20) AS ct", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
const itemShow = 4;
const getItems = (conn, p)=> {
    const start = (p-1)*itemShow;
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM items LIMIT ?, ?", [start, itemShow], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
app.get('/Dashboard', auth, (req, res) => {
    const pageNum = [];
    const {p} = req.query;
    listNewestReview(conn).then(async (result) => { 
        let listRev = result;
        await itemCount(conn, listRev).then((result) => {
            const pageCount = Math.ceil(JSON.parse(JSON.stringify(result))[0].total/itemShow);
            for(let i = 1; i<=pageCount; i++){
                pageNum[i-1] = i;
            }
        })
        await getItems(conn, p).then((result)=>{
            const start = (p-1)*itemShow;
            const end = start + itemShow;
            // console.log(result);
            res.render('Dashboard', {
                username: sessions.username,
                nama: sessions.nama,
                url: sessions.url,
                lsReview: listRev,
                results: result,
                pages: pageNum,
                start: start,
                end: end
            })
        })
    });
});

let minRev = 0;
const get_jumlahKat = (conn, minRev) => {
    console.log(minRev);
    return new Promise((resolve, reject) => {
        conn.query("SELECT kategori.nama_kategori, count(review_id) FROM `stat_kat` RIGHT OUTER JOIN kategori ON kategori.nama_kategori = stat_kat.nama_kategori GROUP BY kategori.nama_kategori HAVING count(review_id) >= ? ORDER BY count(review_id) DESC LIMIT 10",[minRev], (err, result) => {
            if(err){
                reject(err);
            } else{
                console.log(result);
                resolve(result);
            }
        })
    })
};

const get_jumlahSubKat = (conn, minRev) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT sub_kategori.nama_sub_kategori, COUNT(review_id) FROM stat_subkat RIGHT OUTER JOIN sub_kategori on sub_kategori.sub_kategori_id = stat_subkat.sub_kategori_id GROUP BY stat_subkat.nama_sub_kategori HAVING count(review_id) >= ? ORDER BY COUNT(review_id) DESC LIMIT 10",[minRev], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
};

const get_nilaiKat = (conn, minRev) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT kategori.nama_kategori, CAST(AVG(angka_review) as INT) FROM stat_kat RIGHT OUTER JOIN kategori on kategori.kategori_id = stat_kat.kategori_id GROUP BY kategori.nama_kategori HAVING count(review_id) >= ? ORDER BY AVG(angka_review) DESC LIMIT 10",[minRev], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
};

const get_nilaiSubKat = (conn, minRev) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT sub_kategori.nama_sub_kategori, CAST(AVG(angka_review) as INT) FROM stat_subkat RIGHT OUTER JOIN sub_kategori on sub_kategori.sub_kategori_id = stat_subkat.sub_kategori_id GROUP BY sub_kategori.nama_sub_kategori HAVING count(review_id) >= ? ORDER BY AVG(angka_review) DESC LIMIT 10",[minRev], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
};

// app.post('/getMinRev', async (req, res) => {
//     res.json(minRev);
// })

app.post('/getDataGrafikSatu', async (req, res) => {
    let dataJumlah = await get_jumlahKat(conn, minRev);
    res.json(dataJumlah);

})

app.post('/getDataGrafikDua', async (req, res) => {
    let dataJumlah = await get_jumlahSubKat(conn, minRev);
    res.json(dataJumlah);
})

app.post('/getDataGrafikTiga', async (req, res) => {
    let dataJumlah = await get_nilaiKat(conn, minRev);
    res.json(dataJumlah);
})

app.post('/getDataGrafikEmpat', async (req, res) => {
    let dataJumlah = await get_nilaiSubKat(conn, minRev);
    res.json(dataJumlah);
})

//-----------------------------------------User Profile----------------------------------------------------
app.get('/UserProfile', auth, async (req, res) => {
    let usrfollowing, usrfollower, barreview, listsFollowing, listsFollower, listsReview;
    await following(conn, sessions.username).then((jmlhFollowing) => {
        usrfollowing = jmlhFollowing;
    });
    await follower(conn, sessions.username).then((jmlhFollower) => {
        usrfollower = jmlhFollower;
    });
    await review(conn, sessions.username).then((jmlhReview) => {
        barreview = jmlhReview;
    });
    await listFollowing(conn, sessions.username).then((lsFollowing) => {
        listsFollowing = lsFollowing;
    });
    await listFollower(conn, sessions.username).then((lsFollower) => {
        listsFollower = lsFollower;
    });
    await listReview(conn, sessions.username).then((lsReview) => {
        listsReview = lsReview;
    });
    res.render('UserProfile', {
        following: usrfollowing[0].jumlahFollowing,
        followers: usrfollower[0].jumlahFollower,
        review: barreview[0].jumlahReview,
        lsFollowing: listsFollowing,
        lsFollower: listsFollower,
        lsReview: listsReview,
        username: sessions.username,
        url: sessions.url
    });
});

const listReview  = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT `write_review`.`username`, DATE(`write_review`.`tanggal`) as tanggal, `review`.`teks_review`, `review`.`angka_review`, `tas`.`foto`, `merek`.`nama_merek`, `tas`.`tas_id` FROM `write_review` JOIN `review` ON `write_review`.`review_id` = `review`.`review_id` JOIN `tas` ON `tas`.`tas_id` = `review`.`tas_id` JOIN `merek` ON `tas`.`merek_id` = `merek`.`merek_id` JOIN `sub_kategori` ON `sub_kategori`.`sub_kategori_id` = `tas`.`sub_kategori_id` JOIN `kategori` ON `kategori`.`kategori_id` = `sub_kategori`.`kategori_id` WHERE `write_review`.`username`=?", [username], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const review = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT COUNT(review_id) as jumlahReview FROM write_review WHERE username=?", [username], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const following = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT COUNT(username2) as jumlahFollowing FROM follow WHERE username1=?", [username], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const follower = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT COUNT(username1) as jumlahFollower FROM follow WHERE username2=?", [username], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const listFollowing = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT username2 FROM follow WHERE username1=?", [username], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const listFollower = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT username1 FROM follow WHERE username2=?", [username], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

// -----------------------------------Another User--------------------------------------------------------
const follow = (conn, username1, username2) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT COUNT(username1) as teman FROM follow WHERE username1=? AND username2=?", [username1, username2], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const addFollow = (conn, username1, username2) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO follow (username1, username2) VALUE (?,?)", [username1, username2], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.get('/ngefollow', async (req, res) => {
    let follow2an = 0;
    await follow(conn, sessions.username, username).then((follow) => {
        follow2an = follow[0].teman;
    });
    const data = {
        follow: follow2an
    }
    res.send(data);
});

app.post('/ngefollow', async (req, res) => {
    await addFollow(conn, sessions.username, username).then((follow) => {
    });
    await follower(conn, username).then((jmlhFollower) => {
        const data = {
            angkaFollower: jmlhFollower,
            usernamesaya: sessions.username
        }
        res.json(data);
    });
});


let username;

app.get('/anotherUser/:username', auth, async (req, res) => {
    
    username =  req.params.username;
    if (username == sessions.username){
        res.redirect('/UserProfile');
    } else {
        let usrfollowing, usrfollower, barreview, listsFollowing, listsFollower, listsReview;
        
        await following(conn, username).then((jmlhFollowing) => {
            usrfollowing = jmlhFollowing;
        });
        await follower(conn, username).then((jmlhFollower) => {
            usrfollower = jmlhFollower;
        });
        await review(conn, username).then((jmlhReview) => {
            barreview = jmlhReview;
        });
        await listFollowing(conn, username).then((lsFollowing) => {
            listsFollowing = lsFollowing;
        });
        await listFollower(conn, username).then((lsFollower) => {
            listsFollower = lsFollower;
        });
        await listReview(conn, username).then((lsReview) => {
            listsReview = lsReview;
        });
        res.render('anotherUser', {
            following: usrfollowing[0].jumlahFollowing,
            followers: usrfollower[0].jumlahFollower,
            review: barreview[0].jumlahReview,
            lsFollowing: listsFollowing,
            lsFollower: listsFollower,
            lsReview: listsReview,
            username: sessions.username,
            usernameAnother: username,
            url: sessions.url
        });
    }
});


// -----------------------------------User settings--------------------------------------------------------
const cariPengguna = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM pengguna WHERE username=?", [username], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.get('/userProfileSettings', auth, (req, res) => {
    cariPengguna(conn, sessions.username).then((result) => {
        res.render('userProfileSettings', {
            nama: result[0].nama_lengkap,
            email: result[0].email,
            username: sessions.username,
            password: result[0].password,
            url: sessions.url
        });
    });
});

const updatePengguna = (conn, data, usernameOld) => {
    return new Promise((resolve, reject) => {
        conn.query("UPDATE Pengguna SET nama_lengkap=?, email=?, password=? WHERE username=?", [data.nama, data.email, data.password, usernameOld], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.post('/userProfileSettings', (req, res) => {
    const data = req.body;
    if (data){ 
        cekUsername(conn, sessions.username).then((result) => {
            if (result[0].count == 1){
                updatePengguna(conn, data, sessions.username).then((result) => {
                    res.render('login', {
                        cek: true
                    });
                });
            } else {
                res.redirect('/userProfileSettings');
            }
        });
    } else {
        res.redirect('/userProfileSettings');
    }
});

//-----------------------Search-----------------------------------------------------------

app.get('/search', auth, async (req, res) => {
    const kataKunci = req.query.search;
    let lsUsers;
    await searchUser(conn, kataKunci).then((result) => {
        lsUsers = result;
    });
    let lsBags;
    await listSearchBag(conn, kataKunci).then((result) => {
        lsBags = result;
    });
    res.render('search', {
        username: sessions.username,
        nama: sessions.nama,
        url: sessions.url,
        listUsers: lsUsers,
        listBags: lsBags
    });
});

const searchUser = (conn, kataKunciTertentu) => {
    return new Promise((resolve, reject) => {
        const like = kataKunciTertentu.replace(/_/g, "\\_");
        conn.query("SELECT username FROM `pengguna` WHERE username LIKE '%" + like + "%' AND username != 'Admin123'", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const listSearchBag  = (conn, kataKunciTertentu) => {
    return new Promise((resolve, reject) => {
        const like = kataKunciTertentu.replace(/_/g, "\\_");
        conn.query("SELECT tas.tas_id, tas.panjang, tas.lebar, tas.tinggi, tas.warna_utama, tas.foto, merek.nama_merek, designer.nama_designer, sub_kategori.nama_sub_kategori, rata2Bintang.bintang FROM tas LEFT OUTER JOIN merek ON tas.merek_id = merek.merek_id LEFT OUTER JOIN designer ON designer.designer_id = tas.designer_id LEFT OUTER JOIN sub_kategori ON sub_kategori.sub_kategori_id = tas.sub_kategori_id LEFT OUTER JOIN (SELECT tas_id, round(avg(angka_review)) AS bintang FROM review GROUP BY tas_id) AS rata2Bintang ON rata2Bintang.tas_id = tas.tas_id WHERE nama_merek LIKE '%" + like + "%'", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.post('/cari', (req, res) => {
    let kataKunci = req.body.kataKunci;
    searchUser(conn, kataKunci).then((result) => {
        res.json(result);
    });
});

//-----------------------Admin-----------------------------------------------------------

app.get('/AdminProfile', auth, (req, res) => {
    res.render('AdminProfile', {
        username: sessions.username,
        nama: sessions.nama,
        url: sessions.url
    });
});

//-------------------------kategori dan sub kategori-------------------------------------

const kategori = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM kategori", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.post('/tambahkategori', (req, res) => {
    let namakategori = req.body.namaKategori;
    const kosong = true;
    if (namakategori != ''){
        cariKat(conn, namakategori).then((result) => {
            const gaerror = false;
            if (!result[0]){
                addKategori(conn, namakategori).then((result) => {
                    res.json(namakategori);
                });
            } else {
                res.json(gaerror);
            }
        });
    } else {
        res.json(kosong);
    }
});

app.get('/addCategory', auth, (req, res) => {
    kategori(conn).then((result) => {
        res.render('addCategory', {
            username: sessions.username,
            kategori: result,
            url: sessions.url
        });
    });
});

const addKategori = (conn, addCat) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO kategori (nama_kategori) VALUES (?)", [addCat], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const cariKat = (conn, nama_kategori) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_kategori FROM kategori WHERE nama_kategori=?", [nama_kategori], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
//------------------subkategori

const SubKategori = (conn, idKategori) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_sub_kategori FROM sub_kategori WHERE kategori_id=?", [idKategori], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

let idKategori = '';
let kat = '';
app.get('/addSubCategory/:idKategori', auth, (req, res) => {
    idKategori = req.params.idKategori; // dapatkan id kategori
    SubKategori(conn, idKategori).then((result) => {
        cariKat(conn, idKategori).then((namaKat) => {
            kat = namaKat[0].nama_kategori;
            res.render('addSubCategory', {
                username: sessions.username,
                kategori: kat,
                subkategori: result,
                url: sessions.url
            });
        });
    });
});

app.post('/tambahsubkategori', (req, res) => {
    let namaSubKategori = req.body.namaSubKategori;
    const kosong = true;
    if (namaSubKategori != ''){
        cariSubKat(conn, namaSubKategori).then((result) => {
            const gaerror = false;
            if (!result[0]){
                addSubKategori(conn, namaSubKategori, idKategori).then((result) => {
                    res.json(namaSubKategori);
                });
            } else {
                res.json(gaerror);
            }
        });
    } else {
        res.json(kosong);
    }
});

const cariSubKat = (conn, nama_sub_kategori) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_sub_kategori FROM sub_kategori WHERE nama_sub_kategori=?", [nama_sub_kategori], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const addSubKategori = (conn, addSubCat, idKat) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES (?,?)", [addSubCat, idKat], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

//-------------------------tambah item bag----------------------------------------------
let _id;
let _merek = [];
let _designer = [];
let _kategori = [];
let _subkat = [];
let k, idK;

const set_id = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT tas_id AS 'maks' FROM tas HAVING tas_id = (SELECT MAX(tas_id) FROM tas)", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
};

//ambil data merek, designer, kategori, dan sub-kategori berdasarkan kategorinya dari database
const data_merek = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_merek FROM merek", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
const data_designer = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_designer FROM designer", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
const data_kategori = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_kategori FROM kategori", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
const get_idmerek = (conn, merek) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT merek_id FROM merek WHERE nama_merek = ?', [merek], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
const get_iddesigner = (conn, designer) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT designer_id FROM designer WHERE nama_designer=?", [designer], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
const get_idsubkat = (conn, subkat) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT sub_kategori_id FROM sub_kategori WHERE nama_sub_kategori=?", [subkat], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
const get_idkat = (conn, kat) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT kategori_id FROM kategori WHERE nama_kategori=?", [kat], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
const data_subkat = (conn, id_kat) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT nama_sub_kategori FROM sub_kategori WHERE kategori_id=?';
        conn.query(sql, [id_kat], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
//tambahkan item bag ke dalam database
const addBagManual = (conn, panjang, lebar, tinggi, warna, foto, idmerek, iddesigner, idsubkat) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO tas (panjang, lebar, tinggi, warna_utama, foto, merek_id, designer_id, sub_kategori_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
        [panjang, lebar, tinggi, warna, foto, idmerek, iddesigner, idsubkat], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
app.get("/getSubkat", (req, res) => {
    k = req.query.kategori;
    get_idkat(conn, k).then((result)=>{
        idK = (JSON.parse(JSON.stringify
            (result))[0]).kategori_id;
        data_subkat(conn, idK).then((result2) => {
            _subkat = [];
            for(let i of result2){
                _subkat.push(Object.values(JSON.parse(JSON.stringify(i))));
            }
            res.json(_subkat);
        });
    });
});

app.get('/addBagItem', auth, (req, res) => {
    data_merek(conn).then((result) => {
        _merek = result;
        console.log(_merek);
    })
    data_designer(conn).then((result) => {
        _designer = result;
        console.log(_designer);
    })
    data_kategori(conn).then((result) => {
        _kategori = result;
        console.log(_kategori);
    })
    set_id(conn).then((result) => {
        _id = (JSON.parse(JSON.stringify(result))[0].maks)+1;
        result+=1;
        res.render('addBagItem', {
            username: sessions.username,
            url: sessions.url,
            id: _id,
            merek: _merek,
            designer: _designer,
            kategori: _kategori,
            subkat: _subkat
        });
    })
});

//MULTER
const storageUploadFoto = multer.diskStorage({
    destination: function (req, file, callBack) {
        const bukti = `./public/images/${_id}`;
        try {
            if (!fs.existsSync(bukti)) {
                fs.mkdirSync(bukti);
            }
        } catch (err) {
            console.error(err);
        }
        callBack(null, `./public/images/${_id}/`);
    },
    filename: function (req, file, callBack){
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
let upload = multer({
    storage: storageUploadFoto
});

let idmerek, iddesigner, idsubkat;
app.post('/uploadManual', auth, upload.single('image'), async (req,res) => {
    const {bagid, panjang, lebar, tinggi, warna, merek, designer, subkat} = req.body; 
    const file = req.file.filename;
    await get_idmerek(conn,merek).then((result) => {
        idmerek = (JSON.parse(JSON.stringify(result))[0].merek_id);
    })
    await get_iddesigner(conn,designer).then((result) => {
        iddesigner = (JSON.parse(JSON.stringify(result))[0].designer_id);
    })
    await get_idsubkat(conn,subkat).then((result) => {
        idsubkat = (JSON.parse(JSON.stringify(result))[0].sub_kategori_id);
    })
    const bukti = `/images/${_id}/${file}`;
    // console.log(bukti);
    await addBagManual(conn, panjang, lebar, tinggi, warna, bukti, idmerek, iddesigner, idsubkat).then((result) => {
        set_id(conn).then((result) => {
            _id = (JSON.parse(JSON.stringify(result))[0].maks)+1;
            result+=1;
            res.redirect('/addBagItem');
        })
    })
})

const storageUploadCSV = multer.diskStorage({
    destination: function (req, file, callBack) {
        callBack(null, './public/upload/');
    },
    filename: function (req, file, callBack){
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
let uploadCSV = multer({
    storage: storageUploadCSV
});

app.post('/uploadFile', auth, uploadCSV.single('file_tas'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
      }
    
    const result = [];
    const file = req.file.filename;
    fs.createReadStream(`./public/upload/${file}`)
        .on('error', (err) => {
            console.error('Error reading file:', err);
        })
        .pipe(parse({ delimiter: ',', headers: false }))
        .on('data', (data) => result.push(data))
        .on('end', async () => {
        for (let i of result) {
            let foto = `/images/default/default.jpg`;
            addBagManual(conn, i[0], i[1], i[2], i[3], foto, i[5], i[6], i[7]);
            _id+=1;
      }
      res.redirect('/addBagItem');
    });
});
//------------------------------------Review Setting----------------------------------------------

let rev1, rev2, rev3, rev4, rev5;
app.get('/reviewSettings', auth, (req, res) => {
    res.render('reviewSettings', {
        username: sessions.username,
        url: sessions.url
    });
});

app.post('/uploadForm', auth, (req, res) => {
    console.log(req.body)
    minRev = req.body.minimal;
    rev1 = req.body.satu;
    rev2 = req.body.dua;
    rev3 = req.body.tiga;
    rev4 = req.body.empat;
    rev5 = req.body.lima;
    console.log(minRev, rev1, rev2, rev3, rev4, rev5);
    res.render('AdminProfile', {
        username: sessions.username,
        nama: sessions.nama,
        url: sessions.url
    });
})

//-------------------------laporan sitatistika tas----------------------------------------------

app.get('/statistikTas', auth, (req, res) => {
    res.render('statistikTas', {
        username: sessions.username,
        url: sessions.url,
        showBy: "Not Choosen Yet!"
    });
});

//laporan statistik per kategori
const per_kat = (conn, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT nama_kategori, COUNT(review_id) AS "byk", MIN(angka_review) AS "min", MAX(angka_review) AS "max", AVG(angka_review) AS "avg" FROM stat_kat WHERE tanggal>=? AND tanggal<=? GROUP BY nama_kategori', [fromDate, toDate], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
//laporan statistik per sub-kategori
const per_subkat = (conn, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT nama_sub_kategori, COUNT(review_id) AS "byk", MIN(angka_review) AS "min", MAX(angka_review) AS "max", AVG(angka_review) AS "avg" FROM stat_subkat WHERE tanggal>=? AND tanggal<=? GROUP BY nama_sub_kategori', [fromDate, toDate], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
//laporan statistik per merek
const per_merek = (conn, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT nama_merek, COUNT(review_id) AS "byk", MIN(angka_review) AS "min", MAX(angka_review) AS "max", AVG(angka_review) AS "avg" FROM stat_merek WHERE tanggal>=? AND tanggal<=? GROUP BY nama_merek', [fromDate, toDate], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
//laporan statistik per designer
const per_designer = (conn, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT nama_designer, COUNT(review_id) AS "byk", MIN(angka_review) AS "min", MAX(angka_review) AS "max", AVG(angka_review) AS "avg" FROM stat_designer WHERE tanggal>=? AND tanggal<=? GROUP BY nama_designer', [fromDate, toDate], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

let tabel_kat, tabel_subkat, tabel_merek, tabel_designer;
app.post('/getTabel', async (req, res) => {
    let fromDate = req.body.from;
    let toDate = req.body.to;
    console.log(fromDate,"*");
    console.log(toDate,"*");
    await per_kat(conn, fromDate, toDate).then((result) => {
        tabel_kat = [];
        for(let i of result){
            tabel_kat.push(Object.values(JSON.parse(JSON.stringify(i))));
        }
    })
    await per_subkat(conn, fromDate, toDate).then((result) => {
        tabel_subkat = [];
        for(let i of result){
            tabel_subkat.push(Object.values(JSON.parse(JSON.stringify(i))));
        }
    })
    await per_merek(conn, fromDate, toDate).then((result) => {
        tabel_merek = [];
        for(let i of result){
            tabel_merek.push(Object.values(JSON.parse(JSON.stringify(i))));
        }
    })
    await per_designer(conn, fromDate, toDate).then((result) => {
        tabel_designer = [];
        for(let i of result){
            tabel_designer.push(Object.values(JSON.parse(JSON.stringify(i))));
        }
    })
    console.log("kat ", tabel_kat);
    console.log("subkat ", tabel_subkat);
    console.log("merek ", tabel_merek);
    console.log("designer ", tabel_designer);
    res.json("server accessed the table");
});

app.post('/showTabel', (req, res) => {
    let by = req.body.by;
    console.log(by);
    if(by=="Category"){
        res.json(tabel_kat);
    }else if(by=="Sub-Category"){
        res.json(tabel_subkat);
    }else if(by=="Merek"){
        res.json(tabel_merek);
    }else if(by=="Designer"){
        res.json(tabel_designer);
    }else{
        res.status(400).send('Input tidak dikenal');
        return;
    }
})

//-------------------------- tas -------------------------------------------------------

const get_pathFoto = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT foto FROM tas WHERE tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_namaMerek = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_merek FROM `merek` JOIN tas on merek.merek_id = tas.merek_id WHERE tas.tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_namaDesigner = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_designer FROM `designer` JOIN tas on designer.designer_id = tas.designer_id WHERE tas.tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_subkat = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_sub_kategori FROM `sub_kategori` JOIN tas on sub_kategori.sub_kategori_id = tas.sub_kategori_id WHERE tas.tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_kat = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT kategori.nama_kategori FROM sub_kategori JOIN kategori ON sub_kategori.kategori_id = kategori.kategori_id JOIN tas ON tas.sub_kategori_id = sub_kategori.sub_kategori_id WHERE tas_id =?', [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_warna = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT warna_utama FROM tas WHERE tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_panjang = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT panjang FROM tas WHERE tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_lebar = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT lebar FROM tas WHERE tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_tinggi = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT tinggi FROM tas WHERE tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const listReviewTas  = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT `write_review`.`username`, DATE(`write_review`.`tanggal`) as tanggal, `review`.`teks_review`, `review`.`angka_review`, `tas`.`foto`, `merek`.`nama_merek`, tas.tas_id FROM `write_review` JOIN `review` ON `write_review`.`review_id` = `review`.`review_id` JOIN `tas` ON `tas`.`tas_id` = `review`.`tas_id` JOIN `merek` ON `tas`.`merek_id` = `merek`.`merek_id` JOIN `sub_kategori` ON `sub_kategori`.`sub_kategori_id` = `tas`.`sub_kategori_id` JOIN `kategori` ON `kategori`.`kategori_id` = `sub_kategori`.`kategori_id` WHERE tas.tas_id=? ORDER BY tanggal DESC", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const rataReview = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT round(avg(angka_review)) FROM review WHERE tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const cekReview = (conn, _id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT COUNT(review_id) FROM review WHERE tas_id=?", [_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}
let id_bag;
app.get('/bag/:idbag', async (req, res) => {
    id_bag = req.params.idbag;
    let foto_path; let namaMerek; let namaDesigner; let ket_sub_kat; let ket_kat; let warnaTas; let panjangTas; let lebarTas; let tinggiTas;
    let jumlahR; let lsReview; ;let rataR;

    await get_pathFoto(conn, id_bag).then((result) => {
        foto_path = (JSON.parse(JSON.stringify(result))[0])
        foto_path = foto_path.foto;
        console.log(foto_path)
    })
    await get_namaMerek(conn, id_bag).then((result) => {
        namaMerek = (JSON.parse(JSON.stringify(result))[0])
    })
    await get_namaDesigner(conn, id_bag).then((result) => {
        namaDesigner = (JSON.parse(JSON.stringify(result))[0])
    })
    await get_subkat(conn, id_bag).then((result) => {
        ket_sub_kat = (JSON.parse(JSON.stringify(result))[0])
    })
    await get_kat(conn, id_bag).then((result) => {
        ket_kat = (JSON.parse(JSON.stringify(result))[0])
    })
    await get_warna(conn, id_bag).then((result) => {
        warnaTas = (JSON.parse(JSON.stringify(result))[0])
    })
    await get_panjang(conn, id_bag).then((result) => {
        panjangTas = (JSON.parse(JSON.stringify(result))[0])
    })
    await get_lebar(conn, id_bag).then((result) => {
        lebarTas = (JSON.parse(JSON.stringify(result))[0])
    })
    await get_tinggi(conn, id_bag).then((result) => {
        tinggiTas = (JSON.parse(JSON.stringify(result))[0])
    })
    await cekReview(conn, id_bag).then((result) => {
        jumlahR = result[0]['COUNT(review_id)'];
    })
    await rataReview(conn, id_bag).then((result) => {
        rataR = result[0]['round(avg(angka_review))'];
    })
    await listReviewTas(conn, id_bag).then((result) => { 
        res.render('bag', {
            username: sessions.username,
            url: sessions.url,
            id: id_bag,
            path: foto_path, 
            merek: namaMerek.nama_merek,
            designer: namaDesigner.nama_designer,
            kategori: ket_kat.nama_kategori,
            subkat: ket_sub_kat.nama_sub_kategori,
            warna: warnaTas.warna_utama,
            panjang: panjangTas.panjang,
            lebar : lebarTas.lebar,
            tinggi : tinggiTas.tinggi,
            rataReview : rataR,
            review: jumlahR,
            lsReview: result
        });
    })
})

//---------------------add review-----------------------------------------------

app.get('/addReview', (req, res) => {
    res.render('addReview', {
        username: sessions.username,
        url: sessions.url
    });
});

const addReviews = (conn, angkaReview, teksReview) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO review (angka_review, teks_review, tas_id) VALUES (?,?,?)", [angkaReview, teksReview, _id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

const get_review_id_max = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT max(review_id) from review", (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
};

const addWriteReview = (conn, usern, review_id) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO write_review (tanggal, username, review_id) VALUES (curdate(),?,?)", [ usern, review_id], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.post('/uploadRev', async (req, res) => {
    const data = req.body;
    _id = id_bag; //ini cara tau id tas yg mau di add gimana yak?

    let angkaReview = data.nilai; 
    let teksReview = data.review;

    if (!req.body.nilai) {
        res.status(400).send('Anda belum menginput angka review.');
        return;
      }
    
    await addReviews(conn, angkaReview, teksReview).then((result) => {
        // console.log(result);
    })

    let review_id;
    await get_review_id_max(conn).then((result) => {
        review_id = result[0]['max(review_id)'];
    })
    
    let usern = sessions.username;
    await addWriteReview(conn, usern, review_id).then((result) => {
        res.redirect('/bag/'+_id);
    })
});
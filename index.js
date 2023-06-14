import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import session from 'express-session';
import memoryStore from 'memorystore';
import multer from 'multer';
import path from 'path' ;
import parse from 'csv-parser';
import fs from 'fs';
// import path from 'path';

// import { follow } from './public/js/follow.js';

const PORT = 8080;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.resolve('public')));
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
        checkPeriod: 1*60*60*1000   //ms
    }),
    name: 'nama',
    secret: 'rahasiasecret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: true, 
        maxAge:30*60*1000 
    }
}));

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

let sessions;
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        cekPengguna(conn, username, password).then((nama) => {
            if (!nama[0]){
                res.redirect('/');
            } else {
                sessions = req.session;
                sessions.username = username;
                sessions.nama = nama[0].nama_lengkap;
                if (sessions.username == 'Admin123'){
                    sessions.url = '/AdminProfile';
                } else {
                    sessions.url = '/UserProfile';
                }
                res.redirect('Dashboard');
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
                    res.render('login');
                });
            } else {
                res.redirect('/signup');
            }
        });
    } else {
        res.redirect('/signup');
    }
});

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
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO pengguna VALUES (?,?,?,?)", [data.nama, data.email, data.username, data.password], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.get('/Dashboard', (req, res) => {
    res.render('Dashboard', {
        username: sessions.username,
        nama: sessions.nama,
        url: sessions.url
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        username: sessions.username,
        url: sessions.url
    });
});

//-----------------------------------------User Profile----------------------------------------------------
app.get('/UserProfile', (req, res) => {
    
    following(conn, sessions.username).then((jmlhFollowing) => {
        follower(conn, sessions.username).then((jmlhFollower) => {
            review(conn, sessions.username).then((jmlhReview) => {
                listFollowing(conn, sessions.username).then((lsFollowing) => {
                    listFollower(conn, sessions.username).then((lsFollower) => {
                        listReview(conn, sessions.username).then((lsReview) => {
                            console.log(lsReview)
                            res.render('UserProfile', {
                                review: jmlhReview[0].jumlahReview,
                                followers: jmlhFollower[0].jumlahFollower,
                                following: jmlhFollowing[0].jumlahFollowing,
                                lsFollower: lsFollower,
                                lsFollowing: lsFollowing,
                                lsReview: lsReview,
                                username: sessions.username,
                                url: sessions.url
                            });
                        });
                    });
                });
            });
        });
    });
});

const listReview  = (conn, username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT `write_review`.`username`, DATE(`write_review`.`tanggal`) as tanggal, `review`.`teks_review`, `review`.`angka_review`, `tas`.`foto`, `merek`.`nama_merek` FROM `write_review` JOIN `review` ON `write_review`.`review_id` = `review`.`review_id` JOIN `tas` ON `tas`.`tas_id` = `review`.`tas_id` JOIN `merek` ON `tas`.`merek_id` = `merek`.`merek_id` JOIN `sub_kategori` ON `sub_kategori`.`sub_kategori_id` = `tas`.`sub_kategori_id` JOIN `kategori` ON `kategori`.`kategori_id` = `sub_kategori`.`kategori_id` WHERE `write_review`.`username`=?", [username], (err, result) => {
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

app.get('/userProfileSettings', (req, res) => {
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
                    res.render('login');
                });
            } else {
                res.redirect('/userProfileSettings');
            }
        });
    } else {
        res.redirect('/userProfileSettings');
    }
});

//-----------------------Admin-----------------------------------------------------------

app.get('/AdminProfile', (req, res) => {
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

app.get('/addCategory', (req, res) => {
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

app.post('/addCategory', (req, res) => {
    const { addCat } = req.body;
    if (addCat) {
        addKategori(conn, addCat).then((result) => {
            res.redirect('/addCategory');
        });
    } else {
        res.redirect('/addCategory');
    }
});

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
const cariKat = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT nama_kategori FROM kategori WHERE kategori_id=?", [idKategori], (err, result) => {
            if(err){
                reject(err);
            } else{
                // retrun katanya aja
                resolve(result);
            }
        })
    })
}

let kat = '';
app.get('/addSubCategory/:idKategori', (req, res) => {
    idKategori = req.params.idKategori;
    SubKategori(conn, idKategori).then((result) => {
        cariKat(conn).then((namaKat) => {
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

const addSubKategori = (conn, addSubCat, idKategori) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO sub_kategori (nama_sub_kategori, kategori_id) VALUES (?,?)", [addSubCat, idKategori], (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

app.post('/addSubCategory/:idKategori', (req, res) => {
    const { addSubCat } = req.body;
    if (addSubCat){
        addSubKategori(conn, addSubCat, idKategori).then((result) => {
            res.redirect(`/addSubCategory/${idKategori}`);
        });
    } else {
        res.redirect(`/addSubCategory/${idKategori}`);
    }
}); 

//-------------------------tambah item bag----------------------------------------------
//ambil id dari database
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
}
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

app.get('/addBagItem', (req, res) => {
    res.render('addBagItem', {
        username: sessions.username,
        url: sessions.url
    });
});

let _id;
let _merek = [];
let _designer = [];
let _kategori = [];
let _subkat = [];
let k, idK;
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
app.get('/uploadManual', (req, res) => {
    data_merek(conn).then((result) => {
        _merek = result;
    })
    data_designer(conn).then((result) => {
        _designer = result;
    })
    data_kategori(conn).then((result) => {
        _kategori = result;
    })

    set_id(conn).then((result) => {
        _id = (JSON.parse(JSON.stringify(result))[0].maks)+1;
        result+=1;
        res.render('uploadManual', {
            id: _id,
            merek: _merek,
            designer: _designer,
            kategori: _kategori,
            subkat: _subkat
        });
    })
});


//MULTER
let id;
const storageUploadFoto = multer.diskStorage({
    destination: function (req, file, callBack) {
        id = _id; //harusnya pake bagid?
        // console.log(id);
        const bukti = `./public/images/${id}`;
        try {
            if (!fs.existsSync(bukti)) {
                fs.mkdirSync(bukti);
            }
        } catch (err) {
            console.error(err);
        }
        callBack(null, `./public/images/${id}/`);
    },
    filename: function (req, file, callBack){
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

 
let upload = multer({
    storage: storageUploadFoto
});

let idmerek, iddesigner, idsubkat;
app.post('/uploadManual', upload.single('image'), async (req,res) => {
    const {bagid, panjang, lebar, tinggi, warna, merek, designer, subkat} = req.body; //bagid undefined
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
    const bukti = `./public/images/${id}/${file}`;
    // console.log(bukti);
    await addBagManual(conn, panjang, lebar, tinggi, warna, bukti, idmerek, iddesigner, idsubkat).then((result) => {
        res.render('addBagItem', {
            username: sessions.username,
            url: sessions.url
        });
    })
})


//upload pake csv
app.get('/uploadFile', (req, res) => {
    set_id(conn).then((result) => {
        _id = (JSON.parse(JSON.stringify(result))[0].maks)+1;
        result+=1;
        res.render('uploadFile', {
            id: _id
        });
    })
});

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

app.post('/uploadFile', uploadCSV.single('file_tas'), (req, res) => {
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
            let foto = `./public/images/${_id}/${i[4]}`;
            addBagManual(conn, i[0], i[1], i[2], i[3], foto, i[5], i[6], i[7]);
      }
      res.render('addBagItem', {
        username: sessions.username,
        url: sessions.url
      });
    });
});
//------------------------------------Review Setting----------------------------------------------


app.get('/reviewSettings', (req, res) => {
    res.render('reviewSettings', {
        username: sessions.username,
        url: sessions.url
    });
});

//-------------------------laporan sitatistika tas----------------------------------------------

app.get('/statistikTas', (req, res) => {
    res.render('statistikTas', {
        username: sessions.username,
        url: sessions.url
    });
});
 
//-------------------------- tas -------------------------------------------------------

app.get('/bag', (req, res) => {
    res.render('bag', {
        username: sessions.username,
        url: sessions.url,
        id: _id
        // merek: _merek,
        // designer: _designer,
        // kategori: _kategori,
        // subkat: _subkat
    });
});
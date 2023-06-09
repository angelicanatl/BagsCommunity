import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import session from 'express-session';
import memoryStore from 'memorystore';

const PORT = 8080;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

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
        checkPeriod: 1*60*60*1000
    }),
    name: 'nama',
    secret: 'rahasiasecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
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
                sessions.nama = nama;

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
        addPengguna(conn,data).then((result) => {
            res.render('login');
        });
    } else {
        res.redirect('/signup');
    }
});

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

app.get('/UserProfile', (req, res) => {
    res.render('UserProfile', {
        username: sessions.username,
        url: sessions.url
    });
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
    addKategori(conn, addCat).then((result) => {
        res.redirect('addCategory');
    });
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
            console.log(namaKat[0].nama_kategori);
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
    addSubKategori(conn, addSubCat, idKategori).then((result) => {
        res.redirect('addSubCategory');
    });
});

//-------------------------tambah item bag----------------------------------------------

app.get('/addBagItem', (req, res) => {
    res.render('addBagItem', {
        username: sessions.username,
        url: sessions.url
    });
});

const id = 1; // nanti ambil id dari database
app.get('/uploadFile', (req, res) => {
    res.render('uploadFile', {
        id: id
    });
});

app.get('/uploadManual', (req, res) => {
    res.render('uploadManual', {
        id: id
    });
});

app.get('/reviewSettings', (req, res) => {
    res.render('reviewSettings', {
        username: sessions.username,
        url: sessions.url
    });
});

app.get('/statistikTas', (req, res) => {
    res.render('statistikTas', {
        username: sessions.username,
        url: sessions.url
    });
});
 
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
    
// let username = 'joan_nat';
// let nama = 'Joan Natalie'; // nnti ambil dari database
app.get('/Dashboard', (req, res) => {
    res.render('Dashboard', {
        username: sessions.username,
        nama: sessions.nama
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        username: sessions.username
    });
});

app.get('/UserProfile', (req, res) => {
    res.render('UserProfile', {
        username: sessions.username
    });
});

app.get('/AdminProfile', (req, res) => {
    res.render('AdminProfile', {
        username: username,
        nama: nama
    });
});

const kategori = ['Back Pack', 'Koper', 'Hand Bag', 'Another Bag']
app.get('/addCatAndSub', (req, res) => {
    res.render('addCategory', {
        username: username,
        kategori: kategori
    });
});

const namaKat = 'BackPack';
// nanti ambil nama kategori yang dipilih buat WHERE sintaks
const subkategori = ['School backpack', 'Cross Body backpack', 'Mini backpack', 'Laptop backpack'];
// nanti ambil subkategori di database
app.get('/addSubCategory', (req, res) => {
    res.render('addSubCategory', {
        username: username,
        kategori: namaKat,
        subkategori: subkategori
    });
});

app.get('/addBagItem', (req, res) => {
    res.render('addBagItem', {
        username: username
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
        username: username
    });
});

app.get('/statistikTas', (req, res) => {
    res.render('statistikTas', {
        username: username
    });
});
 
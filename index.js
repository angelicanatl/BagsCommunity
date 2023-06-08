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
    secret: 'rahasia',
    resave: false,
    saveUninitialized: false
}));

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
app.get('/', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.post('/signup', (req, res) => {
    const data = req.body;
    addPengguna(conn,data)
    .then((result) => {
        res.render('login');
    })
});
 
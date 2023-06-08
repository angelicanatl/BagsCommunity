import express from 'express';
import bodyParser from 'body-parser';

const PORT = 8080;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

let username = 'joan_nat';
let nama = 'Joan Natalie'; // nnti ambil dari database
app.get('/', (req, res) => {
    res.render('Dashboard', {
        username: username,
        nama: nama
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        username: username
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

app.listen(PORT, (err) => {
    if (err){
        console.error('Server error');
    } else {
        console.log(`Server is ready, listening on port ${PORT}`);
    }
});
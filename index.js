import express from 'express';
import bodyParser from 'body-parser';

const PORT = 8080;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('Dashboard');
});
 
app.listen(PORT, (err) => {
    if (err){
        console.error('Server error');
    } else {
        console.log(`Server is ready, listening on port ${PORT}`);
    }
});
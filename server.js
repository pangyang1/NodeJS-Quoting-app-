var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/quotingDojo');

var quoteSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    quote: {type: String, required: true, minlength: 8}},
    {timestamps: true});

mongoose.model('Quote', quoteSchema);
var Quote = mongoose.model('Quote');
mongoose.Promise = global.Promise;

app.get('/', function(req, res) {
    res.render('index');
})
app.post('/quotes', function(req, res) {
    console.log('post req on quotes')
    var quote = new Quote;
    quote.name = req.body.name;
    quote.quote = req.body.quote;
    quote.save(function(err) {
        if (err) {
            console.log('uh oh!', err);
        } else {
            console.log('succesfully added a new quote');
        }
    })
    res.redirect('/')
})
app.get('/quotes', function(req, res) {
    console.log('get req on quotes');
    Quote.find({}, function(err, quotes) {
        if (err) {
            console.log('error getting quotes', err);
        } else {
            console.log('successfully got all the quotes');
            res.render('show', {quotes: quotes});
        }
    })
})

app.listen(8000, function() {
    console.log('listening on port 8000');
})

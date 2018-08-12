const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


let allTags = [];
getTags()

app.get('/', function(req, res) {
  res.render('pages/index',{data: JSON.stringify(allTags)});
})

app.post('/tag', function(req, res) {
    let bodyTags = req.body.tag.replace(/\s+/g, '-').toLowerCase()
    getAlbums(bodyTags).then(results => results.map((url) => getAlbumInfo(url).then(info => { res.send(info); }).catch(e => null)))
})

function getTags () {
  return fetch(`https://bandcamp.com/tags`)
    .then(res => res.text())
    .then(text => cheerio.load(text))
    .then($ => $('#tags_cloud > a.tag').map((i, a) => $(a).text()).toArray())
    .then(results => allTags = results)
};

function getAlbums (t) {
  return fetch(`https://bandcamp.com/tag/${t}?sort_field=date`)
    .then(res => res.text())
    .then(text => cheerio.load(text))
    .then($ => $('ul.item_list li a').map((i, a) => $(a).attr('href')).toArray())
};

function getAlbumInfo (a) {
  return fetch(`${a}`)
    .then(res => res.text())
    .then(text => cheerio.load(text))
    .then($ => $('meta[property="og:video"]').attr('content'))
    .then(result => 
          fetch(result)
          .then(res => res.text())
          .then(text => cheerio.load(text))
          .then($ => $('script').eq(4).html().trim())
          .then(r => r = r.substring(0, r.indexOf('var parentpage')).substring(17).replace(/^\s+|\s+$/g, ""))
          .then(r => r.slice(0,-1))
          )
};

app.listen(5000, function() {
    console.log('Running on port 5000')
});
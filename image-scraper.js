const rp = require('request-promise')
const $ = require('cheerio')
const fs = require('fs')

let options = {
    uri: 'https://www.pexels.com/search/nature',
    headers: {
        // Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
    }
}

function downloadImage(uri, filename, callback) {
    rp.head(uri, function(err, res, body){
        // console.log('content-type:', res.headers['content-type']);
        // console.log('content-length:', res.headers['content-length']);

        rp(uri)
            .pipe(fs.createWriteStream(filename))
            .on('close', callback)
    });
}

let getAllImageUris = function(callback) {

    rp(options)
        .then(function(html) {
            let images = $('img.photo-item__img', html)

            return Object.values(images).map(function(image) {
                if (image.attribs && 'src' in image.attribs) {
                    return image.attribs.src
                }
            }).filter((image) => {
                return typeof image !== 'undefined'
            })
        })

        .then(function(uris) {
            callback(uris)
        })

        .catch(function(err) {
            console.log(err)
        })
}

let getRandomImage = function(name, callback) {
    getAllImageUris((uris) => {
        let r = Math.floor(Math.random() * uris.length)
        let uri = uris[r]
        downloadImage(uri, name, callback)
    })
}

module.exports.getRandomImage = getRandomImage

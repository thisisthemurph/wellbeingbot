const fs = require('fs')

const imgScraper = require('./image-scraper')
const quoteScraper = require('./quote-scraper')
const iq = require('./image-quote')

const imagePath = 'temp.jpg'
const activeImagePath = 'temp_active.jpg'

// Remove the image files if they already exist
if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath)
}

if (fs.existsSync(activeImagePath)) {
    fs.unlinkSync(activeImagePath)
}

quoteScraper.getAllQuotes((quotes) => {
    let r = Math.floor(Math.random() * quotes.length)
    let quote = quotes[r]

    // Download a random image and add some text to it
    imgScraper.getRandomImage(imagePath, () => {
        iq.addTextToImage(imagePath, activeImagePath, quote.text)
    })

})
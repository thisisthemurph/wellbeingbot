const rp = require('request-promise')
const $ = require('cheerio')

let options = {
    uri: 'https://trans4mind.com/quotes/quotes-happiness-wellbeing.html',
    headers: {
        // Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
    }
}

let getAllQuotes = function(callback) {
    rp(options)
        .then((html) => {
            let quotes = $('p span b', html)
            let allQuotes = []

            for (let i = 0; i < quotes.length; i++) {
                // Parse the quote
                let text = quotes[i].children.filter((elem) => {
                    return elem.type === 'text'
                })
                .map((elem) => {
                    return elem.data
                })
                .join('\n')
                .trim()

                // This is an area of the web page we are not interested in
                // This is the end of the scraping
                if (quotes[i].parent.name === 'a') {
                    break;
                }

                // Parse the author
                let author = quotes[i].parent.next.data

                // Sometimes it's not that simple
                if (typeof author === 'undefined') {
                    // Try some additional possibilities
                    author = quotes[i].parent.parent.next.data
                    
                    if (typeof author == 'undefined') {
                        author = quotes[i].parent.next.next.data
                    } else {
                        author = quotes[i].parent.parent.next.data
                    }
                }

                allQuotes.push({
                    text: text.replace('“', '').replace('”', ''),
                    author: author.trim()
                })
            }

            return allQuotes
        })

        .then((allQuotes) => {
            callback(allQuotes)
        })

        .catch((err) => {
            console.log(err)
        })
}

module.exports.getAllQuotes = getAllQuotes
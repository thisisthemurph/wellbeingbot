const Jimp = require('jimp')

let addTextToImage = function addTextToImage(imagePath, activeImagePath, text) {
    Jimp.read(imagePath)
        .then(image => (image.clone().write(activeImagePath)))

        // read the cloned image
        .then(() => (Jimp.read(activeImagePath)))

        // load the font
        .then(image => (
            Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
                .then(font => ([image, font]))
        ))

        // write the text
        .then(data => {
            image = data[0]
            font = data[1]

            const width = image.bitmap.width
            const height = image.bitmap.height

            let textData = {
                text: text, //the text to be rendered on the image
                maxWidth: width - 20, //image width - 10px margin left - 10px margin right
                maxHeight: height - 20,
                placementX: 10, // 10px in on the x axis
                placementY: 10 //1024-(72+20)-10 //bottom of the image: height - maxHeight - margin 
            }

            return image.print(
                font, 
                textData.placementX, 
                textData.placementY, 
                {
                    text: textData.text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                },
                textData.maxWidth,
                textData.maxHeight
            )
        })

        .then(image => {
            return image
                .write(activeImagePath)
        })

        .catch(err => {
            console.log(err)
        })
}

module.exports.addTextToImage = addTextToImage
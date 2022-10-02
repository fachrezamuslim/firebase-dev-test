// Create cloud function to convert the ISBN number to a link and save it in the database
import * as functions from "firebase-functions"

export const convertISBNNumberToURL = functions.https.onCall((data, context) => {
    if (!data.isbn) return 'ISBN number is required';

    const validSize = ['S', 'M', 'L']
    if (data.imgSize && !validSize.includes(imgSize)) {
        return 'Invalid image size.'
    }

    const usedImgSize = data.imgSize || 'S'
    return {
        isbn: data.isbn,
        imgSize: usedImgSize,
        link: `https://covers.openlibrary.org/b/isbn/${data.isbn}-${usedImgSize}`
    }
})
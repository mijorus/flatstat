const download = require('download');
const fs = require('fs')

const filesToDelete = [`${__dirname}}/dist/sitemap.xml`, `${__dirname}}/dist/sitemap.xml`]

filesToDelete.forEach(element => {
    if (fs.existsSync(element)) {
        fs.unlinkSync(element)
    }
});

download('https://flathub-stats-backend.vercel.app/sitemap.xml', `${__dirname}/dist`, {})
    .then(() => {
        console.log('Download Completed');
    })
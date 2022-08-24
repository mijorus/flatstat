const download = require('download');
const fs = require('fs')

[`${__dirname}/tmp/search_data.json`, `${__dirname}}/dist/sitemap.xml`].forEach(element => {
    if (fs.existsSync(element)) {
        fs.unlinkSync(element)
    }
});


download('https://flathub-stats-backend.vercel.app/search_data.json', `${__dirname}/tmp`, {})
    .then(() => {
        console.log('Download Completed');
    })

download('https://flathub-stats-backend.vercel.app/sitemap.xml', `${__dirname}/dist`, {})
    .then(() => {
        console.log('Download Completed');
    })
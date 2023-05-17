const download = require('download');
const fs = require('fs')

const filesToDelete = [`${__dirname}/tmp/search_data.json`];

console.log(process.env.VERCEL_URL);

filesToDelete.forEach(element => {
    if (fs.existsSync(element)) {
        fs.unlinkSync(element)
    }
});


download('https://flathub-stats-backend.vercel.app/search_data.json', `${__dirname}/tmp`, {})
    .then(() => {
        console.log('Download Completed');
    })

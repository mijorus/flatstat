import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePrerender from 'vite-plugin-prerender'
import path from 'path'
import searchData from './tmp/search_data.json'

const Renderer = vitePrerender.PuppeteerRenderer

const routes =  ['/','/libraries']

// const searchDataString = fs.readFileSync('./tmp/search_data.json',{encoding:'utf8', flag:'r'})
// const searchData = JSON.parse(searchDataString)

searchData.forEach(element => {
    routes.push('/app/' + element.app_id)
});


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vitePrerender({
            // Required - The path to the vite-outputted app to prerender.
            staticDir: path.join(__dirname, 'dist'),
            // Required - Routes to render.
            routes,
            renderer: new Renderer({
                renderAfterTime: 1000,
                maxConcurrentRoutes: 20,
                consoleHandler(route, message) {
                    console.log(`Rendering ${routes.indexOf(route)} / ${routes.length}`)
                }
            })
        }),
    ]
})

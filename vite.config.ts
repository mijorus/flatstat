import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePrerender from 'vite-plugin-prerender'
import path from 'path'
import searchData from './tmp/search_data.json'

const Renderer = vitePrerender.PuppeteerRenderer

let routes =  ['/','/libraries']

searchData.forEach(element => {
    routes.push('/app/' + element.app_id)
});

// routes = routes.slice(0, 30)


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
                // renderAfterElementExists: '.loaded',
                maxConcurrentRoutes: 50,
                skipThirdPartyRequests: false,
                renderAfterTime: 3000,
                consoleHandler(route, message) {
                    console.log(`Rendering ${routes.indexOf(route)} / ${routes.length}`)
                }
            })
        }),
    ]
})

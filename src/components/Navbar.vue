<template>
    <nav class="navbar is-fixed-top px-2 is-primary" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a
                role="button"
                class="navbar-burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <router-link class="navbar-item" to="/">
                    <span>Flatstat</span>
                </router-link>

                <div class="navbar-item">
                    <div class="dropdown" :class="{'is-active': state.searchResults}">
                        <input
                            id="search-bar"
                            class="input is-rounded is-small"
                            type="text"
                            :name="Math.random().toString(36)"
                            placeholder="Press / to search"
                            v-model="state.query"
                            @keyup="handleSearchQueryChange"
                        />

                        <div class="dropdown-menu" role="menu">
                            <div class="dropdown-content" v-if="state.searchResults && state.searchResults.length" style="max-height: 400px; overflow-y: auto;">
                                <div class="dropdown-item" v-for="result, i in state.searchResults" @click="() => state.searchResults = undefined">
                                    <p style="text-align: left;" >
                                        <router-link :to="`/app/${result.app_id}`" class="is-flex is-align-items-center">
                                            <LazyImage :src="getAppIconUrl(result.app_id)" size="is-32x32 mr-2" />
                                            {{result.name}}
                                        </router-link>
                                    </p>
                                    <hr class="dropdown-divider" v-if="i !== (state.searchResults.length - 1)"/>
                                </div>
                            </div>
                            <div class="dropdown-content" v-else-if="state.searchResults?.length === 0">
                                <div class="dropdown-item">
                                    <p class="has-text-grey">Nothing interesting was found 😔</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <a class="navbar-link">More</a> -->
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { NumericLiteral } from '@babel/types';
import { onMounted, reactive, UnwrapNestedRefs } from 'vue'
import { searchApp, getAppIconUrl } from '../lib/flathubData';
import { SearchData } from '../types/flathub';
import LazyImage from './LazyImage.vue';

const state: UnwrapNestedRefs<{ query: string, searchResults?: SearchData[] }> = reactive({
    query: '',
    searchResults: undefined
})

let searchResultsTimeout: number;
async function handleSearchQueryChange(e: KeyboardEvent) {
    if (state.query.length > 2) {
        clearTimeout(searchResultsTimeout);
        setTimeout(async () => {
            state.searchResults = (await searchApp(state.query)).slice(0, 20)
        }, 300)
    } else {
        state.searchResults = undefined
    }
}

function handleDocumentKeydown(e: KeyboardEvent) {
    if (document.getElementById('search-bar') &&
        document.activeElement === document.querySelector('body') &&
        e.key === '/'
    ) {
        e.preventDefault()
        document.getElementById('search-bar')?.focus()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleDocumentKeydown)

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const t = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                if (t) t.classList.toggle('is-active');

            });
        });
    }
})


</script>
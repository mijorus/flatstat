<template>
    <nav class="navbar is-fixed-top is-primary" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link class="navbar-item" to="/">
                <img src="/flatstat-badge-logo.svg" alt="flatstat logo" class="mr-2">
                <span class="has-text-weight-bold">Flatstat</span>

            </router-link>
            <a
                role="button"
                class="navbar-burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="main-navbar-menu"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="main-navbar-menu" class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item">
                    <div class="dropdown searchbar-dropdown" :class="{'is-active': state.searchResults}">
                        <input
                            id="search-bar"
                            class="input is-rounded is-small"
                            type="search"
                            :name="Math.random().toString(36)"
                            placeholder="Press / to search"
                            v-model.trim="state.query"
                            @input="handleSearchQueryChange"
                        />

                        <div class="dropdown-menu" role="menu">
                            <div class="dropdown-content" v-if="state.searchResults && state.searchResults.length" style="max-height: 400px; overflow-y: auto;">
                                <div class="dropdown-item" v-for="result, i in state.searchResults" @click="() => handleClickOnSearchItem()">
                                    <p style="text-align: left;" >
                                        <router-link :to="`/app/${result.app_id}`" class="is-flex is-align-items-center">
                                            <LazyImage :src="getAppIconUrl(result.app_id)" size="is-32x32 mr-2" />
                                            {{result.name}}
                                        </router-link>
                                    </p>
                                    <hr class="dropdown-divider" v-if="state.searchResults && i !== (state.searchResults.length - 1)"/>
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
                <router-link to="/libraries" class="navbar-item">
                    Libraries
                </router-link>
                <router-link to="/all-time" class="navbar-item">
                    All time best
                </router-link>
            </div>
        </div>
    </nav>
</template>

<style scoped lang="scss">

@media screen and (max-width: 768px) {
    #main-navbar-menu {
        overflow: visible !important;
    }

    .searchbar-dropdown {
        width: 70%;

        .dropdown-menu {
            width: 100%;
        }
    }
}
</style>

<script lang="ts" setup>
import { onMounted, reactive, UnwrapNestedRefs } from 'vue'
import { searchApp, getAppIconUrl } from '../lib/flathubData';
import { SearchData } from '../types/flathub';
import LazyImage from './LazyImage.vue';

const state: UnwrapNestedRefs<{ query: string, searchResults?: SearchData[] }> = reactive({
    query: '',
    searchResults: undefined
})

let searchResultsTimeout: number;
async function handleSearchQueryChange(e: Event) {
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

function handleClickOnSearchItem() {
    state.searchResults = undefined;
    closeNavbarMobileMenu();
}

function closeNavbarMobileMenu() {
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Add a click event on each of them
    navbarBurgers.forEach(el => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        
        if (target) {
            const t = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.remove('is-active');
            if (t) t.classList.remove('is-active');
        }
    });
}

onMounted(() => {
    document.addEventListener('keydown', handleDocumentKeydown);

    // Get all "navbar-burger" elements
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if (navbarBurgers.length > 0) {

        // Add a click event on each of them
        navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                
                if (target) {
                    const t = document.getElementById(target);

                    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                    el.classList.toggle('is-active');
                    if (t) t.classList.toggle('is-active');
                }

            });
        });
    }
})


</script>
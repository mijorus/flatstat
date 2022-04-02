<template>
    <nav class="navbar is-fixed-top px-2" role="navigation" aria-label="main navigation">
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
                    <span>Flathub stats</span>
                </router-link>

                <div class="navbar-item">
                    <input id="search-bar" class="input is-rounded is-small" type="text" placeholder="Press / to search" />
                    <a class="navbar-link">More</a>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

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
                t.classList.toggle('is-active');

            });
        });
    }
})


</script>
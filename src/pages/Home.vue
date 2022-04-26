<template>
    <Base>
        <div class="mb-6">
            <h1 class="title is-1 is-flex is-justify-content-center is-align-items-center" style="gap: 10px;">
                <img src="/flatstat-badge-logo.svg" alt="flatstat logo" class="image is-128x128">
                <p>Flatstat</p>
            </h1>
            <p class="subtitle is-size-6">Browse, explore, visualize statistics from Flathub, the official Flatpak store.</p>
        </div>
        <div class="mb-3">
            <h2 class="is-size-3 ">Most popular apps in the last 30 days</h2>
        </div>
        <div v-if="state.lastMonthData" class="columns is-multiline is-centered">
            <div v-for="app in state.lastMonthData" class="column is-half">
                <PreviewBox label="In the last 30 days:" :data="app"/>
            </div>
        </div>
        <div v-else class="has-text-center">
            <LazyImage size="is-inline-block is-64x64 mt-4"></LazyImage>
        </div>
    </Base>
</template>

<script setup lang="ts">
import Base from '../views/Base.vue'
import { onMounted, reactive } from "vue";
import type { UnwrapNestedRefs } from "vue";
import { getLastMonth } from "../lib/flathubData";
import type { SummaryElement } from "../lib/flathubData";
import LazyImage from "../components/LazyImage.vue";
import PreviewBox from '../components/PreviewBox.vue';

const state: UnwrapNestedRefs<{ lastMonthData: SummaryElement[] | null }> = reactive({
    lastMonthData: null,
})

onMounted(function() {
    getLastMonth().then((res) => state.lastMonthData = res)
    document.title = 'Flatstats - statistics from Flathub'
})

</script>

<style global>
    .graph-svg-tip .title{
        color: white;
        font-size: 14px;
        white-space: nowrap;
    }
</style>
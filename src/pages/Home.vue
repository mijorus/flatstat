<template>
    <Base>
        <h1 class="title is-1">Flatstat</h1>
        <p class="subtitle is-size-6">Some statistics from Flathub</p>
        <h2 class="is-size-3 mb-3">Most popular apps in the last 30 days</h2>
        <div v-if="state.lastMonthData">
            <div class="columns is-multiline">
                <div v-for="app in state.lastMonthData" class="column is-half">
                    <PreviewBox :data="app"/>
                </div>
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
import type { HistoryElement } from "../lib/flathubData";
import LazyImage from "../components/LazyImage.vue";
import PreviewBox from '../components/PreviewBox.vue';

const state: UnwrapNestedRefs<{ lastMonthData: HistoryElement[] | null }> = reactive({
    lastMonthData: null,
})

onMounted(function() {
    getLastMonth().then((res) => state.lastMonthData = res)
})

</script>

<style global>
    .graph-svg-tip .title{
        color: white;
        font-size: 14px;
        white-space: nowrap;
    }
</style>
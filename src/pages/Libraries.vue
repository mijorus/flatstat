<template>
    <Base>
        <div class="loaded mb-6">
            <h1 class="title is-1 ">
                <p>Libraries</p>
            </h1>
            <p class="subtitle is-size-6">Libraries are shared packages needed to run the most popular applications</p>
        </div>
        <h2 class="is-size-3 mb-3">Most downloaded libraries</h2>
        <div v-if="partialList">
            <div class="columns is-multiline">
                <div v-for="app in partialList" class="column is-half">
                    <PreviewBox :hide-link="true" label="" :data="app" :hide-icon="true"/>
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
import { onMounted, reactive, computed, ComputedRef } from "vue";
import type { UnwrapNestedRefs } from "vue";
import { getLibrariesSummary } from "../lib/flathubData";
import type { SummaryElement } from "../lib/flathubData";
import LazyImage from "../components/LazyImage.vue";
import PreviewBox from '../components/PreviewBox.vue';

const partialList: ComputedRef<SummaryElement[]> = computed(() => {
    return state.librariesSummary ? state.librariesSummary.slice(0, 30) : []
})

const state: UnwrapNestedRefs<{ librariesSummary: SummaryElement[] | null }> = reactive({
    librariesSummary: null,
})

onMounted(function() {
    getLibrariesSummary().then((res) => state.librariesSummary = res)
    document.title = 'Libraries - Flatstats'
})

</script>

<style global>
    .graph-svg-tip .title{
        color: white;
        font-size: 14px;
        white-space: nowrap;
    }
</style>

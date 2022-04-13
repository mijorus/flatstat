<template>
    <Base>
        <div class="mb-6">
            <h1 class="title is-1 ">
                <p>Libraries</p>
            </h1>
            <p class="subtitle is-size-6">Some statistics from Flathub</p>
        </div>
        <h2 class="is-size-3 mb-3">Most popular apps in the last 30 days</h2>
        <div v-if="partialList">
            <div class="columns is-multiline">
                <div v-for="app in partialList" class="column is-half">
                    <PreviewBox label="" :data="app" :hide-icon="true"/>
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
})

</script>

<style global>
    .graph-svg-tip .title{
        color: white;
        font-size: 14px;
        white-space: nowrap;
    }
</style>
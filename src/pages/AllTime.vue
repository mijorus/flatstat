<template>
    <Base>
    <div class="mb-6">
        <h1 class="is-size-1 ">
            <p>🔝 Most downloaded apps 📈</p>
        </h1>
        <p class="subtitle is-size-6">List of the most popular apps on Flathub</p>
    </div>
    <div v-if="partialList">
        <div class="columns is-multiline">
            <div v-for="app, i in partialList" class="column is-half">
                <PreviewBox v-if="i === 0" :label="`#${(i + 1).toString()}`" :data="app" class="is-gold is-light" />
                <PreviewBox v-else-if="i === 1" :label="`#${(i + 1).toString()}`" :data="app" class="is-silver" />
                <PreviewBox v-else-if="i === 2" :label="`#${(i + 1).toString()}`" :data="app" class="is-bronze" />
                <PreviewBox v-else :label="`#${(i + 1).toString()}`" :data="app" />
            </div>
        </div>
    </div>
    <div v-else class="has-text-center">
        <LazyImage size="is-inline-block is-64x64 mt-4"></LazyImage>
    </div>
    </Base>
</template>

<style>
.notification.is-gold {
    background-color: #ffde7cbc;
    color: #4b3701;
}

.notification.is-silver {
    background-color: #c9c9c979;
    color: #222222;
}

.notification.is-bronze {
    background-color: #c5a89192;
    color: #222222;
}
</style>

<script setup lang="ts">
import Base from '../views/Base.vue'
import { onMounted, reactive, computed, ComputedRef } from "vue";
import type { UnwrapNestedRefs } from "vue";
import { allTime } from "../lib/flathubData";
import type { SummaryElement } from "../lib/flathubData";
import LazyImage from "../components/LazyImage.vue";
import PreviewBox from '../components/PreviewBox.vue';

const partialList: ComputedRef<SummaryElement[]> = computed(() => {
    return state.librariesSummary ? state.librariesSummary.slice(0, 30) : []
})

const state: UnwrapNestedRefs<{ librariesSummary: SummaryElement[] | null }> = reactive({
    librariesSummary: null,
})

onMounted(function () {
    allTime().then((res) => state.librariesSummary = res)
    document.title = 'Libraries - Flatstats'
})

</script>

<style global>
.graph-svg-tip .title {
    color: white;
    font-size: 14px;
    white-space: nowrap;
}
</style>

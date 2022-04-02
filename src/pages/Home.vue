<template>
    <Base>
        <div v-if="state.lastMonthData">
            <div class="columns is-multiline">
                <div v-for="app in state.lastMonthData" class="column is-half">
                    <PreviewBox :data="app"/>
                </div>
            </div>
        </div>
    </Base>
</template>

<script setup lang="ts">
import Base from '../views/Base.vue'
import { onMounted, reactive } from "vue";
import type { UnwrapNestedRefs } from "vue";
import { getLastMonth } from "../lib/flathubData";
import type { LastMonthHistoryElement } from "../lib/flathubData";
import PreviewBox from '../components/PreviewBox.vue';

const state: UnwrapNestedRefs<{ lastMonthData: LastMonthHistoryElement[] | null }> = reactive({
    lastMonthData: null,
})

onMounted(function() {
    getLastMonth().then((res) => state.lastMonthData = res)
})

</script>
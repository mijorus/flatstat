<template>
    <Base>
        <div v-if="state.lastMonthData">
            <div class="columns is-multiline">
                <div v-for="app in state.lastMonthData" class="column is-half">
                    <h2>{{ app.name }}</h2>
                </div>
            </div>
        </div>
    </Base>
</template>

<script setup lang="ts">
import Base from '../views/Base.vue'
import { onMounted, reactive } from "vue";
import type { UnwrapNestedRefs } from "vue";
import { getLastMonth } from "../lib/statsData";
import type { LastMonthHistory } from "../lib/statsData";

const state: UnwrapNestedRefs<{ lastMonthData: LastMonthHistory[] | null }> = reactive({
    lastMonthData: null,
})

onMounted(function() {
    getLastMonth().then((res) => state.lastMonthData = res)
})

</script>
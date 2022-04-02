<template>
    <Base>
       <div class="m-1">
           <div v-if="state.name" class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
               <h1 class="title is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
                    <LazyImage :src="state.appDetails?.icon" size="is-inline-block is-64x64 mr-2"></LazyImage>
                    {{state.name}}
                </h1>
                <p class="subtitle  is-size-6">{{state.appDetails?.appstream?.developer_name || `${state.name} developers`}}</p>
           </div>
           <h1 class="title" v-else> Loading details... </h1>
           <div class="chart"></div>
       </div>

       <div v-if="state.appDetails">
            <p class="is-size-3">
                Total downloads: {{ state.appDetails.history_sum.i }}
            </p>
            <p class="is-size-6 has-text-grey">
                Updated: {{ state.appDetails.history_sum.u }} times
            </p>
       </div>
    </Base>
</template>

<script setup lang="ts">
import Base from '../views/Base.vue'
import { onMounted, reactive } from "vue";
import { useRouter, useRoute } from 'vue-router'
import type { UnwrapNestedRefs } from "vue";
import { getAppDetails, getAppstramDetails } from "../lib/flathubData";
import type { AppDetailElement } from "../lib/flathubData";
import { FlatHubAppstreamResponse } from "../types/flathub";

//@ts-ignore
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm"
import LazyImage from '../components/LazyImage.vue';

const router = useRouter()
const route = useRoute()

const state: UnwrapNestedRefs<{ appDetails?: AppDetailElement, id?: string, name?: string }> = reactive({
    appDetails: undefined,
    id: undefined,
    name: undefined,
})

let graphData: { labels: string[], datasets: { name: string; values: number[]; type: string}[], yMarkers?: any[] } = {
    labels: [],
    datasets: [
        { name: 'Installs', values: [], type: 'bar' }
    ]
};

function loadGraphData(data: AppDetailElement) {
    for (let [key, value] of Object.entries(data.history)) {
        graphData.labels.push(key)
        graphData.datasets[0].values.push(value.total.i)
    }

    const mean = graphData.datasets[0].values.reduce((prev, curr) => prev + curr, 0) / graphData.datasets[0].values.length;
    graphData.yMarkers = [
        {
            label: "Mean: " + mean.toFixed(0),
            value: mean,
            options: { labelPos: 'left' } // default: 'right'
        }
    ]

    const chart = new Chart(".chart", {
        title: "",
        data: graphData,
        type: 'axis-mixed',
        height: 500 ,
        colors: ['#7cd6fd', '#743ee2'],
        tooltipOptions: {
            formatTooltipX: d => d,
            formatTooltipY: d => d
            
        },
        axisOptions: {
            xIsSeries: true // default: false
        },
    })
}

onMounted(function() {
    //@ts-ignore
    const id: string = route.params.id;
    state.id = id;

    getAppDetails(id).then((res) => {
        loadGraphData(res)
        state.appDetails = { ...res }
        state.name = res.appstream.name
    })
})

</script>
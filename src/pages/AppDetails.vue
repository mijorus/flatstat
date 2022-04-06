<template>
    <Base>
        <div class="m-1">
            <div
                v-if="state.name"
                class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center"
            >
                <h1
                    class="title is-flex is-flex-direction-row is-align-items-center is-justify-content-center"
                >
                    <LazyImage :src="state.appDetails?.icon" size="is-inline-block is-64x64 mr-2"></LazyImage>
                    {{ state.name }}
                </h1>
                <p class="subtitle is-size-6">
                    by {{ state.appDetails?.appstream?.developer_name || `${state.name} developers` }}
                    <br />
                    <a :href="state.appDetails?.url" class="is-size-7">Open on Flathub</a>
                </p>
            </div>
            <h1 class="title" v-else>
                Loading details...
                <div class="mt-6">
                    <LazyImage src="" size="is-inline-block is-64x64 mr-2"></LazyImage>
                </div>
            </h1>
            <div class="chart"></div>
        </div>

        <div v-if="state.appDetails">
            <p class="is-size-3">Total downloads: {{ state.appDetails.history_sum.i.toLocaleString() }}</p>
            <p class="is-size-6 has-text-grey">Updated: {{ state.appDetails.history_sum.u.toLocaleString() }} times</p>

            <h2 class="is-size-4 mt-6">Lastest updates</h2>
            <div>
                <div
                    class="columns is-centered has-text-left"
                    v-for="release of state.appDetails.appstream.releases.slice(0, 7)"
                >
                    <div class="column is-one-third mt-2" style="border-left: 1px solid lightgrey;">
                        <p>
                            Version: {{ release.version }}
                            <span
                                v-if="release.type === 'stable'"
                                class="tag is-success is-light is-normal"
                            >stable</span>
                            <span
                                v-else-if="release.type !== undefined"
                                class="tag is-warning is-light is-normal"
                            >{{ release.type }}</span>
                        </p>
                        <p
                            class="is-size-7 has-text-grey"
                        >{{ dayjs(parseInt(release.timestamp) * 1000).format(defaultDateFormat) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </Base>
</template>

<script setup lang="ts">
import Base from '../views/Base.vue'
import { ref, onMounted, reactive, watch, Ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import type { UnwrapNestedRefs } from "vue";
import { getAppDetails, getAppstramDetails } from "../lib/flathubData";
import type { AppDetailElement } from "../lib/flathubData";
import { primaryColor, defaultDateFormat } from "../lib/utils";
import dayjs from "dayjs";

//@ts-ignore
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm"
import LazyImage from '../components/LazyImage.vue';

interface GraphData { labels: string[], datasets: { name: string; values: number[]; type: string }[], yMarkers?: any[] }
interface ChartMarker { label: string; value: number; options: Object }

const router = useRouter()
const route = useRoute()

let sourceImageAnalysis: Ref<HTMLImageElement | null> = ref(null)

const state: UnwrapNestedRefs<{
    appDetails?: AppDetailElement,
    id?: string,
    name?: string,
}> = reactive({})

let graphData: GraphData = resetGraphData();

function resetGraphData() {
    return {
        labels: [],
        datasets: [
            { name: 'Installs', values: [], type: 'bar' },
        ]
    }
}

function loadGraphData(data: AppDetailElement) {
    graphData = resetGraphData()

    let last = -1
    for (let h of data.history) {
        const value = h?.total?.i || 0

        if (last > 0 && (h.date !== dayjs().format(defaultDateFormat))) {
            graphData.labels.push(h.date)
            graphData.datasets[0].values.push(value)
        }

        last = (last > 0) ? 1 : value
    }

    const mean = graphData.datasets[0].values.reduce((prev, curr) => prev + curr, 0) / graphData.datasets[0].values.length;
    const yMarkers: ChartMarker[] = [
        {
            label: "Mean: " + mean.toFixed(0) + ' (daily downloads)',
            value: mean,
            options: { labelPos: 'left' } // default: 'right'
        }
    ]

    graphData = { ...graphData, yMarkers }

    const chart = new Chart(".chart", {
        title: "",
        data: graphData,
        type: 'axis-mixed',
        height: 500,
        colors: [ primaryColor ],
        axisOptions: {
            xIsSeries: true, // default: false
            xAxisMode: 'tick',
        },
        lineOptions: {
            hideDots: true,
            spline: 1, // default: 
        },
    })

    chart.parent.addEventListener('data-select', (e) => {
        console.log(e);
    }); 
}

function loadAppData(id: string) {
    getAppDetails(id).then((res) => {
        loadGraphData(res)
        state.appDetails = { ...res }
        state.name = res.appstream.name
    })

}

onMounted(function () {
    //@ts-ignore
    const id: string = route.params.id;
    state.id = id;

    loadAppData(id)
})

//@ts-ignore
watch(() => route.params.id, (newId: string) => {
    loadAppData(newId)
})

</script>
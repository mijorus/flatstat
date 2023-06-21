<template>
    <Base>
    <div class="m-1">
        <!-- @ts-ignore -->
        <Promised :promise="appDataPromise">
            <template v-slot:pending>
                <h1 class="title">
                    Loading details...
                    <div class="mt-6">
                        <LazyImage src="" size="is-inline-block is-64x64 mr-2"></LazyImage>
                    </div>
                </h1>
            </template>
            <template v-slot>
                <div class="loaded is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
                    <h1 class="title is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
                        <LazyImage :src="state.isLib ? '/flathub-badge-logo.svg' : state.appDetails?.icon" size="is-inline-block is-64x64 mr-2" />
                        {{ state.name }}
                    </h1>
                    <p class="subtitle is-size-6">
                        <span v-if="!state.isLib && state.appDetails">
                            by {{ (state.appDetails.appstream?.developer_name || `${state.name} developers`) }}
                            <br />
                            <a :href="state.appDetails?.url" class="is-size-7">Open on Flathub</a>
                        </span>
                    </p>
                </div>
            </template>
            <template v-slot:rejected="err">
                <h1 class="title has-text-danger mt-4">
                    Requested app not found
                </h1>
                <div class="is-2 has-text-danger title">
                    <i class="gg-danger" style="display: inline-block;"></i>
                </div>
            </template>
        </Promised>
        <div v-show="state.appDetails">
            <div class="columns is-centered mt-2 is-mobile">
                <div class="column is-3-desktop is-10-mobile">
                    <Datepicker range multi-calendars required :enable-time-picker="false" :clearable="false" inputClassName="has-text-centered" :textInput="true"
                        :format="defaultDateFormat.replaceAll('Y', 'y').replaceAll('D', 'd')" v-model="state.datePickerVal" :min-date="new Date(2018, 1, 1)" :max-date="new Date()"
                        @update:modelValue="reloadGraphData" />
                </div>
            </div>
            <div class="columns">
                <div id="chart" class=" column"></div>
                <div id="chart-comulative" class=" column"></div>
            </div>

            <div class="container is-max-desktop">
                <div class="is-size-6 mb-6" style="text-align: left;">
                    <p class="content mx-5" v-html="state.appDetails?.appstream.description.replaceAll('script>', '')">
                    </p>
                </div>
            </div>

            <div v-if="state.appDetails" class="mb-6">
                <p class="is-size-3">Total downloads: {{ state.appDetails.history_sum.i.toLocaleString() }}</p>
                <p class="is-size-6 has-text-grey">Updated: {{ state.appDetails.history_sum.u.toLocaleString() }} times</p>
            </div>
            <hr>

            <div class="mb-6">
                <h3 class="is-size-4">Updates heatmap (last 12 months)</h3>
                <p class="has-text-grey is-size-6">Number of updates per day</p>
                <div class="columns">
                    <div class="column is-flex" style="overflow-x: auto; justify-content: center;">
                        <div id="updates-heatmap"> </div>
                    </div>
                </div>
            </div>
            <hr>
        </div>
    </div>

    <div>
        <div v-if="state.appDetails" class="mb-6">
            <div style="border-radius: 10px;">
                <div v-if="!state.isLib" class="mb-6">
                    <h2 class="is-size-4">Badges</h2>
                    <p class="has-text-grey">Get some fancy badges for your new app 🚀</p>
                    <p class="is-size-7 has-text-grey">(ps more coming soon 🤫)</p>
                    <div class="mt-4 columns">
                        <div class="column">
                            <div class="columns is-centered">
                                <div class="column is-one-fifth p-0">
                                    <img :src="`${getShieldIoBadgeDataUrl(state.appDetails.name)}`" />
                                </div>
                            </div>
                            <div class="columns is-centered mt-0 pt-0 is-multiline">
                                <div class="column is-full">
                                    <div class="columns is-centered ">
                                        <div class="column pt-0 is-10 is-narrow-mobile" style="max-width: 500px;">
                                            <div class="px-2">
                                                <div class="control has-icons-right" style="cursor: pointer;" @click.prevent="() => copyAppNameToClipBoard('.copied-shieldio-link')">
                                                    <input class="input pointer" type="text" :value="`${getShieldIoBadgeDataUrl(state.appDetails.name)}`" readonly>
                                                    <span class="icon is-small is-right" style="cursor: pointer; z-index: 10;">
                                                        <i class="gg-copy copied-shieldio-link"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="column is-full">
                                    <div class="columns is-centered">
                                        <div class="column pt-0 is-10 is-narrow-mobile" style="max-width: 500px;">
                                            <p>Link to this page in Markdown</p>
                                            <div class="px-2">
                                                <div class="control has-icons-right" style="cursor: pointer;"
                                                    @click.prevent="() => copyToClipboard(getMarkdownShieldIoBadgeDataUrl((state?.appDetails?.name || '')), 'copied-shieldio-md-link')">
                                                    <input class="input pointer" type="text" :value="`${getMarkdownShieldIoBadgeDataUrl(state.appDetails.name)}`" readonly>
                                                    <span class="icon is-small is-right" style="cursor: pointer; z-index: 10;">
                                                        <i class="gg-copy copied-shieldio-md-link"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="releases-box" v-if="state?.appDetails?.appstream?.releases">
                    <h2 class="is-size-4 mt-6">Latest updates</h2>
                    <div class="columns is-centered has-text-left is-mobile" v-for="release of state.appDetails.appstream.releases.slice(0, 5)">
                        <div class="column is-one-third mt-2" style="border-left: 1px solid lightgrey;">
                            <p>
                                Version: {{ release.version }}
                                <span v-if="release.type === 'stable'" class="tag is-success is-light is-normal">stable</span>
                                <span v-else-if="release.type !== undefined" class="tag is-warning is-light is-normal">
                                    {{ release.type }}
                                </span>
                            </p>
                            <p class="is-size-7 has-text-grey">{{ dayjs(parseInt(release.timestamp) *
                                1000).format(defaultDateFormat)
                            }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>

        <div v-if="!state.isLib && state.reviews">
            <h2 class="is-size-4 mt-6">Reviews</h2>
            <p class="has-text-grey">User reviews and ratings from <a href="https://odrs.gnome.org/">GNOME's ODRS project</a></p>

            <div v-if="state.reviews.ratings && (getRating() !== null)">

                {{ getRating()?.toFixed(1) }}<div class="stars" :style="'--rating:' + getRating()?.toFixed(1)" :aria-label="`Rating of this product is ${getRating()?.toFixed(1)} out of 5.`"></div>
            </div>

            <div class="columns is-multiline mx-3">
                <div v-for="r, index in state.reviews.reviews" class="has-text-left column is-6" v-show="(index < 20) || state.reviewsExpanded">
                    <div class="panel">
                        <div class="panel-heading">{{ r.summary }}</div>
                        <div class="panel-block" style="overflow-y: hidden;">
                            <div>
                                <p class="">👤 <b>{{ r.user_display }}</b></p>
                                <p class="has-text-grey">version: {{ r.version }}</p>
                                <div class="mb-3"></div>
                                <p style="white-space: normal;">
                                    {{ r.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="state.reviews.reviews.length > 20">
                <button class="button btn" @click="state.reviewsExpanded = true">Show all</button>
            </div>
        </div>
    </div>
    </Base>
</template>

<style>
:root {
    --star-color: #fff;
    --star-background: #fc0;
}

.stars {
    --percent: calc(var(--rating) / 5 * 100%);

    display: inline-block;
    font-size: 20px;
    font-family: Times;
    line-height: 1;
}

.stars::before {
    content: '★★★★★';
    letter-spacing: 3px;
    background: linear-gradient(90deg, var(--star-background) var(--percent), var(--star-color) var(--percent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>

<script setup lang="ts">
import Base from '../views/Base.vue'
import { ref, onMounted, reactive, watch, Ref, VueElement } from "vue";
import { useRouter, useRoute } from 'vue-router'
import type { UnwrapNestedRefs } from "vue";
import { getAppDetails, getShieldIoBadgeDataUrl, getMarkdownShieldIoBadgeDataUrl, getAppReviews } from "../lib/flathubData";
import type { AppDetailElement } from "../lib/flathubData";
import { primaryColor, defaultDateFormat } from "../lib/utils";
import { Promised, usePromise } from "vue-promised";
import { copyToClipboard } from "./../lib/utils";
import Datepicker from '@vuepic/vue-datepicker';

import dayjs from "dayjs";

//@ts-ignore
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm"
import LazyImage from '../components/LazyImage.vue';

interface GraphData { labels: string[], datasets: { name: string; values: number[]; type: string }[], yMarkers?: any[] }
interface ChartMarker { label: string; value: number; options: Object }

const route = useRoute()

const state: UnwrapNestedRefs<{
    appDetails?: AppDetailElement,
    id?: string,
    name?: string,
    isLib?: boolean,
    reviews?: any,
    reviewsExpanded: boolean,
    datePickerVal: Date[]
}> = reactive({
    reviewsExpanded: false,
    datePickerVal: [dayjs().subtract(1, 'month').toDate(), new Date()]
})

function resetGraphData() {
    return {
        labels: [],
        datasets: [
            { name: 'Daily new installations', values: [], type: 'bar' },
        ]
    }
}

function resetComulativeGraphData() {
    return {
        labels: [],
        datasets: [
            { name: 'Total new installations', values: [], type: 'bar' },
        ]
    }
}

let graphData: GraphData = resetGraphData()
let comulativeGraphData: GraphData = resetComulativeGraphData()

function loadGraphData(data: AppDetailElement) {
    graphData = resetGraphData();
    comulativeGraphData = resetComulativeGraphData();

    const from: dayjs.Dayjs = dayjs(state.datePickerVal[0])
    const to: dayjs.Dayjs = dayjs(state.datePickerVal[1])

    const updatedHeatmapDataPoint: { [key: string]: any } = {}

    let last = -1 // will be set > on the first day with at least one download
    let firstUsableDate: string | undefined = undefined;
    for (let h of data.history) {
        const value = h?.total?.i || 0
        const currentDate: dayjs.Dayjs = dayjs(h.date, 'YYYY/MM/DD');

        if ((last > 0) && (currentDate.isBefore(dayjs().subtract(2, 'days')))) {
            if (currentDate.isBefore(from.subtract(1, 'day'))) continue
            else if (currentDate.isAfter(to)) break

            graphData.labels.push(h.date)
            graphData.datasets[0].values.push(value)

            if (currentDate.isAfter(dayjs().subtract(1, 'year'))) {
                if (!firstUsableDate) firstUsableDate = h.date
                updatedHeatmapDataPoint[currentDate.valueOf() / 1000] = h?.total?.u || 0
            }

            const nextComulativeValue = value + (comulativeGraphData.datasets[0].values[comulativeGraphData.datasets[0].values.length - 1] ?? 0)
            comulativeGraphData.labels.push(h.date)
            comulativeGraphData.datasets[0].values.push(nextComulativeValue)
        }

        last = (last > 0) ? 1 : value
    }

    const firstDateInHistory = graphData.labels[0]
    let scannedDate = dayjs(firstDateInHistory, 'YYYY/MM/DD')

    console.log(scannedDate.format('YYYY/MM/DD'), dayjs(state.datePickerVal[0]).format('YYYY/MM/DD'))

    if (from.isBefore(scannedDate)) {
        while (scannedDate.format('YYYY/MM/DD') !== dayjs(state.datePickerVal[0]).format('YYYY/MM/DD')) {
            graphData.labels.unshift(scannedDate.format('YYYY/MM/DD'))
            graphData.datasets[0].values.unshift(0)

            comulativeGraphData.labels.unshift(scannedDate.format('YYYY/MM/DD'))
            comulativeGraphData.datasets[0].values.unshift(0)

            scannedDate = scannedDate.subtract(1, 'day')
            if (scannedDate.format('YYYY/MM/DD') === firstDateInHistory) {
                break;
            }
        }
    }


    const mean = graphData.datasets[0].values.reduce((prev, curr) => prev + curr, 0) / graphData.datasets[0].values.length;
    const yMarkers: ChartMarker[] = [
        {
            label: "Average: " + mean.toFixed(0) + ' (daily downloads)',
            value: mean,
            options: { labelPos: 'left' } // default: 'right'
        }
    ]

    graphData = { ...graphData, yMarkers }
    const commonGraphData = {
        title: "",
        type: 'axis-mixed',
        height: 500,
        colors: [primaryColor],
        axisOptions: {
            xIsSeries: true, // default: false
            xAxisMode: 'tick',
        },
        lineOptions: {
            hideDots: true,
            spline: 1, // default: 
        },
    }

    console.log(graphData);

    new Chart("#chart", { ...commonGraphData, data: graphData })
    new Chart("#chart-comulative", { ...commonGraphData, data: comulativeGraphData, colors: ['#ff5200'] })

    let updatedHeatmap = new Chart("#updates-heatmap", {
        type: 'heatmap',
        colors: ["#e85d04", "#ff8800", "#ffba08", "#ffdd00", "#ffee90"].reverse(),
        data: {
            discreteDomains: 1, // default 1
            dataPoints: updatedHeatmapDataPoint,
            start: new Date(dayjs(firstUsableDate, 'YYYY/MM/DD').valueOf()),
            end: new Date(dayjs(data.history[data.history.length - 1].date, 'YYYY/MM/DD').valueOf())
        },
    })
}

function reloadGraphData(dates: Date[]) {
    console.log(dates);

    if (state.appDetails) {
        loadGraphData(state.appDetails)
    }
}

async function loadAppData(id: string) {
    console.log(id);
    state.appDetails = undefined

    const res = await getAppDetails(id)

    state.appDetails = { ...res }
    state.isLib = res.name.includes('/') || (res.appstream.name === undefined)
    state.name = res.appstream?.name ?? res.name

    document.title = state.name + ' - Flatstat'
    loadGraphData(res)

    try {
        state.reviews = await getAppReviews(id);

    } catch {
        console.log('No reviews found for this app');
    }
}

function copyAppNameToClipBoard(iconTarget: string) {
    if (state.appDetails?.name) {
        copyToClipboard(getShieldIoBadgeDataUrl(state.appDetails.name), iconTarget)
    }
}

function getRating() {
    if (!state?.reviews?.ratings || (state.reviews.ratings.star0 === undefined) || (state.reviews.ratings.total === 0)) {
        return null;
    }

    let rating = ['star0', 'star1', 'star2', 'star3', 'star4', 'star5'].reduce((acc, curr, i) => {
        return acc + (state.reviews.ratings[curr] * i)
    }, 0) / state.reviews.ratings.total;

    return rating;
}

const appDataPromise: Ref<any> = ref(null)
onMounted(function () {
    //@ts-ignore
    const id: string = route.params.id || window.location.pathname.split('/')[2];;
    state.id = id;

    appDataPromise.value = loadAppData(id)
})

//@ts-ignore
watch(() => route.params.id, (newId: string | undefined) => {
    const loadId = newId || window.location.pathname.split('/')[2];
    if (loadId) {
        appDataPromise.value = loadAppData(loadId)
    }
})

</script>
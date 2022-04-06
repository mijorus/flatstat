<template>
    <div class="box">
        <article class="media">
            <div class="media-left">
                <LazyImage :src="data.icon" size="is-64x64" />
            </div>
            <div class="media-content">
                <div class="content">
                    <p>
                        <router-link :to="`/app/${encodeURIComponent(data.name)}`">
                            <strong>{{ data.appstream.name && data.appstream.name.length ? data.appstream.name : data.name }}</strong>
                        </router-link>
                        <p class="is-size-7">{{data.name}}</p>
                    </p>
                    <div class="is-size-6">In the last 30 days:</div>
                    <div class="is-size-7 has-text-grey	">
                        Downloads {{ data.history_sum.i }}
                    </div>
                    <div class="is-size-7 has-text-grey	">
                        Updates {{ data.history_sum.u }}
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HistoryElement } from '../lib/flathubData';
import LazyImage from './LazyImage.vue';

const props = defineProps<{
    data: HistoryElement;
}>()

</script>
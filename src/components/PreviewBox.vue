<template>
    <div class="box m-3">
        <article class="media">
            <div class="media-left">
                <LazyImage :src="data.icon" size="is-64x64" v-if="!hideIcon" />
                <img src="/flathub-badge-logo.svg" alt="flatstat logo" class="image is-64x64" v-else>
            </div>
            <div class="media-content">
                <div class="content">
                    <p>
                        <router-link :to="`/app/${encodeURIComponent(data.name)}`">
                            <strong>{{ data.appstream.name && data.appstream.name.length ? data.appstream.name : data.name }}</strong>
                        </router-link>
                        <p class="is-size-7">{{data.name}}</p>
                    </p>
                    <div class="is-size-6">{{label}}</div>
                    <div class="is-size-7 has-text-grey	">
                        Downloads {{ data.history_sum.i.toLocaleString() }}
                    </div>
                    <div class="is-size-7 has-text-grey	">
                        Updates {{ data.history_sum.u.toLocaleString() }}
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import type { SummaryElement } from '../lib/flathubData';
import LazyImage from './LazyImage.vue';

const props = defineProps<{
    data: SummaryElement;
    hideIcon?: boolean;
    label: string;
}>()

</script>
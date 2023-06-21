<template>
    <div class="notification">
        <article class="media">
            <div class="media-left">
                <LazyImage :src="data.icon" size="is-96x96" v-if="!hideIcon" />
                <img src="/flathub-badge-logo.svg" alt="flatstat logo" class="image is-64x64" v-else>
            </div>
            <div class="media-content">
                <div class="content">
                    <p>
                        <div v-if="hideLink === true">
                            <strong class="is-size-5">{{ data.appstream.name && data.appstream.name.length ? data.appstream.name : data.name }}</strong>
                        </div>
                        <router-link v-else :to="`/app/${encodeURIComponent(data.name)}`">
                            <strong class="is-size-5">{{ data.appstream.name && data.appstream.name.length ? data.appstream.name : data.name }}</strong>
                        </router-link>
                        <p class="is-size-7">{{data.name}}</p>
                    </p>
                    <div class="is-size-6">{{label}}</div>
                    <div class="is-size-7">
                        Downloads {{ data.history_sum.i.toLocaleString() }}
                    </div>
                    <div class="is-size-7">
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
    hideLink?: boolean;
    label: string;
}>()

</script>
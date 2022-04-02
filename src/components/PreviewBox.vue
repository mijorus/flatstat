<template>
    <div class="box">
        <article class="media">
            <div class="media-left">
                <figure class="image is-64x64">
                    <img :src="data.icon" alt="Image" />
                </figure>
            </div>
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>{{ data.name }}</strong>
                        <div>
                            <a :href="data.url" class="is-size-7">Open on Flathub</a>
                        </div>
                    </p>
                    <div class="is-size-5 has-text-grey	">
                        Downloads {{ data.history_sum.i }}
                    </div>
                    <div class="is-size-6 has-text-grey	">
                        Updates {{ data.history_sum.u }}
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">import { computed } from 'vue';
import { LastMonthHistoryElement } from '../lib/flathubData';

const props = defineProps<{
    data: LastMonthHistoryElement;
}>()

</script>
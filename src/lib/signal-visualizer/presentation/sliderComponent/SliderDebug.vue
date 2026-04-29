<script setup lang="ts">
import { ref, type Ref } from 'vue';
import SliderComponent, { type CurrentViewPortSamples } from './SliderComponent.vue';

const viewportRef: Ref<CurrentViewPortSamples> = ref({
    currentSamplePosition: 0,
    lengthSamples: 10,
})

</script>

<template>
    <SliderComponent :left-slider-position-percent="10" :right-slider-position-percent="80" :currentViewPort="viewportRef"
:view-port-largest-value-samples="1000" :sample-to-string="(x) => x.toFixed(2)"
        :length-to-string="(x) => x.toFixed(2)"
        @update:viewPort="(viewport) => viewportRef = viewport"></SliderComponent>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import SliderComponent from '@/presentation/sliderComponent/SliderComponent.vue'
import type { CurrentViewPortSamples } from '@/presentation/sliderComponent/types';

const viewportRef: Ref<CurrentViewPortSamples> = ref({
    currentSamplePosition: 0,
    lengthSamples: 10,
})

</script>

<template>
    <SliderComponent :currentViewPort="viewportRef" :viewPortUpperBound="1000" :viewPortLowerBound="0"
        :sample-to-string="(x) => x.toFixed(2)"
        :length-to-string="(x) => x.toFixed(2)"
        @update:viewPort="(viewport) => viewportRef = viewport"></SliderComponent>
</template>

<style scoped></style>

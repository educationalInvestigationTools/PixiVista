<script setup lang="ts">
import { ref, type Ref } from 'vue';
import SliderComponent from '@/presentation/sliderComponent/SliderComponent.vue'
import type { SliderViewPort } from '@/presentation/sliderComponent/types';

const viewportRef: Ref<SliderViewPort> = ref({
    currentPositionSeconds: 0,
    lengthSeconds: 10,
})

</script>

<template>
    <SliderComponent :currentViewPort="viewportRef" :viewPortUpperBound="1000" :viewPortLowerBound="0"
        :sample-to-string="(x) => x.toFixed(2)"
        :length-to-string="(x) => x.toFixed(2)"
        @update:viewPort="(viewport) => viewportRef = viewport"></SliderComponent>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref } from 'vue';

import DialElement from '../dialElement/DialElement.vue';

const heightMin = 60
const heightMax = 200
const currentHeight = ref(100)

function handleDialUpdate(x: number) {
    currentHeight.value = heightMin + ((heightMax - heightMin) * x) / 100
}


</script>

<template>
        <DialElement
            :currentValuePercent="((currentHeight - heightMin) / (heightMax - heightMin)) * 100" :toStringFromPercent="(x) => {
                return x.toFixed(2)
            }" @update:value="handleDialUpdate"></DialElement>
</template>

<style scoped>


</style>

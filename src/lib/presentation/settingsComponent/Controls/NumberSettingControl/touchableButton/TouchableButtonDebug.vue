<script setup lang="ts">
import { ref } from 'vue';

import TouchableButton from '@/presentation/touchableButton/TouchableButton.vue';

const value = ref<number>(0)

function adjustValue(direction: number) {
    value.value += direction
}

</script>

<template>
    <TouchableButton :isPositive="false" @buttonPressed="adjustValue"></TouchableButton>
    <span> {{ value }} </span>
</template>

<style scoped></style>

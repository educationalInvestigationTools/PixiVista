<script setup lang="ts">

const props = defineProps<{
    headerText: string,
    headerValue: string
}>()

</script>

<template>

    <div class="header__readout">
        <span class="header__readout-label"> {{ props.headerText }}</span>
        <span class="header__readout-value"> {{ props.headerValue }} </span>
    </div>

</template>


<style scoped>
.header__readout {
    display: flex;
    flex-direction: column;
    padding: 3px 8px;
    box-sizing: border-box;
    justify-content: space-evenly;
    text-align: center;
    background: #0f0f0f;
    border: 1px solid #2a2a2a;
    height: 50px;
    width : 100%;
    min-width: 0;
}

.header__readout-label {
    font-size: clamp(12px, 1.5vw, 14px);
    color: #9a9a9a;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header__readout-value {
    font-size: clamp(13px, 2.0vw, 15px);
    color: #ffffff;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

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
    background: var(--ui-panel-surface);
    border: 1px solid var(--ui-panel-border);
    height: 50px;
    width : 100%;
    min-width: 0;
    font-family: var(--ui-font);
}

.header__readout-label {
    font-size: clamp(12px, 1.5vw, 14px);
    color: var(--ui-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
}

.header__readout-value {
    font-size: clamp(13px, 2.0vw, 15px);
    color: var(--ui-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

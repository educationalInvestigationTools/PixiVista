<script setup lang="ts">

const props = defineProps<{
    headerText: string,
    headerValue: string
}>()

</script>

<template>

    <div class="header__readout">
        <span class="header__readout-label header__text"> {{ props.headerText }}</span>
        <span class="header__readout-value header__text"> {{ props.headerValue }} </span>
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
    width : 100%;
    min-width: 0;
    font-family: var(--ui-font);
}

.header__text {
    font-size: 12px;
    overflow: scroll;
    text-overflow:ellipsis

}

.header__readout-label {
    color: var(--ui-text-muted);
}

.header__readout-value {
    color: var(--ui-text-primary);
}
</style>

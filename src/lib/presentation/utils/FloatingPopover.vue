<script setup lang="ts">
import { ref } from 'vue';
import { useFloating, offset, flip, shift, autoUpdate, type Placement } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';

const props = withDefaults(defineProps<{
    placement?: Placement;
    offsetValue?: number;
}>(), {
    placement: 'bottom-start',
    offsetValue: 6
});

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const { floatingStyles } = useFloating(triggerRef, menuRef, {
    placement: props.placement,
    whileElementsMounted: autoUpdate,
    middleware: [
        offset(props.offsetValue),
        flip(),
        shift()
    ],
});

const toggle = () => { isOpen.value = !isOpen.value };
const close = () => { isOpen.value = false };

onClickOutside(menuRef, close, { ignore: [triggerRef] });
</script>

<template>
    <div ref="triggerRef" class="floating-popover-wrapper">
        <slot name="trigger" :toggle="toggle" :isOpen="isOpen" :close="close" />
    </div>

    <Teleport to="body">
        <div v-if="isOpen" ref="menuRef" :style="floatingStyles" style="position: absolute; z-index: 9999;">
            <slot name="content" :close="close" />
        </div>
    </Teleport>
</template>

<style scoped>
.floating-popover-wrapper {
    display: inline-block;
}
</style>

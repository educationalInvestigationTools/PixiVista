<script setup lang="ts">
import type { LabelTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';
import SettingRow from '@/presentation/settingsComponent/SettingRow.vue';

const props = defineProps<{
    node : LabelTreeNode
}>()
</script>

<template>
    <SettingRow :label="props.node.label">
    </SettingRow>
</template>

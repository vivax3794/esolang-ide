<template>
    <v-container>
        <v-card color="#424242">
            <span v-for="(item, index) in tokens" :key="index">
                <span :class="{ running: index == pointer }">{{ item }}</span>&nbsp
            </span>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ code: String, pointer: number }>();
const tokens = computed(() => props.code.split(/\s+/))
</script>

<style>
.running {
    background-color: white;
    color: black;
}
</style>

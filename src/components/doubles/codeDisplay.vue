<template>
    <v-container>
        <v-card color="#424242">
            <span style="font-family: monospace;" v-for="(item, index) in code" :key="index">
                <span :class="{ running: index == pointer }">{{ item }}</span>&nbsp;
            </span>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ code: String[], pointer: number }>();
</script>

<style>
.running {
    background-color: white;
    color: black;
}
</style>

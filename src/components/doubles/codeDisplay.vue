<template>
    <v-container>
        <v-card color="#424242">
            <span style="font-family: monospace;" v-for="(item, index) in code" :key="index">
                <span :class="{ running: index == pointer }"
                    :style="{ color: index == pointer ? null : (COLORS[item] ?? 'cyan') }">
                    {{ item }}
                </span>&nbsp;</span>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ code: String[], pointer: number }>();
const COLORS: { [token: string]: string } = {
    "PV": "green",
    "PC": "green",
    "GC": "green",
    "GV": "green",
    "GS": "green",
    "SX": "yellow",
    "IX": "yellow",
    "DX": "yellow",
    "XV": "yellow",
    "SY": "orange",
    "IY": "orange",
    "DY": "orange",
    "YV": "orange",
    "SV": "magenta",
    "DV": "magenta",
    "IV": "magenta",
    "RS": "red",
    "CR": "red",
    "JM": "blue",
    "CJ": "blue",
    "JB": "blue",
    "JF": "blue",
    "CF": "blue",
    "CB": "blue",
    "JR": "blue",
    "RR": "blue",
    "RC": "blue",
    "BC": "blue",
    "RN": "magenta"
}
</script>

<style>
.running {
    background-color: white;
    color: black;
}
</style>

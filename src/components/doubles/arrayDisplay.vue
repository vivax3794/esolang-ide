<template>

    <v-container>
        <v-row> <b>NOTE: this is not the whole memory </b></v-row>
        <v-row v-for="(row, y) in values.slice(0, 27)" :key="y">
            <v-col v-for="(value, x) in row.slice(0, 27)" :key="x">
                <span style="font-family: monospace;" :class="{ selected: x == xIndex && y == yIndex }">{{
                        value.toString(16).toUpperCase().padStart(2,
                            "0")
                }}</span>
            </v-col>
        </v-row>
    </v-container>

</template>
<script lang="ts" setup>
const props = defineProps<{
    values: number[][],
    xIndex: number,
    yIndex: number
}>();
</script>
<style>
.selected {
    background-color: yellow;
    color: black;
}
</style>
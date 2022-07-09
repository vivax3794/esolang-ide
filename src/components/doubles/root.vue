<template>
  <v-container>
    <v-card>
      <Editor @update:code="(newcode) => code = newcode" :starting_code="starting_code.join(' ')" />
      <v-container>
        <v-row>
          <v-btn @click="run_code()" v-if="!inp.running" color="green">RUN</v-btn>
          <v-btn @click="stop_code()" v-else color="red">STOP</v-btn>
          <v-btn @click="do_step()" color="orange">STEP</v-btn>
          <v-btn @click="do_reset()" color="red">RESET</v-btn>
        </v-row>
      </v-container>
      <v-container>
        Execution Speed: {{ speed }}
        <v-slider v-model="speed" max="1000" min="1" step="1" />
      </v-container>
      <CodeDispay :code="running_code" :pointer="inp.pointer" />
      <v-container>
        <v-card>
          <pre>{{ inp.output }}</pre>
        </v-card>
      </v-container>
      <span style="font-family: monospace;">
        X = {{ inp.xValue.toString(16).toUpperCase().padStart(2, "0") }} ({{ inp.xValue }}) <br />
        Y = {{ inp.yValue.toString(16).toUpperCase().padStart(2, "0") }} ({{ inp.yValue }})
      </span>
      <ArrayDisplay :values="inp.data" :x-index="inp.xValue" :y-index="inp.yValue" />
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import Editor from "./editor.vue";
import CodeDispay from "./codeDisplay.vue";
import ArrayDisplay from "./arrayDisplay.vue";

import Interp from "./interp";
import compile from "./compile";
import { encode, decode } from "./encoding";

const starting_code = location.hash.includes("#") ? decode(decodeURIComponent(location.hash.slice(1))) : []
let code = ref(starting_code.join(" "));
let running_code = ref(starting_code);
let inp = ref(new Interp());
let speed = ref(100);

let interval_id: number | undefined = undefined;

do_reset();

function do_reset(): void {
  stop_code();

  running_code.value = compile(code.value);
  inp.value.reset();
  inp.value.tokens = running_code.value;

  location.hash = "#" + encode(running_code.value);
}

function run_code(): void {
  inp.value.running = true;

  interval_id = setInterval(() => {
    let should_stop = inp.value.step();
    if (should_stop) stop_code()
  }, speed.value);
}

function do_step(): void {
  inp.value.step();
}

function stop_code(): void {
  // inp.value.reset();
  inp.value.running = false;
  clearInterval(interval_id);
  interval_id = undefined;
}

</script>

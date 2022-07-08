<template>
  <!-- <v-textarea rows="10" :model-value="props.modelValue"
    @update:modelValue="(newValue) => emit('update:modelValue', newValue)" style="font-family: monospace;" /> -->

  <v-container>
    <v-card color="#424242">
      <pre id="input-colors">{{ starting_code }}</pre>
      <pre id="input" contenteditable="true" @paste="(payload) => paste_event(payload)"
        @input="(event) => content_changed(event)"> {{ starting_code }} </pre>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>

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

const props = defineProps<{
  starting_code: String;
}>();
const emit = defineEmits(["update:code"]);

function paste_event(event: ClipboardEvent): void {
  event.preventDefault();
  document.execCommand('inserttext', false, event.clipboardData.getData('text/plain'));
}

function content_changed(event: Event): void {
  let element = event.target as HTMLPreElement;
  let code = element.innerText ?? "";
  console.log(code)
  emit("update:code", code);

  document.getElementById("input-colors").innerHTML = highligth(code);
}

function highligth(code: string): string {
  code = code.replace(/\/.*?$/gm, "<span style='color: gray'>$&</span>")
  code = code.replace(/(?<=\s|^)\w*?:(?=\s|$)/gm, "<span style='color: pink'>$&</span>")
  code = code.replace(/(?<=\s|^)\.".*?"(?=\s|$)/gm, "<span style='color: green'>$&</span>")

  Object.keys(COLORS).forEach((token) => code = code.replace(new RegExp(`(?<=\\s|^)${token}(?=\\s|$)`, "gm"), `<span style="color: ${COLORS[token] ?? 'cyan'}">${token}</span>`));


  return code;
}
</script>

<style>
#input {
  background-color: transparent;
  color: transparent;
  /* Make text invisible */
  caret-color: hsl(50, 75%, 70%);
  /* But keep caret visible */
  font-family: monospace;
}

#input-colors {
  position: absolute;
  user-select: none;
  font-family: monospace;
  color: cyan;
  pointer-events: none;
}
</style>
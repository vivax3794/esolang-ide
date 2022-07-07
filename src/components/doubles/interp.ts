function parse_hex(value: string): number {
  return value.match(/^ *[a-f0-9]+ *$/i) ? parseInt(value, 16) % 256 : NaN
}

export default class Interp {
  running = false;
  tokens: string[] = [];

  pointer = 0;
  xValue = 0;
  yValue = 0;
  stack: number[] = [];
  data: number[][] = [...Array(256)].map(_ => Array(255).fill(0));
  output = "";

  reset(): void {
    this.running = false;
    this.pointer = 0;
    this.xValue = 0;
    this.yValue = 0;
    this.output = "";
    this.stack = [];
    this.data.forEach(sub => sub.fill(0));
  }

  step(): boolean {
    console.log(this.pointer, this.tokens[this.pointer], this.xValue, this.yValue);

    switch (this.tokens[this.pointer]) {
      case "PV": {
        this.output += this.data[this.yValue][this.xValue].toString() + "\n"
        this.pointer++;
        break;
      }
      case "PC": {
        this.output += String.fromCharCode(this.data[this.yValue][this.xValue])
        this.pointer++;
        break;
      }
      case "SX": {
        this.xValue = parse_hex(this.tokens[this.pointer + 1]);
        this.pointer += 2;
        break;
      }
      case "SY": {
        this.yValue = parse_hex(this.tokens[this.pointer + 1]);
        this.pointer += 2;
        break;
      }
      case "IX": {
        this.xValue++;
        this.xValue %= 256;
        this.pointer++;
        break;
      }
      case "IY": {
        this.yValue++;
        this.yValue %= 256;
        this.pointer++;
        break;
      }
      case "DX": {
        this.xValue--;
        if (this.xValue == -1) this.xValue = 255;
        this.pointer++;
        break;
      }
      case "DY": {
        this.yValue--;
        if (this.yValue == -1) this.yValue = 255;
        this.pointer++;
        break;
      }
      case "SV": {
        this.data[this.yValue][this.xValue] = parse_hex(this.tokens[this.pointer + 1]);
        this.pointer += 2;
        break;
      }
      case "IV": {
        this.data[this.yValue][this.xValue]++;
        this.data[this.yValue][this.xValue] %= 256;
        this.pointer++;
        break;
      }
      case "DV": {
        this.data[this.yValue][this.xValue]--;
        if (this.data[this.yValue][this.xValue] == -1) this.data[this.yValue][this.xValue] = 255;
        this.pointer++;
        break;
      }
      case "RS": {
        this.pointer = 0;
        break;
      }
      case "CR": {
        let current = this.data[this.yValue][this.xValue];
        let check = parse_hex(this.tokens[this.pointer + 1]);
        if (current == check) {
          this.pointer += 2;
        } else {
          this.pointer = 0;
        }
        break;
      }
      case "GC": {
        let value = 255;
        let response = prompt("Enter one char");
        if (response !== null) {
          value = response.charCodeAt(0);
          if (value == -1) value = 255;
        }

        this.data[this.yValue][this.xValue] = value;
        this.pointer++;
        break;

      }
      case "GV": {
        let value = 255;
        let response = prompt("Enter a hex value");
        if (response !== null) {
          value = parse_hex(response.toUpperCase());
          if (Number.isNaN(value)) value = 255;
        }

        this.data[this.yValue][this.xValue] = value;
        this.pointer++;
        break;

      }
      case "XV": {
        this.data[this.yValue][this.xValue] = this.xValue;
        this.pointer++;
        break;
      }
      case "YV": {
        this.data[this.yValue][this.xValue] = this.yValue;
        this.pointer++;
        break;
      }
      case "JM": {
        this.pointer = parse_hex(this.tokens[this.pointer + 1]);
        break;
      }
      case "CJ": {
        let check = parse_hex(this.tokens[this.pointer + 1]);
        let location = parse_hex(this.tokens[this.pointer + 2])
        let current = this.data[this.yValue][this.xValue];

        if (check == current) {
          this.pointer += 3;
        } else {
          this.pointer = location;
        }
        break;
      }
      case "JF": {
        let amount = parse_hex(this.tokens[this.pointer + 1]);
        this.pointer += amount;
        break;
      }
      case "JB": {
        let amount = parse_hex(this.tokens[this.pointer + 1]);
        this.pointer -= amount;
        break;
      }
      case "CF": {
        let check = parse_hex(this.tokens[this.pointer + 1]);
        let amount = parse_hex(this.tokens[this.pointer + 2])
        let current = this.data[this.yValue][this.xValue];

        if (check == current) {
          this.pointer += 3;
        } else {
          this.pointer += amount;
        }
        break;
      }
      case "CB": {
        let check = parse_hex(this.tokens[this.pointer + 1]);
        let amount = parse_hex(this.tokens[this.pointer + 2])
        let current = this.data[this.yValue][this.xValue];

        if (check == current) {
          this.pointer += 3;
        } else {
          this.pointer -= amount;
        }
        break;
      }
      case "GS": {
        let response = prompt("input a string");
        response = response !== null ? response : "";
        for (let index = 0; index < response.length; index++) {
          this.data[this.yValue][this.xValue + index] = response.charCodeAt(index);
        }
        this.data[this.yValue][this.xValue + response.length] = 255;
        this.pointer++;
        break;
      }
      case "JR": {
        let location = parse_hex(this.tokens[this.pointer + 1]);
        this.stack.push(this.pointer + 2);
        this.pointer = location;
        break;
      }
      case "RR": {
        this.pointer = this.stack.pop() ?? this.pointer + 1;
        break;
      }
      case "RC": {
        let check = parse_hex(this.tokens[this.pointer + 1]);
        let location = parse_hex(this.tokens[this.pointer + 2]);
        let current = this.data[this.yValue][this.xValue];

        if (current != check) {
          this.stack.push(this.pointer + 3);
          this.pointer = location;
        } else {
          this.pointer += 3;
        }
        break;
      }
      case "BC": {
        let check = parse_hex(this.tokens[this.pointer + 1]);
        let current = this.data[this.yValue][this.xValue];

        if (current != check) {
          this.pointer = this.stack.pop() ?? this.pointer;
        } else {
          this.pointer += 2;
        }
        break;
      }
      case "RN": {
        this.data[this.yValue][this.xValue] = Math.floor(Math.random() + 0.5);
        this.pointer++;
        break;
      }
      default: {
        this.pointer++;
      }
    }

    return this.pointer >= this.tokens.length;
  }
}

window.onload = onLoad;
var terminal = null;

function onLoad() {
  terminal = new Terminal('output', 50, 30);
  focusInput();
  terminal.printLine('Hello, World!');
  terminal.printLine('');
}

function focusInput() {
  document.getElementById('input').focus();
}

document.getElementById('input').onkeydown = function (event) {
  // On 'Enter', print the input, then call processInput().
  // Ignore 'Enter' if output is still printing.
  if (event.key !== 'Enter')
    return;
  if (terminal.isPrinting())
    return;
  let inputElement = document.getElementById('input');
  let inputString = inputElement.value;
  inputElement.value = '';
  terminal.printLineImmediate('> ' + inputString + '\n');
  processInput(inputString);
};

function processInput(inputString) {
  terminal.printLine("TODO: Make something happen in processInput().");
}


class Terminal {
  constructor(outputElementId, printDelayMs, maxLines) {
    // maxLines: The maximum number of lines to keep in memory (not on screen)
    this.outputElementId = outputElementId;
    this.printDelayMs = printDelayMs;
    this.maxLines = maxLines;
    this.queue = '';
    this.timer = null;
  }

  isPrinting() {
    return this.timer !== null;
  }

  printLine(line) {
    this.queue += '\n' + line;
    if (this.timer === null) {
      this.timer = setInterval(() => {
        this.printNextChar();
      }, this.printDelayMs);
    }
  }

  printLineImmediate(line) {
    this.printChar('\n');
    for (let i = 0; i < line.length; i++)
      this.printChar(line[i]);
  }

  printNextChar() {
    if (this.queue === '') {
      clearInterval(this.timer);
      this.timer = null;
      return;
    }
    this.printChar(this.queue[0]);
    this.queue = this.queue.substr(1);
    // Print spaces without a delay.
    while (this.queue[0] === ' ') {
      this.printChar(' ');
      this.queue = this.queue.substr(1);
    }
  }

  printChar(char) {
    let outputElement = document.getElementById(this.outputElementId);
    if (char === '\n') {
      let lines = outputElement.innerHTML.split('<br>');
      if (lines.length >= this.maxLines)
        lines.shift();
      outputElement.innerHTML = lines.join('<br>');
      char = '<br>';
    }
    if (char === ' ')
      char = '\xA0'; // nbsp;
    outputElement.innerHTML += char;
  }
}

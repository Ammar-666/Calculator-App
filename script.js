let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let expression = '';
let history = [];

const display = document.getElementById('display');
const historyLog = document.getElementById('history-log');

// Variables for swipe gesture
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // Minimum pixels to qualify as a swipe

// Add event listeners for touch gestures
display.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

display.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    // Detect a swipe from right to left
    if (touchEndX < touchStartX - swipeThreshold) {
        backspace();
    }
}

function backspace() {
    if (expression.length > 0) {
        expression = expression.slice(0, -1);
        if (expression === '') {
            expression = '0';
            displayValue = '0';
        } else {
            // Update the displayValue based on the new expression
            const parts = expression.split(/[\+\-\*\/]/);
            displayValue = parts[parts.length - 1].trim();
        }
        updateDisplay();
    }
}

function updateDisplay() {
    display.textContent = expression || displayValue;
}

function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    expression = '';
    updateDisplay();
}

function appendNumber(number) {
    if (waitingForSecondOperand) {
        displayValue = number;
        waitingForSecondOperand = false;
        if (operator) {
            expression = firstOperand + ' ' + operator + ' ' + number;
        } else {
            expression = number;
        }
    } else {
        if (expression.length > 1 && expression.startsWith('0') && expression.includes('.')) {
            expression += number;
        } else {
            expression = expression === '0' ? number : expression + number;
        }
        displayValue = displayValue === '0' ? number : displayValue + number;
    }
    updateDisplay();
}

function appendOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        expression = firstOperand + ' ' + nextOperator + ' ';
        updateDisplay();
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation(firstOperand, inputValue, operator);
        displayValue = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    expression = firstOperand + ' ' + operator + ' ';
    updateDisplay();
}

function calculateResult() {
    const inputValue = parseFloat(displayValue);
    if (operator && !waitingForSecondOperand) {
        const result = performCalculation(firstOperand, inputValue, operator);
        displayValue = String(result);

        const historyItem = `${firstOperand} ${operator} ${inputValue} = ${result}`;
        history.push(historyItem);
        renderHistory();

        expression = result;
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }
}

function performCalculation(operand1, operand2, op) {
    if (op === '+') {
        return operand1 + operand2;
    } else if (op === '-') {
        return operand1 - operand2;
    } else if (op === '*') {
        return operand1 * operand2;
    } else if (op === '/') {
        return operand1 / operand2;
    } else {
        return operand2;
    }
}

function toggleSign() {
    displayValue = (parseFloat(displayValue) * -1).toString();
    expression = displayValue;
    updateDisplay();
}

function calculatePercentage() {
    displayValue = (parseFloat(displayValue) / 100).toString();
    expression = displayValue;
    updateDisplay();
}

function renderHistory() {
    historyLog.innerHTML = '';
    history.forEach(item => {
        const historyItemDiv = document.createElement('div');
        historyItemDiv.classList.add('history-item');
        historyItemDiv.textContent = item;
        historyLog.appendChild(historyItemDiv);
    });
}

function toggleHistory() {
    historyLog.classList.toggle('active');
}
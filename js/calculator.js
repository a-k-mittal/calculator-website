/**
 * Scientific Calculator Module
 * Supports: Basic operations, trigonometry, powers, roots, factorial, percentage
 */

(function() {
    'use strict';

    // Calculator State
    const state = {
        expression: '',
        result: '0',
        lastResult: null,
        waitingForOperand: false
    };

    // DOM Elements
    const expressionDisplay = document.getElementById('expression');
    const resultDisplay = document.getElementById('result');
    const keypad = document.querySelector('.keypad');

    // Utility Functions
    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity; // Prevent overflow
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    function formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return 'Error';
        if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
        
        // Handle very large or very small numbers with scientific notation
        if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-8 && num !== 0)) {
            return num.toExponential(6);
        }
        
        // Round to avoid floating point errors
        const rounded = Math.round(num * 1e10) / 1e10;
        
        // Format with commas for readability (optional)
        const str = rounded.toString();
        if (str.length > 12) {
            return parseFloat(rounded.toPrecision(10)).toString();
        }
        return str;
    }

    function updateDisplay() {
        expressionDisplay.textContent = state.expression;
        resultDisplay.textContent = state.result;
    }

    // Parse and evaluate the expression safely
    function evaluateExpression(expr) {
        try {
            // Replace display symbols with JavaScript operators
            let evalExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/π/g, Math.PI.toString())
                .replace(/e(?![0-9])/g, Math.E.toString());

            // Handle percentage
            evalExpr = evalExpr.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');

            // Handle implicit multiplication: 2(3) or (2)(3)
            evalExpr = evalExpr.replace(/(\d)\(/g, '$1*(');
            evalExpr = evalExpr.replace(/\)(\d)/g, ')*$1');
            evalExpr = evalExpr.replace(/\)\(/g, ')*(');

            // Validate expression - only allow safe characters
            if (!/^[0-9+\-*/().%\s]+$/.test(evalExpr)) {
                return NaN;
            }

            // Check for balanced parentheses
            let parenCount = 0;
            for (const char of evalExpr) {
                if (char === '(') parenCount++;
                if (char === ')') parenCount--;
                if (parenCount < 0) return NaN;
            }
            if (parenCount !== 0) return NaN;

            // Evaluate using Function constructor (safer than eval)
            const result = new Function('return ' + evalExpr)();
            return typeof result === 'number' ? result : NaN;
        } catch (error) {
            return NaN;
        }
    }

    // Handle scientific functions
    function applyScientificFunction(action) {
        let currentValue = parseFloat(state.result.replace(/,/g, ''));
        if (isNaN(currentValue)) currentValue = 0;

        let result;
        let displayAction = '';

        switch (action) {
            case 'sin':
                result = Math.sin(currentValue * Math.PI / 180); // Degrees
                displayAction = `sin(${currentValue})`;
                break;
            case 'cos':
                result = Math.cos(currentValue * Math.PI / 180); // Degrees
                displayAction = `cos(${currentValue})`;
                break;
            case 'tan':
                result = Math.tan(currentValue * Math.PI / 180); // Degrees
                displayAction = `tan(${currentValue})`;
                break;
            case 'sqrt':
                result = Math.sqrt(currentValue);
                displayAction = `√(${currentValue})`;
                break;
            case 'square':
                result = currentValue * currentValue;
                displayAction = `(${currentValue})²`;
                break;
            case 'factorial':
                if (currentValue < 0 || !Number.isInteger(currentValue)) {
                    result = NaN;
                } else {
                    result = factorial(currentValue);
                }
                displayAction = `${currentValue}!`;
                break;
            case 'percent':
                result = currentValue / 100;
                displayAction = `${currentValue}%`;
                break;
            case 'negate':
                result = -currentValue;
                displayAction = '';
                state.result = formatNumber(result);
                updateDisplay();
                return;
            default:
                return;
        }

        state.expression = displayAction + ' =';
        state.result = formatNumber(result);
        state.lastResult = result;
        state.waitingForOperand = true;
        updateDisplay();
    }

    // Handle button clicks
    function handleButtonClick(event) {
        const button = event.target.closest('.btn');
        if (!button) return;

        const value = button.dataset.value;
        const action = button.dataset.action;

        // Number or decimal input
        if (value !== undefined) {
            if (state.waitingForOperand) {
                state.expression = '';
                state.result = value === '.' ? '0.' : value;
                state.waitingForOperand = false;
            } else {
                if (value === '.' && state.result.includes('.')) return;
                if (state.result === '0' && value !== '.') {
                    state.result = value;
                } else {
                    state.result += value;
                }
            }
            updateDisplay();
            return;
        }

        // Actions
        switch (action) {
            case 'clear':
                state.expression = '';
                state.result = '0';
                state.lastResult = null;
                state.waitingForOperand = false;
                break;

            case 'backspace':
                if (state.result.length > 1) {
                    state.result = state.result.slice(0, -1);
                } else {
                    state.result = '0';
                }
                break;

            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                const operators = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
                if (state.expression && !state.waitingForOperand) {
                    // Chain operations
                    state.expression += state.result + ' ' + operators[action] + ' ';
                } else if (state.lastResult !== null) {
                    state.expression = formatNumber(state.lastResult) + ' ' + operators[action] + ' ';
                } else {
                    state.expression = state.result + ' ' + operators[action] + ' ';
                }
                state.waitingForOperand = true;
                break;

            case 'equals':
                if (state.expression) {
                    const fullExpression = state.expression + state.result;
                    const evalResult = evaluateExpression(fullExpression);
                    state.expression = fullExpression + ' =';
                    state.result = formatNumber(evalResult);
                    state.lastResult = evalResult;
                    state.waitingForOperand = true;
                }
                break;

            case 'openParen':
                if (state.waitingForOperand || state.result === '0') {
                    state.result = '(';
                    state.waitingForOperand = false;
                } else {
                    state.result += '(';
                }
                break;

            case 'closeParen':
                state.result += ')';
                break;

            case 'power':
                state.expression = state.result + '^';
                state.result = '0';
                state.waitingForOperand = true;
                // For power, we'll handle it specially
                break;

            case 'sin':
            case 'cos':
            case 'tan':
            case 'sqrt':
            case 'square':
            case 'factorial':
            case 'percent':
            case 'negate':
                applyScientificFunction(action);
                return;

            default:
                return;
        }

        updateDisplay();
    }

    // Keyboard support
    function handleKeyboard(event) {
        const key = event.key;
        
        // Prevent default for calculator keys
        if (/^[0-9+\-*/().=%]$/.test(key) || ['Enter', 'Backspace', 'Escape', 'Delete'].includes(key)) {
            event.preventDefault();
        }

        // Map keyboard to actions
        const keyMap = {
            '0': { value: '0' },
            '1': { value: '1' },
            '2': { value: '2' },
            '3': { value: '3' },
            '4': { value: '4' },
            '5': { value: '5' },
            '6': { value: '6' },
            '7': { value: '7' },
            '8': { value: '8' },
            '9': { value: '9' },
            '.': { value: '.' },
            '+': { action: 'add' },
            '-': { action: 'subtract' },
            '*': { action: 'multiply' },
            '/': { action: 'divide' },
            '%': { action: 'percent' },
            '(': { action: 'openParen' },
            ')': { action: 'closeParen' },
            'Enter': { action: 'equals' },
            '=': { action: 'equals' },
            'Backspace': { action: 'backspace' },
            'Delete': { action: 'clear' },
            'Escape': { action: 'clear' }
        };

        const mapping = keyMap[key];
        if (mapping) {
            // Create a fake event
            const fakeButton = document.createElement('button');
            fakeButton.classList.add('btn');
            if (mapping.value !== undefined) {
                fakeButton.dataset.value = mapping.value;
            }
            if (mapping.action !== undefined) {
                fakeButton.dataset.action = mapping.action;
            }
            handleButtonClick({ target: fakeButton });
        }
    }

    // Initialize
    function init() {
        keypad.addEventListener('click', handleButtonClick);
        document.addEventListener('keydown', handleKeyboard);
        updateDisplay();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

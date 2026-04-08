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

    // DOM Elements - will be set in init()
    let expressionDisplay;
    let resultDisplay;
    let keypad;

    // Utility Functions
    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return NaN; // Too large - would overflow
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    function formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return 'Error';
        // Division by zero or overflow - show Error instead of infinity
        if (!isFinite(num)) return 'Error';
        
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
        if (expressionDisplay) expressionDisplay.textContent = state.expression;
        if (resultDisplay) resultDisplay.textContent = state.result;
    }

    // Parse and evaluate the expression safely
    function evaluateExpression(expr) {
        try {
            // Replace display symbols with JavaScript operators
            let evalExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/\^/g, '**')
                .replace(/π/g, Math.PI.toString())
                .replace(/e(?![0-9])/g, Math.E.toString());

            // Handle percentage
            evalExpr = evalExpr.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');

            // Handle implicit multiplication: 2(3) or (2)(3)
            evalExpr = evalExpr.replace(/(\d)\(/g, '$1*(');
            evalExpr = evalExpr.replace(/\)(\d)/g, ')*$1');
            evalExpr = evalExpr.replace(/\)\(/g, ')*(');

            // Check for 0^0 (0**0) which is mathematically undefined
            if (/(?<![1-9])0\s*\*\*\s*0(?![1-9])/.test(evalExpr) || /\b0\*\*0\b/.test(evalExpr)) {
                return NaN;
            }

            // Validate expression - only allow safe characters (includes ** for power)
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
                // Handle exact values for common angles
                if (currentValue % 180 === 0) result = 0;
                displayAction = `sin(${currentValue})`;
                break;
            case 'cos':
                result = Math.cos(currentValue * Math.PI / 180); // Degrees
                // Handle exact values for common angles
                if ((currentValue - 90) % 180 === 0) result = 0;
                displayAction = `cos(${currentValue})`;
                break;
            case 'tan':
                // tan is undefined at 90°, 270°, etc. (90 + n*180)
                if ((currentValue - 90) % 180 === 0) {
                    result = NaN; // Undefined
                } else {
                    result = Math.tan(currentValue * Math.PI / 180); // Degrees
                    // Handle exact zero at multiples of 180
                    if (currentValue % 180 === 0) result = 0;
                }
                displayAction = `tan(${currentValue})`;
                break;
            case 'sqrt':
                if (currentValue < 0) {
                    result = NaN; // Square root of negative is not real
                    displayAction = `√(${currentValue}) - Invalid`;
                } else {
                    result = Math.sqrt(currentValue);
                    displayAction = `√(${currentValue})`;
                }
                break;
            case 'square':
                result = currentValue * currentValue;
                displayAction = `(${currentValue})²`;
                break;
            case 'factorial':
                if (currentValue < 0 || !Number.isInteger(currentValue)) {
                    result = NaN;
                    displayAction = currentValue < 0 ? `${currentValue}! - Invalid` : `${currentValue}! - Integer only`;
                } else if (currentValue > 170) {
                    result = NaN;
                    displayAction = `${currentValue}! - Too large`;
                } else {
                    result = factorial(currentValue);
                    displayAction = `${currentValue}!`;
                }
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
                // Only clear expression if it shows a completed calculation (contains '=')
                if (state.expression.includes('=')) {
                    state.expression = '';
                    state.lastResult = null; // Clear previous result when starting fresh
                }
                state.result = value === '.' ? '0.' : value;
                state.waitingForOperand = false;
            } else {
                if (value === '.' && state.result.includes('.')) return;
                // Handle decimal after just minus sign: "-" + "." = "-0."
                if (value === '.' && state.result === '-') {
                    state.result = '-0.';
                } else if (state.result === '0' && value !== '.') {
                    state.result = value;
                } else {
                    state.result += value;
                }
                // Remove leading zeros (but keep "0." and "-0." for decimals)
                if (!state.result.includes('.') && state.result.length > 1 && state.result !== '-') {
                    state.result = state.result.replace(/^(-?)0+/, '$1') || '0';
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
                // If just finished a calculation, clear for new input
                if (state.waitingForOperand) {
                    state.expression = '';
                    state.result = '0';
                    state.waitingForOperand = false;
                } else if (state.result.length > 1) {
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
                
                // Special case: after power (^), minus should negate the exponent
                if (action === 'subtract' && state.expression.endsWith('^') && state.waitingForOperand) {
                    state.result = '-';
                    state.waitingForOperand = false;
                    break;
                }
                
                // Special case: at the start, minus should start a negative number
                if (action === 'subtract' && !state.expression && state.result === '0') {
                    state.result = '-';
                    break;
                }
                
                // If already waiting for operand, replace the previous operator
                if (state.waitingForOperand && state.expression) {
                    // If expression shows a completed calculation (contains '='), start fresh with result
                    if (state.expression.includes('=')) {
                        state.expression = state.result + ' ' + operators[action] + ' ';
                    }
                    // Don't replace ^ with operator - that would break power
                    else if (!state.expression.endsWith('^')) {
                        state.expression = state.expression.replace(/[+−×÷]\s*$/, operators[action] + ' ');
                    }
                } else if (state.expression && !state.waitingForOperand) {
                    // Chain operations
                    state.expression += state.result + ' ' + operators[action] + ' ';
                } else {
                    // Start new expression with current result (not lastResult)
                    state.expression = state.result + ' ' + operators[action] + ' ';
                }
                state.waitingForOperand = true;
                break;

            case 'equals':
                // If already showing a result (expression contains '='), do nothing
                if (state.expression && state.expression.includes('=')) {
                    break;
                }
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
                // Count open and close parens to ensure balance
                const fullExpr = state.expression + state.result;
                const openCount = (fullExpr.match(/\(/g) || []).length;
                const closeCount = (fullExpr.match(/\)/g) || []).length;
                // Only allow closing paren if there's an unmatched opening paren
                if (openCount > closeCount) {
                    state.result += ')';
                }
                break;

            case 'power':
                // Append current result to expression with power operator
                if (state.expression && !state.waitingForOperand) {
                    // If there's an existing expression, append the result first
                    state.expression += state.result + '^';
                } else if (state.expression && state.waitingForOperand) {
                    // Replace operator with power - remove trailing operator
                    state.expression = state.expression.replace(/[+−×÷]\s*$/, '') + state.result + '^';
                } else {
                    state.expression = state.result + '^';
                }
                state.result = '0';
                state.waitingForOperand = true;
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
        // Only handle keyboard when calculator tab is active
        const calculatorTab = document.getElementById('calculator');
        if (!calculatorTab || !calculatorTab.classList.contains('active')) {
            return; // Not on calculator tab, let other inputs handle keyboard
        }
        
        // Don't intercept when user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        const key = event.key;

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
            // Prevent default browser behavior for calculator keys
            event.preventDefault();
            
            // Create a fake event to trigger button click handler
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
        // Select DOM elements after DOM is ready
        expressionDisplay = document.getElementById('expression');
        resultDisplay = document.getElementById('result');
        keypad = document.querySelector('.keypad');
        
        // Attach keyboard listener first (works globally)
        document.addEventListener('keydown', handleKeyboard);
        
        // Attach click listener to keypad if it exists
        if (keypad) {
            keypad.addEventListener('click', handleButtonClick);
        } else {
            console.error('Calculator keypad not found');
        }
        
        updateDisplay();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

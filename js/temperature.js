// Temperature Converter
const Temperature = {
    input: null,
    fromSelect: null,
    toSelect: null,
    result: null,
    unit: null,
    swapBtn: null,

    init() {
        this.input = document.getElementById('tempInput');
        this.fromSelect = document.getElementById('tempFrom');
        this.toSelect = document.getElementById('tempTo');
        this.result = document.getElementById('tempResult');
        this.unit = document.getElementById('tempUnit');
        this.swapBtn = document.getElementById('swapTemp');

        this.setupEventListeners();
        this.convert();
    },

    setupEventListeners() {
        this.input.addEventListener('input', () => this.convert());
        this.fromSelect.addEventListener('change', () => this.convert());
        this.toSelect.addEventListener('change', () => this.convert());
        this.swapBtn.addEventListener('click', () => this.swap());
    },

    // Convert to Celsius first (base unit), then to target
    toCelsius(value, fromUnit) {
        switch (fromUnit) {
            case 'celsius':
                return value;
            case 'fahrenheit':
                return (value - 32) * 5 / 9;
            case 'kelvin':
                return value - 273.15;
            default:
                return value;
        }
    },

    fromCelsius(celsius, toUnit) {
        switch (toUnit) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * 9 / 5) + 32;
            case 'kelvin':
                return celsius + 273.15;
            default:
                return celsius;
        }
    },

    getUnitSymbol(unit) {
        const symbols = {
            celsius: '°C',
            fahrenheit: '°F',
            kelvin: 'K'
        };
        return symbols[unit] || unit;
    },

    convert() {
        const value = parseFloat(this.input.value);
        
        if (isNaN(value)) {
            this.result.textContent = '--';
            return;
        }

        const fromUnit = this.fromSelect.value;
        const toUnit = this.toSelect.value;

        // Convert via Celsius
        const celsius = this.toCelsius(value, fromUnit);
        const result = this.fromCelsius(celsius, toUnit);

        // Format result
        this.result.textContent = this.formatNumber(result);
        this.unit.textContent = this.getUnitSymbol(toUnit);
    },

    formatNumber(num) {
        if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(4);
        }
        // Round to reasonable decimal places
        const rounded = Math.round(num * 1000000) / 1000000;
        return rounded.toLocaleString('en-US', { maximumFractionDigits: 6 });
    },

    swap() {
        const temp = this.fromSelect.value;
        this.fromSelect.value = this.toSelect.value;
        this.toSelect.value = temp;
        this.convert();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => Temperature.init());

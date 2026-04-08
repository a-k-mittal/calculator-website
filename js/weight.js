/**
 * Weight Converter Module
 * Converts between: Kilogram, Gram, Milligram
 */

(function() {
    'use strict';

    // Conversion factors (base unit: kilogram)
    const conversionFactors = {
        kilogram: 1,
        gram: 1000,
        milligram: 1000000
    };

    // Unit display names
    const unitNames = {
        kilogram: 'kg',
        gram: 'g',
        milligram: 'mg'
    };

    // DOM Elements
    const weightInput = document.getElementById('weightInput');
    const weightFrom = document.getElementById('weightFrom');
    const weightTo = document.getElementById('weightTo');
    const weightResult = document.getElementById('weightResult');
    const weightUnit = document.getElementById('weightUnit');
    const swapBtn = document.getElementById('swapWeight');

    // Convert weight
    function convert() {
        const value = parseFloat(weightInput.value);
        const fromUnit = weightFrom.value;
        const toUnit = weightTo.value;

        if (isNaN(value)) {
            weightResult.textContent = '--';
            weightUnit.textContent = unitNames[toUnit];
            return;
        }

        // Weight cannot be negative
        if (value < 0) {
            weightResult.textContent = 'Invalid';
            weightUnit.textContent = '(negative)';
            return;
        }

        // Convert to kilograms first, then to target unit
        const inKilograms = value / conversionFactors[fromUnit];
        const result = inKilograms * conversionFactors[toUnit];

        // Format result
        let formattedResult;
        if (Math.abs(result) >= 1e9 || (Math.abs(result) < 1e-6 && result !== 0)) {
            formattedResult = result.toExponential(4);
        } else {
            // Round to avoid floating point errors
            formattedResult = parseFloat(result.toPrecision(10));
            // Add thousand separators for large numbers
            if (Math.abs(formattedResult) >= 1000) {
                formattedResult = formattedResult.toLocaleString('en-US', {
                    maximumFractionDigits: 6
                });
            }
        }

        weightResult.textContent = formattedResult;
        weightUnit.textContent = unitNames[toUnit];
    }

    // Swap units
    function swap() {
        const temp = weightFrom.value;
        weightFrom.value = weightTo.value;
        weightTo.value = temp;
        convert();
    }

    // Event listeners
    function init() {
        weightInput.addEventListener('input', convert);
        weightFrom.addEventListener('change', convert);
        weightTo.addEventListener('change', convert);
        swapBtn.addEventListener('click', swap);

        // Initial conversion
        convert();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

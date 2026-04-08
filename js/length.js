/**
 * Length Converter Module
 * Converts between: Meter, Centimeter, Millimeter, Kilometer, Mile, Inch, Foot, Yard
 */

(function() {
    'use strict';

    // Conversion factors (base unit: meter)
    const conversionFactors = {
        meter: 1,
        centimeter: 100,
        millimeter: 1000,
        kilometer: 0.001,
        mile: 0.000621371,
        inch: 39.3701,
        foot: 3.28084,
        yard: 1.09361
    };

    // Unit display names
    const unitNames = {
        meter: 'm',
        centimeter: 'cm',
        millimeter: 'mm',
        kilometer: 'km',
        mile: 'mi',
        inch: 'in',
        foot: 'ft',
        yard: 'yd'
    };

    // DOM Elements
    const lengthInput = document.getElementById('lengthInput');
    const lengthFrom = document.getElementById('lengthFrom');
    const lengthTo = document.getElementById('lengthTo');
    const lengthResult = document.getElementById('lengthResult');
    const lengthUnit = document.getElementById('lengthUnit');
    const swapBtn = document.getElementById('swapLength');

    // Convert length
    function convert() {
        const value = parseFloat(lengthInput.value);
        const fromUnit = lengthFrom.value;
        const toUnit = lengthTo.value;

        if (isNaN(value)) {
            lengthResult.textContent = '--';
            lengthUnit.textContent = unitNames[toUnit];
            return;
        }

        // Length cannot be negative
        if (value < 0) {
            lengthResult.textContent = 'Invalid';
            lengthUnit.textContent = '(negative)';
            return;
        }

        // Convert to meters first, then to target unit
        const inMeters = value / conversionFactors[fromUnit];
        const result = inMeters * conversionFactors[toUnit];

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

        lengthResult.textContent = formattedResult;
        lengthUnit.textContent = unitNames[toUnit];
    }

    // Swap units
    function swap() {
        const temp = lengthFrom.value;
        lengthFrom.value = lengthTo.value;
        lengthTo.value = temp;
        convert();
    }

    // Event listeners
    function init() {
        lengthInput.addEventListener('input', convert);
        lengthFrom.addEventListener('change', convert);
        lengthTo.addEventListener('change', convert);
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

/**
 * Area Converter Module
 * Converts between: Square Meter, Square Centimeter, Square Kilometer, Square Mile,
 *                   Square Foot, Square Yard, Square Inch, Hectare, Acre
 */

(function() {
    'use strict';

    // Conversion factors (base unit: square meter)
    const conversionFactors = {
        squareMeter: 1,
        squareCentimeter: 10000,
        squareKilometer: 0.000001,
        squareMile: 3.861e-7,
        squareFoot: 10.7639,
        squareYard: 1.19599,
        squareInch: 1550.0031,
        hectare: 0.0001,
        acre: 0.000247105
    };

    // Unit display names
    const unitNames = {
        squareMeter: 'm²',
        squareCentimeter: 'cm²',
        squareKilometer: 'km²',
        squareMile: 'mi²',
        squareFoot: 'ft²',
        squareYard: 'yd²',
        squareInch: 'in²',
        hectare: 'ha',
        acre: 'ac'
    };

    // DOM Elements
    const areaInput = document.getElementById('areaInput');
    const areaFrom = document.getElementById('areaFrom');
    const areaTo = document.getElementById('areaTo');
    const areaResult = document.getElementById('areaResult');
    const areaUnit = document.getElementById('areaUnit');
    const swapBtn = document.getElementById('swapArea');

    // Convert area
    function convert() {
        const value = parseFloat(areaInput.value);
        const fromUnit = areaFrom.value;
        const toUnit = areaTo.value;

        if (isNaN(value)) {
            areaResult.textContent = '--';
            areaUnit.textContent = unitNames[toUnit];
            return;
        }

        // Area cannot be negative
        if (value < 0) {
            areaResult.textContent = 'Invalid';
            areaUnit.textContent = '(negative)';
            return;
        }

        // Convert to square meters first, then to target unit
        const inSquareMeters = value / conversionFactors[fromUnit];
        const result = inSquareMeters * conversionFactors[toUnit];

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

        areaResult.textContent = formattedResult;
        areaUnit.textContent = unitNames[toUnit];
    }

    // Swap units
    function swap() {
        const temp = areaFrom.value;
        areaFrom.value = areaTo.value;
        areaTo.value = temp;
        convert();
    }

    // Event Listeners
    areaInput.addEventListener('input', convert);
    areaFrom.addEventListener('change', convert);
    areaTo.addEventListener('change', convert);
    swapBtn.addEventListener('click', swap);

    // Initial conversion
    convert();
})();

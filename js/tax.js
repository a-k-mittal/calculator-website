/**
 * Income Tax Calculator
 * Compares Old vs New Tax Regime
 * Supports multiple Financial Years (FY 2024-25, 2025-26, 2026-27)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const taxFY = document.getElementById('taxFY');
    const taxIncome = document.getElementById('taxIncome');
    const taxAge = document.getElementById('taxAge');
    const deduction80C = document.getElementById('deduction80C');
    const deduction80CCD = document.getElementById('deduction80CCD');
    const deduction80D = document.getElementById('deduction80D');
    const deduction80TTA = document.getElementById('deduction80TTA');
    const deductionHRA = document.getElementById('deductionHRA');
    const deductionHomeLoan = document.getElementById('deductionHomeLoan');
    const deductionOther = document.getElementById('deductionOther');

    // Constants
    const CESS_RATE = 0.04; // 4% Health & Education Cess

    // Tax configuration by Financial Year
    const TAX_CONFIG = {
        '2024-25': {
            standardDeductionOld: 50000,
            standardDeductionNew: 75000,
            rebateLimitOld: 500000,
            rebateLimitNew: 700000,
            oldSlabs: {
                below60: [
                    { limit: 250000, rate: 0 },
                    { limit: 500000, rate: 0.05 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ],
                senior: [
                    { limit: 300000, rate: 0 },
                    { limit: 500000, rate: 0.05 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ],
                supersenior: [
                    { limit: 500000, rate: 0 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ]
            },
            newSlabs: [
                { limit: 300000, rate: 0 },
                { limit: 700000, rate: 0.05 },
                { limit: 1000000, rate: 0.10 },
                { limit: 1200000, rate: 0.15 },
                { limit: 1500000, rate: 0.20 },
                { limit: Infinity, rate: 0.30 }
            ],
            slabDisplay: {
                old: [
                    ['Up to ₹2,50,000', 'Nil'],
                    ['₹2,50,001 - ₹5,00,000', '5%'],
                    ['₹5,00,001 - ₹10,00,000', '20%'],
                    ['Above ₹10,00,000', '30%']
                ],
                new: [
                    ['Up to ₹3,00,000', 'Nil'],
                    ['₹3,00,001 - ₹7,00,000', '5%'],
                    ['₹7,00,001 - ₹10,00,000', '10%'],
                    ['₹10,00,001 - ₹12,00,000', '15%'],
                    ['₹12,00,001 - ₹15,00,000', '20%'],
                    ['Above ₹15,00,000', '30%']
                ]
            },
            note: '+ 4% Health & Education Cess on total tax. Rebate u/s 87A: No tax if taxable income ≤ ₹5L (Old) / ₹7L (New).'
        },
        '2025-26': {
            standardDeductionOld: 50000,
            standardDeductionNew: 75000,
            rebateLimitOld: 500000,
            rebateLimitNew: 700000,
            oldSlabs: {
                below60: [
                    { limit: 250000, rate: 0 },
                    { limit: 500000, rate: 0.05 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ],
                senior: [
                    { limit: 300000, rate: 0 },
                    { limit: 500000, rate: 0.05 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ],
                supersenior: [
                    { limit: 500000, rate: 0 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ]
            },
            newSlabs: [
                { limit: 300000, rate: 0 },
                { limit: 700000, rate: 0.05 },
                { limit: 1000000, rate: 0.10 },
                { limit: 1200000, rate: 0.15 },
                { limit: 1500000, rate: 0.20 },
                { limit: Infinity, rate: 0.30 }
            ],
            slabDisplay: {
                old: [
                    ['Up to ₹2,50,000', 'Nil'],
                    ['₹2,50,001 - ₹5,00,000', '5%'],
                    ['₹5,00,001 - ₹10,00,000', '20%'],
                    ['Above ₹10,00,000', '30%']
                ],
                new: [
                    ['Up to ₹3,00,000', 'Nil'],
                    ['₹3,00,001 - ₹7,00,000', '5%'],
                    ['₹7,00,001 - ₹10,00,000', '10%'],
                    ['₹10,00,001 - ₹12,00,000', '15%'],
                    ['₹12,00,001 - ₹15,00,000', '20%'],
                    ['Above ₹15,00,000', '30%']
                ]
            },
            note: '+ 4% Health & Education Cess on total tax. Rebate u/s 87A: No tax if taxable income ≤ ₹5L (Old) / ₹7L (New).'
        },
        '2026-27': {
            // Union Budget 2025 changes - New regime more favorable
            standardDeductionOld: 50000,
            standardDeductionNew: 75000,
            rebateLimitOld: 500000,
            rebateLimitNew: 1200000, // Increased rebate limit
            oldSlabs: {
                below60: [
                    { limit: 250000, rate: 0 },
                    { limit: 500000, rate: 0.05 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ],
                senior: [
                    { limit: 300000, rate: 0 },
                    { limit: 500000, rate: 0.05 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ],
                supersenior: [
                    { limit: 500000, rate: 0 },
                    { limit: 1000000, rate: 0.20 },
                    { limit: Infinity, rate: 0.30 }
                ]
            },
            // New regime slabs - Budget 2025 changes
            newSlabs: [
                { limit: 400000, rate: 0 },
                { limit: 800000, rate: 0.05 },
                { limit: 1200000, rate: 0.10 },
                { limit: 1600000, rate: 0.15 },
                { limit: 2000000, rate: 0.20 },
                { limit: 2400000, rate: 0.25 },
                { limit: Infinity, rate: 0.30 }
            ],
            slabDisplay: {
                old: [
                    ['Up to ₹2,50,000', 'Nil'],
                    ['₹2,50,001 - ₹5,00,000', '5%'],
                    ['₹5,00,001 - ₹10,00,000', '20%'],
                    ['Above ₹10,00,000', '30%']
                ],
                new: [
                    ['Up to ₹4,00,000', 'Nil'],
                    ['₹4,00,001 - ₹8,00,000', '5%'],
                    ['₹8,00,001 - ₹12,00,000', '10%'],
                    ['₹12,00,001 - ₹16,00,000', '15%'],
                    ['₹16,00,001 - ₹20,00,000', '20%'],
                    ['₹20,00,001 - ₹24,00,000', '25%'],
                    ['Above ₹24,00,000', '30%']
                ]
            },
            note: '+ 4% Health & Education Cess on total tax. Rebate u/s 87A: No tax if taxable income ≤ ₹5L (Old) / ₹12L (New).'
        }
    };

    // Surcharge slabs (same for all years)
    const SURCHARGE_SLABS = [
        { limit: 5000000, rate: 0 },
        { limit: 10000000, rate: 0.10 },
        { limit: 20000000, rate: 0.15 },
        { limit: 50000000, rate: 0.25 },
        { limit: Infinity, rate: 0.37 }
    ];

    // Get current FY config
    function getConfig() {
        const fy = taxFY ? taxFY.value : '2026-27';
        return TAX_CONFIG[fy] || TAX_CONFIG['2026-27'];
    }

    // Helper: Format Indian currency
    function formatIndianCurrency(num) {
        if (num === undefined || num === null || isNaN(num)) return '₹0';
        
        const isNegative = num < 0;
        num = Math.abs(Math.round(num));
        
        const numStr = num.toString();
        let result = '';
        
        if (numStr.length <= 3) {
            result = numStr;
        } else {
            result = numStr.slice(-3);
            let remaining = numStr.slice(0, -3);
            
            while (remaining.length > 0) {
                if (remaining.length > 2) {
                    result = remaining.slice(-2) + ',' + result;
                    remaining = remaining.slice(0, -2);
                } else {
                    result = remaining + ',' + result;
                    remaining = '';
                }
            }
        }
        
        return (isNegative ? '-' : '') + '₹' + result;
    }

    // Helper: Sanitize number input
    function sanitizeNumber(value, defaultVal = 0) {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) return defaultVal;
        return num;
    }

    // Calculate tax based on slabs
    function calculateTaxOnSlabs(income, slabs) {
        let tax = 0;
        let previousLimit = 0;

        for (const slab of slabs) {
            if (income <= previousLimit) break;
            
            const taxableInSlab = Math.min(income, slab.limit) - previousLimit;
            tax += taxableInSlab * slab.rate;
            previousLimit = slab.limit;
        }

        return tax;
    }

    // Calculate surcharge
    function calculateSurcharge(income, tax, isNewRegime = false) {
        let surchargeRate = 0;
        
        for (const slab of SURCHARGE_SLABS) {
            if (income <= slab.limit) {
                surchargeRate = slab.rate;
                break;
            }
        }

        // New regime caps surcharge at 25%
        if (isNewRegime && surchargeRate > 0.25) {
            surchargeRate = 0.25;
        }

        return tax * surchargeRate;
    }

    // Calculate Old Regime Tax
    function calculateOldRegimeTax(income, age, deductions) {
        const config = getConfig();
        const grossIncome = income;
        
        // Total deductions
        const totalDeductions = config.standardDeductionOld + 
            Math.min(deductions.c80, 150000) +
            Math.min(deductions.ccd80, 50000) +
            Math.min(deductions.d80, 100000) +
            Math.min(deductions.tta80, age === 'supersenior' || age === 'senior' ? 50000 : 10000) +
            deductions.hra +
            Math.min(deductions.homeLoan, 200000) +
            deductions.other;

        // Taxable income
        const taxableIncome = Math.max(0, grossIncome - totalDeductions);

        // Get appropriate slabs based on age
        const slabs = config.oldSlabs[age];

        // Calculate tax
        let tax = calculateTaxOnSlabs(taxableIncome, slabs);

        // Apply rebate u/s 87A
        if (taxableIncome <= config.rebateLimitOld) {
            tax = 0;
        }

        // Add surcharge
        const surcharge = calculateSurcharge(grossIncome, tax, false);
        tax += surcharge;

        // Add cess
        const cess = tax * CESS_RATE;
        tax += cess;

        return {
            grossIncome,
            totalDeductions,
            taxableIncome,
            tax: Math.round(tax),
            effectiveRate: grossIncome > 0 ? ((tax / grossIncome) * 100).toFixed(2) : 0
        };
    }

    // Calculate New Regime Tax
    function calculateNewRegimeTax(income) {
        const config = getConfig();
        const grossIncome = income;
        
        // Only standard deduction in new regime
        const totalDeductions = config.standardDeductionNew;
        const taxableIncome = Math.max(0, grossIncome - totalDeductions);

        // Calculate tax
        let tax = calculateTaxOnSlabs(taxableIncome, config.newSlabs);

        // Apply rebate u/s 87A
        if (taxableIncome <= config.rebateLimitNew) {
            tax = 0;
        }

        // Add surcharge (capped at 25% for new regime)
        const surcharge = calculateSurcharge(grossIncome, tax, true);
        tax += surcharge;

        // Add cess
        const cess = tax * CESS_RATE;
        tax += cess;

        return {
            grossIncome,
            totalDeductions,
            taxableIncome,
            tax: Math.round(tax),
            effectiveRate: grossIncome > 0 ? ((tax / grossIncome) * 100).toFixed(2) : 0
        };
    }

    // Main calculation function
    function calculateTax() {
        // Get values
        const income = sanitizeNumber(taxIncome.value, 0);
        const age = taxAge.value;

        const deductions = {
            c80: sanitizeNumber(deduction80C.value, 0),
            ccd80: sanitizeNumber(deduction80CCD.value, 0),
            d80: sanitizeNumber(deduction80D.value, 0),
            tta80: sanitizeNumber(deduction80TTA.value, 0),
            hra: sanitizeNumber(deductionHRA.value, 0),
            homeLoan: sanitizeNumber(deductionHomeLoan.value, 0),
            other: sanitizeNumber(deductionOther.value, 0)
        };

        // Calculate both regimes
        const oldResult = calculateOldRegimeTax(income, age, deductions);
        const newResult = calculateNewRegimeTax(income);

        // Update Old Regime display
        document.getElementById('oldGrossIncome').textContent = formatIndianCurrency(oldResult.grossIncome);
        document.getElementById('oldDeductions').textContent = formatIndianCurrency(oldResult.totalDeductions);
        document.getElementById('oldTaxableIncome').textContent = formatIndianCurrency(oldResult.taxableIncome);
        document.getElementById('oldTaxPayable').textContent = formatIndianCurrency(oldResult.tax);
        document.getElementById('oldEffectiveRate').textContent = oldResult.effectiveRate + '%';

        // Update New Regime display
        document.getElementById('newGrossIncome').textContent = formatIndianCurrency(newResult.grossIncome);
        document.getElementById('newDeductions').textContent = formatIndianCurrency(newResult.totalDeductions);
        document.getElementById('newTaxableIncome').textContent = formatIndianCurrency(newResult.taxableIncome);
        document.getElementById('newTaxPayable').textContent = formatIndianCurrency(newResult.tax);
        document.getElementById('newEffectiveRate').textContent = newResult.effectiveRate + '%';

        // Update recommendation
        const recommendationEl = document.getElementById('taxRecommendation');
        const recommendedRegimeEl = document.getElementById('recommendedRegime');
        const taxSavingsEl = document.getElementById('taxSavings');

        const savings = Math.abs(oldResult.tax - newResult.tax);

        if (oldResult.tax < newResult.tax) {
            recommendedRegimeEl.textContent = 'Old Tax Regime';
            taxSavingsEl.textContent = `saves you ${formatIndianCurrency(savings)}`;
            recommendationEl.className = 'tax-recommendation old-better';
        } else if (newResult.tax < oldResult.tax) {
            recommendedRegimeEl.textContent = 'New Tax Regime';
            taxSavingsEl.textContent = `saves you ${formatIndianCurrency(savings)}`;
            recommendationEl.className = 'tax-recommendation new-better';
        } else {
            recommendedRegimeEl.textContent = 'Both regimes equal';
            taxSavingsEl.textContent = 'no difference in tax';
            recommendationEl.className = 'tax-recommendation equal';
        }

        // Highlight better regime card
        document.querySelector('.old-regime').classList.toggle('better', oldResult.tax < newResult.tax);
        document.querySelector('.new-regime').classList.toggle('better', newResult.tax < oldResult.tax);
    }

    // Input validation - prevent negative and special characters
    function enforcePositiveInput(inputElement) {
        if (!inputElement) return;

        inputElement.addEventListener('keydown', (e) => {
            // Block: minus, plus, e, E
            if (['-', '+', 'e', 'E'].includes(e.key)) {
                e.preventDefault();
            }
        });

        inputElement.addEventListener('input', () => {
            let value = inputElement.value;
            
            // Remove any negative signs or special chars that got through
            value = value.replace(/[^0-9.]/g, '');
            
            // Ensure only one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            if (value !== inputElement.value) {
                inputElement.value = value;
            }
            
            calculateTax();
        });
    }

    // Initialize tooltips
    function initTooltips() {
        const tooltips = document.querySelectorAll('#tax .tooltip-icon');
        
        tooltips.forEach(tooltip => {
            // Only add tooltip if not already added
            if (!tooltip.querySelector('.tooltip-text')) {
                const tooltipText = document.createElement('div');
                tooltipText.className = 'tooltip-text';
                tooltipText.textContent = tooltip.dataset.tooltip;
                tooltip.appendChild(tooltipText);
            }
        });
    }

    // Update tax slabs display based on selected FY
    function updateTaxSlabsDisplay() {
        const config = getConfig();
        const container = document.getElementById('taxSlabsDisplay');
        const noteEl = document.getElementById('slabNote');
        const subtitleEl = document.getElementById('taxSubtitle');
        const fy = taxFY ? taxFY.value : '2026-27';
        
        if (!container) return;

        // Update subtitle
        if (subtitleEl) {
            subtitleEl.textContent = `Compare Old vs New Tax Regime (FY ${fy})`;
        }

        // Build the table HTML
        let html = `
            <div class="tax-slab-table">
                <h4>Old Regime (Below 60)</h4>
                <table>
                    ${config.slabDisplay.old.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('')}
                </table>
            </div>
            <div class="tax-slab-table">
                <h4>New Regime (All Ages)</h4>
                <table>
                    ${config.slabDisplay.new.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('')}
                </table>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Update note
        if (noteEl) {
            noteEl.textContent = config.note;
        }
    }

    // Apply input validation to all inputs
    const allInputs = [
        taxIncome, deduction80C, deduction80CCD, deduction80D,
        deduction80TTA, deductionHRA, deductionHomeLoan, deductionOther
    ];

    allInputs.forEach(input => {
        if (input) enforcePositiveInput(input);
    });

    // Event listener for FY dropdown
    if (taxFY) {
        taxFY.addEventListener('change', () => {
            updateTaxSlabsDisplay();
            calculateTax();
        });
    }

    // Event listener for age dropdown
    if (taxAge) {
        taxAge.addEventListener('change', calculateTax);
    }

    // Initialize collapsibles for tax section
    // (separate handler since investment.js may not properly attach to tax section)
    function initCollapsibles() {
        const headers = document.querySelectorAll('#tax .collapsible-header');
        headers.forEach(header => {
            // Remove any existing listeners and add fresh one
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
            
            newHeader.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = newHeader.closest('.collapsible-section');
                if (section) {
                    section.classList.toggle('collapsed');
                }
            });
        });
    }

    // Initialize
    initTooltips();
    initCollapsibles();
    updateTaxSlabsDisplay();
    
    // Initial calculation
    calculateTax();
});

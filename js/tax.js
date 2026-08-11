/**
 * Income Tax Calculator
 * Compares Old vs New Tax Regime
 * Supports multiple Financial Years (FY 2024-25, 2025-26, 2026-27)
 */

(function() {
    function init() {
    // Input elements
    const taxFY = document.getElementById('taxFY');
    const taxIncome = document.getElementById('taxIncome');
    const taxAge = document.getElementById('taxAge');
    
    // Old Regime specific deductions
    const deduction80C = document.getElementById('deduction80C');
    const deduction80CCD = document.getElementById('deduction80CCD');
    const deduction80D = document.getElementById('deduction80D');
    const deduction80TTA = document.getElementById('deduction80TTA');
    const deductionHRA = document.getElementById('deductionHRA');
    const deductionHomeLoan = document.getElementById('deductionHomeLoan');
    const deductionOther = document.getElementById('deductionOther');
    
    // Common deductions (applicable to both regimes)
    const deductionNPSEmployer = document.getElementById('deductionNPSEmployer');
    const deductionAgnipath = document.getElementById('deductionAgnipath');

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

    // Dynamic Deductions Configuration
    const DEDUCTION_CONFIG = {
        '80E': { name: 'Education Loan Interest', limit: Infinity, description: 'Interest on education loan for higher studies' },
        '80G': { name: 'Donations', limit: Infinity, description: '50% or 100% deduction on donations to approved funds' },
        '80GG': { name: 'Rent Paid (No HRA)', limit: 60000, description: 'Rent paid when not receiving HRA' },
        '80EEB': { name: 'EV Loan Interest', limit: 150000, description: 'Interest on loan for electric vehicle' },
        '80DDB': { name: 'Medical Treatment', limit: 100000, description: 'Expenses for specified diseases' },
        '80U': { name: 'Disability', limit: 125000, description: '₹75,000 (40-80%) or ₹1,25,000 (>80% disability)' },
        '80RRB': { name: 'Royalty on Patents', limit: 300000, description: 'Income from patents registered in India' },
        '80QQB': { name: 'Royalty on Books', limit: 300000, description: 'Income from authoring books' }
    };

    // Store for dynamically added deductions
    let addedDeductions = {};
    const STORAGE_KEY = 'taxCalc_dynamicDeductions';

    // Load deductions from localStorage
    function loadDynamicDeductions() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                addedDeductions = JSON.parse(saved);
                renderAddedDeductions();
                updateOtherDeductionsTotal();
            }
        } catch (e) {
            console.warn('Could not load saved deductions:', e);
        }
    }

    // Save deductions to localStorage
    function saveDynamicDeductions() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(addedDeductions));
        } catch (e) {
            console.warn('Could not save deductions:', e);
        }
    }

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

    // Calculate tax based on slabs with detailed breakdown
    function calculateTaxOnSlabs(income, slabs) {
        let tax = 0;
        let previousLimit = 0;
        const breakdown = [];

        for (const slab of slabs) {
            if (income <= previousLimit) break;
            
            const taxableInSlab = Math.min(income, slab.limit) - previousLimit;
            const taxInSlab = taxableInSlab * slab.rate;
            tax += taxInSlab;
            
            if (taxableInSlab > 0) {
                breakdown.push({
                    from: previousLimit,
                    to: Math.min(income, slab.limit),
                    rate: slab.rate,
                    taxableAmount: taxableInSlab,
                    tax: taxInSlab
                });
            }
            
            previousLimit = slab.limit;
        }

        return { tax, breakdown };
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
    function calculateOldRegimeTax(income, age, deductions, commonDeductions = {}) {
        const config = getConfig();
        const grossIncome = income;
        
        // Standard Deduction (Old Regime)
        const standardDeduction = config.standardDeductionOld;
        
        // Common deductions (applicable to both regimes)
        const commonTotal = (commonDeductions.npsEmployer || 0) + (commonDeductions.agnipath || 0);
        
        // Chapter VI-A Deductions (80C, 80CCD, 80D, 80TTA, HRA, Home Loan, Other)
        const chapterVIADeductions = 
            Math.min(deductions.c80, 150000) +
            Math.min(deductions.ccd80, 50000) +
            Math.min(deductions.d80, 100000) +
            Math.min(deductions.tta80, age === 'supersenior' || age === 'senior' ? 50000 : 10000) +
            deductions.hra +
            Math.min(deductions.homeLoan, 200000) +
            deductions.other +
            commonTotal;
        
        // Total deductions
        const totalDeductions = standardDeduction + chapterVIADeductions;

        // Taxable income
        const taxableIncome = Math.max(0, grossIncome - totalDeductions);

        // Get appropriate slabs based on age
        const slabs = config.oldSlabs[age];

        // Calculate tax on slabs with breakdown
        const { tax: taxOnIncome, breakdown: slabBreakdown } = calculateTaxOnSlabs(taxableIncome, slabs);
        
        // Calculate rebate u/s 87A
        let rebate = 0;
        let taxAfterRebate = taxOnIncome;
        if (taxableIncome <= config.rebateLimitOld && taxOnIncome > 0) {
            rebate = taxOnIncome;
            taxAfterRebate = 0;
        }

        // Add surcharge
        const surcharge = calculateSurcharge(grossIncome, taxAfterRebate, false);
        const taxWithSurcharge = taxAfterRebate + surcharge;

        // Add cess
        const cess = taxWithSurcharge * CESS_RATE;
        const totalTax = taxWithSurcharge + cess;
        
        // Monthly take-home
        const monthlyTakeHome = Math.round((grossIncome - totalTax) / 12);

        return {
            grossIncome,
            standardDeduction,
            chapterVIADeductions,
            totalDeductions,
            taxableIncome,
            taxOnIncome: Math.round(taxOnIncome),
            slabBreakdown,
            rebate: Math.round(rebate),
            surcharge: Math.round(surcharge),
            cess: Math.round(cess),
            tax: Math.round(totalTax),
            monthlyTakeHome,
            effectiveRate: grossIncome > 0 ? ((totalTax / grossIncome) * 100).toFixed(2) : 0
        };
    }

    // Calculate New Regime Tax
    function calculateNewRegimeTax(income, commonDeductions = {}) {
        const config = getConfig();
        const grossIncome = income;
        
        // Common deductions (applicable to both regimes)
        const commonTotal = (commonDeductions.npsEmployer || 0) + (commonDeductions.agnipath || 0);
        
        // Standard deduction + Common deductions in new regime
        const totalDeductions = config.standardDeductionNew + commonTotal;
        const taxableIncome = Math.max(0, grossIncome - totalDeductions);

        // Calculate tax on slabs with breakdown
        const { tax: taxOnIncome, breakdown: slabBreakdown } = calculateTaxOnSlabs(taxableIncome, config.newSlabs);

        // Calculate rebate u/s 87A
        let rebate = 0;
        let taxAfterRebate = taxOnIncome;
        if (taxableIncome <= config.rebateLimitNew && taxOnIncome > 0) {
            rebate = taxOnIncome;
            taxAfterRebate = 0;
        }

        // Add surcharge (capped at 25% for new regime)
        const surcharge = calculateSurcharge(grossIncome, taxAfterRebate, true);
        const taxWithSurcharge = taxAfterRebate + surcharge;

        // Add cess
        const cess = taxWithSurcharge * CESS_RATE;
        const totalTax = taxWithSurcharge + cess;
        
        // Monthly take-home
        const monthlyTakeHome = Math.round((grossIncome - totalTax) / 12);

        return {
            grossIncome,
            totalDeductions,
            taxableIncome,
            taxOnIncome: Math.round(taxOnIncome),
            slabBreakdown,
            rebate: Math.round(rebate),
            surcharge: Math.round(surcharge),
            cess: Math.round(cess),
            tax: Math.round(totalTax),
            monthlyTakeHome,
            effectiveRate: grossIncome > 0 ? ((totalTax / grossIncome) * 100).toFixed(2) : 0
        };
    }

    // Render added deductions to the UI
    function renderAddedDeductions() {
        const container = document.getElementById('addedDeductions');
        const totalRow = document.getElementById('deductionTotalRow');
        const dropdown = document.getElementById('deductionDropdown');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        // Update dropdown - disable already added options
        if (dropdown) {
            Array.from(dropdown.options).forEach(option => {
                if (option.value) {
                    option.disabled = addedDeductions.hasOwnProperty(option.value);
                }
            });
        }
        
        const sections = Object.keys(addedDeductions);
        
        if (sections.length === 0) {
            if (totalRow) totalRow.style.display = 'none';
            return;
        }
        
        sections.forEach(section => {
            const config = DEDUCTION_CONFIG[section];
            const amount = addedDeductions[section];
            const isExceeded = config.limit !== Infinity && amount > config.limit;
            
            const item = document.createElement('div');
            item.className = 'deduction-item';
            item.dataset.section = section;
            
            const limitText = config.limit === Infinity ? 'No limit' : `Max ₹${config.limit.toLocaleString('en-IN')}`;
            
            item.innerHTML = `
                <span class="section-badge">${section}</span>
                <span class="deduction-name">${config.name}</span>
                <input type="number" class="deduction-amount-input" value="${amount}" 
                       placeholder="Enter amount" min="0" ${config.limit !== Infinity ? `max="${config.limit}"` : ''}
                       inputmode="numeric" step="1">
                <span class="limit-info ${isExceeded ? 'limit-exceeded' : ''}">${limitText}</span>
                <button type="button" class="remove-btn" title="Remove">×</button>
            `;
            
            container.appendChild(item);
        });
        
        if (totalRow) totalRow.style.display = 'flex';
    }

    // Update the total other deductions
    function updateOtherDeductionsTotal() {
        let total = 0;
        
        Object.keys(addedDeductions).forEach(section => {
            const config = DEDUCTION_CONFIG[section];
            const amount = addedDeductions[section];
            // Apply limit if applicable
            if (config.limit !== Infinity) {
                total += Math.min(amount, config.limit);
            } else {
                total += amount;
            }
        });
        
        // Update hidden input for backward compatibility
        if (deductionOther) {
            deductionOther.value = total;
        }
        
        // Update total display
        const totalDisplay = document.getElementById('totalOtherDeductions');
        if (totalDisplay) {
            totalDisplay.textContent = formatIndianCurrency(total);
        }
        
        return total;
    }

    // Initialize dynamic deductions UI
    function initDynamicDeductions() {
        const addBtn = document.getElementById('addDeductionBtn');
        const selector = document.getElementById('deductionSelector');
        const dropdown = document.getElementById('deductionDropdown');
        const confirmBtn = document.getElementById('confirmDeductionBtn');
        const cancelBtn = document.getElementById('cancelDeductionBtn');
        const container = document.getElementById('addedDeductions');
        
        if (!addBtn || !selector || !dropdown) return;
        
        // Show selector when add button is clicked
        addBtn.addEventListener('click', () => {
            selector.style.display = 'flex';
            dropdown.value = '';
            dropdown.focus();
        });
        
        // Confirm adding deduction
        confirmBtn.addEventListener('click', () => {
            const section = dropdown.value;
            if (section && !addedDeductions.hasOwnProperty(section)) {
                addedDeductions[section] = 0;
                saveDynamicDeductions();
                renderAddedDeductions();
                updateOtherDeductionsTotal();
                calculateTax();
            }
            selector.style.display = 'none';
        });
        
        // Cancel adding
        cancelBtn.addEventListener('click', () => {
            selector.style.display = 'none';
        });
        
        // Handle input changes and remove buttons (event delegation)
        container.addEventListener('input', (e) => {
            if (e.target.classList.contains('deduction-amount-input')) {
                const item = e.target.closest('.deduction-item');
                const section = item.dataset.section;
                const value = sanitizeNumber(e.target.value, 0);
                const config = DEDUCTION_CONFIG[section];
                
                addedDeductions[section] = value;
                
                // Visual feedback for limit exceeded
                const limitInfo = item.querySelector('.limit-info');
                const input = e.target;
                
                if (config.limit !== Infinity && value > config.limit) {
                    input.classList.add('invalid');
                    limitInfo.classList.add('limit-exceeded');
                } else {
                    input.classList.remove('invalid');
                    limitInfo.classList.remove('limit-exceeded');
                }
                
                saveDynamicDeductions();
                updateOtherDeductionsTotal();
                calculateTax();
            }
        });
        
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const item = e.target.closest('.deduction-item');
                const section = item.dataset.section;
                
                delete addedDeductions[section];
                saveDynamicDeductions();
                renderAddedDeductions();
                updateOtherDeductionsTotal();
                calculateTax();
            }
        });
        
        // Load saved deductions
        loadDynamicDeductions();
    }

    // Get deductions breakdown for PDF export
    function getDynamicDeductionsBreakdown() {
        const breakdown = [];
        
        Object.keys(addedDeductions).forEach(section => {
            const config = DEDUCTION_CONFIG[section];
            const claimed = addedDeductions[section];
            const allowed = config.limit === Infinity ? claimed : Math.min(claimed, config.limit);
            
            if (claimed > 0) {
                breakdown.push({
                    section: section,
                    description: config.name,
                    claimed: claimed,
                    allowed: allowed
                });
            }
        });
        
        return breakdown;
    }

    // Main calculation function
    function calculateTax() {
        // Get values
        const income = sanitizeNumber(taxIncome.value, 0);
        const age = taxAge.value;

        // Old regime specific deductions
        const deductions = {
            c80: sanitizeNumber(deduction80C.value, 0),
            ccd80: sanitizeNumber(deduction80CCD.value, 0),
            d80: sanitizeNumber(deduction80D.value, 0),
            tta80: sanitizeNumber(deduction80TTA.value, 0),
            hra: sanitizeNumber(deductionHRA.value, 0),
            homeLoan: sanitizeNumber(deductionHomeLoan.value, 0),
            other: sanitizeNumber(deductionOther.value, 0)
        };
        
        // Common deductions (apply to both regimes)
        const commonDeductions = {
            npsEmployer: sanitizeNumber(deductionNPSEmployer ? deductionNPSEmployer.value : 0, 0),
            agnipath: sanitizeNumber(deductionAgnipath ? deductionAgnipath.value : 0, 0)
        };

        // Calculate both regimes
        const oldResult = calculateOldRegimeTax(income, age, deductions, commonDeductions);
        const newResult = calculateNewRegimeTax(income, commonDeductions);

        // Update Old Regime display
        document.getElementById('oldGrossIncome').textContent = formatIndianCurrency(oldResult.grossIncome);
        document.getElementById('oldStandardDeduction').textContent = formatIndianCurrency(oldResult.standardDeduction);
        document.getElementById('oldChapterVIA').textContent = formatIndianCurrency(oldResult.chapterVIADeductions);
        document.getElementById('oldDeductions').textContent = formatIndianCurrency(oldResult.totalDeductions);
        document.getElementById('oldTaxableIncome').textContent = formatIndianCurrency(oldResult.taxableIncome);
        document.getElementById('oldTaxOnIncome').textContent = formatIndianCurrency(oldResult.taxOnIncome);
        document.getElementById('oldCess').textContent = formatIndianCurrency(oldResult.cess);
        document.getElementById('oldTaxPayable').textContent = formatIndianCurrency(oldResult.tax);
        document.getElementById('oldEffectiveRate').textContent = oldResult.effectiveRate + '%';
        document.getElementById('oldMonthlyTakeHome').textContent = formatIndianCurrency(oldResult.monthlyTakeHome);
        
        // Show/hide rebate row for Old Regime
        const oldRebateRow = document.getElementById('oldRebateRow');
        if (oldResult.rebate > 0) {
            oldRebateRow.style.display = 'flex';
            document.getElementById('oldRebate').textContent = '-' + formatIndianCurrency(oldResult.rebate);
        } else {
            oldRebateRow.style.display = 'none';
        }
        
        // Show/hide surcharge row for Old Regime
        const oldSurchargeRow = document.getElementById('oldSurchargeRow');
        if (oldResult.surcharge > 0) {
            oldSurchargeRow.style.display = 'flex';
            document.getElementById('oldSurcharge').textContent = formatIndianCurrency(oldResult.surcharge);
        } else {
            oldSurchargeRow.style.display = 'none';
        }

        // Update New Regime display
        document.getElementById('newGrossIncome').textContent = formatIndianCurrency(newResult.grossIncome);
        document.getElementById('newDeductions').textContent = formatIndianCurrency(newResult.totalDeductions);
        document.getElementById('newTaxableIncome').textContent = formatIndianCurrency(newResult.taxableIncome);
        document.getElementById('newTaxOnIncome').textContent = formatIndianCurrency(newResult.taxOnIncome);
        document.getElementById('newCess').textContent = formatIndianCurrency(newResult.cess);
        document.getElementById('newTaxPayable').textContent = formatIndianCurrency(newResult.tax);
        document.getElementById('newEffectiveRate').textContent = newResult.effectiveRate + '%';
        document.getElementById('newMonthlyTakeHome').textContent = formatIndianCurrency(newResult.monthlyTakeHome);
        
        // Show/hide rebate row for New Regime
        const newRebateRow = document.getElementById('newRebateRow');
        if (newResult.rebate > 0) {
            newRebateRow.style.display = 'flex';
            document.getElementById('newRebate').textContent = '-' + formatIndianCurrency(newResult.rebate);
        } else {
            newRebateRow.style.display = 'none';
        }
        
        // Show/hide surcharge row for New Regime
        const newSurchargeRow = document.getElementById('newSurchargeRow');
        if (newResult.surcharge > 0) {
            newSurchargeRow.style.display = 'flex';
            document.getElementById('newSurcharge').textContent = formatIndianCurrency(newResult.surcharge);
        } else {
            newSurchargeRow.style.display = 'none';
        }

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
        
        // Update break-even analysis
        updateBreakEvenAnalysis(income, age, newResult, commonDeductions);
        
        // Update slab breakdown
        updateSlabBreakdown(oldResult, newResult);
        
        // Update investment suggestions  
        updateInvestmentSuggestions(deductions);
        
        // Store current results for export/save
        window.currentTaxResults = { oldResult, newResult, income, age, deductions, commonDeductions, fy: taxFY.value };
        
        // Validate and show warnings for exceeding max limits
        validateDeductionLimits();
    }
    
    // Update break-even analysis
    function updateBreakEvenAnalysis(income, age, newResult, commonDeductions) {
        const breakEvenEl = document.getElementById('breakEvenText');
        const breakEvenSection = document.getElementById('breakEvenSection');
        
        if (!breakEvenEl || income <= 0) {
            if (breakEvenEl) breakEvenEl.textContent = 'Enter income to see analysis';
            return;
        }
        
        const config = getConfig();
        const newTax = newResult.tax;
        
        // Calculate: What deduction amount would make Old Regime = New Regime tax?
        // We need to find deduction X where Old Regime tax with X deductions = New Regime tax
        
        // Binary search for break-even deduction
        let low = 0;
        let high = income; // Max possible deduction
        let breakEvenDeduction = -1;
        
        for (let i = 0; i < 50; i++) { // 50 iterations for precision
            const mid = Math.floor((low + high) / 2);
            
            // Calculate old regime tax with mid deduction
            const testDeductions = { c80: Math.min(mid, 150000), ccd80: 0, d80: 0, tta80: 0, hra: 0, homeLoan: 0, other: Math.max(0, mid - 150000) };
            const oldTestResult = calculateOldRegimeTax(income, age, testDeductions, commonDeductions);
            
            if (Math.abs(oldTestResult.tax - newTax) < 100) {
                breakEvenDeduction = mid;
                break;
            }
            
            if (oldTestResult.tax > newTax) {
                low = mid + 1; // Need more deductions
            } else {
                high = mid - 1; // Less deductions needed
            }
        }
        
        // Get current total deductions claimed
        const currentDeductions = 
            sanitizeNumber(deduction80C.value, 0) +
            sanitizeNumber(deduction80CCD.value, 0) +
            sanitizeNumber(deduction80D.value, 0) +
            sanitizeNumber(deduction80TTA.value, 0) +
            sanitizeNumber(deductionHRA.value, 0) +
            sanitizeNumber(deductionHomeLoan.value, 0) +
            sanitizeNumber(deductionOther.value, 0);
        
        // Calculate old regime tax with current deductions
        const currentOldDeductions = {
            c80: sanitizeNumber(deduction80C.value, 0),
            ccd80: sanitizeNumber(deduction80CCD.value, 0),
            d80: sanitizeNumber(deduction80D.value, 0),
            tta80: sanitizeNumber(deduction80TTA.value, 0),
            hra: sanitizeNumber(deductionHRA.value, 0),
            homeLoan: sanitizeNumber(deductionHomeLoan.value, 0),
            other: sanitizeNumber(deductionOther.value, 0)
        };
        const currentOldResult = calculateOldRegimeTax(income, age, currentOldDeductions, commonDeductions);
        
        // Generate insight message
        if (currentOldResult.tax < newTax) {
            // Old regime is already better
            const surplus = breakEvenDeduction > 0 ? currentDeductions - breakEvenDeduction : 0;
            if (surplus > 50000) {
                breakEvenEl.innerHTML = `Old Regime is better. You have <strong>${formatIndianCurrency(surplus)}</strong> buffer before New Regime becomes better.`;
            } else {
                breakEvenEl.innerHTML = `Old Regime is better with your current deductions.`;
            }
            breakEvenSection.className = 'break-even-analysis old-better';
        } else if (currentOldResult.tax > newTax) {
            // New regime is better
            if (breakEvenDeduction > 0 && breakEvenDeduction > currentDeductions) {
                const needed = breakEvenDeduction - currentDeductions;
                breakEvenEl.innerHTML = `Need <strong>${formatIndianCurrency(needed)}</strong> more deductions for Old Regime to be better.`;
            } else if (breakEvenDeduction <= 0) {
                breakEvenEl.innerHTML = `New Regime is better for your income level regardless of deductions.`;
            } else {
                breakEvenEl.innerHTML = `New Regime saves you <strong>${formatIndianCurrency(newTax - currentOldResult.tax)}</strong>.`;
            }
            breakEvenSection.className = 'break-even-analysis new-better';
        } else {
            breakEvenEl.innerHTML = `Both regimes result in same tax. Any additional deduction makes Old Regime better.`;
            breakEvenSection.className = 'break-even-analysis equal';
        }
    }
    
    // Update slab-wise breakdown display
    function updateSlabBreakdown(oldResult, newResult) {
        const oldContainer = document.getElementById('oldSlabBreakdown');
        const newContainer = document.getElementById('newSlabBreakdown');
        
        if (oldContainer) {
            oldContainer.innerHTML = renderSlabBreakdown(oldResult.slabBreakdown, oldResult.taxOnIncome);
        }
        if (newContainer) {
            newContainer.innerHTML = renderSlabBreakdown(newResult.slabBreakdown, newResult.taxOnIncome);
        }
    }
    
    function renderSlabBreakdown(breakdown, total) {
        if (!breakdown || breakdown.length === 0) {
            return '<div class="slab-row"><span class="slab-range">No tax applicable</span><span class="slab-tax">₹0</span></div>';
        }
        
        let html = breakdown.map(slab => {
            const ratePercent = (slab.rate * 100).toFixed(0);
            const rangeText = `₹${formatCompact(slab.from)} - ₹${formatCompact(slab.to)} @ ${ratePercent}%`;
            return `<div class="slab-row">
                <span class="slab-range">${rangeText}</span>
                <span class="slab-tax">${formatIndianCurrency(slab.tax)}</span>
            </div>`;
        }).join('');
        
        html += `<div class="slab-row total">
            <span class="slab-range">Total</span>
            <span class="slab-tax">${formatIndianCurrency(total)}</span>
        </div>`;
        
        return html;
    }
    
    function formatCompact(num) {
        if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
        if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        return num.toLocaleString('en-IN');
    }
    
    // Update investment suggestions
    function updateInvestmentSuggestions(deductions) {
        const container = document.getElementById('suggestionsList');
        if (!container) return;
        
        const suggestions = [];
        
        // Check 80C
        const current80C = sanitizeNumber(deduction80C.value, 0);
        if (current80C < 150000) {
            suggestions.push({
                label: '80C (PPF, ELSS, LIC)',
                remaining: 150000 - current80C,
                maxed: false
            });
        } else {
            suggestions.push({ label: '80C Investments', remaining: 0, maxed: true });
        }
        
        // Check 80CCD(1B) NPS
        const currentNPS = sanitizeNumber(deduction80CCD.value, 0);
        if (currentNPS < 50000) {
            suggestions.push({
                label: '80CCD(1B) NPS',
                remaining: 50000 - currentNPS,
                maxed: false
            });
        } else {
            suggestions.push({ label: '80CCD(1B) NPS', remaining: 0, maxed: true });
        }
        
        // Check 80D
        const current80D = sanitizeNumber(deduction80D.value, 0);
        const max80D = (taxAge.value === 'senior' || taxAge.value === 'supersenior') ? 100000 : 50000;
        if (current80D < max80D) {
            suggestions.push({
                label: '80D Health Insurance',
                remaining: max80D - current80D,
                maxed: false
            });
        } else {
            suggestions.push({ label: '80D Health Insurance', remaining: 0, maxed: true });
        }
        
        // Check Home Loan
        const currentHomeLoan = sanitizeNumber(deductionHomeLoan.value, 0);
        if (currentHomeLoan < 200000 && currentHomeLoan > 0) {
            suggestions.push({
                label: 'Home Loan Interest (24b)',
                remaining: 200000 - currentHomeLoan,
                maxed: false
            });
        }
        
        // Render suggestions
        const activeSuggestions = suggestions.filter(s => !s.maxed);
        
        if (activeSuggestions.length === 0) {
            container.innerHTML = '<p class="no-suggestions">✓ All major deduction limits utilized!</p>';
        } else {
            container.innerHTML = suggestions.map(s => `
                <div class="suggestion-item ${s.maxed ? 'maxed' : ''}">
                    <span class="label">${s.label}</span>
                    <span class="value">${s.maxed ? '✓ Maxed' : 'Can add ' + formatIndianCurrency(s.remaining)}</span>
                </div>
            `).join('');
        }
    }
    
    // Validate deduction limits and show warnings
    function validateDeductionLimits() {
        const warnings = [];
        const deductionLimits = [
            { id: 'deduction80C', max: 150000, name: '80C Investments' },
            { id: 'deduction80CCD', max: 50000, name: '80CCD(1B) NPS' },
            { id: 'deduction80D', max: 100000, name: '80D Health Insurance' },
            { id: 'deduction80TTA', max: taxAge.value === 'senior' || taxAge.value === 'supersenior' ? 50000 : 10000, name: '80TTA Savings Interest' },
            { id: 'deductionHomeLoan', max: 200000, name: 'Home Loan Interest' },
        ];
        
        deductionLimits.forEach(({ id, max, name }) => {
            const input = document.getElementById(id);
            if (input) {
                const value = parseFloat(input.value) || 0;
                if (value > max) {
                    warnings.push(`${name}: Capped at ₹${max.toLocaleString('en-IN')}`);
                }
            }
        });
        
        const warningEl = document.getElementById('deductionWarning');
        if (warningEl) {
            if (warnings.length > 0) {
                warningEl.innerHTML = '⚠️ ' + warnings.join(' | ');
                warningEl.style.display = 'block';
            } else {
                warningEl.style.display = 'none';
            }
        }
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

    // Initialize tooltips - simple approach, CSS handles positioning
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

    // Quick Actions
    function initQuickActions() {
        const maxOut80C = document.getElementById('maxOut80C');
        const maxOut80D = document.getElementById('maxOut80D');
        const maxOutNPS = document.getElementById('maxOutNPS');
        const clearAllDeductions = document.getElementById('clearAllDeductions');
        
        if (maxOut80C) {
            maxOut80C.addEventListener('click', () => {
                deduction80C.value = 150000;
                calculateTax();
            });
        }
        
        if (maxOut80D) {
            maxOut80D.addEventListener('click', () => {
                const max80D = (taxAge.value === 'senior' || taxAge.value === 'supersenior') ? 50000 : 25000;
                deduction80D.value = max80D;
                calculateTax();
            });
        }
        
        if (maxOutNPS) {
            maxOutNPS.addEventListener('click', () => {
                deduction80CCD.value = 50000;
                calculateTax();
            });
        }
        
        if (clearAllDeductions) {
            clearAllDeductions.addEventListener('click', () => {
                const deductionInputs = [
                    deduction80C, deduction80CCD, deduction80D,
                    deduction80TTA, deductionHRA, deductionHomeLoan, deductionOther,
                    deductionNPSEmployer, deductionAgnipath
                ];
                deductionInputs.forEach(input => {
                    if (input) input.value = 0;
                });
                calculateTax();
            });
        }
    }
    
    // Save & Load Scenarios
    function initScenarios() {
        const saveBtn = document.getElementById('saveScenario');
        const viewBtn = document.getElementById('viewSavedScenarios');
        const modal = document.getElementById('scenariosModal');
        const closeBtn = document.getElementById('closeModal');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', saveCurrentScenario);
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                renderSavedScenarios();
                modal.classList.add('show');
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        }
    }
    
    function saveCurrentScenario() {
        const title = prompt('Enter a name for this scenario:', `Scenario ${new Date().toLocaleDateString()}`);
        if (!title) return;
        
        const results = window.currentTaxResults;
        if (!results) {
            alert('Please calculate tax first');
            return;
        }
        
        const scenario = {
            id: Date.now(),
            title: title,
            date: new Date().toISOString(),
            fy: results.fy,
            income: results.income,
            age: results.age,
            deductions: results.deductions,
            dynamicDeductions: JSON.parse(JSON.stringify(addedDeductions)), // Save dynamic deductions separately
            commonDeductions: results.commonDeductions,
            oldTax: results.oldResult.tax,
            newTax: results.newResult.tax,
            recommendation: results.oldResult.tax < results.newResult.tax ? 'Old' : 'New'
        };
        
        const scenarios = JSON.parse(localStorage.getItem('taxScenarios') || '[]');
        scenarios.unshift(scenario);
        
        // Keep only last 10 scenarios
        if (scenarios.length > 10) scenarios.pop();
        
        localStorage.setItem('taxScenarios', JSON.stringify(scenarios));
        alert('Scenario saved successfully!');
    }
    
    function renderSavedScenarios() {
        const container = document.getElementById('savedScenariosList');
        if (!container) return;
        
        const scenarios = JSON.parse(localStorage.getItem('taxScenarios') || '[]');
        
        if (scenarios.length === 0) {
            container.innerHTML = '<p class="no-scenarios">No saved scenarios yet. Save your first calculation!</p>';
            return;
        }
        
        container.innerHTML = scenarios.map(s => `
            <div class="saved-scenario-card" data-id="${s.id}">
                <div class="scenario-header">
                    <span class="scenario-title">${s.title}</span>
                    <span class="scenario-date">${new Date(s.date).toLocaleDateString()}</span>
                </div>
                <div class="scenario-details">
                    <div class="scenario-detail">
                        <span class="label">FY</span>
                        <span class="value">${s.fy}</span>
                    </div>
                    <div class="scenario-detail">
                        <span class="label">Income</span>
                        <span class="value">${formatIndianCurrency(s.income)}</span>
                    </div>
                    <div class="scenario-detail">
                        <span class="label">Old Tax</span>
                        <span class="value">${formatIndianCurrency(s.oldTax)}</span>
                    </div>
                    <div class="scenario-detail">
                        <span class="label">New Tax</span>
                        <span class="value">${formatIndianCurrency(s.newTax)}</span>
                    </div>
                </div>
                <div class="scenario-actions">
                    <button class="scenario-btn load" onclick="loadScenario(${s.id})">Load</button>
                    <button class="scenario-btn delete" onclick="deleteScenario(${s.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    // Make functions available globally for onclick handlers
    window.loadScenario = function(id) {
        const scenarios = JSON.parse(localStorage.getItem('taxScenarios') || '[]');
        const scenario = scenarios.find(s => s.id === id);
        if (!scenario) return;
        
        // Load values
        taxFY.value = scenario.fy;
        taxIncome.value = scenario.income;
        taxAge.value = scenario.age;
        
        if (scenario.deductions) {
            deduction80C.value = scenario.deductions.c80 || 0;
            deduction80CCD.value = scenario.deductions.ccd80 || 0;
            deduction80D.value = scenario.deductions.d80 || 0;
            deduction80TTA.value = scenario.deductions.tta80 || 0;
            deductionHRA.value = scenario.deductions.hra || 0;
            deductionHomeLoan.value = scenario.deductions.homeLoan || 0;
            
            // Restore dynamic deductions if saved
            if (scenario.dynamicDeductions) {
                addedDeductions = scenario.dynamicDeductions;
                saveDynamicDeductions();
                renderAddedDeductions();
                updateOtherDeductionsTotal();
            } else {
                // Clear dynamic deductions if not in scenario
                addedDeductions = {};
                saveDynamicDeductions();
                renderAddedDeductions();
                deductionOther.value = scenario.deductions.other || 0;
            }
        }
        
        if (scenario.commonDeductions) {
            if (deductionNPSEmployer) deductionNPSEmployer.value = scenario.commonDeductions.npsEmployer || 0;
            if (deductionAgnipath) deductionAgnipath.value = scenario.commonDeductions.agnipath || 0;
        }
        
        // Close modal
        document.getElementById('scenariosModal').classList.remove('show');
        
        // Recalculate
        updateTaxSlabsDisplay();
        calculateTax();
    };
    
    window.deleteScenario = function(id) {
        if (!confirm('Delete this scenario?')) return;
        
        let scenarios = JSON.parse(localStorage.getItem('taxScenarios') || '[]');
        scenarios = scenarios.filter(s => s.id !== id);
        localStorage.setItem('taxScenarios', JSON.stringify(scenarios));
        
        renderSavedScenarios();
    };
    
    // Export PDF
    function initExportPDF() {
        const exportBtn = document.getElementById('exportPDF');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportAsPDF);
        }
    }
    
    function exportAsPDF() {
        const results = window.currentTaxResults;
        if (!results) {
            alert('Please calculate tax first');
            return;
        }
        
        const config = getConfig();
        const ageLabel = results.age === 'below60' ? 'Below 60 years' : 
                         results.age === 'senior' ? '60-80 years (Senior Citizen)' : 
                         '80+ years (Super Senior Citizen)';
        
        // Build deductions breakdown for Old Regime
        const deductionRows = [];
        
        // Chapter VI-A Deductions
        if (results.deductions.c80 > 0) {
            deductionRows.push({
                section: '80C',
                description: 'Investments (PPF, ELSS, LIC, EPF, etc.)',
                claimed: results.deductions.c80,
                allowed: Math.min(results.deductions.c80, 150000)
            });
        }
        if (results.deductions.ccd80 > 0) {
            deductionRows.push({
                section: '80CCD(1B)',
                description: 'NPS Contribution (Additional)',
                claimed: results.deductions.ccd80,
                allowed: Math.min(results.deductions.ccd80, 50000)
            });
        }
        if (results.deductions.d80 > 0) {
            deductionRows.push({
                section: '80D',
                description: 'Health Insurance Premium',
                claimed: results.deductions.d80,
                allowed: Math.min(results.deductions.d80, 100000)
            });
        }
        if (results.deductions.tta80 > 0) {
            const maxTTA = (results.age === 'senior' || results.age === 'supersenior') ? 50000 : 10000;
            deductionRows.push({
                section: results.age === 'senior' || results.age === 'supersenior' ? '80TTB' : '80TTA',
                description: 'Savings Account Interest',
                claimed: results.deductions.tta80,
                allowed: Math.min(results.deductions.tta80, maxTTA)
            });
        }
        if (results.deductions.hra > 0) {
            deductionRows.push({
                section: '10(13A)',
                description: 'House Rent Allowance (HRA)',
                claimed: results.deductions.hra,
                allowed: results.deductions.hra
            });
        }
        if (results.deductions.homeLoan > 0) {
            deductionRows.push({
                section: '24(b)',
                description: 'Home Loan Interest',
                claimed: results.deductions.homeLoan,
                allowed: Math.min(results.deductions.homeLoan, 200000)
            });
        }
        
        // Add dynamic deductions (each section separately)
        const dynamicDeductions = getDynamicDeductionsBreakdown();
        dynamicDeductions.forEach(ded => {
            deductionRows.push(ded);
        });
        
        // Common deductions (both regimes)
        const commonDeductionRows = [];
        if (results.commonDeductions.npsEmployer > 0) {
            commonDeductionRows.push({
                section: '80CCD(2)',
                description: "Employer's NPS Contribution",
                amount: results.commonDeductions.npsEmployer
            });
        }
        if (results.commonDeductions.agnipath > 0) {
            commonDeductionRows.push({
                section: '80CCH',
                description: 'Agniveer Corpus Fund',
                amount: results.commonDeductions.agnipath
            });
        }
        
        // Build slab breakdown HTML
        const buildSlabHTML = (breakdown, total) => {
            if (!breakdown || breakdown.length === 0) {
                return '<tr><td colspan="3" style="text-align: center;">No tax applicable</td></tr>';
            }
            return breakdown.map(slab => {
                const ratePercent = (slab.rate * 100).toFixed(0);
                return `<tr>
                    <td>${formatIndianCurrency(slab.from)} - ${formatIndianCurrency(slab.to)}</td>
                    <td style="text-align: center;">${ratePercent}%</td>
                    <td style="text-align: right;">${formatIndianCurrency(slab.tax)}</td>
                </tr>`;
            }).join('') + `<tr style="font-weight: bold; border-top: 2px solid #333;">
                <td colspan="2">Total Tax on Income</td>
                <td style="text-align: right;">${formatIndianCurrency(total)}</td>
            </tr>`;
        };
        
        // Create printable content - CA style computation sheet
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Income Tax Computation - FY ${results.fy}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 30px; color: #333; font-size: 12px; line-height: 1.5; }
                    h1 { color: #1a472a; text-align: center; font-size: 18px; margin-bottom: 5px; }
                    h2 { font-size: 14px; color: #1a472a; margin: 20px 0 10px 0; border-bottom: 1px solid #1a472a; padding-bottom: 5px; }
                    h3 { font-size: 13px; color: #333; margin: 15px 0 8px 0; }
                    .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #1a472a; padding-bottom: 15px; }
                    .header p { margin: 3px 0; color: #666; }
                    .assessee-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                    .assessee-info table { width: 100%; }
                    .assessee-info td { padding: 5px 10px; }
                    .assessee-info td:first-child { font-weight: bold; width: 150px; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background: #f0f7ef; font-weight: bold; }
                    .amount { text-align: right; font-family: 'Courier New', monospace; }
                    .section-col { width: 100px; font-weight: bold; color: #1a472a; }
                    .total-row { font-weight: bold; background: #e8f5e9; }
                    .total-row td { border-top: 2px solid #333; }
                    .highlight { background: #fff3cd; }
                    .final-tax { font-size: 14px; background: #1a472a; color: white; }
                    .final-tax td { border: none; padding: 12px; }
                    .comparison-section { display: flex; gap: 30px; margin-top: 30px; }
                    .regime-section { flex: 1; }
                    .regime-section h3 { background: #1a472a; color: white; padding: 10px; margin: 0; text-align: center; }
                    .recommendation { text-align: center; margin: 25px 0; padding: 15px; background: #e8f5e9; border: 2px solid #1a472a; border-radius: 8px; }
                    .recommendation strong { font-size: 14px; color: #1a472a; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 10px; color: #666; }
                    .note { font-size: 10px; color: #666; font-style: italic; margin-top: 5px; }
                    .watermark { position: fixed; bottom: 20px; right: 30px; font-size: 10px; color: #ccc; }
                    @media print { 
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .page-break { page-break-before: always; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>INCOME TAX COMPUTATION STATEMENT</h1>
                    <p>Assessment Year: ${parseInt(results.fy.split('-')[0]) + 1}-${parseInt(results.fy.split('-')[1]) + 1} | Financial Year: ${results.fy}</p>
                    <p>Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div class="assessee-info">
                    <table>
                        <tr>
                            <td>Gross Annual Income:</td>
                            <td>${formatIndianCurrency(results.income)}</td>
                            <td>Age Category:</td>
                            <td>${ageLabel}</td>
                        </tr>
                    </table>
                </div>

                <!-- OLD TAX REGIME COMPUTATION -->
                <h2>COMPUTATION UNDER OLD TAX REGIME</h2>
                
                <h3>A. Gross Total Income</h3>
                <table>
                    <tr>
                        <td>Income from Salary / Business / Other Sources</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.grossIncome)}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Gross Total Income</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.grossIncome)}</td>
                    </tr>
                </table>

                <h3>B. Less: Standard Deduction u/s 16(ia)</h3>
                <table>
                    <tr>
                        <td>Standard Deduction (Salaried Individuals)</td>
                        <td class="amount">${formatIndianCurrency(config.standardDeductionOld)}</td>
                    </tr>
                </table>

                ${deductionRows.length > 0 ? `
                <h3>C. Less: Deductions under Chapter VI-A</h3>
                <table>
                    <tr>
                        <th class="section-col">Section</th>
                        <th>Particulars</th>
                        <th style="text-align: right; width: 120px;">Claimed (₹)</th>
                        <th style="text-align: right; width: 120px;">Allowed (₹)</th>
                    </tr>
                    ${deductionRows.map(d => `
                    <tr>
                        <td class="section-col">${d.section}</td>
                        <td>${d.description}</td>
                        <td class="amount">${formatIndianCurrency(d.claimed)}</td>
                        <td class="amount">${formatIndianCurrency(d.allowed)}</td>
                    </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="3">Total Chapter VI-A Deductions</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.chapterVIADeductions - (results.commonDeductions.npsEmployer + results.commonDeductions.agnipath))}</td>
                    </tr>
                </table>
                ` : ''}

                ${commonDeductionRows.length > 0 ? `
                <h3>D. Less: Employer Contributions (Exempt)</h3>
                <table>
                    <tr>
                        <th class="section-col">Section</th>
                        <th>Particulars</th>
                        <th style="text-align: right; width: 120px;">Amount (₹)</th>
                    </tr>
                    ${commonDeductionRows.map(d => `
                    <tr>
                        <td class="section-col">${d.section}</td>
                        <td>${d.description}</td>
                        <td class="amount">${formatIndianCurrency(d.amount)}</td>
                    </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="2">Total Employer Contributions</td>
                        <td class="amount">${formatIndianCurrency(results.commonDeductions.npsEmployer + results.commonDeductions.agnipath)}</td>
                    </tr>
                </table>
                ` : ''}

                <h3>E. Total Deductions Summary</h3>
                <table>
                    <tr>
                        <td>Standard Deduction u/s 16(ia)</td>
                        <td class="amount">${formatIndianCurrency(config.standardDeductionOld)}</td>
                    </tr>
                    <tr>
                        <td>Chapter VI-A Deductions</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.chapterVIADeductions)}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Deductions</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.totalDeductions)}</td>
                    </tr>
                </table>

                <h3>F. Taxable Income</h3>
                <table>
                    <tr>
                        <td>Gross Total Income</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.grossIncome)}</td>
                    </tr>
                    <tr>
                        <td>Less: Total Deductions</td>
                        <td class="amount">(${formatIndianCurrency(results.oldResult.totalDeductions)})</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Taxable Income</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.taxableIncome)}</td>
                    </tr>
                </table>

                <h3>G. Tax Computation (Slab-wise)</h3>
                <table>
                    <tr>
                        <th>Income Slab</th>
                        <th style="text-align: center;">Rate</th>
                        <th style="text-align: right;">Tax (₹)</th>
                    </tr>
                    ${buildSlabHTML(results.oldResult.slabBreakdown, results.oldResult.taxOnIncome)}
                </table>

                <h3>H. Tax Payable</h3>
                <table>
                    <tr>
                        <td>Tax on Total Income</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.taxOnIncome)}</td>
                    </tr>
                    ${results.oldResult.rebate > 0 ? `
                    <tr class="highlight">
                        <td>Less: Rebate u/s 87A (Income ≤ ₹5,00,000)</td>
                        <td class="amount">(${formatIndianCurrency(results.oldResult.rebate)})</td>
                    </tr>
                    <tr>
                        <td>Tax after Rebate</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.taxOnIncome - results.oldResult.rebate)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td>Add: Health & Education Cess @ 4%</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.cess)}</td>
                    </tr>
                    <tr class="final-tax">
                        <td>TOTAL TAX PAYABLE</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.tax)}</td>
                    </tr>
                    <tr>
                        <td>Effective Tax Rate</td>
                        <td class="amount">${results.oldResult.effectiveRate}%</td>
                    </tr>
                </table>

                <div class="page-break"></div>

                <!-- NEW TAX REGIME COMPUTATION -->
                <h2>COMPUTATION UNDER NEW TAX REGIME</h2>
                
                <h3>A. Gross Total Income</h3>
                <table>
                    <tr>
                        <td>Income from Salary / Business / Other Sources</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.grossIncome)}</td>
                    </tr>
                </table>

                <h3>B. Less: Deductions Allowed under New Regime</h3>
                <table>
                    <tr>
                        <th class="section-col">Section</th>
                        <th>Particulars</th>
                        <th style="text-align: right;">Amount (₹)</th>
                    </tr>
                    <tr>
                        <td class="section-col">16(ia)</td>
                        <td>Standard Deduction</td>
                        <td class="amount">${formatIndianCurrency(config.standardDeductionNew)}</td>
                    </tr>
                    ${commonDeductionRows.map(d => `
                    <tr>
                        <td class="section-col">${d.section}</td>
                        <td>${d.description}</td>
                        <td class="amount">${formatIndianCurrency(d.amount)}</td>
                    </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="2">Total Deductions</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.totalDeductions)}</td>
                    </tr>
                </table>
                <p class="note">Note: Under New Tax Regime, Chapter VI-A deductions (80C, 80D, etc.) and HRA exemption are NOT allowed.</p>

                <h3>C. Taxable Income</h3>
                <table>
                    <tr>
                        <td>Gross Total Income</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.grossIncome)}</td>
                    </tr>
                    <tr>
                        <td>Less: Total Deductions</td>
                        <td class="amount">(${formatIndianCurrency(results.newResult.totalDeductions)})</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Taxable Income</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.taxableIncome)}</td>
                    </tr>
                </table>

                <h3>D. Tax Computation (Slab-wise)</h3>
                <table>
                    <tr>
                        <th>Income Slab</th>
                        <th style="text-align: center;">Rate</th>
                        <th style="text-align: right;">Tax (₹)</th>
                    </tr>
                    ${buildSlabHTML(results.newResult.slabBreakdown, results.newResult.taxOnIncome)}
                </table>

                <h3>E. Tax Payable</h3>
                <table>
                    <tr>
                        <td>Tax on Total Income</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.taxOnIncome)}</td>
                    </tr>
                    ${results.newResult.rebate > 0 ? `
                    <tr class="highlight">
                        <td>Less: Rebate u/s 87A (Income ≤ ₹12,00,000)</td>
                        <td class="amount">(${formatIndianCurrency(results.newResult.rebate)})</td>
                    </tr>
                    <tr>
                        <td>Tax after Rebate</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.taxOnIncome - results.newResult.rebate)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td>Add: Health & Education Cess @ 4%</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.cess)}</td>
                    </tr>
                    <tr class="final-tax">
                        <td>TOTAL TAX PAYABLE</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.tax)}</td>
                    </tr>
                    <tr>
                        <td>Effective Tax Rate</td>
                        <td class="amount">${results.newResult.effectiveRate}%</td>
                    </tr>
                </table>

                <!-- COMPARISON & RECOMMENDATION -->
                <h2>COMPARATIVE ANALYSIS</h2>
                <table>
                    <tr>
                        <th>Particulars</th>
                        <th style="text-align: right;">Old Regime (₹)</th>
                        <th style="text-align: right;">New Regime (₹)</th>
                        <th style="text-align: right;">Difference (₹)</th>
                    </tr>
                    <tr>
                        <td>Gross Income</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.grossIncome)}</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.grossIncome)}</td>
                        <td class="amount">-</td>
                    </tr>
                    <tr>
                        <td>Total Deductions</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.totalDeductions)}</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.totalDeductions)}</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.totalDeductions - results.newResult.totalDeductions)}</td>
                    </tr>
                    <tr>
                        <td>Taxable Income</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.taxableIncome)}</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.taxableIncome)}</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.taxableIncome - results.newResult.taxableIncome)}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Tax Payable</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.tax)}</td>
                        <td class="amount">${formatIndianCurrency(results.newResult.tax)}</td>
                        <td class="amount">${formatIndianCurrency(results.oldResult.tax - results.newResult.tax)}</td>
                    </tr>
                    <tr>
                        <td>Effective Tax Rate</td>
                        <td class="amount">${results.oldResult.effectiveRate}%</td>
                        <td class="amount">${results.newResult.effectiveRate}%</td>
                        <td class="amount">${(parseFloat(results.oldResult.effectiveRate) - parseFloat(results.newResult.effectiveRate)).toFixed(2)}%</td>
                    </tr>
                </table>

                <div class="recommendation">
                    <strong>RECOMMENDATION: ${results.oldResult.tax < results.newResult.tax ? 'OLD TAX REGIME' : results.newResult.tax < results.oldResult.tax ? 'NEW TAX REGIME' : 'BOTH REGIMES ARE EQUAL'}</strong>
                    <br><br>
                    ${results.oldResult.tax !== results.newResult.tax ? 
                        `Tax Savings: <strong>${formatIndianCurrency(Math.abs(results.oldResult.tax - results.newResult.tax))}</strong> per annum` : 
                        'No difference in tax liability between both regimes.'}
                </div>

                <div class="footer">
                    <p><strong>Disclaimer:</strong> This computation is for informational purposes only and should not be considered as tax advice. 
                    Please consult a qualified Chartered Accountant or Tax Professional for accurate tax computation and filing.</p>
                    <p>Generated by Multi-Function Calculator | ${new Date().toLocaleString('en-IN')}</p>
                </div>
                
                <div class="watermark">Computer Generated Statement</div>
            </body>
            </html>
        `;
        
        // Open print dialog
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
    
    // Clickable tax rows to expand slab breakdown
    function initClickableTaxRows() {
        const oldTaxRow = document.getElementById('oldTaxOnIncomeRow');
        const newTaxRow = document.getElementById('newTaxOnIncomeRow');
        
        const expandSlab = () => {
            const slabSection = document.querySelector('[data-target="slabBreakdown"]');
            if (slabSection) {
                const section = slabSection.closest('.collapsible-section');
                if (section) {
                    section.classList.remove('collapsed');
                    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };
        
        if (oldTaxRow) oldTaxRow.addEventListener('click', expandSlab);
        if (newTaxRow) newTaxRow.addEventListener('click', expandSlab);
    }

    // Apply input validation to all inputs
    const allInputs = [
        taxIncome, deduction80C, deduction80CCD, deduction80D,
        deduction80TTA, deductionHRA, deductionHomeLoan, deductionOther,
        deductionNPSEmployer, deductionAgnipath
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
    initQuickActions();
    initScenarios();
    initExportPDF();
    initClickableTaxRows();
    initDynamicDeductions();
    updateTaxSlabsDisplay();
    
    // Initial calculation
    calculateTax();
    }
    
    // Run init when DOM is ready, or immediately if already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

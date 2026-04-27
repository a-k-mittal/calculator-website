/**
 * Investment Calculators - Compound Interest, SIP, Lump Sum, EMI
 * Uses Chart.js for visualizations
 * Indian number formatting (₹1,00,000)
 */

// Wait for DOM and Chart.js to load
document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Chart instances
    let ciChart = null;
    let sipChart = null;
    let lsChart = null;
    let emiChart = null;

    // Helper: Restrict input to integers only (no decimals, no special chars)
    function enforceIntegerInput(inputElement) {
        if (!inputElement) return;
        
        // Prevent typing non-numeric characters
        inputElement.addEventListener('keydown', (e) => {
            // Allow: backspace, delete, tab, escape, enter, arrows
            if ([8, 9, 13, 27, 46, 37, 38, 39, 40].includes(e.keyCode)) {
                return;
            }
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                return;
            }
            // Block: decimal, minus, plus, e (scientific notation)
            if (['.', ',', '-', '+', 'e', 'E'].includes(e.key)) {
                e.preventDefault();
                return;
            }
            // Allow only digits 0-9
            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
            }
        });
        
        // Sanitize on input (handles paste)
        inputElement.addEventListener('input', () => {
            // Remove any non-digit characters and parse
            let cleanValue = inputElement.value.replace(/[^\d]/g, '');
            let value = parseInt(cleanValue) || 0;
            if (value < 0) value = 0;
            inputElement.value = value || '';
        });
    }

    // Helper: Prevent negative values and special chars in decimal inputs
    function enforcePositiveInput(inputElement) {
        if (!inputElement) return;
        
        // Prevent typing non-numeric characters (except decimal point)
        inputElement.addEventListener('keydown', (e) => {
            // Allow: backspace, delete, tab, escape, enter, arrows
            if ([8, 9, 13, 27, 46, 37, 38, 39, 40].includes(e.keyCode)) {
                return;
            }
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                return;
            }
            // Block: minus, plus, e (scientific notation)
            if (['-', '+', 'e', 'E'].includes(e.key)) {
                e.preventDefault();
                return;
            }
            // Allow decimal point (only one)
            if (e.key === '.' || e.key === ',') {
                if (inputElement.value.includes('.')) {
                    e.preventDefault();
                }
                return;
            }
            // Allow only digits 0-9
            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
            }
        });
        
        // Sanitize on input (handles paste)
        inputElement.addEventListener('input', () => {
            // Remove any invalid characters, keep only digits and first decimal
            let cleanValue = inputElement.value.replace(/[^\d.]/g, '');
            // Keep only first decimal point
            const parts = cleanValue.split('.');
            if (parts.length > 2) {
                cleanValue = parts[0] + '.' + parts.slice(1).join('');
            }
            let value = parseFloat(cleanValue);
            if (!isNaN(value) && value < 0) {
                value = Math.abs(value);
                inputElement.value = value;
            } else if (cleanValue !== inputElement.value) {
                inputElement.value = cleanValue;
            }
        });
    }

    // Helper: Sanitize numeric input (ensure non-negative, handle NaN)
    function sanitizePositiveNumber(value, defaultVal = 0) {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) return defaultVal;
        return num;
    }

    // Helper: Sanitize integer input
    function sanitizePositiveInteger(value, defaultVal = 0) {
        const num = parseInt(value);
        if (isNaN(num) || num < 0) return defaultVal;
        return num;
    }

    // Helper: Check if result is valid (not Infinity, NaN)
    function isValidResult(num) {
        return typeof num === 'number' && isFinite(num) && !isNaN(num);
    }

    // Indian number formatting
    function formatIndianCurrency(num) {
        if (num === null || num === undefined || isNaN(num)) return '₹0';
        
        const absNum = Math.abs(Math.round(num));
        const sign = num < 0 ? '-' : '';
        
        // Convert to string and split
        let numStr = absNum.toString();
        let result = '';
        
        if (numStr.length <= 3) {
            result = numStr;
        } else {
            // Last 3 digits
            result = numStr.slice(-3);
            numStr = numStr.slice(0, -3);
            
            // Remaining digits in pairs
            while (numStr.length > 2) {
                result = numStr.slice(-2) + ',' + result;
                numStr = numStr.slice(0, -2);
            }
            
            if (numStr.length > 0) {
                result = numStr + ',' + result;
            }
        }
        
        return sign + '₹' + result;
    }

    // Get chart colors based on theme
    function getChartColors() {
        const isDark = document.body.dataset.theme === 'dark';
        const colorTheme = document.body.dataset.color || 'forest';
        
        // Base colors for different themes
        const themes = {
            forest: { primary: '#3d7a35', secondary: '#6fa866', tertiary: '#a8d5a2' },
            ocean: { primary: '#2980b9', secondary: '#54a8d8', tertiary: '#a2d0f0' },
            sunset: { primary: '#e07020', secondary: '#e88040', tertiary: '#f0c8a0' },
            rose: { primary: '#d63384', secondary: '#e05090', tertiary: '#f0a0c0' },
            lavender: { primary: '#7c3aed', secondary: '#9060e8', tertiary: '#c8a0f0' },
            slate: { primary: '#475569', secondary: '#64748b', tertiary: '#94a3b8' }
        };
        
        const colors = themes[colorTheme] || themes.forest;
        
        return {
            primary: colors.primary,
            secondary: colors.secondary,
            tertiary: colors.tertiary,
            text: isDark ? '#a8d5a2' : '#2d5a27',
            grid: isDark ? 'rgba(168, 213, 162, 0.1)' : 'rgba(45, 90, 39, 0.1)',
            background: isDark ? '#1a2e1a' : '#e8f0e3'
        };
    }

    // Update chart colors when theme changes
    function updateAllCharts() {
        calculateCompoundInterest();
        calculateSIP();
        calculateLumpSum();
        calculateEMI();
    }

    // Listen for theme changes
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(updateAllCharts, 100);
        });
    }

    // Listen for color theme changes
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(updateAllCharts, 100);
        });
    });

    // ==========================================
    // Collapsible Sections
    // ==========================================
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.closest('.collapsible-section');
            section.classList.toggle('collapsed');
        });
    });

    // ==========================================
    // Finance Sub-tab Navigation
    // ==========================================
    const financeTabBtns = document.querySelectorAll('.finance-tab-btn');
    const financePanels = document.querySelectorAll('.finance-panel');

    financeTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            financeTabBtns.forEach(b => b.classList.remove('active'));
            financePanels.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const panel = document.getElementById(btn.dataset.calc);
            if (panel) {
                panel.classList.add('active');
                
                // Trigger calculation for the active panel
                switch(btn.dataset.calc) {
                    case 'compound': calculateCompoundInterest(); break;
                    case 'sip': calculateSIP(); break;
                    case 'lumpsum': calculateLumpSum(); break;
                    case 'emi': calculateEMI(); generateAmortizationSchedule(); break;
                }
            }
        });
    });

    // ==========================================
    // Compound Interest Calculator
    // ==========================================
    const ciPrincipal = document.getElementById('ciPrincipal');
    const ciRate = document.getElementById('ciRate');
    const ciYears = document.getElementById('ciYears');
    const ciMonths = document.getElementById('ciMonths');
    const ciFrequency = document.getElementById('ciFrequency');

    // Enforce input validations
    enforcePositiveInput(ciPrincipal);
    enforcePositiveInput(ciRate);
    enforceIntegerInput(ciYears);
    enforceIntegerInput(ciMonths);

    function calculateCompoundInterest() {
        // Sanitize inputs
        const P = sanitizePositiveNumber(ciPrincipal.value, 0);
        const r = sanitizePositiveNumber(ciRate.value, 0) / 100;
        const years = sanitizePositiveInteger(ciYears.value, 0);
        const months = sanitizePositiveInteger(ciMonths.value, 0);
        const n = parseInt(ciFrequency.value) || 12;

        // Total time in years (e.g., 4 years 2 months = 4.167 years)
        const t = years + (months / 12);
        const totalMonths = (years * 12) + months;

        // Handle edge case: zero time period
        if (t === 0) {
            document.getElementById('ciPrincipalResult').textContent = formatIndianCurrency(P);
            document.getElementById('ciInterestResult').textContent = formatIndianCurrency(0);
            document.getElementById('ciMaturityResult').textContent = formatIndianCurrency(P);
            
            // Still show a simple chart with just the principal
            updateCIChart([`0Y`], [P], [P]);
            return;
        }

        // A = P(1 + r/n)^(nt)
        let A = P * Math.pow(1 + r / n, n * t);
        
        // Handle overflow/invalid results
        if (!isValidResult(A)) {
            A = P; // Fallback to principal
        }
        
        const interest = A - P;

        // Update results
        document.getElementById('ciPrincipalResult').textContent = formatIndianCurrency(P);
        document.getElementById('ciInterestResult').textContent = formatIndianCurrency(interest);
        document.getElementById('ciMaturityResult').textContent = formatIndianCurrency(A);

        // Generate data for chart
        const labels = [];
        const principalData = [];
        const totalData = [];

        const totalMonthsCalc = (years * 12) + months;
        
        if (years === 0 && months > 0) {
            // Month-only mode: show month-wise progression
            const step = months <= 12 ? 1 : Math.ceil(months / 12);
            for (let m = 0; m <= months; m += step) {
                labels.push(`${m}M`);
                principalData.push(P);
                let monthValue = P * Math.pow(1 + r / n, n * (m / 12));
                if (!isValidResult(monthValue)) monthValue = P;
                totalData.push(Math.round(monthValue));
            }
            // Ensure final month is included
            if (months % step !== 0) {
                labels.push(`${months}M`);
                principalData.push(P);
                totalData.push(Math.round(A));
            }
        } else {
            // Year-based mode: show year-by-year plus final months if any
            for (let year = 0; year <= years; year++) {
                labels.push(`${year}Y`);
                principalData.push(P);
                let yearValue = P * Math.pow(1 + r / n, n * year);
                if (!isValidResult(yearValue)) yearValue = P;
                totalData.push(Math.round(yearValue));
            }
            
            // Add final point if there are extra months
            if (months > 0) {
                labels.push(`${years}Y ${months}M`);
                principalData.push(P);
                totalData.push(Math.round(A));
            }
        }
        
        // Ensure at least one data point
        if (labels.length === 0) {
            labels.push('0Y');
            principalData.push(P);
            totalData.push(P);
        }

        // Update chart
        updateCIChart(labels, principalData, totalData);
    }

    // Helper function to update CI chart
    function updateCIChart(labels, principalData, totalData) {
        const ctx = document.getElementById('ciChart');
        if (!ctx) return;

        const colors = getChartColors();

        if (ciChart) {
            ciChart.destroy();
        }

        ciChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Principal',
                        data: principalData,
                        borderColor: colors.secondary,
                        backgroundColor: colors.secondary + '40',
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: 'Total Value',
                        data: totalData,
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '40',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: colors.text }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${formatIndianCurrency(context.raw)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.text }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: {
                            color: colors.text,
                            callback: (value) => formatIndianCurrency(value)
                        }
                    }
                }
            }
        });
    }

    // Event listeners for CI
    [ciPrincipal, ciRate, ciYears, ciMonths, ciFrequency].forEach(el => {
        if (el) el.addEventListener('input', calculateCompoundInterest);
    });

    // ==========================================
    // SIP Calculator
    // ==========================================
    const sipMonthly = document.getElementById('sipMonthly');
    const sipRate = document.getElementById('sipRate');
    const sipYears = document.getElementById('sipYears');
    const sipMonths = document.getElementById('sipMonths');

    // Enforce input validations
    enforcePositiveInput(sipMonthly);
    enforcePositiveInput(sipRate);
    enforceIntegerInput(sipYears);
    enforceIntegerInput(sipMonths);

    function calculateSIP() {
        // Sanitize inputs
        const P = sanitizePositiveNumber(sipMonthly.value, 0);
        const r = sanitizePositiveNumber(sipRate.value, 0) / 100 / 12;
        const years = sanitizePositiveInteger(sipYears.value, 0);
        const months = sanitizePositiveInteger(sipMonths.value, 0);
        
        // Total months
        const n = (years * 12) + months;

        // Handle edge case: zero time period
        if (n === 0) {
            document.getElementById('sipInvestedResult').textContent = formatIndianCurrency(0);
            document.getElementById('sipReturnsResult').textContent = formatIndianCurrency(0);
            document.getElementById('sipTotalResult').textContent = formatIndianCurrency(0);
            
            // Show chart with zero values
            updateSIPChart(['0Y'], [0], [0]);
            return;
        }

        // FV = P × [(1+r)^n - 1] / r × (1+r)
        let totalValue = 0;
        if (r > 0 && n > 0) {
            totalValue = P * (Math.pow(1 + r, n) - 1) / r * (1 + r);
        } else {
            totalValue = P * n;
        }
        
        // Handle overflow
        if (!isValidResult(totalValue)) {
            totalValue = P * n;
        }
        
        const invested = P * n;
        const returns = Math.max(0, totalValue - invested); // Ensure non-negative returns

        // Update results
        document.getElementById('sipInvestedResult').textContent = formatIndianCurrency(invested);
        document.getElementById('sipReturnsResult').textContent = formatIndianCurrency(returns);
        document.getElementById('sipTotalResult').textContent = formatIndianCurrency(totalValue);

        // Generate data for chart
        const labels = [];
        const investedData = [];
        const returnsData = [];

        const totalMonthsCalc = (years * 12) + months;
        
        if (years === 0 && months > 0) {
            // Month-only mode: show month-wise progression
            const step = months <= 12 ? 1 : Math.ceil(months / 12);
            for (let m = 0; m <= months; m += step) {
                labels.push(`${m}M`);
                const monthInvested = P * m;
                investedData.push(monthInvested);
                
                let monthTotal = 0;
                if (r > 0 && m > 0) {
                    monthTotal = P * (Math.pow(1 + r, m) - 1) / r * (1 + r);
                    if (!isValidResult(monthTotal)) monthTotal = monthInvested;
                } else {
                    monthTotal = monthInvested;
                }
                returnsData.push(Math.max(0, Math.round(monthTotal - monthInvested)));
            }
            // Ensure final month is included
            if (months % step !== 0) {
                labels.push(`${months}M`);
                investedData.push(invested);
                returnsData.push(Math.round(returns));
            }
        } else {
            // Year-based mode: show year-by-year plus final months if any
            for (let year = 0; year <= years; year++) {
                labels.push(`${year}Y`);
                const monthsSoFar = year * 12;
                const yearInvested = P * monthsSoFar;
                investedData.push(yearInvested);
                
                let yearTotal = 0;
                if (r > 0 && monthsSoFar > 0) {
                    yearTotal = P * (Math.pow(1 + r, monthsSoFar) - 1) / r * (1 + r);
                    if (!isValidResult(yearTotal)) yearTotal = yearInvested;
                } else {
                    yearTotal = yearInvested;
                }
                returnsData.push(Math.max(0, Math.round(yearTotal - yearInvested)));
            }
            
            // Add final point if there are extra months
            if (months > 0) {
                labels.push(`${years}Y ${months}M`);
                investedData.push(invested);
                returnsData.push(Math.round(returns));
            }
        }
        
        // Ensure at least one data point
        if (labels.length === 0) {
            labels.push('0Y');
            investedData.push(0);
            returnsData.push(0);
        }

        // Update chart
        updateSIPChart(labels, investedData, returnsData);
    }

    // Helper function to update SIP chart
    function updateSIPChart(labels, investedData, returnsData) {
        const ctx = document.getElementById('sipChart');
        if (!ctx) return;

        const colors = getChartColors();

        if (sipChart) {
            sipChart.destroy();
        }

        sipChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Invested Amount',
                        data: investedData,
                        backgroundColor: colors.secondary,
                        borderRadius: 4
                    },
                    {
                        label: 'Returns',
                        data: returnsData,
                        backgroundColor: colors.primary,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: colors.text }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${formatIndianCurrency(context.raw)}`
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { color: colors.grid },
                        ticks: { color: colors.text }
                    },
                    y: {
                        stacked: true,
                        grid: { color: colors.grid },
                        ticks: {
                            color: colors.text,
                            callback: (value) => formatIndianCurrency(value)
                        }
                    }
                }
            }
        });
    }

    // Event listeners for SIP
    [sipMonthly, sipRate, sipYears, sipMonths].forEach(el => {
        if (el) el.addEventListener('input', calculateSIP);
    });

    // ==========================================
    // Lump Sum Calculator
    // ==========================================
    const lsAmount = document.getElementById('lsAmount');
    const lsRate = document.getElementById('lsRate');
    const lsYears = document.getElementById('lsYears');
    const lsMonths = document.getElementById('lsMonths');

    // Enforce input validations
    enforcePositiveInput(lsAmount);
    enforcePositiveInput(lsRate);
    enforceIntegerInput(lsYears);
    enforceIntegerInput(lsMonths);

    function calculateLumpSum() {
        // Sanitize inputs
        const P = sanitizePositiveNumber(lsAmount.value, 0);
        const r = sanitizePositiveNumber(lsRate.value, 0) / 100;
        const years = sanitizePositiveInteger(lsYears.value, 0);
        const months = sanitizePositiveInteger(lsMonths.value, 0);

        // Total time in years
        const t = years + (months / 12);

        // Handle edge case: zero time period
        if (t === 0) {
            document.getElementById('lsInvestedResult').textContent = formatIndianCurrency(P);
            document.getElementById('lsReturnsResult').textContent = formatIndianCurrency(0);
            document.getElementById('lsTotalResult').textContent = formatIndianCurrency(P);
            
            updateLSChart(['0Y'], [P]);
            return;
        }

        // FV = P × (1 + r)^t
        let totalValue = P * Math.pow(1 + r, t);
        
        // Handle overflow
        if (!isValidResult(totalValue)) {
            totalValue = P;
        }
        
        const returns = Math.max(0, totalValue - P);

        // Update results
        document.getElementById('lsInvestedResult').textContent = formatIndianCurrency(P);
        document.getElementById('lsReturnsResult').textContent = formatIndianCurrency(returns);
        document.getElementById('lsTotalResult').textContent = formatIndianCurrency(totalValue);

        // Generate data for chart
        const labels = [];
        const valueData = [];

        if (years === 0 && months > 0) {
            // Month-only mode: show month-wise progression
            const step = months <= 12 ? 1 : Math.ceil(months / 12);
            for (let m = 0; m <= months; m += step) {
                labels.push(`${m}M`);
                let monthValue = P * Math.pow(1 + r, m / 12);
                if (!isValidResult(monthValue)) monthValue = P;
                valueData.push(Math.round(monthValue));
            }
            // Ensure final month is included
            if (months % step !== 0) {
                labels.push(`${months}M`);
                valueData.push(Math.round(totalValue));
            }
        } else {
            // Year-based mode: show year-by-year plus final months if any
            for (let year = 0; year <= years; year++) {
                labels.push(`${year}Y`);
                let yearValue = P * Math.pow(1 + r, year);
                if (!isValidResult(yearValue)) yearValue = P;
                valueData.push(Math.round(yearValue));
            }
            
            // Add final point if there are extra months
            if (months > 0) {
                labels.push(`${years}Y ${months}M`);
                valueData.push(Math.round(totalValue));
            }
        }
        
        // Ensure at least one data point
        if (labels.length === 0) {
            labels.push('0Y');
            valueData.push(P);
        }

        // Update chart
        updateLSChart(labels, valueData);
    }

    // Helper function to update Lump Sum chart
    function updateLSChart(labels, valueData) {
        const ctx = document.getElementById('lsChart');
        if (!ctx) return;

        const colors = getChartColors();

        if (lsChart) {
            lsChart.destroy();
        }

        lsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Investment Value',
                        data: valueData,
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '30',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: colors.primary,
                        pointBorderColor: colors.background,
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: colors.text }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Value: ${formatIndianCurrency(context.raw)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.text }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: {
                            color: colors.text,
                            callback: (value) => formatIndianCurrency(value)
                        }
                    }
                }
            }
        });
    }

    // Event listeners for Lump Sum
    [lsAmount, lsRate, lsYears, lsMonths].forEach(el => {
        if (el) el.addEventListener('input', calculateLumpSum);
    });

    // ==========================================
    // EMI Calculator
    // ==========================================
    const emiLoan = document.getElementById('emiLoan');
    const emiRate = document.getElementById('emiRate');
    const emiYears = document.getElementById('emiYears');
    const emiMonths = document.getElementById('emiMonths');

    // Enforce input validations
    enforcePositiveInput(emiLoan);
    enforcePositiveInput(emiRate);
    enforceIntegerInput(emiYears);
    enforceIntegerInput(emiMonths);

    function calculateEMI() {
        // Sanitize inputs
        const P = sanitizePositiveNumber(emiLoan.value, 0);
        const r = sanitizePositiveNumber(emiRate.value, 0) / 100 / 12;
        const years = sanitizePositiveInteger(emiYears.value, 0);
        const months = sanitizePositiveInteger(emiMonths.value, 0);
        
        // Total months
        const n = (years * 12) + months;

        // Handle edge case: zero time period
        if (n === 0) {
            document.getElementById('emiMonthlyResult').textContent = formatIndianCurrency(0);
            document.getElementById('emiPrincipalResult').textContent = formatIndianCurrency(P);
            document.getElementById('emiInterestResult').textContent = formatIndianCurrency(0);
            document.getElementById('emiTotalResult').textContent = formatIndianCurrency(P);
            
            // Show chart with just principal (no interest when tenure is 0)
            updateEMIChart(P, 0);
            return;
        }

        // EMI = P × r × (1+r)^n / [(1+r)^n - 1]
        let emi = 0;
        if (r > 0 && n > 0) {
            emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
            // Handle overflow
            if (!isValidResult(emi)) {
                emi = P / n;
            }
        } else if (n > 0) {
            emi = P / n;
        }
        
        const totalAmount = emi * n;
        const totalInterest = Math.max(0, totalAmount - P); // Ensure non-negative

        // Update results
        document.getElementById('emiMonthlyResult').textContent = formatIndianCurrency(emi);
        document.getElementById('emiPrincipalResult').textContent = formatIndianCurrency(P);
        document.getElementById('emiInterestResult').textContent = formatIndianCurrency(totalInterest);
        document.getElementById('emiTotalResult').textContent = formatIndianCurrency(totalAmount);

        // Update chart
        updateEMIChart(P, totalInterest);
    }

    // Helper function to update EMI chart
    function updateEMIChart(principal, interest) {
        const ctx = document.getElementById('emiChart');
        if (!ctx) return;

        const colors = getChartColors();

        if (emiChart) {
            emiChart.destroy();
        }
        
        // Ensure valid data for chart
        const chartPrincipal = Math.max(0, Math.round(principal));
        const chartInterest = Math.max(0, Math.round(interest));
        const total = chartPrincipal + chartInterest;

        emiChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [chartPrincipal, chartInterest],
                    backgroundColor: [colors.secondary, colors.primary],
                    borderColor: colors.background,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: colors.text }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (total === 0) {
                                    return `${context.label}: ${formatIndianCurrency(context.raw)} (0%)`;
                                }
                                const percent = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${formatIndianCurrency(context.raw)} (${percent}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // Amortization schedule state
    let amortizationView = 'yearly'; // 'yearly' or 'monthly'

    // Function to generate amortization schedule
    function generateAmortizationSchedule() {
        const P = sanitizePositiveNumber(emiLoan.value, 0);
        const annualRate = sanitizePositiveNumber(emiRate.value, 0);
        const r = annualRate / 100 / 12;
        const years = sanitizePositiveInteger(emiYears.value, 0);
        const months = sanitizePositiveInteger(emiMonths.value, 0);
        const n = (years * 12) + months;

        const tbody = document.getElementById('amortizationBody');
        if (!tbody) return;

        // Clear existing rows
        tbody.innerHTML = '';

        // Handle edge cases
        if (n === 0 || P === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" style="text-align: center;">Enter loan details to see amortization schedule</td>';
            tbody.appendChild(row);
            return;
        }

        // Calculate EMI
        let emi = 0;
        if (r > 0) {
            emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
            if (!isValidResult(emi)) {
                emi = P / n;
            }
        } else {
            emi = P / n;
        }

        let balance = P;
        
        if (amortizationView === 'monthly') {
            // Monthly amortization
            for (let month = 1; month <= n && month <= 360; month++) { // Limit to 360 months (30 years)
                const interestPayment = balance * r;
                const principalPayment = emi - interestPayment;
                balance = Math.max(0, balance - principalPayment);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>Month ${month}</td>
                    <td>${formatIndianCurrency(principalPayment)}</td>
                    <td>${formatIndianCurrency(interestPayment)}</td>
                    <td>${formatIndianCurrency(balance)}</td>
                `;
                tbody.appendChild(row);
            }
            if (n > 360) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="4" style="text-align: center; font-style: italic;">Showing first 360 months only</td>';
                tbody.appendChild(row);
            }
        } else {
            // Yearly amortization
            const totalYears = Math.ceil(n / 12);
            let monthCounter = 0;

            for (let year = 1; year <= totalYears && year <= 50; year++) { // Limit to 50 years
                let yearPrincipal = 0;
                let yearInterest = 0;
                const monthsThisYear = Math.min(12, n - monthCounter);

                for (let m = 0; m < monthsThisYear; m++) {
                    const interestPayment = balance * r;
                    const principalPayment = emi - interestPayment;
                    yearPrincipal += principalPayment;
                    yearInterest += interestPayment;
                    balance = Math.max(0, balance - principalPayment);
                    monthCounter++;
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>Year ${year}</td>
                    <td>${formatIndianCurrency(yearPrincipal)}</td>
                    <td>${formatIndianCurrency(yearInterest)}</td>
                    <td>${formatIndianCurrency(balance)}</td>
                `;
                tbody.appendChild(row);
            }
        }
    }

    // Amortization toggle handlers
    const amortBtns = document.querySelectorAll('.amort-btn');
    
    amortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            amortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update view and regenerate
            amortizationView = btn.dataset.view;
            generateAmortizationSchedule();
        });
    });

    // Event listeners for EMI
    [emiLoan, emiRate, emiYears, emiMonths].forEach(el => {
        if (el) el.addEventListener('input', () => {
            calculateEMI();
            generateAmortizationSchedule();
        });
    });

    // ==========================================
    // Initialize - Calculate on finance tab activation
    // ==========================================
    
    // Calculate when finance tab is clicked
    const financeMainTab = document.querySelector('[data-tab="finance"]');
    if (financeMainTab) {
        financeMainTab.addEventListener('click', () => {
            // Small delay to ensure panel is visible
            setTimeout(() => {
                calculateCompoundInterest();
            }, 50);
        });
    }

    // Initial calculation if finance panel is visible
    const financePanel = document.getElementById('finance');
    if (financePanel && financePanel.classList.contains('active')) {
        calculateCompoundInterest();
    }

    // Also run calculations on first load after a small delay
    setTimeout(() => {
        if (document.getElementById('finance').classList.contains('active')) {
            calculateCompoundInterest();
        }
    }, 500);
});

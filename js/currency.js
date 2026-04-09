/**
 * Currency Converter Module
 * Uses ExchangeRate-API for real-time exchange rates
 * Supports: USD, EUR, GBP, JPY, INR
 */

(function() {
    'use strict';

    // API Configuration
    // Using the free tier of ExchangeRate-API (no API key required for basic usage)
    const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/';
    
    // Cache for exchange rates
    let ratesCache = {
        base: null,
        rates: null,
        timestamp: null
    };

    // Cache duration: 1 hour (in milliseconds)
    const CACHE_DURATION = 60 * 60 * 1000;

    // Fallback rates (approximate, for offline use)
    const fallbackRates = {
        USD: { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, INR: 83.12 },
        EUR: { USD: 1.09, EUR: 1, GBP: 0.86, JPY: 162.89, INR: 90.56 },
        GBP: { USD: 1.27, EUR: 1.16, GBP: 1, JPY: 189.24, INR: 105.19 },
        JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, JPY: 1, INR: 0.56 },
        INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.80, INR: 1 }
    };

    // DOM Elements - initialized in init()
    let currencyInput;
    let currencyFrom;
    let currencyTo;
    let currencyResult;
    let currencyUnit;
    let swapBtn;
    let statusDot;
    let statusText;
    let lastUpdated;

    // Update status indicator
    function updateStatus(status, message) {
        if (statusDot) statusDot.className = 'status-dot ' + status;
        if (statusText) statusText.textContent = message;
    }

    // Format currency result
    function formatCurrency(value, currency) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: currency === 'JPY' ? 0 : 2
        });
        return formatter.format(value);
    }

    // Fetch exchange rates from API
    async function fetchRates(baseCurrency) {
        try {
            // Check cache first
            if (ratesCache.base === baseCurrency && 
                ratesCache.timestamp && 
                Date.now() - ratesCache.timestamp < CACHE_DURATION) {
                return ratesCache.rates;
            }

            updateStatus('', 'Fetching rates...');
            
            const response = await fetch(API_BASE_URL + baseCurrency);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            // Update cache
            ratesCache = {
                base: baseCurrency,
                rates: data.rates,
                timestamp: Date.now()
            };

            // Save to localStorage for offline access
            localStorage.setItem('currencyRates', JSON.stringify(ratesCache));

            updateStatus('online', 'Rates updated');
            
            // Show last updated time
            const now = new Date();
            if (lastUpdated) lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;

            return data.rates;
        } catch (error) {
            console.error('Failed to fetch rates:', error);
            
            // Try to load from localStorage
            const cached = localStorage.getItem('currencyRates');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.base === baseCurrency) {
                    updateStatus('offline', 'Using cached rates');
                    const cacheDate = new Date(parsed.timestamp);
                    if (lastUpdated) lastUpdated.textContent = `Cached from: ${cacheDate.toLocaleDateString()}`;
                    return parsed.rates;
                }
            }

            // Use fallback rates
            updateStatus('offline', 'Using offline rates');
            if (lastUpdated) lastUpdated.textContent = 'Offline mode - rates may be outdated';
            return null;
        }
    }

    // Convert currency
    async function convert() {
        if (!currencyInput || !currencyFrom || !currencyTo || !currencyResult || !currencyUnit) {
            console.error('Currency converter DOM elements not found');
            return;
        }
        
        const amount = parseFloat(currencyInput.value);
        const fromCurrency = currencyFrom.value;
        const toCurrency = currencyTo.value;

        if (isNaN(amount) || amount < 0) {
            currencyResult.textContent = '--';
            currencyUnit.textContent = toCurrency;
            return;
        }

        // Same currency
        if (fromCurrency === toCurrency) {
            currencyResult.textContent = formatCurrency(amount, toCurrency);
            currencyUnit.textContent = toCurrency;
            return;
        }

        try {
            const rates = await fetchRates(fromCurrency);
            
            let result;
            if (rates && rates[toCurrency]) {
                result = amount * rates[toCurrency];
            } else {
                // Use fallback rates
                const rate = fallbackRates[fromCurrency]?.[toCurrency];
                if (rate) {
                    result = amount * rate;
                } else {
                    currencyResult.textContent = 'Error';
                    currencyUnit.textContent = toCurrency;
                    return;
                }
            }

            currencyResult.textContent = formatCurrency(result, toCurrency);
            currencyUnit.textContent = toCurrency;
        } catch (error) {
            console.error('Conversion error:', error);
            currencyResult.textContent = 'Error';
            currencyUnit.textContent = toCurrency;
        }
    }

    // Swap currencies
    function swap() {
        const temp = currencyFrom.value;
        currencyFrom.value = currencyTo.value;
        currencyTo.value = temp;
        convert();
    }

    // Debounce function for input
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Event listeners
    function init() {
        // Select DOM elements
        currencyInput = document.getElementById('currencyInput');
        currencyFrom = document.getElementById('currencyFrom');
        currencyTo = document.getElementById('currencyTo');
        currencyResult = document.getElementById('currencyResult');
        currencyUnit = document.getElementById('currencyUnit');
        swapBtn = document.getElementById('swapCurrency');
        statusDot = document.querySelector('#currencyStatus .status-dot');
        statusText = document.querySelector('#currencyStatus .status-text');
        lastUpdated = document.getElementById('lastUpdated');
        
        const debouncedConvert = debounce(convert, 300);
        
        currencyInput.addEventListener('input', debouncedConvert);
        currencyFrom.addEventListener('change', convert);
        currencyTo.addEventListener('change', convert);
        swapBtn.addEventListener('click', swap);

        // Initial conversion
        convert();

        // Refresh rates every hour
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                convert();
            }
        }, CACHE_DURATION);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

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
    
    // LocalStorage key for storing all currency rates
    const STORAGE_KEY = 'currencyRatesAll';
    
    // In-memory cache for exchange rates (per base currency)
    let ratesCache = {};

    // Cache duration: 1 hour (in milliseconds)
    const CACHE_DURATION = 60 * 60 * 1000;
    
    // Track if we're in offline mode
    let isOfflineMode = false;

    // Default fallback rates (used only if no stored rates available)
    const defaultFallbackRates = {
        USD: { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, INR: 83.12 },
        EUR: { USD: 1.09, EUR: 1, GBP: 0.86, JPY: 162.89, INR: 90.56 },
        GBP: { USD: 1.27, EUR: 1.16, GBP: 1, JPY: 189.24, INR: 105.19 },
        JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, JPY: 1, INR: 0.56 },
        INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.80, INR: 1 }
    };
    
    // Load stored rates from localStorage on startup
    function loadStoredRates() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                ratesCache = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load stored rates:', e);
            ratesCache = {};
        }
    }
    
    // Save rates to localStorage
    function saveRatesToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ratesCache));
        } catch (e) {
            console.error('Failed to save rates to storage:', e);
        }
    }
    
    // Get the most recent stored timestamp for display
    function getMostRecentStoredDate() {
        let mostRecent = null;
        for (const base in ratesCache) {
            if (ratesCache[base]?.timestamp) {
                if (!mostRecent || ratesCache[base].timestamp > mostRecent) {
                    mostRecent = ratesCache[base].timestamp;
                }
            }
        }
        return mostRecent ? new Date(mostRecent) : null;
    }

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
        const decimals = currency === 'JPY' ? 0 : 2;
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        return formatter.format(value);
    }

    // Fetch exchange rates from API
    async function fetchRates(baseCurrency) {
        try {
            // Check if we're offline first
            if (!navigator.onLine) {
                throw new Error('No internet connection');
            }

            // Check in-memory cache first (only use if online - to show correct status)
            const cached = ratesCache[baseCurrency];
            if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_DURATION) {
                isOfflineMode = false;
                updateStatus('online', 'Rates up to date');
                return cached.rates;
            }

            updateStatus('', 'Fetching rates...');
            
            const response = await fetch(API_BASE_URL + baseCurrency);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            // Update cache for this base currency
            ratesCache[baseCurrency] = {
                rates: data.rates,
                timestamp: Date.now()
            };

            // Save all rates to localStorage for offline access
            saveRatesToStorage();

            isOfflineMode = false;
            updateStatus('online', 'Rates updated');
            
            // Show last updated time
            const now = new Date();
            if (lastUpdated) lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;

            return data.rates;
        } catch (error) {
            console.error('Failed to fetch rates:', error);
            
            // Try to use stored rates for this base currency
            const storedForBase = ratesCache[baseCurrency];
            if (storedForBase && storedForBase.rates) {
                isOfflineMode = true;
                updateStatus('offline', 'Offline - using last known rates');
                const cacheDate = new Date(storedForBase.timestamp);
                if (lastUpdated) {
                    lastUpdated.textContent = `Offline: rates from ${cacheDate.toLocaleDateString()} ${cacheDate.toLocaleTimeString()}`;
                }
                return storedForBase.rates;
            }
            
            // Try to compute rate from other stored rates
            const computedRate = tryComputeRateFromStored(baseCurrency);
            if (computedRate) {
                isOfflineMode = true;
                updateStatus('offline', 'Offline - using last known rates');
                const recentDate = getMostRecentStoredDate();
                if (lastUpdated && recentDate) {
                    lastUpdated.textContent = `Offline: rates from ${recentDate.toLocaleDateString()} ${recentDate.toLocaleTimeString()}`;
                }
                return computedRate;
            }

            // Last resort: use default hardcoded fallback rates
            isOfflineMode = true;
            updateStatus('offline', 'Offline - using default rates');
            if (lastUpdated) lastUpdated.textContent = 'Offline: using approximate default rates';
            return null;
        }
    }
    
    // Try to compute rates from other stored bases (e.g., if we have USD rates, compute EUR rates)
    function tryComputeRateFromStored(baseCurrency) {
        // Look for any stored base currency that has rates for our target
        for (const storedBase in ratesCache) {
            const storedData = ratesCache[storedBase];
            if (!storedData || !storedData.rates) continue;
            
            // Check if this stored base has a rate for our baseCurrency
            const baseToStoredRate = storedData.rates[baseCurrency];
            if (baseToStoredRate && baseToStoredRate > 0) {
                // We can compute: baseCurrency -> X = (storedBase -> X) / (storedBase -> baseCurrency)
                const computedRates = {};
                for (const currency in storedData.rates) {
                    computedRates[currency] = storedData.rates[currency] / baseToStoredRate;
                }
                computedRates[baseCurrency] = 1;
                return computedRates;
            }
        }
        return null;
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
                // Use default fallback rates as last resort
                const rate = defaultFallbackRates[fromCurrency]?.[toCurrency];
                if (rate) {
                    result = amount * rate;
                    if (!isOfflineMode) {
                        isOfflineMode = true;
                        updateStatus('offline', 'Offline - using default rates');
                        if (lastUpdated) lastUpdated.textContent = 'Offline: using approximate default rates';
                    }
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
        // Load stored rates from localStorage first
        loadStoredRates();
        
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
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            console.log('Network online - refreshing rates');
            convert();
        });
        
        window.addEventListener('offline', () => {
            console.log('Network offline');
            isOfflineMode = true;
            updateStatus('offline', 'Offline - using last known rates');
            const recentDate = getMostRecentStoredDate();
            if (lastUpdated && recentDate) {
                lastUpdated.textContent = `Offline: rates from ${recentDate.toLocaleDateString()} ${recentDate.toLocaleTimeString()}`;
            }
        });

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

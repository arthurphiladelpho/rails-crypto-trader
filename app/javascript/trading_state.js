// TradingState class to manage application state
export class TradingState { // Manages current symbol, interval, and persistence
  constructor() { // Initialize state from localStorage or defaults
    this.symbol = this.loadFromStorage('symbol') || 'BTCUSDT'; // Current symbol (default: BTCUSDT)
    this.interval = this.loadFromStorage('interval') || '1m'; // Current interval (default: 1m)
    this.listeners = []; // Array of state change listeners
  }

  loadFromStorage(key) { // Load value from localStorage
    try { // Try to load from localStorage
      return localStorage.getItem(`trading_${key}`); // Return stored value
    } catch (e) { // Handle localStorage errors
      console.warn('localStorage not available:', e); // Log warning
      return null; // Return null if unavailable
    }
  }

  saveToStorage(key, value) { // Save value to localStorage
    try { // Try to save to localStorage
      localStorage.setItem(`trading_${key}`, value); // Store value
    } catch (e) { // Handle localStorage errors
      console.warn('localStorage not available:', e); // Log warning
    }
  }

  setSymbol(symbol) { // Set current symbol
    if (this.symbol !== symbol) { // Only update if changed
      this.symbol = symbol; // Update symbol
      this.saveToStorage('symbol', symbol); // Persist to localStorage
      this.notifyListeners(); // Notify all listeners
    }
  }

  setInterval(interval) { // Set current interval
    if (this.interval !== interval) { // Only update if changed
      this.interval = interval; // Update interval
      this.saveToStorage('interval', interval); // Persist to localStorage
      this.notifyListeners(); // Notify all listeners
    }
  }

  getSymbol() { // Get current symbol
    return this.symbol; // Return current symbol
  }

  getInterval() { // Get current interval
    return this.interval; // Return current interval
  }

  onChange(callback) { // Register state change listener
    this.listeners.push(callback); // Add callback to listeners array
  }

  notifyListeners() { // Notify all listeners of state change
    this.listeners.forEach(callback => { // Loop through all listeners
      callback({ // Call each listener with current state
        symbol: this.symbol, // Current symbol
        interval: this.interval // Current interval
      });
    });
  }
}

import consumer from "./consumer" // Import ActionCable consumer

export class MarketDataChannel { // Manages WebSocket connection for market data
  constructor(chartManager, statusCallback) { // Initialize with chart manager and status callback
    this.chartManager = chartManager; // Reference to chart manager
    this.statusCallback = statusCallback; // Callback for status updates
    this.subscription = null; // Current subscription instance
    this.currentSymbol = null; // Current subscribed symbol
    this.currentInterval = null; // Current subscribed interval
  }

  subscribe(symbol, interval) { // Subscribe to market data channel
    this.unsubscribe(); // Unsubscribe from previous channel if exists

    this.currentSymbol = symbol; // Store current symbol
    this.currentInterval = interval; // Store current interval

    // Update status to connecting
    this.updateStatus('connecting', 'Connecting...'); // Update UI status

    // Fetch historical data first
    this.fetchHistoricalData(symbol, interval).then(() => { // Load historical candles
      // Then subscribe to real-time updates
      this.subscription = consumer.subscriptions.create( // Create ActionCable subscription
        { // Subscription parameters
          channel: "MarketDataChannel", // Channel name
          symbol: symbol, // Symbol parameter
          interval: interval // Interval parameter
        },
        { // Subscription callbacks
          connected: () => { // Called when connected
            console.log('WebSocket connected'); // Log connection
            this.updateStatus('connected', 'Connected'); // Update UI status
          },

          disconnected: () => { // Called when disconnected
            console.log('WebSocket disconnected'); // Log disconnection
            this.updateStatus('connecting', 'Reconnecting...'); // Update UI status
          },

          received: (data) => { // Called when data received
            this.handleUpdate(data); // Process received data
          }
        }
      );
    }).catch(error => { // Handle errors loading historical data
      console.error('Error loading historical data:', error); // Log error
      this.updateStatus('error', 'Connection error'); // Update UI status
    });
  }

  unsubscribe() { // Unsubscribe from current channel
    if (this.subscription) { // If subscription exists
      this.subscription.unsubscribe(); // Unsubscribe from channel
      this.subscription = null; // Clear subscription reference
    }
  }

  async fetchHistoricalData(symbol, interval) { // Fetch historical candlestick data
    const response = await fetch( // Make API request
      `/api/market_data/history?symbol=${symbol}&interval=${interval}&limit=500` // API endpoint with parameters
    );

    if (!response.ok) { // Check if request failed
      throw new Error('Failed to fetch historical data'); // Throw error
    }

    const result = await response.json(); // Parse JSON response

    if (result.success && result.data) { // If data received successfully
      this.chartManager.setData(result.data); // Load data into chart
    } else { // If request failed
      throw new Error(result.error || 'Unknown error'); // Throw error
    }
  }

  handleUpdate(data) { // Handle real-time data update
    if (data && data.time) { // Validate data
      this.chartManager.updateCandle(data); // Update chart with new candle data
    }
  }

  updateStatus(state, text) { // Update connection status UI
    if (this.statusCallback) { // If callback provided
      this.statusCallback(state, text); // Call status callback
    }
  }
}

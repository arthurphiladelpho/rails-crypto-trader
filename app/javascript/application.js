// Entry point for the build script in your package.json
import "@hotwired/turbo-rails" // Import Turbo for SPA-like navigation
import "./channels" // Import ActionCable channels
import { ChartManager } from "./chart_manager" // Import chart manager
import { TradingState } from "./trading_state" // Import trading state manager
import { MarketDataChannel } from "./channels/market_data_channel" // Import market data channel

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => { // Run when DOM is loaded
  initTradingApp(); // Initialize trading application
});

function initTradingApp() { // Initialize the trading application
  // Initialize managers
  const chartManager = new ChartManager('chart-container'); // Create chart manager instance
  const tradingState = new TradingState(); // Create state manager instance

  // Create market data channel with status callback
  const marketDataChannel = new MarketDataChannel( // Create market data channel instance
    chartManager, // Pass chart manager
    updateStatus // Pass status update callback
  );

  // Initialize UI elements
  const coinSelector = document.getElementById('coin-selector'); // Get coin selector element
  const timeframeButtons = document.querySelectorAll('.timeframe-btn'); // Get all timeframe buttons
  const loadingOverlay = document.getElementById('loading-overlay'); // Get loading overlay element

  // Set initial values from state
  coinSelector.value = tradingState.getSymbol(); // Set coin selector to saved value
  setActiveTimeframe(tradingState.getInterval()); // Set active timeframe button

  // Subscribe to initial market data
  marketDataChannel.subscribe( // Subscribe to market data
    tradingState.getSymbol(), // Current symbol
    tradingState.getInterval() // Current interval
  );

  // Hide loading overlay after short delay
  setTimeout(() => { // Wait for initial data load
    loadingOverlay.classList.add('hidden'); // Hide loading overlay
  }, 1000);

  // Coin selector change handler
  coinSelector.addEventListener('change', (e) => { // Listen for coin selection changes
    const newSymbol = e.target.value; // Get selected symbol
    tradingState.setSymbol(newSymbol); // Update state
    reloadChart(); // Reload chart with new symbol
  });

  // Timeframe button click handlers
  timeframeButtons.forEach(button => { // Loop through all timeframe buttons
    button.addEventListener('click', () => { // Add click listener to each button
      const newInterval = button.dataset.interval; // Get interval from button data attribute
      tradingState.setInterval(newInterval); // Update state
      setActiveTimeframe(newInterval); // Update active button styling
      reloadChart(); // Reload chart with new interval
    });
  });

  function reloadChart() { // Reload chart with current state
    loadingOverlay.classList.remove('hidden'); // Show loading overlay
    chartManager.clear(); // Clear existing chart data

    marketDataChannel.subscribe( // Subscribe to new market data
      tradingState.getSymbol(), // Current symbol
      tradingState.getInterval() // Current interval
    );

    setTimeout(() => { // Wait for data load
      loadingOverlay.classList.add('hidden'); // Hide loading overlay
    }, 1000);
  }

  function setActiveTimeframe(interval) { // Set active timeframe button
    timeframeButtons.forEach(btn => { // Loop through all buttons
      if (btn.dataset.interval === interval) { // If button matches interval
        btn.classList.add('active'); // Add active class
      } else { // If button doesn't match
        btn.classList.remove('active'); // Remove active class
      }
    });
  }

  function updateStatus(state, text) { // Update connection status UI
    const statusDot = document.getElementById('status-dot'); // Get status dot element
    const statusText = document.getElementById('status-text'); // Get status text element

    // Remove all status classes
    statusDot.classList.remove('connected', 'error'); // Remove status classes

    // Add appropriate class
    if (state === 'connected') { // If connected
      statusDot.classList.add('connected'); // Add connected class
    } else if (state === 'error') { // If error
      statusDot.classList.add('error'); // Add error class
    }

    // Update status text
    statusText.textContent = text; // Update status text content
  }
}

// ChartManager class to handle TradingView Lightweight Charts
export class ChartManager { // Manages chart initialization and updates
  constructor(containerId) { // Initialize with container element ID
    this.container = document.getElementById(containerId); // Get chart container element
    this.chart = null; // Chart instance
    this.candleSeries = null; // Candlestick series instance
    this.lastCandle = null; // Store the last candle for updates
    this.initChart(); // Initialize the chart
  }
  
  initChart() { // Initialize TradingView Lightweight Chart
    this.chart = LightweightCharts.createChart(this.container, { // Create chart with configuration
      layout: { // Layout configuration
        background: { color: '#131722' }, // Dark background color
        textColor: '#d1d4dc', // Light text color
      },
      grid: { // Grid configuration
        vertLines: { color: '#1e222d' }, // Vertical grid lines color
        horzLines: { color: '#1e222d' }, // Horizontal grid lines color
      },
      crosshair: { // Crosshair configuration
        mode: LightweightCharts.CrosshairMode.Normal, // Normal crosshair mode
      },
      rightPriceScale: { // Right price scale configuration
        borderColor: '#2a2e39', // Border color
      },
      timeScale: { // Time scale configuration
        borderColor: '#2a2e39', // Border color
        timeVisible: true, // Show time on scale
        secondsVisible: false, // Hide seconds
      },
      handleScroll: { // Scroll handling
        vertTouchDrag: true, // Enable vertical touch drag
      },
      handleScale: { // Scale handling
        axisPressedMouseMove: true, // Enable scaling with mouse
      },
    });
    
    this.candleSeries = this.chart.addCandlestickSeries({ // Add candlestick series
      upColor: '#0ecb81', // Green color for up candles
      downColor: '#f6465d', // Red color for down candles
      borderUpColor: '#0ecb81', // Green border for up candles
      borderDownColor: '#f6465d', // Red border for down candles
      wickUpColor: '#0ecb81', // Green wick for up candles
      wickDownColor: '#f6465d', // Red wick for down candles
    });
    
    // Handle window resize
    window.addEventListener('resize', () => { // Add resize event listener
      this.chart.applyOptions({ // Update chart dimensions
        width: this.container.clientWidth, // New width
        height: this.container.clientHeight, // New height
      });
    });
  }
  
  setData(data) { // Set initial chart data
    this.candleSeries.setData(data); // Load all candles at once
    if (data.length > 0) { // If data exists
      this.lastCandle = data[data.length - 1]; // Store last candle
    }
    this.chart.timeScale().fitContent(); // Fit all content in view
  }
  
  updateCandle(candle) { // Update the current candle in real-time
    if (!candle) return; // Exit if no candle data
    
    if (candle.is_closed) { // If candle is closed
      // Add as new candle
      this.candleSeries.update(candle); // Add new candle to series
      this.lastCandle = candle; // Update last candle reference
    } else { // If candle is still forming
      // Update current candle
      this.candleSeries.update(candle); // Update current candle data
      this.lastCandle = candle; // Update last candle reference
    }
  }
  
  clear() { // Clear all chart data
    if (this.candleSeries) { // If series exists
      this.candleSeries.setData([]); // Clear all data
      this.lastCandle = null; // Reset last candle
    }
  }
  
  destroy() { // Destroy chart instance
    if (this.chart) { // If chart exists
      this.chart.remove(); // Remove chart from DOM
      this.chart = null; // Clear reference
      this.candleSeries = null; // Clear series reference
    }
  }
}


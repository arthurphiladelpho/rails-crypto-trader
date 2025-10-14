require 'faraday' # HTTP client for API calls

class BinanceService # Service to interact with Binance REST API
  BASE_URL = 'https://api.binance.com' # Binance API base URL

  def initialize # Initialize Faraday connection
    @conn = Faraday.new(url: BASE_URL) do |f| # Create new Faraday connection
      f.adapter Faraday.default_adapter # Use default adapter (Net::HTTP)
      f.options.timeout = 10 # Set timeout to 10 seconds
    end
  end

  def fetch_klines(symbol, interval, limit = 500) # Fetch historical candlestick data
    response = @conn.get('/api/v3/klines') do |req| # Make GET request to klines endpoint
      req.params['symbol'] = symbol.upcase # Symbol in uppercase (e.g., BTCUSDT)
      req.params['interval'] = interval # Interval (e.g., 1m, 5m, 1h)
      req.params['limit'] = limit # Number of candles to fetch
    end

    if response.status == 200 # Check if request was successful
      raw_data = JSON.parse(response.body) # Parse JSON response
      format_klines(raw_data) # Format data for TradingView chart
    else
      raise "Binance API error: #{response.status} - #{response.body}" # Raise error if request failed
    end
  end

  private

  def format_klines(raw_data) # Format Binance kline data for TradingView Lightweight Charts
    raw_data.map do |candle| # Map each candle to TradingView format
      {
        time: candle[0] / 1000, # Convert milliseconds to seconds (TradingView format)
        open: candle[1].to_f, # Open price
        high: candle[2].to_f, # High price
        low: candle[3].to_f, # Low price
        close: candle[4].to_f, # Close price
        volume: candle[5].to_f # Volume
      }
    end
  end
end

require 'websocket-client-simple' # WebSocket client library

class BinanceWebsocketService # Service to manage WebSocket connections to Binance
  WS_BASE_URL = 'wss://stream.binance.com:9443/ws' # Binance WebSocket base URL

  def initialize(symbol, interval) # Initialize WebSocket service with symbol and interval
    @symbol = symbol.downcase # Symbol in lowercase for WebSocket URL
    @interval = interval.downcase # Interval in lowercase for WebSocket URL
    @ws = nil # WebSocket connection instance
    @on_message_callback = nil # Callback for incoming messages
  end

  def connect(&block) # Connect to Binance WebSocket stream
    @on_message_callback = block # Store callback for message handling
    stream_name = "#{@symbol}@kline_#{@interval}" # Stream name format (e.g., btcusdt@kline_1m)
    url = "#{WS_BASE_URL}/#{stream_name}" # Full WebSocket URL

    @ws = WebSocket::Client::Simple.connect(url) # Connect to WebSocket

    @ws.on :message do |msg| # Handle incoming messages
      begin
        data = JSON.parse(msg.data) # Parse JSON message
        process_message(data) # Process the message
      rescue => e # Handle parsing errors
        Rails.logger.error "WebSocket message error: #{e.message}" # Log error
      end
    end

    @ws.on :error do |e| # Handle WebSocket errors
      Rails.logger.error "WebSocket error: #{e.message}" # Log error
    end

    @ws.on :close do |e| # Handle WebSocket closure
      Rails.logger.info "WebSocket closed: #{e}" # Log closure
    end
  end

  def disconnect # Disconnect from WebSocket
    @ws&.close # Close WebSocket connection if it exists
  end

  private

  def process_message(data) # Process incoming WebSocket message
    return unless data['e'] == 'kline' # Only process kline events

    kline = data['k'] # Extract kline data from message
    formatted_data = { # Format data for TradingView chart
      time: kline['t'] / 1000, # Convert milliseconds to seconds
      open: kline['o'].to_f, # Open price
      high: kline['h'].to_f, # High price
      low: kline['l'].to_f, # Low price
      close: kline['c'].to_f, # Close price
      volume: kline['v'].to_f, # Volume
      is_closed: kline['x'] # Whether the candle is closed
    }

    @on_message_callback&.call(formatted_data) # Call the callback with formatted data
  end
end

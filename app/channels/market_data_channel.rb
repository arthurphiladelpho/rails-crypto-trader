class MarketDataChannel < ApplicationCable::Channel # ActionCable channel for real-time market data
  def subscribed # Called when client subscribes to channel
    symbol = params[:symbol] || 'BTCUSDT' # Get symbol from params
    interval = params[:interval] || '1m' # Get interval from params
    stream_name = "market_data_#{symbol}_#{interval}" # Unique stream name for this symbol/interval
    
    stream_from stream_name # Subscribe to the stream
    
    # Start WebSocket connection to Binance in a separate thread
    Thread.new do # Run WebSocket in background thread
      @ws_service = BinanceWebsocketService.new(symbol, interval) # Create WebSocket service
      @ws_service.connect do |data| # Connect and handle incoming data
        ActionCable.server.broadcast(stream_name, data) # Broadcast data to all subscribers
      end
    rescue => e # Handle errors
      Rails.logger.error "Market data channel error: #{e.message}" # Log error
    end
  end

  def unsubscribed # Called when client unsubscribes from channel
    @ws_service&.disconnect # Disconnect WebSocket when client unsubscribes
  end
end


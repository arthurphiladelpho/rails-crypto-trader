module Api # API namespace module
  class MarketDataController < ApplicationController # Controller for market data API endpoints
    def history # Fetches historical candlestick data from Binance
      symbol = params[:symbol] || 'BTCUSDT' # Get symbol from params, default to BTCUSDT
      interval = params[:interval] || '1m' # Get interval from params, default to 1m
      limit = params[:limit]&.to_i || 500 # Get limit from params, default to 500 candles

      begin
        service = BinanceService.new # Initialize Binance service
        candles = service.fetch_klines(symbol, interval, limit) # Fetch candlestick data

        render json: { # Return JSON response with candle data
          success: true, # Success flag
          data: candles, # Array of candlestick data
          symbol: symbol, # Symbol requested
          interval: interval # Interval requested
        }
      rescue StandardError => e # Handle any errors
        render json: { # Return error response
          success: false, # Error flag
          error: e.message # Error message
        }, status: :internal_server_error # 500 status code
      end
    end
  end
end

# Binance API configuration
module BinanceConfig # Configuration module for Binance API settings
  REST_API_URL = 'https://api.binance.com' # Binance REST API base URL
  WS_API_URL = 'wss://stream.binance.com:9443' # Binance WebSocket API base URL
  
  # Available trading pairs
  SYMBOLS = { # Map of coin names to Binance trading pairs
    'BTC' => 'BTCUSDT', # Bitcoin
    'ETH' => 'ETHUSDT', # Ethereum
    'SOL' => 'SOLUSDT', # Solana
    'BNB' => 'BNBUSDT', # Binance Coin
    'XRP' => 'XRPUSDT', # Ripple
    'ADA' => 'ADAUSDT', # Cardano
    'DOGE' => 'DOGEUSDT' # Dogecoin
  }
  
  # Available timeframes
  INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'] # Supported timeframe intervals
end


# Real-Time Crypto Trading Chart

A Ruby on Rails application featuring real-time cryptocurrency trading charts powered by TradingView Lightweight Charts and Binance API.

## Features

- **Real-time candlestick charts** that update every second
- **Multiple cryptocurrencies**: BTC, ETH, SOL, BNB, XRP, ADA, DOGE
- **Multiple timeframes**: 1m, 5m, 15m, 1h, 4h, 1d, 1w
- **Live data streaming** via Binance WebSocket API
- **Modern dark theme** matching TradingView aesthetic
- **Responsive design** for desktop and mobile
- **State persistence** using localStorage

## Tech Stack

- **Backend**: Ruby on Rails 7.1
- **Frontend**: TradingView Lightweight Charts
- **Real-time**: ActionCable + Binance WebSocket
- **HTTP Client**: Faraday
- **WebSocket Client**: websocket-client-simple
- **Database**: SQLite3 (for development)

## Installation

### Prerequisites

- Ruby 3.2.8 or higher
- Rails 7.1 or higher
- Bundler

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/arthurphiladelpho/rails-crypto-trader.git
   cd rails-crypto-trader
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Setup database**
   ```bash
   rails db:create
   rails db:migrate
   ```

4. **Start the server**
   ```bash
   rails server
   ```

5. **Open your browser**
   Navigate to http://localhost:3000

## Usage

1. **Select a cryptocurrency** from the dropdown (BTC, ETH, SOL, etc.)
2. **Choose a timeframe** by clicking one of the timeframe buttons (1m, 5m, 15m, etc.)
3. **Watch the chart update in real-time** as new candles form
4. **Interact with the chart**:
   - Zoom in/out with mouse wheel
   - Pan by dragging
   - Hover to see precise values
   - Click and drag on price scale to zoom vertically

## Architecture

### Data Flow

1. User selects coin and timeframe
2. Frontend requests historical data from Rails API
3. Rails fetches 500 candles from Binance REST API
4. Chart renders initial data
5. Rails opens WebSocket connection to Binance
6. Binance streams real-time updates
7. Rails broadcasts updates via ActionCable
8. Frontend updates current candle every second

### Key Components

#### Backend

- **HomeController**: Serves the main page
- **Api::MarketDataController**: Provides historical candlestick data
- **BinanceService**: Fetches data from Binance REST API
- **BinanceWebsocketService**: Manages WebSocket connections to Binance
- **MarketDataChannel**: ActionCable channel for real-time updates

#### Frontend

- **ChartManager**: Manages TradingView chart instance and updates
- **TradingState**: Manages application state (symbol, interval)
- **MarketDataChannel**: Handles WebSocket communication with backend
- **application.js**: Main application entry point

### File Structure

```
app/
├── controllers/
│   ├── home_controller.rb              # Main page controller
│   └── api/
│       └── market_data_controller.rb   # API endpoint for historical data
├── services/
│   ├── binance_service.rb              # Binance REST API service
│   └── binance_websocket_service.rb    # Binance WebSocket service
├── channels/
│   └── market_data_channel.rb          # ActionCable channel
├── javascript/
│   ├── application.js                  # Main JavaScript entry point
│   ├── chart_manager.js                # Chart management
│   ├── trading_state.js                # State management
│   └── channels/
│       ├── consumer.js                 # ActionCable consumer
│       ├── index.js                    # Channel loader
│       └── market_data_channel.js      # Frontend WebSocket handler
├── views/
│   └── home/
│       └── index.html.erb              # Main page template
└── assets/
    └── stylesheets/
        └── trading.css                 # Custom styles
```

## Configuration

### Binance API

The app uses Binance's public API endpoints, so **no API key is required**.

Configuration is in `config/initializers/binance.rb`:

```ruby
module BinanceConfig
  REST_API_URL = 'https://api.binance.com'
  WS_API_URL = 'wss://stream.binance.com:9443'

  SYMBOLS = {
    'BTC' => 'BTCUSDT',
    'ETH' => 'ETHUSDT',
    # ... more symbols
  }

  INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']
end
```

### ActionCable

ActionCable configuration is in `config/cable.yml`:

- **Development**: Uses async adapter (no Redis needed)
- **Production**: Uses Redis adapter (requires Redis server)

## Deployment

### Production Setup

1. **Install Redis** (required for ActionCable in production)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install redis-server

   # macOS
   brew install redis
   ```

2. **Set environment variables**
   ```bash
   export REDIS_URL=redis://localhost:6379/1
   export RAILS_ENV=production
   export SECRET_KEY_BASE=$(rails secret)
   ```

3. **Precompile assets**
   ```bash
   rails assets:precompile
   ```

4. **Run migrations**
   ```bash
   rails db:migrate RAILS_ENV=production
   ```

5. **Start the server**
   ```bash
   rails server -e production
   ```

## Development

### Adding New Coins

To add a new cryptocurrency:

1. Update `config/initializers/binance.rb`:
   ```ruby
   SYMBOLS = {
     'BTC' => 'BTCUSDT',
     'YOUR_COIN' => 'YOUR_COINUSDT',  # Add your coin here
   }
   ```

2. Update `app/views/home/index.html.erb`:
   ```html
   <option value="YOUR_COINUSDT">YOUR_COIN</option>
   ```

### Adding New Timeframes

To add a new timeframe:

1. Update `config/initializers/binance.rb`:
   ```ruby
   INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M']  # Add '1M'
   ```

2. Update `app/views/home/index.html.erb`:
   ```html
   <button class="timeframe-btn" data-interval="1M">1M</button>
   ```

## Troubleshooting

### Bundle install fails

If you get network errors during `bundle install`:
- Check your internet connection
- Try using a VPN
- Check firewall settings

### Chart not loading

1. Check browser console for errors
2. Verify Rails server is running
3. Check that Binance API is accessible
4. Ensure JavaScript is enabled

### WebSocket connection fails

1. Check ActionCable configuration in `config/cable.yml`
2. Verify Redis is running (in production)
3. Check browser WebSocket support
4. Look for CORS issues in browser console

### No real-time updates

1. Check that WebSocket connection is established (status should show "Connected")
2. Verify Binance WebSocket URL is accessible
3. Check Rails logs for errors
4. Ensure MarketDataChannel is properly subscribed

## API Endpoints

### Get Historical Data

```
GET /api/market_data/history
```

**Parameters:**
- `symbol` (optional): Trading pair (default: BTCUSDT)
- `interval` (optional): Timeframe (default: 1m)
- `limit` (optional): Number of candles (default: 500)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": 1697299200,
      "open": 28000.50,
      "high": 28100.00,
      "low": 27950.00,
      "close": 28050.00,
      "volume": 123.45
    },
    ...
  ],
  "symbol": "BTCUSDT",
  "interval": "1m"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **Binance** for providing free public API
- **TradingView** for the excellent Lightweight Charts library
- **Ruby on Rails** community

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions

## Roadmap

Future enhancements:
- [ ] Add volume indicators
- [ ] Support for more technical indicators (RSI, MACD, etc.)
- [ ] Multiple chart layouts
- [ ] Price alerts
- [ ] Historical data export
- [ ] Dark/Light theme toggle
- [ ] User authentication
- [ ] Saved chart layouts

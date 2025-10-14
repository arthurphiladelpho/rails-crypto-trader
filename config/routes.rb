Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index" # Main trading chart page

  # API endpoints for market data
  namespace :api do # API namespace for market data endpoints
    get 'market_data/history', to: 'market_data#history' # Fetch historical candlestick data
  end
end

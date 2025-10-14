# Pin npm packages by running ./bin/importmap

pin "application", preload: true # Pin main application JavaScript
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true # Pin Turbo for SPA-like navigation
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true # Pin Stimulus framework
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true # Pin Stimulus loading
pin_all_from "app/javascript/controllers", under: "controllers" # Pin all Stimulus controllers
pin "@rails/actioncable", to: "actioncable.esm.js" # Pin ActionCable for WebSocket support
pin_all_from "app/javascript/channels", under: "channels" # Pin all ActionCable channels

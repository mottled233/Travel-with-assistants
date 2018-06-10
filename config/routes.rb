Rails.application.routes.draw do
  get '/home', to: "static_pages#home"
  get '/map', to: "static_pages#map", as: :map

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'static_pages#home'
  
  get '/static_maps/:longitude/:latitude', longitude: /[^\/]+/, latitude: /[^\/]+/, to: 'static_maps#show', as: :static_maps, defaults: { longitude:116.403874, latitude:39.914888 }
  
  resources :users
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/reg', to: 'users#new'
  delete '/logout', to: 'sessions#destroy'
  get '/logout', to: 'sessions#destroy'
  
  
end

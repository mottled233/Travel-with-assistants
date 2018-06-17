Rails.application.routes.draw do


  root 'static_pages#home'
  

  get '/home', to: "static_pages#home"
  get '/map', to: "static_pages#map", as: :map
  
  get '/city/:cityname', to: "city#show", as: :city
  get '/static_maps/:longitude/:latitude', longitude: /[^\/]+/, latitude: /[^\/]+/, to: 'static_maps#show', as: :static_maps, defaults: { longitude:116.403874, latitude:39.914888 }
  get '/weather/:cityname', to: "weather#show", as: :weather
  get '/attractions/:attraction', to: "attractions#show", as: :attraction
  
  
  resources :users do
    resources :interest_points
    get "interest_points_create", to:"interest_points#create"
    get "interest_points_delete/:id", to:"interest_points#destroy", as:"interest_points_delete"
  end
  
  
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/reg', to: 'users#new'
  delete '/logout', to: 'sessions#destroy'
  get '/logout', to: 'sessions#destroy'
  
  
end

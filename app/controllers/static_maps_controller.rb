class StaticMapsController < ApplicationController
  require 'digest/md5'
  require 'net/http'
  include ApplicationHelper
  
  
  def show
    @latitude = params[:latitude]
    @longitude = params[:longitude]

    @static_map_path = get_map @longitude, @latitude, params
    respond_to do |format|
      format.json
      format.html
    end
    
  end
  
  
  def get_map(longitude=116.403874, latitude=39.914888, option={})
    height = option[:height] || 600
    width = option[:width] || 800
    zoom = option[:zoom] || 11
    
    ak = "w025eBzN2vPrdO4EAlm9HBsrYMWItR9N"
    
    url = "https://api.map.baidu.com/staticimage/v2?center=#{longitude},#{latitude}"
    url += "&height=#{height}&width=#{width}&zoom=#{zoom}&output=json"
    if option[:markers]
      markers = option[:markers].split("|")
      mark_style = (1..markers.size).to_a.map{|i| "l,#{i},0xff0000"}
      url += "&markers=#{option[:markers]}&markerStyles=#{mark_style.join("|")}"
    end
    url += "&ak=#{ak}"
    
    url = urlEncoding url
    url = URI.parse(url)
  end 
end

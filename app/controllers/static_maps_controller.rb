class StaticMapsController < ApplicationController
  require 'digest/md5'
  require 'net/http'
  include ApplicationHelper
  
  
  def show
    @latitude = params[:latitude]
    @longitude = params[:longitude]
    @height = params[:height]
    @width = params[:width]
    @zoom = params[:zoom]
    @static_map_path = get_map @longitude, @latitude, height: @height, width: @width, zoom: @zoom
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
    url += "&ak=#{ak}"
    url = urlEncoding url
    url = URI.parse(url)
  end 
end

class CityController < ApplicationController
  require 'net/http'
  require 'json'
  include ApplicationHelper
  
  
  def show
    city = params[:cityname]
    page = params[:page].to_i - 1 || 0
    begin
      url = URI.parse(URI::escape("http://api.map.baidu.com/place/v2/search?query=景点&region=#{city}&page_size=9&page_num=#{page}&output=json&ak=#{ApplicationHelper::AK}"))
      res = Net::HTTP.get_response(url)
      res = JSON::parse(res.body)
    rescue SocketError => e
      puts e
      res = {status:404}
    end
    
    @locations = []
    total = {lng: 0, lat:0, markers:[]}
    @count = 0
    if res["results"]
      res["results"].each do |item|
        addr = {}
        addr[:name] = item["name"]
        addr[:lat] = item["location"]["lat"].to_f
        addr[:lng] = item["location"]["lng"].to_f
        total[:lng]+=addr[:lng]
        total[:lat]+=addr[:lat]
        total[:markers].append("#{addr[:lng]},#{addr[:lat]}")
        @count+=1
        @locations.append addr
      end
    end
    
    @status = (res["status"]==0&&@count>0) ? 1 : 2
    @count+=1 if @count==0
    
    @center = {lng: total[:lng]/@count, lat: total[:lat]/@count}
    @zoom = params[:zoom] || 11
    @height = params[:height] || 600
    @width = params[:width] || 800
    @marker = total[:markers].join "|"
    
    respond_to do |format|
      format.json
      format.html
    end
  end
end

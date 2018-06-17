class InterestPointsController < ApplicationController
  require 'net/http'
  require 'json'
  include ApplicationHelper
  
  def index
    unless User.exists?(params[:user_id])
      redirect_to "/404.html"
      return
    end
    url = "http://api.map.baidu.com/geodata/v3/poi/list?user_id=#{params[:user_id].to_i},#{params[:user_id].to_i+1}&ak=#{ApplicationHelper::AK}&geotable_id=#{ApplicationHelper::InterestPoints_table}"
    puts url
    begin
      url = URI.parse(URI::escape(url))
      res = Net::HTTP.get_response(url)
      res = JSON::parse(res.body)["pois"]
    rescue SocketError => e
      puts e
      res = []
    end
    res = res.select do |item|
      item["user_id"].to_s==params[:user_id].to_s
    end
    @interest_points = []
    res.each do |poi|
      @interest_points.append(InterestPoint.new(id: poi["id"],name: poi["title"], 
                              longitude: poi["location"][0], latitude: poi["location"][1],
                              user_id: poi["user_id"], zoom: poi["zoom"]))
    end
    
    respond_to do |format|
      format.json
    end
  end
  
  def create
    unless User.exists?(params[:user_id])
      redirect_to "/404.html"
      return
    end
    url = "http://api.map.baidu.com/geodata/v3/poi/create"
    post_params = 
    { 
      ak: ApplicationHelper::AK, geotable_id: ApplicationHelper::InterestPoints_table,
      coord_type: 3, user_id: params[:user_id], title: params[:name], zoom: params[:zoom],
      latitude: params[:latitude], longitude: params[:longitude]
    }
    
    begin
      url = URI.parse(URI::escape(url))
      res = Net::HTTP.post_form(url,post_params)
      res = JSON::parse(res.body)
    rescue SocketError => e
      puts e
      res = {status:404}
    end
    
    @result = res["status"]==0? 1:2
    respond_to do |format|
      format.json{ render "result"}
    end
  end
  
  def destroy
    unless User.exists?(params[:user_id])
      redirect_to "/404.html"
      return
    end
    
    url = "http://api.map.baidu.com/geodata/v3/poi/delete"
    post_params = 
    { 
      ak: ApplicationHelper::AK, geotable_id: ApplicationHelper::InterestPoints_table,
      id: params[:id]
    }
    
    begin
      url = URI.parse(URI::escape(url))
      res = Net::HTTP.post_form(url,post_params)
      res = JSON::parse(res.body)
    rescue SocketError => e
      puts e
      res = {status:404}
    end
    
    @result = res["status"]==0? 1:2
    respond_to do |format|
      format.json{ render "result"}
    end
  end
  
  private
  def point_param
    params.require(:interest_point).permit(:latitude, :longitude, :name, :name)
  end
  
end
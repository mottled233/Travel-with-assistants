class AttractionsController < ApplicationController
  require 'net/http'
  require 'json'
  include ApplicationHelper
  
  def show
    @attraction = params[:attraction]
    
    begin
      url = URI.parse(URI::escape("http://route.showapi.com/268-1?showapi_appid=#{ApplicationHelper::Attraction_ID}&showapi_sign=#{ApplicationHelper::Attraction_AK}&keyword=#{@attraction}"))
      res = Net::HTTP.get_response(url)
      res = JSON::parse(res.body)["showapi_res_body"]["pagebean"]["contentlist"]
      res = res.select {|item| item["name"]==@attraction}
    rescue SocketError => e
      puts e
      res = {status:404}
    end
    
    if res.size>=1
      res = res[0] 
      @result={
        description: res["content"],
        picture: res["picList"][0]["picUrl"]
      }
    else
      @result={}
    end
    
    
    respond_to do |format|
      format.json
      format.html
    end
  end
end

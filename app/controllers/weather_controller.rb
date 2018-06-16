class WeatherController < ApplicationController
  require 'net/http'
  require 'json'
  include ApplicationHelper
  
  def show
    @city = params[:cityname]
    
    begin
      url = URI.parse(URI::escape("https://free-api.heweather.com/s6/weather/forecast?location=#{@city}&key=#{ApplicationHelper::Weather_AK}"))
      res = Net::HTTP.get_response(url)
      res = JSON::parse(res.body)["HeWeather6"][0]
    rescue SocketError => e
      puts e
      res = {status:404}
    end
    @city = {nation: res["basic"]["cnty"], province: res["basic"]["admin_area"], city: @city}
    
    @status = res["status"]=="ok"? 1:2
    
    @daily = []
    date = Time.now
    res["daily_forecast"].each do |day|
      day_date = {year: date.year, month: date.month, day: date.day, week_day: date.wday}
      weather = {day_weather: day["cond_txt_d"], night_weather: day["cond_txt_n"]}
      weather[:max_temp] = day["tmp_max"]
      weather[:min_temp] = day["tmp_min"]
      weather[:wind_direction] = day["wind_dir"]
      weather[:wind_level] = day["wind_sc"]
      @daily.append({date: day_date, weather: weather})
      date+=1.day
    end
    
    
    respond_to do |format|
      format.json
      format.html
    end
  end
end

module ApplicationHelper
  AK = "w025eBzN2vPrdO4EAlm9HBsrYMWItR9N"
  InterestPoints_table = "190670"
  Weather_AK = "df8ab8002b164009a46cd496d27d3833"
  Attraction_AK = "48c79db4d9f94dc8a0c79e2e1834daee"
  Attraction_ID = "67601"
  
  def urlEncoding url
    puts url
    while pos = (url =~ /[\p{Han}\s]/) do
      char, url[pos] = url[pos], ""
      url.insert(pos,Rack::Utils.escape(char))
    end

    url
  end
  
  def calc_sn url
    sk = "XM9SkXGlnx8H6wDPi7vtTI92XRihdTb1"
    pos = url=~/\.com/
    url = url[pos+4..-1]
    puts url+sk
    Digest::MD5.hexdigest url+sk
  end
  
  def get_static_map(longitude=116.403874, latitude=39.914888, width=800, height=600)
    url = "https://api.map.baidu.com/staticimage/v2?center=#{longitude},#{latitude}"
    url += "&height=#{height}&width=#{width}&output=json"
    
    url += "&ak=#{AK}"
    url = urlEncoding url
    puts url
    url = URI.parse(url)
  end
end

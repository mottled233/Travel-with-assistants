$(document).ready(function(){
  // global
  function updateMap(img_url){
    $("#map").attr("src",img_url);
  }
  
  var markers = "";
  function getNewMap(longitude,latitude,zoom,width,height){
    if(longitude==null)
      longitude = parseFloat($("#now_longitude").val());
    if(latitude==null)
      latitude = parseFloat($("#now_latitude").val());
    if(zoom==null)
      zoom = parseInt($("#now_zoom").val());
    if(height==null)
      height = parseInt($("#now_height").val());
    if(width==null)
      width = parseInt($("#now_width").val());
      
    $("#longitude").val(longitude);
    $("#latitude").val(latitude);
    $("#now_longitude").val(longitude);
    $("#now_latitude").val(latitude);
    $("#now_height").val(height);
    $("#now_width").val(width);
    $("#now_zoom").val(zoom);
    
    var url = "/static_maps/" + longitude + "/" + latitude +"?format=json";
    url += "&height="+height + "&width="+width;
    url += "&zoom="+zoom;
    if(markers!="")url += "&markers="+markers;
    $.get(url,function(data,status){
      var map = data["map"];
      map = map.replace(/&amp;(\w+)=/g, "&$1=");
      updateMap(map);
      
    });
  }
  
  function showPosition(position) {
    getNewMap(position.coords.longitude,position.coords.latitude,17);
    
  }
  
  function showError(error) {
    getNewMap();
    switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("用户拒绝对获取地理位置的请求。");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("位置信息是不可用的。");
      break;
    case error.TIMEOUT:
      alert("请求用户地理位置超时。");
      break;
    case error.UNKNOWN_ERROR:
      alert("未知错误。");
      break;
    }
  }
  function isNull( str ){
    if ( str==null || str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  }
  
  zoom_scale= [0,  0,0,0,0,0,0,0,0,0,0,[0.001156626,0.0009230769],0,0,[1.428571e-04,1.190476e-04], [7.272727e-05,5.714286e-05], [3.614458e-05, 2.884615e-05], [1.798561e-05,1.492537e-05], [9.009009e-06,7.246376e-06]];
  $("#map").click(function(e){ 
      var zoom = parseInt($("#now_zoom").val());
      var longitude = parseFloat($("#now_longitude").val());
      var latitude = parseFloat($("#now_latitude").val());
      var height = parseInt($("#now_height").val());
      var width = parseInt($("#now_width").val());
      var x = e.pageX - $('#map').offset().left-width/2;
      var y = e.pageY - $('#map').offset().top-height/2; 
      var click_longitude = longitude+x*zoom_scale[zoom][0];
      var click_latitude = latitude-y*zoom_scale[zoom][1];
      getNewMap(click_longitude,click_latitude);
  });
  
  // map_jump
  
  $(".direction").click(function(){
    var id = $(this).attr('id');
    var longitude = parseFloat($("#now_longitude").val());
    var latitude = parseFloat($("#now_latitude").val());
    var zoom = parseInt($("#now_zoom").val());
    var step = 0.0003*((19-zoom)*(19-zoom)*5);
    switch(id){
      case "up":
        latitude+=step*0.5;
        break;
      case "down":
        latitude-=step*0.5;
        break;
      case "right":
        longitude+=step;
        break;
      case "left":
        longitude-=step;
        break;
    }
    
    getNewMap(longitude, latitude);
  });
  
  $("#my_pos").click(function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("该浏览器不支持定位功能！");
    }
  });
  
  $("#jump_to").click(function(){
    var longitude = $("#longitude").val();
    var latitude = $("#latitude").val();
    var zoom = parseInt($("#now_zoom").val());
    if(isNull(longitude) || isNull(latitude))return;
    
    getNewMap(longitude, latitude);
  });
  
  $(".zoom").click(function(){
    var longitude = $("#now_longitude").val();
    var latitude = $("#now_latitude").val();
    var zoom = $("#now_zoom").val();
    if(isNull(longitude) || isNull(latitude) || isNull(zoom))return;
    id = $(this).attr("id");
    if(id == "zoom_minus") zoom=parseInt(zoom)-1;
    else if(id == "zoom_plus") zoom=parseInt(zoom)+1;
    
    if(zoom>=3&&zoom<=18){
      getNewMap(longitude, latitude, zoom);
    }
  });
  
  
  
  
  // city to go
  function clearAttractions(need_refresh){
    markers="";
    if(need_refresh)
      getNewMap();
    $("#attractions").slideUp();
    $("#attractions").html("");
    $("#attractions").append("<h3>该城市景点信息</h3>");
    $("#attractions").append("<hr />");
    clearWeatherAndDetail();
    
  }
  
  $("#city_go").click(getCityAttraction);
  
  function getCityAttraction(e,city_to_go, page){
    if(city_to_go==null){
      city_to_go =$("#dist_city").val();
    }
    if(page==null)
      page=1
    var url = "/city/"+city_to_go+"?page="+page;
    $.get(url,function(data,status){
      clearAttractions();
      var map = data["map"];
      markers = map["markers"];
      getNewMap(map["lng"], map["lat"], map["zoom"], map["width"], map["height"]);
      
      var size = data["total"];
      var attractions = data["attractions"];
      
      for(var i = 0; i < size; i++){
        var attraction = $("<div></div>").addClass("attraction").attr("lat", attractions[i]["lat"]).attr("lng", attractions[i]["lng"]);
        attraction.attr("name", attractions[i]["name"]).attr("city", city_to_go);
        var name = "<a class=\"inline-block attraction_jump pointer\">"+(i+1)+"、  "+attractions[i]["name"]+"</a>";
        attraction.append(name);
        $("#attractions").append(attraction);
      }
      $(".attraction_jump").click(function() {
        var lat = $(this).parent().attr("lat");
        var lng = $(this).parent().attr("lng");
        var city = $(this).parent().attr("city");
        var name = $(this).parent().attr("name");
        jump_to_attraction(lng,lat,14,city,name);
      });
      if(size>0){
        if(page>1)
          var prev = "<a class=\"attraction_prev pointer block\">上一页</a>"
        var clear = "<a class=\"attraction_clear pointer block\">取消检索</a>"
        var next = "<a class=\"attraction_next pointer block\">下一页</a>"
        attraction.append(prev,clear,next);
        $(".attraction_clear").click(clearAttractions);
        $(".attraction_prev").click(function(){
          getCityAttraction(1,city_to_go,page-1);
        })
        $(".attraction_next").click(function(){
          getCityAttraction(1,city_to_go,page+1);
        })
        $("#attractions").slideDown();
      }else{
        alert("无法查询到该城市景点信息。");
      }
    });
  }
  
  function clearWeatherAndDetail(){
    $("#weathers").slideUp();
    $("#weathers").html("");
    $("#weathers").append("<h3>当前天气</h3>");
    $("#weathers").append("<hr/>");
    $("#descriptions").slideUp();
    $("#descriptions").html("");
    $("#descriptions").append("<h3>景点描述</h3>");
    $("#descriptions").append("<hr/>");
  }
  var mutex = 0;
  function jump_to_attraction(lng, lat, zoom, city, name){
    if(mutex>0)return;
    getNewMap(lng, lat, zoom);
    clearWeatherAndDetail();
    mutex=2;
    url="/weather/"+city
    $.get(url,function(data,status){
      for(var i = 0; i<data["daily_weather"].length; i++){
        var daily = data["daily_weather"][i];
        var date = daily["date"];
        var weather = daily["weather"];
        
        var title = $("<p></p>").addClass("weather-date").text(date["year"]+"年"+date["month"]+"月"+date["day"]+"日");
        $("#weathers").append(title);
        
        
        var content = $("<div></div>").addClass("weather-data");
        var description = $("<p></p>").addClass("weather-description").text(weather["day_weather"]+"转"+weather["night_weather"]);
        if(weather["daily_weather"]==weather["night_weather"])description.text(weather["day_weather"]);
        var tempure = $("<p></p>").addClass("weather-tempure").text(weather["min_temp"]+"°C--"+weather["max_temp"]+"°C");
        var wind = $("<p></p>").addClass("weather-wind").text(weather["wind_direction"]+weather["wind_level"]+"级");
        content.append(description,tempure,wind);
        $("#weathers").append(content);
        $("#weathers").append("<hr/>");
      }
      $("#weathers").slideDown();
      mutex-=1;
    });
    
    url = "/attractions/"+name;
    $.get(url,function(data,status){
      var img = $("<img></img>").attr("id", "description_pic").attr("src", data["picture"]);
      var content = $("<p></p>").addClass("description-content").text(data["description"]);
      $("#descriptions").append(img, content);
      $("#descriptions").slideDown();
      mutex-=1;
    });
  }
  
  
  //poi
  function refreshPOI(){
    var content = $("#interest_points_content");
    content.html("");
    var user_id = $("#user_id").val();
    url = "/users/"+user_id+"/interest_points";
    $.get(url,function(data,status){
      pois = data["interest_points"];
      for(var i = 0; i < pois.length; i++){
        var poi_content = $("<div></div>").attr("geotable_id", pois[i]["geotable_id"]);
        poi_content.attr("name", pois[i]["name"]).attr("lat", pois[i]["lat"]).attr("lng", pois[i]["lng"]);
        poi_content.attr("zoom", pois[i]["zoom"]).attr("user_id", pois[i]["user_id"]);
        poi_content.addClass("poi-div row");
        var button = $("<a></a>").addClass("poi-jump pointer col-sm-8").text(i+1+"、"+pois[i]["name"]);
        var delete_button = $("<a></a>").addClass("poi-delete pointer col-sm-4").text("删除")
        poi_content.append(button,delete_button);
        content.append(poi_content);
      }
      $(".poi-delete").click(delete_poi);
      $(".poi-jump").click(poi_jump);
    });
  }
  
  function delete_poi(){
    
    var id = $(this).parent().attr("geotable_id");
    var user_id = $(this).parent().attr("user_id");
    var url = url = "/users/"+user_id+"/interest_points_delete/"+id;
    $.get(url,function(data,status){
      if(data["status"]==1)
        refreshPOI();
      else
        alert("删除出错");
    });
  }
  
  function poi_jump(){
    
    var lat = $(this).parent().attr("lat");
    var lng = $(this).parent().attr("lng");
    var zoom = $(this).parent().attr("zoom");
    
    getNewMap(lng,lat,zoom);
  }
  
  
  $("#poi_add").click(function(){
    var longitude = parseFloat($("#now_longitude").val());
    var latitude = parseFloat($("#now_latitude").val());
    var zoom = parseInt($("#now_zoom").val());
    var user_id = $("#user_id").val();
    var name = $("#poi_naming").val();
    if(isNull(name))return;
    var url = url = "/users/"+user_id+"/interest_points";
    var data = {longitude: longitude, latitude: latitude, zoom: zoom, user_id: user_id, name: name};
    $.post(url, data, function(data, status){
      if(data["status"]==1){
        alert("添加成功");
        refreshPOI();
      }
      else
        alert("添加出错");
    });
    
  });
  
  
  // when ready
  refreshPOI();
  if (navigator.geolocation) {
    
     navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      alert("该浏览器不支持定位功能！");
      getNewMap();
  }

});
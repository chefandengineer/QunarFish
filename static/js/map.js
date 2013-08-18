var map = L.map('map').setView([51.505, -0.09], 13);

		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);


		L.marker([51.5, -0.09]).addTo(map)
			.bindPopup("<b>check the sentiment</b><br /> Transportation.").openPopup();

		L.circle([51.508, -0.11], 500, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		}).addTo(map).bindPopup("I am a circle.");

		L.polygon([
			[51.509, -0.08],
			[51.503, -0.06],
			[51.51, -0.047]
		]).addTo(map).bindPopup("I am a polygon.");


		var popup = L.popup();

		function onMapClick(e) {
			popup
				.setLatLng(e.latlng)
				.setContent("You clicked the map at " + e.latlng.toString())
				.openOn(map);
		}

		map.on('click', onMapClick);





// Customized icon for markers that represent different topics

var topic1_icon = L.icon({
    iconUrl: '../images/markers/blue_MarkerA.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



var topic2_icon = L.icon({
    iconUrl: '../images/markers/blue_MarkerB.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



var topic3_icon = L.icon({
    iconUrl:'../images/markers/blue_MarkerC.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});




var topic4_icon = L.icon({
    iconUrl: '../images/markers/blue_MarkerD.png',
  //  shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



var topic5_icon = L.icon({
    iconUrl: '../images/markers/blue_MarkerE.png',
  //  shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



var topic6_icon = L.icon({
    iconUrl: '../images/markers/blue_MarkerF.png',
  //  shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



var buildMapData = function(data){
    var mapData = {};
    for(var i = 0; i < data.length ; i++ ){
        var labelIndex = 0;
        var geoCodes = [];
        var topicLabel = data[i]["distribution"][labelIndex][0];
        while (mapData.hasOwnProperty()){
            labelIndex++;
            topicLabel = data[i]["distribution"][labelIndex][0];
        }
        //Get the list of geocode
        var tweets = data[i]["tweets"];
        for(var j = 0; j < tweets.length; j ++){
            var geoCode =[];
            var geoLocation = tweets[j]["geolocation"];
            var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+ geoLocatioN[0] + ",+" + geoLocation[1] + ",+" + geoLocation[2] + "&sensor=false";
            $.get(url,function(data){
                //Parse the returned json and perform actions correspondently 
                var status  = data["status"];
                if(status == 'ok'){
                    //Get the lat and lng code 
                    var lat = data["geometry"]["location"]["lat"];
                    var lng = data["geometry"]["location"]["lng"];
                    //Set up the marker
                    L.marker([lat, lng]).addTo(map);
                }
            });
        }
    }
}













var input = document.getElementById('input_form');
var defaultZoom = 13;
var initLat;
var initLng;
window.onload = loadNow;

function initAutocomplete(lat, lng, defaultZoom) {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: parseFloat(lat), lng: parseFloat(lng)},
          zoom: defaultZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    
        var infowindow = new google.maps.InfoWindow();

        // Create the search box and link it to the UI element.
        var input = document.getElementById('input_form');
        var searchBox = new google.maps.places.SearchBox(input);
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        
        
    
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          //console.log(places);    
          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          var button = document.getElementById('search_btn');
          
          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
          var infowindow = new google.maps.InfoWindow(); 
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            });
              
            google.maps.event.addListener(marker, 'click', function() {
                if(place.photos){   
                    var photo = place.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
                    var show = "<img border='0' src=" + photo + "><br>";
                } else {
                    var show = "";
                }
                
                if(place.rating) {
                    var rating = '<strong>Rating: </strong>' + place.rating + '<br>';
                } else {
                    var rating = "";
                }
                
                var string = place.formatted_address;
                var address = string.replace(",", "<br>");
                infowindow.setContent('<div>' + show + '<strong>' + place.name + '</strong><br>' + rating + address + '<br></div>');
                infowindow.open(map, this);
                console.log(typeof(place.formatted_address));
                console.log(string.replace(",", " + '<br>' + "))
                
                
            });
            markers.push(marker);  

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });

          map.fitBounds(bounds);
            
          
          
        });
      
        document.getElementById('search_btn').onclick = function () {
        var input = document.getElementById('input_form');

            google.maps.event.trigger(input, 'focus')
            google.maps.event.trigger(input, 'keydown', {
                keyCode: 13
            });
        };
    
        
}

$('#input_form').keypress(function(e) {
    return e.keyCode != 13; 
});

function loadNow() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            initLat = position.coords.latitude;
            initLng = position.coords.longitude;
            initAutocomplete(initLat, initLng, defaultZoom);
        });
    } else {
        console.log("Geolocation is not available.");
    }
}

function userLocationNotFound(){
    initLat = 37.1;
    initLng = -95.7;
    defaultZoom = 3;
    initAutocomplete(initLat, initLng,
                    defaultZoom);
    window.console.log("Fallback set: Lat: " + initLat + " and Lng: " + initLng);
}

setTimeout(function () {
    if(!initLat && !initLng){
        window.console.log("No confirmation from user, using fallback");
        userLocationNotFound();
    }else{
        window.console.log("Location was set");
    }
}, 1000); 

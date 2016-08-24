var input = document.getElementById('input_form');

var height = $(window).height()-50;
$(map).height(height);
window.onload = loadNow;

function initAutocomplete(lat, lng, defaultZoom) {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: parseFloat(lat), lng: parseFloat(lng)},
          zoom: defaultZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    
        var infowindow = new google.maps.InfoWindow();
        var input = document.getElementById('input_form');
        var searchBox = new google.maps.places.SearchBox(input);
    
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
    
        var markers = [];

        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();  
          if (places.length == 0) {
            return;
          }

          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          var button = document.getElementById('search_btn');
          var bounds = new google.maps.LatLngBounds();
            
          places.forEach(function(place) {
          var infowindow = new google.maps.InfoWindow(); 
            if (!place.geometry) {
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

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
                    
            });
            markers.push(marker);  

            if (place.geometry.viewport) {
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
    var defaultZoom;
    var initLat;
    var initLng;
    
    
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            initLat = position.coords.latitude;
            initLng = position.coords.longitude;
            defaultZoom = 13;
            initAutocomplete(initLat, initLng, defaultZoom);
        }, function() { enableHighAccuracy: true; });
    } else {
        initAutocomplete(initLat, initLng, defaultZoom);
        console.log("Geolocation is not available.");
    }

    if((initLat === undefined) && (initLng === undefined) && (defaultZoom === undefined)) {
        initAutocomplete(37.1, -95.7, 3);
    }

}

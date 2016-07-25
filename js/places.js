//Thank you for your interest in a position with Zenefits! I'd like to invite you to complete the first //round in our interviewing process, which is a coding challenge. There isn't any time limit on this, //and you should choose only ONE of the questions below to answer. There isn't a deadline on submitting //this either, but please let me know immediately if you have any pending offers or a short timeline //that I should know about.

//When completing, please keep in mind that your submission should showcase your knowledge of either //Javascript or CSS programming, depending on your strength. We'd love for you to see this challenge as //an opportunity to showcase your programming skills and because of that, one of our engineers will be //diligent in reviewing your code. Also, you are free to build in your own features to show off your //abilities (for example a build system, tests, user accounts / cloud storage, in addition to other //cool features... the sky is the limit!).


//Instructions for Option 1:
//Create a mobile web app that allows you create, edit, and view short notes. Notes are just small //textual items, like to-do lists.
//- Notes should be stored using browser local storage
//- The app should be usable on a standard mobile browser

//Instructions for Option 2:
//Create a web app (desktop or mobile) that provides a query box and a search button and then calls the //Places Library for Google Maps (https://developers.google.com/maps/documentation/javascript/places). //Format the results to give a good user experience.

//Please provide your program as a zip or tar archive, with an index.html file. Use whatever libraries, //documentation, tutorials, or frameworks you consider necessary. This should be a client-side app, //with little or no server code. Please include a README that gives us some relevant info about your //program. 
 
//Once complete, you can submit your finished assignment to the link provided at the bottom of this //email. Or, if you have any problems with uploading, please feel free to email me directly. Thank you!
 
//Please submit here: http://app.greenhouse.io/tests/eb1327dfae39b2d1a8c879197a7acc33

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


var input = document.getElementById('input_form');
window.onload = loadNow;

function initAutocomplete(lat, lng) {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: parseFloat(lat), lng: parseFloat(lng)},
          zoom: 13,
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
                    var show = "<IMG BORDER='0' SRC=" + photo + "><br>";
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
              
             
            //for(var i = 0; i < markers.length; i++){
//                google.maps.event.addListener(place, 'click', function() {
//                    infowindow.setContent(place.name);
//                    infowindow.open(map, this);
//                });
            //}  

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });

          map.fitBounds(bounds);
            
          
          
        });
    
//        function showInfoWindow() {
//            var marker = this;
//            places.getDetails({placeId: marker.placeResult.place_id},
//                function(place, status) {
//                  if (status !== google.maps.places.PlacesServiceStatus.OK) {
//                    return;
//                  }
//                  infoWindow.open(map, marker);
//                  buildIWContent(place);
//                });
//        }
    
            
    
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
        initAutocomplete(position.coords.latitude, position.coords.longitude);
    });
    } else {
        console.log("Geolocation is not available.");
    }
}

//google.maps.event.addDomListener(window, 'load', initialize);
function slow_scroll() {
  $('.navbar .nav li').click(function(e){
    e.preventDefault();

    $('html, body').animate({
       scrollTop: $($(this).find('a').attr('href')).offset().top + 5}, 800
    )
  })
}

function search_validation(){
  $('#locations form button').addClass('disabled');

  $('#locations form #location').on('keyup', function() {
    var details = $.trim($(this).val());

      if (details.length > 3) {
        $('#locations form button').removeClass('disabled');
      }
      else if (details.length <= 3) {
        $('#locations form button').addClass('disabled');
      }
  })

  if ($(window).width() < 767) {
    $('#locations form .row').find('.col-xs-6').removeClass('col-xs-offset-3');
    $('#locations form .row').find('.col-xs-6').addClass('col-xs-10');
    $('#locations form .row').find('.col-xs-6').removeClass('col-xs-6');
  }
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    $('#locations #location_results').hide();
    $('#locations table tbody').empty();

    for (var i = 0; i < results.length; i++) {
      var place = results[i];

      var name = place.name;
      var address = place.formatted_address;

      $('#locations table tbody').append('<tr class="text-left"><td>'+(i+1)+'</td><td>'+name+'</td><td>'+address+'</td></tr>');
    }

    $('#locations #begin_search').hide();
    $('#locations #no_results').hide();
    $('#locations #location_results').show();

    $('html, body').animate({
       scrollTop: $('#locations').offset().top + 5}, 800
    )
  }
}

function find_crossfit_locations() {
  $('#locations form #location').geocomplete()
  .bind("geocode:result", function(event, result){
    $('#locations form').submit();
  })
  

  $('#locations form').submit(function(e){
    e.preventDefault();

    geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': $('#locations form #location').val()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var location = results[0].geometry.location;

        var request = {
          location: location,
          radius: '75',
          query: 'crossfit'
        };

        map = new google.maps.Map(document.getElementById('map'), {
          center: location,
          zoom: 15
        });

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);

      } else {
        $('#locations #location_results').hide();
        $('#locations #begin_search').hide();
        $('#locations #no_results').fadeIn();
      }
    });

  })
}
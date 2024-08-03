$(document).ready(function () {
  const apiKey = "0f7e0fd83e534e78a6321902240308";
  const searchUrl = "https://api.weatherapi.com/v1/search.json";
  const currentWeatherUrl = "https://api.weatherapi.com/v1/current.json";

  $("#cityInput").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: searchUrl,
        dataType: "json",
        data: {
          key: apiKey,
          q: request.term,
        },
        success: function (data) {
          response(
            $.map(data, function (item) {
              return {
                label: item.name + ", " + item.region + ", " + item.country,
                value: item.name,
              };
            })
          );
        },
      });
    },
    minLength: 3,
    select: function (event, ui) {
      getWeatherData(ui.item.value);
    },
  });

  $("#searchBtn").click(function () {
    const city = $("#cityInput").val();
    if (city) {
      searchLocation(city);
    }
  });

  $("#cityInput").keypress(function (e) {
    if (e.which === 13) {
      const city = $("#cityInput").val();
      if (city) {
        searchLocation(city);
      }
    }
  });

  function searchLocation(query) {
    $.ajax({
      url: searchUrl,
      method: "GET",
      data: {
        key: apiKey,
        q: query,
      },
      success: function (response) {
        $("#weatherInfo").empty();
      },
      error: function () {
        alert("Error searching for location. Please try again.");
      },
    });
  }

  function displaySearchResults(results) {
    const $searchResults = $("#searchResults");
    $searchResults.empty();

    if (results.length === 0) {
      $searchResults.html("<p>No results found.</p>");
      return;
    }

    results.forEach(function (location) {
      const $card = $('<div class="location-card">')
        .append($("<h3>").text(location.name))
        .append($("<p>").text(location.region))
        .append($("<p>").text(location.country));

      $card.click(function () {
        getWeatherData(location.name);
      });

      $searchResults.append($card);
    });
  }

  function getWeatherData(location) {
    $.ajax({
      url: currentWeatherUrl,
      method: "GET",
      data: {
        key: apiKey,
        q: location,
      },
      success: function (response) {
        displayWeatherData(response);
      },
      error: function () {
        alert("Error fetching weather data. Please try again.");
      },
    });
  }

  function displayWeatherData(data) {
    const $weatherInfo = $("#weatherInfo");
    $weatherInfo
      .empty()
      .append(
        $("<h2>").text(data.location.name + ", " + data.location.country),
        $("<div>")
          .addClass("weather-icon")
          .append($("<img>").attr("src", data.current.condition.icon)),
        $("<p>").html(
          '<i class="fas fa-thermometer-half"></i> Temperature: ' +
            data.current.temp_c +
            "°C"
        ),
        $("<p>").html(
          '<i class="fas fa-cloud"></i> Condition: ' +
            data.current.condition.text
        ),
        $("<p>").html(
          '<i class="fas fa-tint"></i> Humidity: ' + data.current.humidity + "%"
        ),
        $("<p>").html(
          '<i class="fas fa-wind"></i> Wind: ' + data.current.wind_kph + " km/h"
        ),
        $("<p>").html(
          '<i class="fas fa-meteor"></i> Feels like: ' +
            data.current.feelslike_c +
            "°C"
        )
      );
  }

  function showInitialMessage() {
    $("#weatherInfo").html(`
        <div class="initial-message">
          <i class="fas fa-map-marker-alt"></i>
          <p>Enter a city name to get the weather information</p>
        </div>
      `);
  }

  showInitialMessage();
});

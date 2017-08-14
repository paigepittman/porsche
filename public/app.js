// Grab the promotions as a json
$.getJSON("/promotions", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    console.log(data[i]);

    /////// for displaying images ///////

    // var promoImage = $("<div>");
    // promoImage.attr("class", "promo-image");
    // promoImage.attr("id", data[i]._id);
    // promoImage.append("<img src=" + data[i].image + "/>");
    // $("#promotions").append(promoImage);


    /////// for displaying promo info//////

    //trims the promo string down and adds "..." - eventually will have a click to view full promo
    var promoSplit = data[i].promo.split(" ", 15);
    var promoShort = promoSplit.join(" ") + "...";

    var promoInfo = $("<div>");
    promoInfo.append("<strong>" + data[i].location + "<strong/>");
    promoInfo.append(promoShort);
    $("#promotions").append(promoInfo);

   }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Promotion
  $.ajax({
    method: "GET",
    url: "/promotions/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the promotion
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the promotion saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the promotion
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the promotion from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/promotions/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

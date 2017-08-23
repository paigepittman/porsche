var orderArray = [];
var locations = [];


// $(document).ready(function() {
//     $('#modal1').modal();
// });
// Grab the promotions as a json
$.getJSON("/promotions", function(data) {
  $("#promotions").append("<th> LOCATION </th>  <th> NUMBER OF PROMOTIONS </th>");

  /////for TESTING DO NOT KEEP////////
  // for (var i = 0; i < data.length; i++) {
  //   var promoInfo = $("<tr>" + "<td>" + "<a class ='location' data-name=" + data[i].location + ">" + data[i].location + "</a>" + "<td/>" + "<td>" + data[i].title + "</td>" +  "<td>" + "</tr>");
  //   $("#promotions").append(promoInfo);
// }

  // For each one

  console.log(data.length)
  console.log(data)


  data.forEach(function(el) {

    if (locations.indexOf(el.location) === -1) {
      locations.push(el.location);
      var locationPromos = promoCheck(el.location);

      }
    });


  });



  function promoCheck(location) {


    $.ajax({
      method: "GET",
      url: "/promotions/" + location
    })
      // With that done, add the note information to the page
      .done(function(data) {
        if (data.length <= 3) {
          var locationRow = $("<tr><td>" + "<a class ='location' data-name=" + location + ">" + location + "</a>" + "</td>" + "<td>" + "<span style='color:red'>" + data.length + "</span></td></tr>");
          $("#promotions").append(locationRow);
        } else {
          var locationRow = $("<tr><td>" + "<a class ='location' data-name=" + location + ">" + location + "</a>" + "</td>" + "<td>" + data.length + "</td></tr>");
          $("#promotions").append(locationRow);
        }

  });

};

    /////// for displaying images ///////

    // var promoImage = $("<div>");
    // promoImage.attr("class", "promo-image");
    // promoImage.attr("id", data[i]._id);
    // promoImage.append("<img src=" + data[i].image + "/>");
    // $("#promotions").append(promoImage);


// Whenever someone clicks a location
$(document).on("click", ".location", function() {

  var locationID = $(this).attr("data-name");
  $("#promotions").html("");
  $("store-selected").html(locationID);
  $.ajax({
    method: "GET",
    url: "/promotions/" + locationID
  })
    .done(function(data) {

      console.log(data);

        $("#promotions").append("<th> TITLE </th> <th> PROMO </th> <th> IMAGE </th>");
        // For each one
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].image);


          /////// for displaying promo info//////

          //trims the promo string down and adds "..." - eventually will have a click to view full promo
          var promoSplit = data[i].promo.split(" ", 8);
          var promoShort = promoSplit.join(" ") + "...";
          var imageDiv = $("<img>");
          imageDiv.attr("src", data[i].image);

          var promoInfo = $("<tr>" + "<td>" + data[i].title + "</td>" + "<td>" + "<a class=promo-full id=" + data[i]._id + ">" + promoShort.trim() + "</a>" + "<td>" + "<img src=" + data[i].image + "/>" + "</td></tr>");
          $("#promotions").append(promoInfo);


    };
    $("#buttons").html("<button id='exportButton'> export PDF </button>");

  });
});

// When you click the savenote button
$(document).on("click", ".promo-full", function() {
 $('#modal1').modal();

  // Grab the id associated with the promotion from the submit button
  var promoId = $(this).attr("id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/fullpromo/" + promoId

  })
    .done(function(data) {
      console.log("done")
      console.log(data.promo)
      // Modal Trigger
/* <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a> */
// Modal Structure
        $('#modal1').modal("open");
        $("#modal-content").html(data.promo);
      // var modal = &$("<div id='modal1' class='modal'>"
      //             + "<div class='modal-content'>"
      //             + "<h4>Modal Header</h4>"
      //             + "<p>A bunch of text</p>"
      //             + "</div>"
      //             + "<div class='modal-footer'>"
      //             + "<a href='#!' class='modal-action modal-close waves-effect waves-green btn-flat'>Agree</a>"
      //             + "</div>"
      //             + "</div>");

    });


});


    var specialElementHandlers = {
        '#editor': function (element,renderer) {
            return true;
        }
    };
 $('#exportButton').click(function () {
        var doc = new jsPDF();
        doc.fromHTML($('#target').html(), 15, 15, {
            'width': 170,'elementHandlers': specialElementHandlers
        });
        doc.save('sample-file.pdf');
    });


/////Testing exporting table to excel

        // $(document).on("click", "#exportButton", function () {
        //     // parse the HTML table element having an id=exportTable
        //     var dataSource = shield.DataSource.create({
        //         data: "#promotions",
        //         schema: {
        //             type: "table",
        //             fields: {
        //                 Title: { type: String },
        //                 Promo: { type: String },
        //                 Image: { type: String }
        //             }
        //         }
        //     });
        //
        //     // when parsing is done, export the data to Excel
        //     dataSource.read().then(function (data) {
        //         new shield.exp.OOXMLWorkbook({
        //             author: "PrepBootstrap",
        //             worksheets: [
        //                 {
        //                     name: "PrepBootstrap Table",
        //                     rows: [
        //                         {
        //                             cells: [
        //                                 {
        //                                     style: {
        //                                         bold: true
        //                                     },
        //                                     type: String,
        //                                     value: "Name"
        //                                 },
        //                                 {
        //                                     style: {
        //                                         bold: true
        //                                     },
        //                                     type: String,
        //                                     value: "Age"
        //                                 },
        //                                 {
        //                                     style: {
        //                                         bold: true
        //                                     },
        //                                     type: String,
        //                                     value: "Email"
        //                                 }
        //                             ]
        //                         }
        //                     ].concat($.map(data, function(item) {
        //                         return {
        //                             cells: [
        //                                 { type: String, value: item.Title },
        //                                 { type: String, value: item.Promo },
        //                                 { type: String, value: item.Image }
        //                             ]
        //                         };
        //                     }))
        //                 }
        //             ]
        //         }).saveAs({
        //             fileName: "PrepBootstrapExcel"
        //         });
        //     });
        // });

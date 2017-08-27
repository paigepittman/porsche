var orderArray = [];
var locations = [];







$("#scrape-button").on("click", function() {
  $("#scrape-button").css("visibility", "hidden");
  $(".preloader-wrapper").css("visibility", "visible");

  $.get("/scrape")
  .then(function(data) {
    console.log("DONE")


    });
  });




// Grab the promotions as a json
function displayStores() {
  console.log("stores")
  $.getJSON("/promotions", function(data) {
    $("#promotions").append("<th> LOCATION </th>  <th> ALL SPECIALS </th> ");

    // console.log(data.length)
    // console.log(data)


    data.forEach(function(el) {

      if (locations.indexOf(el.location) === -1) {
        locations.push(el.location);
        var locationPromos = promoCheck(el.location);

        }
      });

    });
}


  function promoCheck(location) {


    $.ajax({
      method: "GET",
      url: "/promotions/" + location
    })

      .done(function(data) {

        // var newSpecials = [];
        // var usedSpecials = [];
        // var serviceSpecials = [];
        // var partsSpecials = [];
        //
        // function checkCategory() {
        //   for (var i = 0; i < data.length; i++) {
        //
        //     if (data.category === "new") {
        //       newSpecials.push(data[i]);
        //     }
        //     else if (data.category === "used") {
        //       usedSpecials.push(data[i]);
        //     }
        //     else if (data.category === "service") {
        //       serviceSpecials.push(data[i]);
        //     }
        //     else if (data.category === "parts") {
        //       partsSpecials.push(data[i]);
        //     };
        //
        //   }
        // }



        if (data.length <= 3) {
          var locationRow = $("<tr><td>" + "<a class ='location' data-name=" + location + ">" + location + "</a>" + "</td>" + "<td>" + "<span style='color:red'>" + data.length + "<td>" +  "</td></tr>");
          $("#promotions").append(locationRow);
        } else {
          var locationRow = $("<tr><td>" + "<a class ='location' data-name=" + location + ">" + location + "</a>" + "</td>" + "<td>" + data.length + "</td></tr>");
          $("#promotions").append(locationRow);
        }

  });

};

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
        $("#promotions").append("<th> TITLE </th> <th> CATEGORY </th> <th> PROMO </th> <th> IMAGE </th>");
        // For each one
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].image);


          /////// for displaying promo info//////

          //trims the promo string down and adds "..." - eventually will have a click to view full promo
          var promoSplit = data[i].promo.split(" ", 8);
          var promoShort = promoSplit.join(" ") + "...";
          var imageDiv = $("<img>");
          imageDiv.attr("src", data[i].image);

          var promoInfo = $("<tr>" + "<td>" + data[i].title + "</td>" + "<td>" + data[i].category + "</td><td>" + "<a class=promo-full id=" + data[i]._id + ">" + promoShort.trim() + "</a>" + "<td>" + "<img src=" + data[i].image + "/>" + "</td></tr>");
          $("#promotions").append(promoInfo);


    };
    // $("#buttons").html("<button id='exportButton'> export PDF </button>");
    // $("#promotions").attr("class", "striped");

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
// Modal Structure
        $('#modal1').modal("open");
        $("#modal-content").html(data.promo);

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

$(document).ready(function() {


  $.get("/api" + window.location.pathname, {
    profileID: window.localStorage.getItem("profileID")
  }).then(function(data) {

    var sellerID = data.ProfileId;
    $('.nameText').html(data.item_name);
    $('.darkText').html(data.item_description);
    $('#carousel1').attr('src', data.item_img1);
    $('#carousel2').attr('src', data.item_img2);
    $('#carousel3').attr('src', data.item_img3);



    //flag the other user's item
    $(document).on("click", ".flagBtn", function(event) {
      event.preventDefault();


      var pathArray = window.location.href.split('/');
      console.log(pathArray);
      var qstring = pathArray[4];

      $.post("/api/flagItem/" + qstring, {
        // flagged: 3,
      }).then(function(data){
        event.preventDefault();
      });
      // swal alert
      swal({
        title: "Are you sure?",
        text: "Only flag listings that are innappropriate or offensive.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("Thank You!", "Your report has been submitted.", {
            icon: "success",
          });
        }
      });
    });

    //unflag the other user's item
    $(document).on("click", ".unFlagBtn", function(event) {
      event.preventDefault();


      var pathArray = window.location.href.split('/');
      console.log(pathArray);
      var qstring = pathArray[4];

      $.post("/api/unFlagItem/" + qstring, {
        // flagged: 3,
      }).then(function(data){
        event.preventDefault();
      });
      alert("You have unflagged this item.");

    });



    //edit item
    $(document).on("click", "#editListing", function(event) {

      var pathArray = window.location.href.split('/');
      console.log(pathArray);
      var qstring = pathArray[4];
      $("#hdnId").attr("value", qstring);

    });

    //delete item
    $(document).on("click", "#deleteItem", function(event){
      event.preventDefault();
      if (confirm("Are you sure you want to delete this item?") === true){
        var pathArray = window.location.href.split('/');
        console.log(pathArray);
        var qstring = pathArray[4];
        $.post("/api/deleteItem/" + qstring, {
          profileID: window.localStorage.getItem("profileID"),
        }).then(function(data){
          window.location.href = "/profile";
        });
      }

    });


      //if yours of item  is you
      if (data.ProfileId === parseInt(window.localStorage.getItem("profileID"))) {

        console.log("matched");
        $(".sellerBtn").remove();
        $(".sellerBtnSubmit").remove();

      }
      //if others
      else {

        console.log("not matched");
        $(".ownerBtn").remove();
        $('select').material_select('destroy');



        $.post("/api/allListings", {
          profileID: window.localStorage.getItem("profileID")
        }).then(function(data) {
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            // var value = "some value";
            console.log(data[i].id);
            $("#selectDropdown").append(
              $("<option></option>")
              .prop("value", data[i].id)
              .text(data[i].item_name)
              .attr("data-icon", data[i].item_img1)
              .attr('class', 'circle left')

            );

            //intialize
            $('select').material_select();
          }
          $('.swapBtn').on('click', function(event) {
            event.preventDefault();
            var x = $("#selectDropdown").val();
            console.log(x);
            var pathArray = window.location.pathname.split('/');
            console.log(pathArray);
            $.post("/api/makeOffer/" + pathArray[2] + "/" + sellerID + "/" + x, {

              profileID: window.localStorage.getItem("profileID")

            }).then(function(data) {


              $('.sellerBtn').empty();
              $('.sellerBtnSubmit').attr("class", "waves-effect waves-light btn pulse orange seeBidBtn");
              $('.sellerBtnSubmit').empty();
              $('.seeBidBtn').html("See your bid");


              $('.seeBidBtn').on("click", function(event) {
                event.preventDefault();
                window.location.href = "/profile/?offers";

              });
            });
          });

        });

      }

    });

  $('.carousel').carousel();

});

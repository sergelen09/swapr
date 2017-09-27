$.post("/", {
  token: window.localStorage.getItem("token")
}).then(function(data) {

  if (!data) {

    window.localStorage.clear();
    window.location.href = "/";

  } else {


    var config = {
      apiKey: "AIzaSyAvfQNHxo8df0lNiPlMWFgu95tBl8rd8Eg",
      authDomain: "class-test-829c1.firebaseapp.com",
      databaseURL: "https://class-test-829c1.firebaseio.com",
      projectId: "class-test-829c1",
      storageBucket: "class-test-829c1.appspot.com",
      messagingSenderId: "38207736538"
    };

    firebase.initializeApp(config);


    var userData = firebase.database();


    $("#add-msg-btn").on("click", function() {



      var user = data.avatar;
      var messages = $("#message-input").val().trim();

      var newTrain = {

        name: user,
        message: messages,
      };

      userData.ref().push(newTrain);


      $("#message-input").val("");
      return false;

    });

    userData.ref().on("child_added", function(childSnapshot, prevChildKey) {

      console.log(childSnapshot.val());

      var userName = childSnapshot.val().name;
      var userMessage = childSnapshot.val().message;


      $("#msg-table > tbody").append("<tr><td><img id='avatarImg' class='circle' src='" + userName + "'></td><td><div class='chatMessage'>" + userMessage + "</div></td></tr>");
      updateScroll();

    });

  }

});


function updateScroll(){
    var element = document.getElementById("Convos");
    element.scrollTop = element.scrollHeight;
}

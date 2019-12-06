// Initialize Firebase
var config = {
    apiKey: "AIzaSyA-XVbAWx6_lxo7sVGBWL1f4Esl7hPFSw8",
    authDomain: "train-schedular-3c7ca.firebaseapp.com",
    databaseURL: "https://train-schedular-3c7ca.firebaseio.com",
    storageBucket: "train-schedular-3c7ca.appspot.com",
    messagingSenderId: "937832961080"
};
firebase.initializeApp(config);
var database = firebase.database();
$('#addTrainBtn').on("click", function () {
    // take user input
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequencyInput").val().trim();
    // to create local temporary object to hold train data
    var newTrain = {
        name: trainName,
        place: destination,
        ftrain: firstTrain,
        freq: frequency
    }
    // uploads train data to the database
    database.ref().push(newTrain);
    console.log(newTrain.name);
    // clears text boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");
    // Prevents moving to new page
    return false;
});
//  Created a firebase event listner for adding trains to database and a row in the html when the user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());
    // Now we store the childSnapshot values into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().place;
    var firstTrain = childSnapshot.val().ftrain;
    var frequency = childSnapshot.val().freq;
    // first Train pushed back to make sure it comes before current time
    var firstTimeConverted = moment(firstTrain, "HH:mm");
    console.log(firstTimeConverted);
    var currentTime = moment().format("HH:mm");
    console.log("CURRENT TIME: " + currentTime);
    // store difference between currentTime and fisrt train converted in a variable.
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(firstTrain);
    // find Remainder of the time left and store in a variable
    var timeRemainder = timeDiff % frequency;
    console.log(timeRemainder);
    // to calculate minutes till train,we store it in a variable
    var minToTrain = frequency - timeRemainder;
    // next train
    var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");
    $("#trainTable>tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + nxTrain + "</td><td>" + frequency + "</td><td>" + minToTrain + "</td></tr>");
});
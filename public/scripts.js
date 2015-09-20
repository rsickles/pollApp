// code from class example is used below and configured for assignment

function doXMLHttpRequest() {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange=function()  {
   if (xhr.readyState==4) {
     if(xhr.status == 200) {
        processResponse(xhr.responseText);
    } else {
      responseArea.innerHTML="Error code " + xhr.status;
    }
   }
  }
  xhr.open("GET", "data.json", true);
  xhr.send(null);
  }

  function processResponse(responseJSON) {
        var responseObject = JSON.parse(responseJSON);
        var displayText =
                "You have "
                + responseObject.homework.length
                + " assignments Received From Server!";
        document.getElementById("responseArea").innerHTML = displayText;
        $('#responseArea').css("color", "red").show("slow");
        //now to fill table with data
        var table = document.getElementById('assignments');
        for (var i = 0; i<responseObject.homework.length; i++) {
                var row = document.createElement("TR");
                var homework = responseObject.homework[i];

                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);

                // Add some text to the new cells:
                cell1.innerHTML = homework.className;
                cell2.innerHTML = homework.assignment;

                table.appendChild(row);
                }
        $('#assignments').slideUp('slow');
}

// 7 jquery methods used, 2 used with chaining


    // JQUERY SCRIPT

  $(function() {  // do once original document loaded and ready
        $('#grades').hide();
        $('#assignments').hide();
        $('#message' ).fadeIn( "slow");
        $('#jquery').click(function() {
                $.getJSON("DataTwo.json", function(responseObject, diditwork) {
                        console.log(diditwork);
                        var table = document.getElementById('grades');
                        for (var i = 0; i<responseObject.grades.length; i++) {
                                var object = responseObject.grades[i];
                                var row = document.createElement("TR");

                                var cell1 = row.insertCell(0);
                                var cell2 = row.insertCell(1);

                                // Add some text to the new cells:
                                cell1.innerHTML = object.className;
                                cell2.innerHTML = object.grade;

                                table.appendChild(row);

                                }
                                $('#grades').slideDown('slow');

                                $('#message').css("color", "red").text("DO BETTER!");
                } );  // getJSON
        } );  // click
  } ); // onReady

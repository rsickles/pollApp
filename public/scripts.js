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
                + " assignments";
        document.getElementById("responseArea").innerHTML = displayText;

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
}
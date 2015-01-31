function getGists(form) {
  console.log('inside getGists'); //lets me know I am inside it
  console.log(form);  //lets me know what form


  var pageCount = form.pagecount.value;
  pageCount = parseInt(pageCount); //change from a string to an integer

  console.log("page count: %d", pageCount); //check to make sure page count is working


  //new array to hold the language values
  var languagesArray = new Array();
  
  var i;

  for (i = 0; i < form.languages.length; ++i) {
    if (form.languages[i].checked) {
      languagesArray.push(form.languages[i].value);
    }
  }

  console.log("languages: %o", languagesArray);

  //STEP 1: Make an HTTP request
  var httpRequest;

  if (window.XMLHttpRequest) {
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    httpRequest = new ActiveXObject ("Microsoft.XMLHTTP");
  }

  //tell what to do after you receive the server response to request
  httpRequest.onreadystatechange = function(){
    var responseString;
    //STEP 2: Handling the server response
    //check for the state of the request
    if (httpRequest.readyState === 4) {
      //everything is good!
      //check if the response code of the HTTP server response
      if (httpRequest.status === 200) {
        //everything is good!
        responseString = httpRequest.responseText;

        //console.log(responseString); //for testing

        //STEP 5
        var response = JSON.parse(responseString);

        //make response filtered
        response = filterResponse(response, languagesArray);

        printResponse(response);

      } else {
        //there was a problem
        alert("There was a problem in the response code.");
      }
    } else {
      //still not ready
    }

  };

  //actually make the request via GET method, and building the URL I am requesting
  httpRequest.open('GET', "https://api.github.com/gists"+"?page="+pageCount, true);
  httpRequest.send(null);



}

function filterResponse (response, languagesArray) {
  var i, j, k;
  var filteredResponse = new Array();
  var havePushedResponse = false;

  if (languagesArray.length === 0) {
    filteredResponse = response;
  }
  else {
    //march through the response
    for (i = 0; i < response.length; ++i) {
      havePushedResponse = false;
      //for each response, march the keys in the files object
      for (k in response[i].files) {
        //for each key in the file object, march through the languages array
        for (j = 0; j < languagesArray.length; ++j) {
          if (response[i].files[k].language === languagesArray[j]) {
            filteredResponse.push(response[i]);
            havePushedResponse = true;
            break;
          }        
        }
        if (havePushedResponse) {
          break;
        }
      }
    }
  }
  console.log (filteredResponse);
  return filteredResponse;
}

function printResponse (response) {
  var list = document.getElementById("results");
  var i;
  
  list.innerHTML = " ";

  for(i = 0; i< response.length; ++i) {
    var gistLabel = "<br>Gist " + (i+1) +": <br>";
    var gistUrl = "URL: " + response[i].url + "<br>";
    var gistDescription = "Description: " + response[i].description + "<br>";
  
    var listItem = document.createElement("li");
    listItem.innerHTML = gistLabel + gistUrl + gistDescription;

    list.appendChild(listItem);
  } 

}








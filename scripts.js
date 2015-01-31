function getGists(form) {
  var pageCount = form.pagecount.value;
  pageCount = parseInt(pageCount); //change from a string to an integer


  //new array to hold the language values
  var languagesArray = new Array();
  
  var i;

  for (i = 0; i < form.languages.length; ++i) {
    if (form.languages[i].checked) {
      languagesArray.push(form.languages[i].value);
    }
  }

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


        //STEP 5
        var response = JSON.parse(responseString);

        //make response filtered
        response = filterResponse(response, languagesArray);

        printResponse(response);
        printFavorites();

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
  var i, j, k, f;
  var filteredResponse = new Array();
  var havePushedResponse = false;
  var isInFavorites = false;
  var favorites = getFavorites();

  //march through the response
  for (i = 0; i < response.length; ++i) {
    havePushedResponse = false;
    isInFavorites = false;

    for (f = 0; f < favorites.length; ++f) {
      if (favorites[f] === (response[i].html_url + "~~" + response[i].description)) {
        isInFavorites = true;
        break;
      }
    }

    if (isInFavorites) {
      continue;
    }

    if (languagesArray.length === 0) {
      filteredResponse.push(response[i]);
    } else {
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
  
  return filteredResponse;
}

function printResponse (response) {
  var list = document.getElementById("results");
  var i;
  
  list.innerHTML = " ";

  for(i = 0; i< response.length; ++i) {
    var buttonValue = (response[i].html_url + "~~" + response[i].description);
    var favoritesButton = '<button onclick="addToFavorites(this);" value="'+ buttonValue + '">Add to favorites</button>';
    var gistLabel = "<br>Gist " + (i+1) +": <br>";
    var gistUrl = "URL: " +"<a target=\"_blank\" href=\""+ response[i].html_url +"\">"+ response[i].html_url + "</a>"+"<br>";
    var gistDescription = "Description: " + response[i].description + "<br>";
  
    var listItem = document.createElement("li");
    listItem.innerHTML = favoritesButton + gistLabel + gistUrl + gistDescription;

    list.appendChild(listItem);
  } 

}

function addToFavorites(button) {
  var favorites = getFavorites();

  favorites.push(button.value);

  localStorage.setItem("favorite-gists", JSON.stringify(favorites));

  getGists(document.getElementsByTagName("form")[0]);
}

function getFavorites() {
  var storedFavorites = localStorage.getItem("favorite-gists");
  var favorites = new Array();
  if (storedFavorites != null) {
    favorites = JSON.parse(storedFavorites);
  }

  return favorites;
}

function printFavorites() {
  var favoritesList = document.getElementById("favorites");
  var favorites = getFavorites();

  favoritesList.innerHTML = '';

  for (var i = 0; i < favorites.length; ++i) {
    var favoriteParts = favorites[i].split('~~');
    var gistUrl = "URL: " +"<a target=\"_blank\" href=\""+ favoriteParts[0] +"\">"+ favoriteParts[0] + "</a>"+"<br>";
    var gistDescription = "Description: " + favoriteParts[1] + "<br>";
    var listItem = document.createElement("li");
    listItem.innerHTML = gistUrl + gistDescription;

    favoritesList.appendChild(listItem);

  }

}

























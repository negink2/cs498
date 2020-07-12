function getData(){
    var url = "https://covid.ourworldindata.org/data/owid-covid-data.csv";
    var promise = readCSVFile(url);
    promise.then(function(csv){
        var csvStr = csv.toString();
        console.log(csv);
        var data = convertCSVtoJSON(csvStr);
        //console.log(data);
        /*countries = getCountries(data);
        var selectedDataDef = getSelectedCountryData(data, selectedCountry);
        $.when(selectedDataDef).done(function(d){
            console.log(d);
            render(d);
        }); */                      
    });
}

function readCSVFile(url){
    return $.ajax({
        type: "GET",
        url: url,
        //type: "json",
        //dataType: "text",
        crossDomain: true,
        //dataType: 'jsonp'
        headers: {
            //'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Headers": "origin, content-type, accept, authorization",
            'Content-Type': 'application/json'}
        });
}


function convertCSVtoJSON(csv){

    var lines=csv.split("\n");
  
    var result = [];
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
  
    //return result; //JavaScript object
    return JSON.parse(JSON.stringify(result)); //JSON
  }

  function getCountries(data){
      var countriesObj = [];
      if(data !== undefined && data != null && data.length > 0){
          data.forEach(function(item){
              if(!countriesObj.includes(item.location)){
                countriesObj.push(item.location);
              }
          });
      }
      if(countriesObj.length > 0){
          return countriesObj;
      }
  }

  function getSelectedCountryData(data, country){
      var filteredData = [];
      if(data !== undefined && data != null && data.length > 0
        && country !== undefined && country != null && country != ""){
            data.forEach(function(item){
                if(item.location == country){
                    filteredData.push(item);
                }
            });            
        }
        return filteredData;
  }

  var intervalId = 0;
  function flashCountrySelector(){            
    var countryDropdown = document.querySelector(".country-dropdown");
    var selectedCountry = countryDropdown.options[countryDropdown.selectedIndex].value;
    var interval = 0;
    var countrySelector = document.querySelector(".arrow-down");
    if(selectedCountry == "Please select a country" && intervalId == 0){
        intervalId = window.setInterval(function(){
            countrySelector.style.opacity = Math.abs(Math.sin(interval));
            interval += 0.01;
        }, 5);
    }
    else{
        countrySelector.style.opacity = 0;
        window.clearInterval(intervalId);
        intervalId = 0;
    }
}
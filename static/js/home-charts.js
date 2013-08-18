

var time_series_chart = function(){

        $('#container').highcharts('StockChart', {
            rangeSelector : {
                selected : 1
            } 
        });
}

var basic_chart = function (data,xaxis){  
    $('#container').highcharts({
            chart: {
                type: 'line',
                marginRight: 10,
                marginBottom: 25
            },
            title: {
                text: 'Sentiment Score For Topic Train',
                x: -20 //center
            },
            xAxis: {
                categories: xaxis
            },
            yAxis: {
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip:{
              //  valuePrefix: "Sentiment:"
            },
            legend:{
                enabled:false
            },
            series: [data]
        });
}

var last_y = -1000;
var high_y = -1000;
var low_y = 1000;
var sum = 0;
var count = 0;
var avg_y = 0;


var dynamic_chart = function () {

    $(document).ready(function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    
        var chart;
        $('#container').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function() {
    
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            //var x = (new Date()).getTime(), // current time
                             //   y = Math.random();
                             if(index < sortedChartsDataEntry.length){
                                 var x_y = sortedChartsDataEntry[index];                         
                                 var x = x_y[0].getTime();
                                 var y = x_y[1];
                                 series.addPoint([x,y], true, true);
                                 showstats(x_y);  
                                 index++;
                                }

                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live Transportation Sentiment'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                dateTimeLabelFormats: {
                    day: '%Y-%m-%d'
                }
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        //show the corresponding topics 
                        set_topic(this.x);      
                        var emoticon = this.y >= 0.09 ? " :-)" : " :-(";
                        var tooltip = '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d', this.x) +' '+
                        Highcharts.numberFormat(this.y, 4) + emoticon;  
                        return tooltip;
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Sentiment Polarity Score',
                data: (function() {
                    // generate an array of random data
                    var data = [];
                    for (index = 0; index < sortedChartsDataEntry.length && index < 20; index++) {
                        data.push({
                            x: sortedChartsDataEntry[index][0].getTime(),
                            y: sortedChartsDataEntry[index][1]
                        });
                    }
                 //   console.log(data);
                    return data;
                })()
            }]
        });
    });
    
}


var pie_charts = function () {
        $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
             text: 'Topics'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['Bike',   45.0],
                    ['Car',       26.8],
                    {
                        name: 'Traffic',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['Jam',    8.5],
                    ['Accident',     6.2],
                    ['Others',   0.7]
                ]
            }]
        });
}

var map_charts = {  chart: {
                type: 'line',
                marginRight: 130,
                marginBottom: 25
            },
            title: {
                text: 'Transporation Sentiment',
                x: -20 //center
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Sentiment Score'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }]
        };
/******************************************************************************************************************/
//End of charts part
/******************************************************************************************************************/




/******************************************************************************************************************/
//Starts of first page javascript
/******************************************************************************************************************/
//File URLs
var domain = "http://localhost:8000/transportation/";
var month = "data/2013-02";
//var domain = "http://transportation.heinz.cmu.edu/";
var sentimentFile = domain + 'data/2013-02/sentiment_results.json';
var wordcloudFile = domain + 'data/2013-02/pennsylvania_word_cloud_results.json';
var topicTrainFile = domain + 'data/2013-02/topic_connection_results.json';
var topUsersFile =   domain + 'data/2013-02/st_top_users.json';
var topLocationFile = domain + 'data/2013-02/st_top_cis.json';

var wordloucFileSuffix = '_word_cloud_results.json';
var first_visit = true;
//Load the files 

var loadFile = function(month_passed){
    month = "data/2013-" + month_passed;
    var stateInString = "/" + current_state.replace(" ","_");
    sentimentFile = domain + month + "/sentiment_results.json";
    topicTrainFile = domain + month + "/topic_connection_results.json";
    topUsersFile = domain + month + "/st_top_users.json";
    topLocationFile = domain + month + '/st_top_cis.json';
    wordcloudFile = domain + month + stateInString + wordloucFileSuffix;

    load_data(current_state);
}

//Convert the string to state 
//(u'alabama', u'united states')
var getState = function(stringKey){
    var matches = stringKey.match(/\(u\'(\w+).+$/);
    var state = matches[1];
    return state;   
}

var getStateKey = function(state){
    state = state.toLowerCase();
    var statekey = '(u\'' + state +  '\', u\'united states\')';
    return statekey;
}
/*********************************************************/
//Show Dynamic Charts 
/*********************************************************/        
//load data for a choosen state
var sentiments = '';
var cities = '';
var topics = '';
var users = '';

var load_content = function(sentiments,cities,topics,users,state) {
    
    $("#state").text(titleFormat(state));
    sentiments = sentiments;
    cities = cities;
    topics = topics;
    users = users;

    currentStateWordcloud = topics;
    currentStateTopUsers = users;
    currentStateTopLocations = cities;

    sortedChartsDataEntry = getDataEntry(sentiments);
    index = 0;
    Highcharts.setOptions(gray_1);
    dynamic_chart();  
}


var load_data = function(state){
    //Reset the information 
//    var stateKey = getStateKey(state);
    //update curent state
    current_state = state;
    //Get the file name
    var stateInString = "/" + state.replace(" ","_");
    wordcloudFile = domain + month + stateInString + wordloucFileSuffix;
    sentimentFile = domain + month   + "/sentiment_results.json";


  //  current_state = stateKey;
    display_information("--","--","--","--","--");
    getWordCloudDataEntry(state.toLowerCase());
    showCharts(state.toLowerCase());
    getTopLocationDataEntry(state);
    getTopUsersDataEntry(state);




    $("#state").text(titleFormat(state));
}

var getTopLocationDataEntry = function(state){
       $.getJSON(topLocationFile,
                 function(data) { 
                    console.log(data);
                state = state.toLowerCase();
                currentStateTopLocations = data[state];
        });
}

var getTopUsersDataEntry = function(state){
        $.getJSON(topUsersFile,
                 function(data) {
                    console.log (data);
                state =  state.toLowerCase();
                currentStateTopUsers = data[state];  
    });
}

var titleFormat = function(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
/*********************************************************/
/*Read and convert the json command*/
/*********************************************************/
//Global variables for the json data 
var currentStateTopLocations = {};
var currentStateTopUsers = {};
var sentiment_data = "";
var sentiment_file = "http://localhost:8000/sentiment.json";
var word_cloud_file = "word_cloud.json";
var current_state_sentiment = "null";
var current_indices = [];
var index;
var max_index;
var sortedChartsDataEntry = [];
var most_recent_date = "";
var store = new Persist.Store('My Data Store');

//Read the json file
var showCharts = function(state) {       
        $.getJSON(sentimentFile,
                 function(data) { 
                    console.log(data);
                    //Initiate the variables for the parse json 
                        sentiment_data = data[state];   
                 //   console.log(sentiment_data);
                    currentStateSentiment = sentiment_data;  
                    sortedChartsDataEntry = getDataEntry(currentStateSentiment);
                  //  console.log(sortedChartsDataEntry);
                    index = 0;
                    Highcharts.setOptions(gray_1);
                    dynamic_chart();    
        });
    }

//This method constructs the data structure that will be used for the page 
//[ Object: [date,sentiment_score,topic_array[]]]
var getDataEntry = function(current_state) {
    var indices = [];
    console.log(current_state);
    for (var key in current_state){
        var key_date = get_date_by(key);
        var sentiment_score = current_state[key][1];
        var entry = [key_date,sentiment_score,key];
        indices.push(entry);
    }
    indices.sort(function (a, b) {    
    return a == b ? 0 : (a[0] > b[0] ? 1 : -1); 
    }); 
    //Set up the most recent date
    most_recent_date = indices[indices.length-1][0];
    return indices;
}

var get_sentiment_by_index = function(index) {
    var current_entry = current_state_sentiment[current_indices[index]];
    var date_string = current_indices[index];
    var sentiment_date = get_date_by(date_string);
        //Convert the format to a javascript readable format
    var sentiment_score = current_entry[0];
    return [sentiment_date.getTime(),sentiment_score];
}

var get_date_by = function(date_in_string) {
   /*
    var matches = date_in_string.match(/^datetime\.datetime\((\d+),\s*(\d+),\s*(\d+).+\)$/);
    var year = matches[1];
    var month = matches[2] - 1;
    var day = matches[3];
    var extracted_date = new Date(year,month,day);
    */
    var extracted_date = new Date(date_in_string);
    return extracted_date;
}

/*
word_cloud_results: {state_name: {date: word_cloud_data}}
z
word_cloud_data: {topic id (starting from index 0): [raw tweets]} 

I set the number of topics for each state and each day equal to 10. 

word_cloud_data['WordCloud'] is a list. Suppose if you want to find words for the ith word cloud. You can access the words from word_cloud_data['WordCloud'][i]
*/

/*
Code for set up the top topics, the top topics would be the first month
*/
var currentStateWordcloud = [];
var current_wordcloud_entry = [];
var top_topics = [];
var NUM_TOPICS = 20;
var is_box_set_up = false;
var current_state = "";
var current_date = {};

var getWordCloudDataEntry = function(state) {
      $.getJSON(wordcloudFile,
                 function(data) { 
                    console.log(data);
                    //initializing the selected box}
                    //Get the current state word cloud data
                 //   currentStateWordcloud = data[state];
                      currentStateWordcloud = data;
                //    console.log(currentStateWordcloud);
                });
}

var tag_index = 1;
/***************************/
//Update the page with words, top 30 topic will be displayed
/**************************/
var updatePage = function(wordcloud,topUsers,topLocations){
    tag_index = 1;
    var comma = ",";
    for(var i = 0; i < 10 ; i ++){
        var tag_id = "a#" + "topic" + tag_index;    
        if(i == 9){
            comma = "";
        }    
        var text = wordcloud[i][1];
        var topicindex = wordcloud[i][0];
        text = text + comma;
        
        var href = domain + "topic.html";
        text = titleFormat(text);
        $(tag_id).text(text);
        $(tag_id).attr("href",href);
        var onclick = "storeVariable(" + i + "," + topicindex + ")";
        topicindex = 0;
        $(tag_id).attr("onclick",onclick);
        //Update the topUsers 
        var tagUserId = "a#" + "user" + tag_index;
        var tagLocationId = "a#" + "location" + tag_index;


        var userText = topUsers[i] + comma;
        var locationText = topLocations[i] + comma;

        userText = titleFormat(userText);
        locationText = titleFormat(locationText);

        $(tagUserId).text(userText);
        $(tagLocationId).text(locationText);
        
        tag_index++;
    }
}
/**
var updatePage = function(wordcloud,topUsers,topLocations){
    tag_index = 1;
    var comma = ",";
    var existingTopics = {};
    var topicindex = 0;
    for(var i = 0; i < 10 ; i ++){
        var dailyWordCloud = wordcloud[i]["distribution"];
        var tag_id = "a#" + "topic" + tag_index;    
        if(i == 9){
            comma = "";
        }
        
        var text = dailyWordCloud[topicindex][0];

        
        while(existingTopics.hasOwnProperty(text)){
            topicindex ++;
            text = dailyWordCloud[topicindex][0]; 

        }

        existingTopics[text] = 1;
        text = text + comma;
        
        var href = domain + "topic.html";
        text = titleFormat(text);
        $(tag_id).text(text);
        $(tag_id).attr("href",href);
        var onclick = "storeVariable(" + i + "," + topicindex + ")";
        topicindex = 0;
        $(tag_id).attr("onclick",onclick);
        //Update the topUsers 
        var tagUserId = "a#" + "user" + tag_index;
        var tagLocationId = "a#" + "location" + tag_index;


        var userText = topUsers[i][0] + comma;
        var locationText = topLocations[i][0] + comma;

        userText = titleFormat(userText);
        locationText = titleFormat(locationText);

        $(tagUserId).text(userText);
        $(tagLocationId).text(locationText);
        
        tag_index++;
    }
}
**/
var storeVariable = function(index,labelindex){

    var state = current_state;
    var date = current_date;
    //(0, datetime.datetime(2013, 2, 21, 0, 0))"
    var topicNodeKey = "(" + index + ", " +  dateToString(date.getTime()) + ")";
    var key = dateToString(date.getTime());
    // create a new client-side persistent data store
    // save data in store

    var persistObj = {};
    persistObj['topicNodeKey'] = topicNodeKey;
    persistObj['datekey'] = key;
    persistObj['topicIndex'] = index;
    persistObj['labelindex'] = labelindex;
    persistObj['statekey'] = getStateKey(state);


    persistObj['state'] = current_state;
    persistObj['sentimentFile'] = sentimentFile;
    persistObj['wordcloudFile'] = wordcloudFile;
  //  store.set("test",1);
    persistObj = JSON.stringify(persistObj);
    store.set('persistObj',persistObj);
 //   console.log(store);
}

var sort_attributes = function(topic_occurances) {
    var indices = [];
    for (var key in topic_occurances){       
        var topic_occurance = topic_occurances[key];
        var entry = [topic_occurance,key]; 
        indices.push(entry);
    }
    indices.sort(function (a, b) {    
    return a == b ? 0 : (a[0] > b[0] ? 1 : -1); 
    }); 
    //Set up the most recent date 
    return indices;
}


//Initilizing the selecbox 
var set_select_box = function(data){
    var select = document.getElementById("states");
    for(var state in data){
        //convert the string to state
        state = getState(state);
        select.options[select.options.length] = new Option(state, state);
    }
    is_box_set_up = true;
}

/*******************************/
//Reset the information part
/*******************************/
var display_information = function(time,y,high_y,low_y,avg_y){
    $("div#growth").text("--");
    $("div#growth_rate").text(y);
    $("div#time").text(time);
    $("div#sentiment_score").text(y);
    $("div#high").text("High: " + high_y);
    $("div#low").text("Low: " + low_y);
    $("div#avg").text("Avg: " + avg_y);
}

/*******************************/
//Set the topic 
/*******************************/

var set_topic = function(milliseconds) {


    current_date = new Date(milliseconds);

    var key = dateToString(milliseconds);
    var topic_array = currentStateWordcloud[key];
    var users_array = currentStateTopUsers[key];
    var locations_array = currentStateTopLocations[key];

    if(! (typeof topic_array == "undefined")){
        updatePage(topic_array,users_array,locations_array);
    }
}

//Show statistical information on the page
var showstats = function(x_y){

    var x = x_y[0].getTime();
    var y = x_y[1];
    var key = x_y[2];

    set_topic(x);

    //initilizing 
    if(last_y == -1000) {last_y = y;}
    sum = sum + y;
    count = count + 1;

    //if the the growth is positive
    var growth_rate = (y - last_y) / last_y;
    growth_rate = Math.abs(growth_rate);
    var growth = y - last_y;

    var avg_y = sum / count;

    //Set the maximum and minimum value
    if (y > high_y) { high_y = y}
    if (y < low_y)  { low_y = y}

    //formating
    time = x_y[0].toDateString();
    
    y = Highcharts.numberFormat(y, 2); 
    growth = Highcharts.numberFormat(growth, 2);
    growth_rate = Highcharts.numberFormat(growth_rate,2);
    avg_y = Highcharts.numberFormat(avg_y,2);
    high_y = Highcharts.numberFormat(high_y,2);
    low_y = Highcharts.numberFormat(low_y,2);


    //Constructing Strings
    //var sentiment = "Transportation Sentiment : "  + y; 

    //Set up 
    display_information(time,y,high_y,low_y,avg_y);
    //Set up color

    if(growth > 0){
        $("div#growth").text("+" + growth);
        $("div#growth_rate").text("+" + growth_rate + "%");

        $("div#growth").css("color","#4cc417");
        $("div#growth_rate").css("color","#4cc417");
    } 
    if(growth < 0){
        $("div#growth").text(growth);
        $("div#growth_rate").text("-" + growth_rate + "%");
        $("div#growth").css("color","red");
        $("div#growth_rate").css("color","red");
    }

      if(growth == 0){
        $("div#growth").text(0);
        $("div#growth_rate").text(0);
    }
    last_y = y;
}


var dateToString = function(milliseconds){

//    console.log(milliseconds);
    var date = new Date(milliseconds);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();

    if(month < 10 ){
        month = "0" + month;
    }
    if(day < 10){
        day = "0" + day;
    }
    //var dateInString = "datetime.datetime(" + year + ", " + month + ", " + day + ", " + "0" + ", " + "0)";
  //  console.log(dateInString);
    var dateInString = year + "-" + month + "-" + day;

    return dateInString;
}





var connectionData = {};

//Connection Data
var sortedWordCloud = {};
//JavaScript For the Second Page

var loadSecondPage = function(){
    store.get("persistObj",function(ok,data){
        var obj = jQuery.parseJSON(data);
      //  console.log(obj);
        var statekey = obj['statekey'];
        var datekey = obj['datekey'];
        var topicIndex = obj['topicIndex'];
        var topicNodeKey = obj['topicNodeKey'];
        var state = obj['state'];
        var sentimmentURL = obj['sentimentFile'];
        var wordcloudURL = obj['wordcloudFile'];
        var labelindex = obj['labelindex'];
        var sentiment = {};
        var wordcloud = {};

            $.getJSON(sentimmentURL,function(data){
            sentiment = data[state.toLowerCase()] ;
        });
         $.getJSON(wordcloudURL,function(data){
            wordcloud = data;
        
        $.getJSON(topicTrainFile,
                 function(topic_connection){
                    state = state.toLowerCase();
                //    console.log(topic_connection);
                    var state_topic_connection = topic_connection[state];
                    var topicWordCloud = wordcloud[datekey][topicIndex];
                    //display the wordcloud 
                    displayWordCloud("#wordcloud",topicWordCloud['distribution']);
                    var tweet = topicWordCloud["tweets"][0]["text"];
                    var topic = topicWordCloud["distribution"][labelindex][0];
                    //display the basic info of this topic 
                    displayBasicInfo(state,datekey,tweet,topic);
                    var date = get_date_by(datekey);
                  //  console.log(topicIndex);
                   // console.log(date);
                    var topicTrain = isPartofTopicTrain(topicIndex,date,state_topic_connection);
                    //console.log(topicTrain);
                    //Get the topic train
                    //if(topicNodeKey in topic_connection[statekey]){
                    if (!(typeof topicTrain == "undefined")){
                   // var topicTrain = topic_connection[statekey][topicNodeKey];        
                        sortedWordCloud =  mergeTopicTrain(sentiment,topicTrain,wordcloud);  
                        if(sortedWordCloud.length < 2){
                            $("div#falseInfo").show();
                            displayFalseInfo();
                        }else{
                            $("div#falseInfo").show();
                        displayTopicTrainSentiment(sentiment,sortedWordCloud);
                        }
                    //    displayTopicTrainWordCloud(sentiment,topicTrain,wordcloud);
                    }else{
                        $("div#falseInfo").show();
                        displayFalseInfo();
                    }
                 });
            });
    });
}

//Suppose I 
var isPartofTopicTrain = function(topicIndex,topicDate,state_topic_connection){
    var targetTopicTrain;
    for(var i = 0; i < state_topic_connection.length;i++){
        var topicTrain = state_topic_connection[i];
        for(var j = 0; j < topicTrain.length;j++){
            var node = topicTrain[j];
            var index = node[0];
            var date = new Date(node[1]);
            if(topicIndex == index && date.toDateString() == topicDate.toDateString()){
            //    console.log("found");
             //   console.log(topicIndex + " " + index + " " +  date.toDateString() + " " + topicDate.toDateString());
                targetTopicTrain = topicTrain;
                return targetTopicTrain;
            }
        }
    }
    return targetTopicTrain;
}

/*
var loadConnectionData = function(){

    $.getJSON(topicTrainFile,
                 function(topic_connection){
                  store.get("persistObj",function(ok,data){
                    var obj = jQuery.parseJSON(data);
                    var sentiment = obj['sentiment'];
                    var wordcloud = obj['wordcloud'];
                    var datekey = obj['datekey'];
                    var topicIndex = obj['topicIndex'];
                    var topicNodeKey = obj['topicNodeKey'];
                    var state = obj['state'];
                    //Set up the wordcloud
                    var topicWordCloud = wordcloud[datekey][topicIndex];
                    //display the wordcloud 
                    displayWordCloud("#wordcloud",topicWordCloud['distribution']);
                    var tweet = topicWordCloud["tweets"][0];
                    var topic = topicWordCloud["distribution"][0][0];
                    //display the basic info of this topic 
                    displayBasicInfo(state,datekey,tweet,topic);

                    //Get the topic train
                    if(topicNodeKey in topic_connection[state]){
                        var topicTrain = topic_connection[state][topicNodeKey];        
                        sortedWordCloud =  mergeTopicTrain(sentiment,topicTrain,wordcloud);  

                        if(sortedWordCloud.length < 2){
                            displayFalseInfo();
                        }else{
                        displayTopicTrainSentiment(sentiment,sortedWordCloud);
                        }
                    //    displayTopicTrainWordCloud(sentiment,topicTrain,wordcloud);
                    }else{
                        displayFalseInfo();
                    }
                    //console.log(topicTrain);
                    });
                  });
}

*/
var imageSize = 1000;
var imageTextNo = 40;

var set_size_no = function(a,b){
    imageSize = a;
    imageTextNo = b;
}


var displayWordCloud = function(div,topicWordCloud){
    var data = [];
    for(var i = 0; i < imageTextNo ; i++){
        var text = topicWordCloud[i][0];
        var size = 10 + imageSize * topicWordCloud[i][1];
        var word = {text:text,size:size};
        data.push(word)
    }
    set_data(div,data);
    generate_wordcloud();
}


var mergeTopicTrain = function(sentiment,topicTrain,wordcloud){

    var topicWordCloudData = {};
    for(var i = 0; i < topicTrain.length; i++){ 
        var dateString = topicTrain[i][1];
        var date = new Date(dateString);
        var index = topicTrain[i][0];
        var datekey = dateToString(date.getTime());
        var topicWordCloud = wordcloud[datekey][index]["distribution"];
        
        //Check if it already have the property
        if(topicWordCloudData.hasOwnProperty(dateString)){
            var existingTopicWordCloud = topicWordCloudData[dateString];
            var newTopicWordCloud = mergeTopicWordCloud(existingTopicWordCloud,topicWordCloud);
            topicWordCloudData[dateString] = newTopicWordCloud;
        }else{
            topicWordCloudData[dateString] = topicWordCloud;
        }
    }


    var sortedWordCloud = sortWordCloud(topicWordCloudData);
    return sortedWordCloud;
}


var displayTopicTrain = function(){
    var rowNo = -1;
    for(var  j= 0 ; j <  sortedWordCloud.length; j++){ 
      var wordCloudNo = j + 1;
      if((j % 3) == 0){
            appendRow(++rowNo);
         }
        appendWordCloud(wordCloudNo,rowNo);        
        var tagname = "#wordcloud" + (j + 1);
        var datetag = "div#" + "date" + (j+1);
        var date = new Date(sortedWordCloud[j][0]);
        $(datetag).text(date.toDateString());
        var wordCloudData = sortedWordCloud[j][1];
        displayWordCloud(tagname,wordCloudData);
    }
    document.getElementById("load").disabled=true;

}

var appendRow = function(rowNo){
        var innerHTML = " <div style='margin:0' class='row' id = 'row" + rowNo + "'></div> ";
        $("#topicTrain").append(innerHTML);
}

var appendWordCloud = function(wordcloudNo,rowNo){
    var innerHTML =     " <div class='4u' style='margin:2px;padding:3px;'> <section style= 'margin:0;padding:0' class='box box-style1' id='wordcloud"
                     + wordcloudNo 
                     + "'><div id='date" 
                     + wordcloudNo 
                     + "' style='font-size:120%;font-weight:bold;'>" 
                     + "</div>   </section></div> ";
    var rowName = "#row" + rowNo;
    $(rowName).append(innerHTML);
}

var sortWordCloud = function(topicWordCloud){
    var indices = [];
    for (var key in topicWordCloud){       
        var wordcloud = topicWordCloud[key];
        var entry = [key,wordcloud]; 
        indices.push(entry);
    }
    indices.sort(function (a, b) { 
    var dateA = new Date(a[0]);
    var dateB = new Date(b[0]);   
    return a == b ? 0 : (dateA > dateB ? 1 : -1); 
    }); 
    //Set up the most recent date 
    return indices;
}

var mergeTopicWordCloud = function(distributionA, distributionB){
    var indexA = 0;
    var indexB = 0;
    var mergedDistribution = [];

    while(indexA < distributionA.length && indexB < distributionB.length && mergedDistribution.length < 50){
        var entryA = distributionA[indexA];
        var entryB = distributionB[indexB];

        var sizeA = entryA[1];
        var sizeB = entryB[1];

        var textA = entryA[0];
        var textB = entryB[0];

        if(textA == textB){
            entryA[1] = sizeA + sizeB;   
            mergedDistribution.push[entryA];
            indexA++;
            indexB++;
        }else{
            if(sizeA >= sizeB){
                mergedDistribution.push(entryA);
                indexA++;
             }else{
                mergedDistribution.push(entryB);
                indexB++;
             }
        }
    }
    return mergedDistribution;
}


var displayBasicInfo = function(state,date,tweet,topic){
    $("#state").text(titleFormat(state));
    $("#time").text(get_date_by(date).toDateString());
    $("#actualtweet").text('\"'+ tweet + '\"');
    $("#topic").text(topic);
}

var displayTopicTrainSentiment = function(sentiment,wordcloud){
    
    
    var dataserious = [];
    var xaxis = [];
    var dataObj = {};
    for(var i = 0; i < wordcloud.length; i++){
        var date = new Date(wordcloud[i][0]);
        var index = wordcloud[i][0];
        var datekey = dateToString(date.getTime());
        var topicsentiment = sentiment[datekey][0];
        xaxis.push(date.toDateString());
        dataserious.push(topicsentiment);
    }
    dataObj={data: dataserious,state_name:"sentiment"};
    Highcharts.setOptions(gray_1);
    basic_chart(dataObj,xaxis);
}

var displayFalseInfo = function(){
    $("div#falseInfo").text("Ops! No Topic Train for this topic");
}

/*The Third Page, Load Day By Day*/

var thirdPageSentiment = {};
var thirdPageWordcloud = {};

var loadStateWordCloud = function(){
      store.get("persistObj",function(ok,data){
        var obj = jQuery.parseJSON(data);
        var statekey = obj['statekey'];
        var datekey = obj['datekey'];
        var topicIndex = obj['topicIndex'];
        var topicNodeKey = obj['topicNodeKey'];
        var state = obj['state'];
        var sentimmentURL = obj['sentimentFile'];
        var wordcloudURL = obj['wordcloudFile'];
        var labelindex = obj['labelindex'];

        $("#state").text(titleFormat(state));
        //Get the first day 
        current_date = get_date_by(datekey);
        var month = current_date.getMonth();
        current_date = new Date(2013,month,1);
        $("#time").text(current_date.toDateString());
        datekey = dateToString(current_date);

     
        set_large_size();
        set_size_no(1800,100);

        $.getJSON(sentimmentURL,function(data){
            sentiment = data[state.toLowerCase()];
            var sentiment_score = sentiment[datekey][0];
            $("#sentiment_score").text(sentiment_score.toFixed(2));
        });        
        $.getJSON(wordcloudURL,function(data){
            thirdPageWordcloud = data;
            displayWordCloud("#wordcloud",thirdPageWordcloud[datekey][0]["distribution"]);
        });
    });
}

var getCurrentDateKey = function(datekey){
    if(typeof current_date == 'undefined'){
        current_date = get_date_by(datekey);
        var month = current_date.getMonth() - 1;
        current_date = new Date(2013,month,1);
    }else{
    }
    return dateToString(current_date);
}

var prevCloud = function(){

    current_date = new Date(current_date.getTime() - (24 * 60 * 60 * 1000));
    $("#time").text(current_date.toDateString());
    var preDayKey = dateToString(current_date);
    var sentiment_score = sentiment[preDayKey][0];
    $("#sentiment_score").text(sentiment_score.toFixed(2));
    $("#wordcloud").html("");
    displayWordCloud("#wordcloud",thirdPageWordcloud[preDayKey][0]["distribution"]);
}

var nextCloud = function(){
    current_date = new Date(current_date.getTime() + (24 * 60 * 60 * 1000));
    $("#time").text(current_date.toDateString());
    var nextDayKey = dateToString(current_date);
    var sentiment_score = sentiment[nextDayKey][0];
    $("#sentiment_score").text(sentiment_score.toFixed(2));
    $("#wordcloud").html("");
    displayWordCloud("#wordcloud",thirdPageWordcloud[nextDayKey][0]["distribution"]);
}




/*****/
//Fourth Page 



var mapfile = domain + 'data/2013-02/2013-02-06_0_topic.json';
var loadMapPage = function(){
    
    //Get the current file
       
    //Update the information 
        $.getJSON(mapfile,
                 function(data) {
        

        console.log(data);
        //TODO 
        //Data should be narrowed to a daily
        //The page will display the data for a day only        //TODO 
        //Set up the topic selection box for a day 
        setTopicSelection(data);
        //Set Up the information
        for(var key in data){
            buildMapData(data[key]);
            break;
        }
        });
}

var setTopicSelection = function(data){
    //Generate the list of topics
    // build an array of topics, size of 10
    //Set up the select box 
    for(var i = 0; i < 10; i++){
        //Set up the select box
        var text = data[i]["distribution"][0][0];
        console.log(text);
        var labelid = "#label" + i;
        $(labelid).text(text);

        //Set up the marker
        var geolocations = data[i]["geolocation"];
        var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+ geolocations[0] + ",+" + geolocations[1] + ",+" + geolocations[2] + "&sensor=false";
            $.get(url,function(data){
                console.log(data);
                //Parse the returned json and perform actions correspondently 
                var status  = data["status"];
                if(status == 'OK'){
                    //Get the lat and lng code 
                    var lat = data["results"][0]["geometry"]["location"]["lat"];
                    var lng = data["results"][0]["geometry"]["location"]["lng"];
                    console.log(lat);
                    console.log(lng);
                    //Set up the marker
                    L.marker([lat, lng]).addTo(map);
                }
            });
    }
}

//The processed data would be
//[id: {label: ;locations:[latitude]}]

var buildMapData = function(data){
    var mapData = {};
    for(var i = 0; i < data.length ; i++ ){
        var labelIndex = 0;
        var geoCodes = [];
        var topicLabel = data[i]["distribution"][labelIndex][0];
        while (mapData.hasOwnProperty()){
            labelIndex++;
            topicLabel = data[i]["distribution"][labelIndex][0];
        }
        //Get the list of geocode
        var tweets = data[i]["tweets"];
        for(var j = 0; j < tweets.length; j ++){
            var geoCode =[];
            var geoLocation = tweets[j]["geolocation"];
            var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+ geoLocatioN[0] + ",+" + geoLocation[1] + ",+" + geoLocation[2] + "&sensor=false";
            $.get(url,function(data){
                //Parse the returned json and perform actions correspondently
                var status  = data["status"];
                if(status == 'ok'){
                    //Get the lat and lng code 
                    var lat = data["geometry"]["location"]["lat"];
                    var lng = data["geometry"]["location"]["lng"];
                    //Set up the marker

                }
            });
        }
    }
}

var showMapForDay = function(dataByDay){

    

}

var updateTopicSelectBox = function(){

}



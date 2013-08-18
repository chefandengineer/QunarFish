var fill = d3.scale.category20();

var clouddata = [];
var tagname = "";
var w1 = 380;
var w2 = 380;

var h1 = 350;
var h2 = 350;

var set_data = function(div,data){
  tagname = div ;
  clouddata = data;
}

var set_large_size = function(){
  w1 = 800;
  w2 = 800;

  h1 = 800;
  h2 = 800;

}
var generate_wordcloud = function(){
  d3.layout.cloud().size([w1, h1])
      .words(clouddata)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  }

  function draw(words) {
    d3.select(tagname).append("svg")
        .attr("width", w2)
        .attr("height", h2)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }

  //Sample Data to generate the word cloud 
  var sample_data_condition = [{text:"hello",size:30},{text:"word",size:40},{text:"we",size:50},{text:"you",size:60}];
  var sample_data_map = {"hello":1,"word":6,"you":10,"normally":15,"this":15,"that":10};
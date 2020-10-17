var margin = 200;
var svg = d3.select("svg");
var width = svg.attr("width") - margin;
var height = svg.attr("height") - margin;

svg.append("text")
.attr("transform","translate(100,0)")
.attr("x",250)
.attr("y",50)
.attr("class","title")
.text("Australia Fires");

var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height,0]);

var g = svg.append("g");
g.attr("transform","translate(100,100)");

var data = [
  {state:"New South Wels", val: 130},
  {state:"Victoria", val: 31},
  {state:"South Australia", val: 23},
  {state:"Queensland", val: 37},
  {state:"Western Australia", val: 26},
  {state:"Tasmania", val: 24},
  {state:"Northern Territory", val: 1},
];

xScale.domain(data.map(function(d) { return d.state;}));
yScale.domain([0,d3.max(data, function(d) {return d.val;})]);

g.append("g")
.attr("transform","translate(0,"+height+")")
.call(d3.axisBottom(xScale));

g.append("g")
.call(d3.axisLeft(yScale));

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#000")
    .text("a simple tooltip");

g.selectAll(".bar")
.data(data)
.enter()
.append("rect")
.attr("class","bar")
.on("mouseover", onMouseOver)
.on("mouseout", onMouseOut)
.attr("x", (d)=>xScale(d.state))
.attr("y", (d)=>yScale(d.val))
.attr("width", xScale.bandwidth())
.transition()
.ease(d3.easeLinear)
.duration(300)
.delay((d,i)=>i*50)
.attr("height", (d)=>height-yScale(d.val));

function onMouseOver(d,i) {
  d3.select(this)
    .attr('class','highlight');


  d3.select(this)
  .transition()
  .duration(300)
  .attr('width', xScale.bandwidth()+3)
  .attr("y", (d)=>yScale(d.val)-10)
  .attr("height", (d)=>height-yScale(d.val)+10);

}

function onMouseOut(d,i) {
  d3.select(this)
  .attr('class','bar');

  d3.select(this)
  .transition()
  .duration(300)
  .attr('width', xScale.bandwidth())
  .attr("y", (d)=>yScale(d.val))
  .attr("height", (d)=>height-yScale(d.val));
}

d3.select("body")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; })
    .on("mouseover", function(d){tooltip.text(d); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

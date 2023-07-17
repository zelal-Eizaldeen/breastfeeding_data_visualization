const canvas = d3.select(".canva");

// add an svg element
const svg = canvas.append("svg")
            .attr("width", 1000)
            .attr("height", 1000);

            var padding = 1.5,
               clusterPadding = 16,
               maxRadius = 15;

const margin = {top:20, right:20, bottom:70, left:70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

//Main Canvas
const mainCanvas = svg.append("g")
                      .attr("width", graphWidth / 2)
                      .attr("height", graphHeight / 2)
                      .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);


//Load csv file
async function init() {
    const data = await d3.csv('reasons.csv');
    
    var nodes = d3.range(data.length)
                .map(function (d) {
                    var numberOfBaseTypeScale = d3.scaleOrdinal().domain(data.map(
                        d=>d.category_code
                    ))

                    var distinctTypesScale = numberOfBaseTypeScale.domain().length;

                    var clusters = new Array(distinctTypesScale);


                    let i = + data[d].category_code,
                    r=data[d].percentages;


                    d = {
                        cluster: i,
                        radius: r,
                        base_type: data[d].base_type,
                        percentages:data[d].percentages,
                        x: Math.cos(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),
                        y: Math.sin(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),

                    };
                    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                   
                    return d;
                }) //end nodes

                var force = d3.forceSimilation()
                //Keep entire simulation balanced around screen center
                .force("center", d3.forceCenter(graphWidth/2, graphHeight/2)) 
    
                //Cluster by section
                .force("cluster", cluster()
                                  .strength(0.7))
                //Apply collision with padding
                .force("collide", d3.forceCollide(d=>d.radius + padding)
                        .strength(0.9))
                        .volacityDecay(0.4)

                .on("tick", layoutTick)
                    .nodes(nodes);


}

init()
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

//Color
const mColors = d3.scaleOrdinal(d3['schemeSet2'])

//Main Canvas
const mainCanvas = svg.append("g")
                      .attr("width", graphWidth / 2)
                      .attr("height", graphHeight / 2)
                      .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);


//Load csv file
async function init() {
    const data = await d3.csv('reasons.csv');

    var numberOfBaseTypeScale = d3.scaleOrdinal().domain(data.map(
        d=>d.category_code
    ))

    var distinctTypesScale = numberOfBaseTypeScale.domain().length;

    var clusters = new Array(distinctTypesScale);

    //Array of colors
    var legendColorsArray = ["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#a6d854"]
    mColors.domain(data.map(d=>d.base_type))
            .range(legendColorsArray)
    var radiusScale = d3.scaleLinear()
                        .domain(d3.extent(data, function(d){
                            return +d.percentages;
                        }))
                        .range([10, maxRadius + 80]);
    
    var nodes = d3.range(data.length)
                .map(function (d) {
                    let i = + data[d].category_code,
                    r=radiusScale(data[d].percentages);


                    d = {
                        cluster: i,
                        radius: r,
                        base_type: data[d].base_type,
                        problem: data[d].problems,
                        percentages:data[d].percentages,
                        x: Math.cos(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),
                        y: Math.sin(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),

                    };
                    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                    
                    return d;
                }) //end nodes

                var force = d3.forceSimulation()
                //Keep entire simulation balanced around screen center
                .force("center", d3.forceCenter(graphWidth/2, graphHeight/2))

                //Cluster by section
                .force("cluster", cluster()
                                  .strength(0.7)) 

                //apply collision with padding
                .force("collide", d3.forceCollide(d => d.radius + padding )
                    .strength(0.9))
                    .velocityDecay(0.4)

                .on("tick", layoutTick)
                    .nodes(nodes);
                
               
              
        var node = mainCanvas.selectAll("circle")
                                .data(nodes)
                                .enter()
                                .append("circle")
                                .style("fill", function(d){
                                      return mColors(d.cluster / distinctTypesScale)
                                })
        
            //Little animation
            // node.transition()
            //             .duration(700)
            //             .delay(function(d, i) {
            //                 return i * 5
            //             })
            //             .attrTween("r", function(d){
            //                  var i = d3.interpolate(0, d.radius);

            //                  return function(t) { return d.radius = i(t)}
            //             });



        //Function tick
function layoutTick(e) {
    node
        // .each(cluster(10 * e.alpha * e.alpha))
        // .each(collide(.5))
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.radius})
        .on("mouseover", function(d){console.log(d.problem)})
  }
// // Move d to be adjacent to the cluster node.
// function cluster() {
//     var nodes, strength = 0.1;

//     function force(alpha){
//         //Scale curve alpha value
//         alpha *= strength * alpha;
//         nodes.forEach(function(d){
//             var cluster = clusters[d.cluster];
//             if (cluster === d) return;

//             var x = d.x - cluster.x,
//             y = d.y - cluster.y,
//             l = Math.sqrt(x * x + y * y),
//             r = d.radius + cluster.radius;
//             if (l != r) {
//                 l = (l - r) / l * alpha;
//                 d.x -= x *= l;
//                 d.y -= y *= l;
//                 cluster.x += x;
//                 cluster.y += y;
//             }
//         });
//     }
//     force.initialize = function(_) {
//         nodes = _
//     }
//     force.strength = _ => {
//         strength = _ == null ? strength
//         return force;
//     };
//     return force;

  //}

  // Move d to be adjacent to the cluster node.
  function cluster() {
                
    var nodes,
        strength = 0.1;

    function force (alpha) {

        // scale + curve alpha value
        alpha *= strength * alpha;

        nodes.forEach(function(d) {
                var cluster = clusters[d.cluster];
            if (cluster === d) return;
        
          let x = d.x - cluster.x,
              y = d.y - cluster.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + cluster.radius;

        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
        }
        });

    }

    force.initialize = function (_) {
        nodes = _;
    }

    force.strength = _ => {
        strength = _ == null ? strength : _;
        return force;
    };

    return force;

    }
    // //LayoutTick
    // function layoutTick(e){
    //     node.attr("cx", (d=>d.x))
    //         .attr("cy", (d=>d.y))
    //         .attr("r", (d=>d.r))

    // }


}

init()
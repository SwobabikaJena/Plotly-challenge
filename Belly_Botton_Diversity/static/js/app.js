var selectID = d3.select("#selDataset");
var demo = d3.select("#sample-metadata");
var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");

function init() {

  //Reset previous data
  resetData();

  //Read samples.json using D3 library
  d3.json("data/samples.json").then((data) => {
    console.log(data);
    
    //Populate dropdown with ID options
    data.names.forEach((name => {
      var option =selectID.append("option");
      option.text(name);
    }));

    //Get the first sample data to create the default plot
    var firstSample = data.names[0];
    console.log(firstSample);
    demographicData(firstSample);
    buildPlots(firstSample);
    
  });
}

function resetData() {
  demo.html("");
  barChart.html("");
  bubbleChart.html("");

};

function demographicData(sample){
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    //console.log(metadata);
    var selectMetadata = metadata.filter(object => object.id == sample)[0];
    //console.log(selectMetadata);
    // demo.html("");

    Object.entries(selectMetadata).forEach(([key, value]) => {
      // Log the key and value
      demo.append("h6").text(`${key}: ${value}`);
    });
    
  });

}

function buildPlots(sample){
  d3.json("data/samples.json").then((data) => {

    // Get sample data from json data
    var samples = data.samples;
    // Filter data for selected Id
    var selectData = samples.filter(object => object.id == sample)[0];

    // Store sample_values, otu_Ids, and otu_labels data into variables.
    var sampleValues = selectData.sample_values;
    var otuIds = selectData.otu_ids;
    var otuLabels = selectData.otu_labels;

    //*********************** */
    // Plot Bubble cart
    // ******************** */ 
    
    var traceBubble = {
      type: "scatter",
      mode: "markers",
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Jet'
      }
    };
     
    var dataBubble = [traceBubble];
     
    var layoutBubble = {
      title: "Bubble Chart for ID " + `${sample}`,
      height: 500,
      width: 1200,
      xaxis: {
        title: "OTUID"
      }
    };
     
    Plotly.plot("bubble", dataBubble, layoutBubble);

    //*********************** */
    // Plot Bar cart
    // ******************** */ 

    // Get the top 10 data for the sample
    topOtuIds = otuIds.slice(0,10).reverse();
    topsampleValues = sampleValues.slice(0,10).reverse();
    topOtuLabels = otuLabels.slice(0,10).reverse();

    // Create trace for horizontal bar Plot
    var traceBar = {
      x: topsampleValues,
      y: topOtuIds.map(otuId => "OTU " + otuId),
      text: topOtuLabels,
      type: "bar",
      orientation: "h"
    };
    // Define data for horizontal bar plot
    var dataBar = [traceBar];

    // Apply the group bar mode to the layout
    var layoutBar = {
      autosize: true,
      width: 600,
      height: 500,
      margin: {t:20, l:150}
    }

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", dataBar, layoutBar);

  });

}

function optionChanged(newSample) {
  //Fetch new data each time a new sample is selected
  resetData();
  demographicData(newSample);
  buildPlots(newSample);
  
}

init();
function buildMetadata(sample) {
   var url="/metadata/"+ sample;
   d3.json(url).then(function(sample_metadata) {
     var inputField=d3.select("#sample-metadata");
     inputField.html("")

     var list=inputField.append("div");
     list.append('h6').text(`Age: ${sample_metadata["AGE"]}`)
     list.append('h6').text(`BBTYPE: ${sample_metadata["BBTYPE"]}`)
     list.append('h6').text(`ETHNICITY: ${sample_metadata["ETHNICITY"]}`)
     list.append('h6').text(`GENDER: ${sample_metadata["GENDER"]}`)
     list.append('h6').text(`LOCATION: ${sample_metadata["LOCATION"]}`)
     list.append('h6').text(`SAMPLEID: ${sample_metadata["sample"]}`)
     console.log(sample_metadata)
   });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  var url="/samples/"+ sample;
  d3.json(url).then(function(data) {
    var data=[{
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      type: "scatter",
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values
      }
    }]
    var layout = {

      xaxis: { title: 'OTU_ID'},
    
    }
    Plotly.newPlot("bubble",data,layout)
  });  

  d3.json(url).then(function(data) {  
    var df=[];
    for (var i=0; i<data["otu_ids"].length; i++) {
      obj={};
      obj["otu_ids"]=data["otu_ids"][i];
      obj["sample_values"]=data["sample_values"][i];
      obj["otu_labels"]=data["otu_labels"][i];
      df.push(obj);
    }
    df.sort(function(y,x) {
      return parseFloat(x.sample_values)-parseFloat(y.sample_values)
    })
    df=df.slice(0,10)
    console.log(sample)
    var sample_values=df.map(i => i.sample_values);
    var otu_ids=df.map(i => i.otu_ids);
    var otu_labels=df.map(i => i.otu_labels);
    var data=[{
      "values": sample_values,
      "labels": otu_ids,
      "hovertext": otu_labels,
      "type": "pie",
      
    }]
    var layout = {
      title: "Lyric Frequency",
      height: 800,
      width: 800,
    }
    Plotly.newPlot("pie",data,layout);


  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected

  buildCharts(newSample);
  buildMetadata(newSample);


}

// Initialize the dashboard
init();

var spotList = new SpotCollection();
var optionList = new OptionCollection();

spotList.fetch({
	dataType: 'jsonp',
	jsonpCallback: 'callback',
	success: function(data) {
		console.log("Spot data collected.")
		populateOptions();
  }
})

function populateOptions() {
	optionList.fetch({
		dataType: 'jsonp',
		jsonpCallback: 'callback',
		success: function(data) {
	    console.log("Rest of data collected.");
	    optionList.getData(spotList);
	    var optionView = new OptionListView({collection: optionList});
	    var vCPUView = new VCPURateView({collection: optionList});
	  }
	});
}
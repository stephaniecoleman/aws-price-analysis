var SpotModel = Backbone.Model.extend();

var SpotCollection = Backbone.Collection.extend({
	model: SpotModel,
	url: "http://spot-price.s3.amazonaws.com/spot.js",
	parse: function(response){
		var dataArray = [];
		var regions = response['config']['regions'];
		for(var i = 0; i < regions.length; i++){
			var region = regions[i];
			for(var j = 0; j < region['instanceTypes'].length; j++){
				var type = region['instanceTypes'][j];
				if (type['type'].indexOf("Previous") > -1){ continue; }
				for(var k = 0; k < type['sizes'].length; k++){
					var size = type['sizes'][k];
					var regionVal = region['region']
					if (region['region'] == "us-east"){
						regionVal = "us-east-1";
					} else if (region['region'] == "us-west"){
						regionVal = "us-west-1";
					}
					var dataObject = {
						spotPrice: parseFloat(size['valueColumns'][0]['prices']['USD']) 
					}
					var typeVal = type['type'].split("CurrentGen")[0];
					var label = [regionVal, typeVal, size['size']].join("-");
					dataObject.label = label;
					dataArray.push(dataObject);
				}
			}
		}	
		return dataArray;
	}
})



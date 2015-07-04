var OptionModel = Backbone.Model.extend({	
		defaults: {
			spotPrice: "-",
			priceSpread: "-",
			pricevCPU: "-"
		}
	});

var OptionCollection = Backbone.Collection.extend({
	model: OptionModel,
	order: 'region',
	// sort by region then type or by type then region
	comparator: function(option) {
		if (this.order === 'region') {
			return [option.get('region'), option.get('type')];
		} else if (this.order === 'type') {
			return [option.get('type'), option.get('region')];
		} else {
			return option.get('pricevCPU');
		}
	},
	url: "http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js",
	parse: function(response){
		var dataArray = [];
		var regions = response['config']['regions'];
		for(var i = 0; i < regions.length; i++){
			var region = regions[i];
			for(var j = 0; j < region['instanceTypes'].length; j++){
				var type = region['instanceTypes'][j];
				for(var k = 0; k < type['sizes'].length; k++){
					var size = type['sizes'][k];
					var dataObject = {
						region: region['region'],
						type: type['type'].split("CurrentGen")[0],
						size: size['size'],
						vCPU: parseInt(size['vCPU']),
						onDemandPrice: parseFloat(size['valueColumns'][0]['prices']['USD']) 
					}
					var label = [dataObject.region, dataObject.type, dataObject.size].join("-");
					dataObject.label = label;
					dataArray.push(dataObject);
				}
			}
		}	
		return dataArray;
	},

	getData: function(spotList){
		this.setSpotPrices(spotList);
		this.calculatePriceSpread();
		this.calculatePricevCPU();
	},
	setSpotPrices: function(spotList) {
		this.each(function(option) {
			var label = option.get('label');
			var sOption = spotList.where({label: label})[0];
			if (!sOption) {
				return;
			} else {
				option.set('spotPrice', sOption.get('spotPrice'));
			}
		});
	},
	calculatePriceSpread: function() {
		this.each(function(option){
			var spot = option.get('spotPrice');
			if (!isNaN(spot)) {
				var onDemand = option.get('onDemandPrice');
				var spread = onDemand - spot;
				option.set('priceSpread', Math.round(spread*1000)/1000);
			}
		});
	},
	// grab cheaper rate per vCPU between spot and on-demand instances
	calculatePricevCPU: function() {
		this.each(function(option){
			var spot = option.get('spotPrice');
			var onDemand = option.get('onDemandPrice');
			var vCPU = option.get('vCPU');
			var pricevCPU;
			if (!isNaN(spot) && spot < onDemand) {
				pricevCPU = spot / vCPU;
			} else {
				pricevCPU = onDemand / vCPU;
			}
			option.set('pricevCPU', pricevCPU);
		})
	},

	sortByRegion: function() {
		this.order = "region";
		this.sort();
	},

	sortByType: function() {
		this.order = "type";
		this.sort();
	},

	sortByPricevCPU: function() {
		this.order = "pricevCPU";
		this.sort();
	},

	findCheapestRegion: function() {
		// get list of regions
		var regions = _.uniq(this.pluck('region'));
		var regionStats = [];

		// get average pricevCPU for each region
		for(var i = 0; i < regions.length; i++) {
			var region = this.where({region: regions[i]});
			var sum = 0;
			for(var j = 0; j < region.length; j++) {
				var pricevCPU = region[j].get('pricevCPU');
				sum += pricevCPU;
			}
			var average = Math.round((sum / region.length) * 10000) / 10000;
			var obj = {name: regions[i], average: average};
			regionStats.push(obj);
		}
		// get cheapest region object.
		var cheapest = _.min(regionStats, function(region){ return region.average; });

		return new Backbone.Model(cheapest);
	}
})
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

	// calculateSpotvCPU: function() {
	// 	this.each(function(option) {
	// 		var spot = option.get('spotPrice');
	// 		if (!isNaN(spot)) {
	// 			var vCPU = option.get('vCPU');
	// 			var spotvCPU = spot / vCPU;
	// 			option.set('spotvCPU', spotvCPU);
	
	// 		}	else {
	// 			option.set('spotvCPU', 2000);
	// 		}
	// 	});
	// },
	// calculateOnDemandvCPU: function() {
	// 	this.each(function(option) {
	// 		var onDemand = option.get('onDemandPrice');
	// 		if (!isNaN(onDemand)) {
	// 			var vCPU = option.get('vCPU');
	// 			var onDemandvCPU = onDemand / vCPU;
	// 			option.set('onDemandvCPU', onDemandvCPU);
	// 		} else {
	// 			option.set('onDemandvCPU', 2000);
	// 		}
	// 	});
	// },

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

	// sortBySpotvCPU: function() {
	// 	this.order = "spotvCPU";
	// 	this.sort();
	// }

})
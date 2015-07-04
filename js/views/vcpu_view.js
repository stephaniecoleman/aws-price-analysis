var VCPURateView = Backbone.View.extend({
	el: '#vCPU-container',
	template : _.template($('#vCPU-tmpl').html()),
	initialize : function() {
		this.collection.sortByPricevCPU();
		this.render();
	},
	render : function() {
		var html = this.template({collection: this.limitToTen().toJSON()});
		this.$el.html(html);
		return this;
	},
	limitToTen: function() {
		return new Backbone.Collection(this.collection.first(10));
	}
})


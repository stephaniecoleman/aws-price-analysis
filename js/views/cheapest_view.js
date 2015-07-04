var CheapestView = Backbone.View.extend({
	el: '#cheapest-container',
	template : _.template($('#cheapest-tmpl').html()),
	initialize : function() {
		this.render();
	},
	render : function(){
		var html = this.template({model: this.collection.findCheapestRegion().toJSON()});
		this.$el.html(html);
		return this;
	}
})
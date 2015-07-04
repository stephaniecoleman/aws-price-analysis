var OptionListView = Backbone.View.extend({
	el: '#spread-container',
	template : _.template($('#option-tmpl').html()),
	events : {
		"click #sortByRegion" : "regionSort",
		"click #sortByType" : "typeSort"
	},
	initialize : function() {
		this.render();
		this.collection.on('sort', this.render, this)
	},
	render : function() {
		var html = this.template({collection: this.collection.toJSON()});
		this.$el.html(html);
		return this;
	},
	regionSort : function() {
		this.collection.sortByRegion();
		this.$('#sortByType').removeClass("active");
		this.$('#sortByRegion').addClass("active");
	},
	typeSort : function() {
		this.collection.sortByType();
		this.$('#sortByType').addClass("active");
		this.$('#sortByRegion').removeClass("active");
	},
})


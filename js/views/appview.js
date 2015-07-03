var OptionListView = Backbone.View.extend({
	el: '#container',
	template: _.template($('#option-tmpl').html()),

	initialize : function() {
		this.render();
		// this.game = new app.Game();
		// this.game.on("X", this.drawX, this);
		// this.game.on("O", this.drawO, this);
		// this.game.on("tie", this.tie, this);
		// this.game.on("win", this.win, this);
		// this.render();
		// this.addIds();
	},

	render : function() {
		var html = this.template({collection: this.collection.toJSON()});
		this.$el.html(html);
		return this;
		// var rows = this.createRowArray(3, '<tr>');
		// var cells = this.createColumnArray(3, '<td></td>');
		// this.$el.append("<table border='1' cellpadding='40'></table>")
		// this.$el.find('table').append(rows);
		// this.$el.find('tr').append(cells);
		// this.$el.append('<button id="lastGame">Show Me Last Games Results!</button>')
		// $("#container").append(this.$el)
	},
})


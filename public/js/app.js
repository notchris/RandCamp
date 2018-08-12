var app = new Vue({
    el: '#app',
    data: {
    	tags: [],
    	selected: false,
    	album: false
    },
    mounted: function () {
    	this.$nextTick(function () {
	    	let set = new Set();
	    	for (let i = 0; i < tags.length; i++){ if (i < 50){ set.add(tags[i]) } }
	    	let a = Array.from(set).sort();
	    	a.forEach(function(item) { app.tags.push({id:item, active: false}) });
    	})
    },
    methods: {
    	selectTag: function(tag){
    		for (let i = 0; i < app.tags.length; i++){
    			app.tags[i].active = false;
    		}
    		tag.active = !tag.active;
    		this.tags.forEach(function(item) {
    			if (item.active){ app.selected = item.id }
    		})
            console.log(this.selected)
    	}
    },
    watch: {
    	selected: function(){
    		if (app.selected){
	    		Vue.http.post('/tag/',{tag: app.selected},{emulateJSON:true}).then(function(response){
	    			let r = response.body;
	    			app.album = response.body;
	    			app.album.track = app.album.tracks[Math.floor(Math.random()*app.album.tracks.length)];
	    			app.album.publish_date = moment(app.album.publish_date).format('MMMM D, YYYY');
	    		})
    		}
    	}
    }
});


var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        this.onDeviceReady();
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },

    onBackKeyDown: function(e){
		e.preventDefault();
	},


    receivedEvent: function(id) {
	/*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    },




};

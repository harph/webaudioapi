NUMBER_OF_KEYS = 300;
MIN_FREQUENCY = 500;
MAX_FREQUENCY = 1600;
KEY_CLASS = 'key';
KEY_CLASS_ACTIVE = 'key active';


function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Key(parentContainer, frequency, gain) {
    this.frequency = frequency;
    this.gain = gain;

    // UI Representation
    this.element;
    this.parentContainer = parentContainer;

    this._init = function() {
        var element = document.createElement('div');
        element.className = KEY_CLASS;
        this.element = element;
        this.parentContainer.appendChild(this.element);
    };

    this.play = function() {
        this.element.className = KEY_CLASS_ACTIVE;
    };

    this.stop = function() {
        this.element.className = KEY_CLASS;
    }

    this._init();
}


function AudioController(container) {
    this.context = new (window.AudioContext || window.webkitAudioContext);
    this.keys = [];

    // UI Representation
    this.container = container;

    this._init = function() {
        var freq = MIN_FREQUENCY;
        var inc = (MAX_FREQUENCY - MIN_FREQUENCY) / NUMBER_OF_KEYS;
        var gain = 0.1;
        for (i = 0; i < NUMBER_OF_KEYS; i++) {
            this.keys.push(new Key(this.container, freq, gain));
            freq += inc;
        }
    };

    this.randomize = function() {
        var i = getRandomInt(0, this.keys.length - 1);
        this.play(this.keys[i], 1000);
    };

    this.start = function() {
        var _this = this;
        setInterval(function() { _this.randomize(); }, 15);
    }

    this.play = function(key, millisecs) {
        var context = this.context;
        var oscilator = context.createOscillator();
        var gain = context.createGain();
        oscilator.frequency.value = key.frequency;
        gain.gain.value = key.gain;
        oscilator.connect(gain);
        gain.connect(context.destination);
        oscilator.noteOn(0);
        key.play();
        setTimeout(function(o, k) {
                o.noteOff(0);
                k.stop();
            },
            millisecs, oscilator, key
        );
    };

    this._init();
}


window.onload = function() {
    var keyContainer = document.getElementById('keyContainer');
    var audioController = new AudioController(keyContainer);
    audioController.start();
}

var mainMenu = {
  "" : {
    "title" : "-- Main Menu --"
  },
  "MACHINE SHOP CALCULATOR" : function() { E.emit('initUnitCalc'); },
  "TEMP COMP CALC" : function() { E.emit('initTempCalc'); },
  "> BACKLIGHT" : function() { Pixl.menu(subMenu); },
};

var subMenu = {
  "" : {
    "title" : "-- SubMenu --"
  },
  "ON" : function() { LED1.set(); },
  "OFF" : function() { LED1.reset(); },
  "< BACK" : function() { Pixl.menu(mainMenu); },
};

var UnitCalc = function() {
  
  var self = this;
  
  this.keys = '123456789*0#';
  this.rows = [D6,D5,D4,D3];
  this.cols = [D2,D1,D0];
  
  this.input = '';
  this.value = 0;
  this.in = 0;
  this.mm = 0;
  
  this.keypad = require('KeyPad').connect(this.cols, this.rows, (index) => {
    //print(self.keys[index]);
    var keystroke = self.keys[index];
    if (keystroke == '*') keystroke = '.';
    if (keystroke == '#') {
      keystroke = '';
      self.input = '';
    }
    self.input += keystroke;
    self.calc(self.input);
    self.display();
  });
  
  this.calc = function(value) {
    self.in = self.round(self.mmToInch(value), 4);
    self.mm = self.round(self.inchToMm(value), 4);
    self.value = self.round(value, 4);
  };
  
  this.mmToInch = function(mm) {
    return mm / 25.4;
  };
  
  this.inchToMm = function(inch) {
    return inch * 25.4;
  };
  
  this.round = function(value, n) {
    return Number(value).toFixed(n);
  };
  
  this.display = function() {
    
    // Clear the LCD
    g.clear();

    // Draw Screen Divisions
    g.drawLine(0, 10, 128, 10);
    g.drawLine(64, 10, 64, 64);
    
    // Set Font Type
    g.setFont6x8();
    
    // Draw Header
    g.drawString('MACHINE SHOP CALCULATOR', 1, 0);

    // Draw mm to inch values
    g.drawString(self.value + ' mm', 2, 22);
    g.drawString(self.in + ' in', 2, 36);

    // Draw inch to mm values
    g.drawString(self.value + ' in', 66, 22);
    g.drawString(self.mm + ' mm', 66, 36);

    // Set Font Type
    g.setFontBitmap();
    
    // Draw "TEMP COMP CALC" text
    g.drawString('TEMP COMP CALC', 2, 58);

    // Update the display
    g.flip();
    
  };
  
  this.init = function() {
    require("Font6x8").add(Graphics);
    self.calc(0);
    self.display();
  };
  
};

var TempCompCalc = function() {
  
  var self = this;
  
  this.tempC = E.getTemperature();
  this.tempF = (this.tempC * 1.8 + 32).toFixed(1);
  
  this.getTemp = function() {
    self.tempC = E.getTemperature();
    self.tempF = (self.tempC * 1.8 + 32).toFixed(1);
    print('tempF: ' + self.tempF);
  };
  
  this.init = function() {
    setInterval(self.getTemp, 2000);
  };
  
};

var initTimer = setTimeout(() => {
  E.emit('init');
}, 2000);

E.on('init', function() {
  Pixl.menu(mainMenu);
  initTimer = null;
});

E.on('initUnitCalc', function() {
  var unitCalc = new UnitCalc();
  unitCalc.init();
});

E.on('initTempCalc', function() {
  var tempCompCalc = new TempCompCalc();
  tempCompCalc.init();
});
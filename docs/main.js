/**
 * Properties
 * Since 2017-06-14 20:59:10
 * @author bitchunk
 */

//canvas
var VIEWMULTI = 2;//キャンバス基本サイズ拡大倍数
var CHIPCELL_SIZE = 8;//基本サイズ1辺り 8*8
var DISPLAY_WIDTH = 320;//キャンバス表示基本幅
var DISPLAY_HEIGHT = 240;//キャンバス表示基本高
var UI_SCREEN_ID = 'screen'; //イベント取得・拡大表示用

var SCROLL_MAX_SPRITES_DRAW = 32; //スプライト最大描画数
var SCROLL_MAX_SPRITES_STACK = 2048; //スプライト最大スタック数

var IMAGE_DIR = './img/'; //画像ファイル読み込みパス(URLフルパスも可)

//wordprint

var WORDPRINT_FONT8PX = 'font8p';
var WORDPRINT_FONT4V6PX = 'font4v6p';
var WORDPRINT_FONT12PX = 'font12p';



//keyevent
var KEYCONTROLL_HOLDTIME = 16; //キー固定判定時間[fps]

var SCROLL;

function UntunedTV(){
	return;
}
UntunedTV.prototype = {
	init: function(){
		this.sprites = {};
		this.testCount = 0;
		this.word8;
		this.keyControll = new KeyControll();
		this.soundEngine = new LitroSound();
		this.soundEffect = new LitroPlayer();
		this.bgPos = {x: 0, y: 0};
		this.colorSwap = false;
		this.reverseEnable = true;
		this.boost = false;
		this.count = 0;
		this.seed = 1;
		var self = this;
		makeCanvasScroll('bg1');
		makeCanvasScroll('bg2');
		makeCanvasScroll('sprite');
		makeCanvasScroll('tmp');
		makeCanvasScroll('screen');
		SCROLL = getScrolls();
		
		this.soundEngine.init();
		this.soundEffect.init('se');
		
		loadImages([['sprites', 8, 8], [WORDPRINT_FONT8PX, 8, 8]], function(){
			self.keyControll.initDefaultKey();
			self.keyControll.setKey('ext', 16);

			self.word8 = new WordPrint();
			self.word8.init('8px');
			self.initSprites();
			self.initDrawBG();
			self.drawNoiseBG();
			self.playNoiseSE();
			self.setVolume(0);
			self.main();
		});
	},
	
	initSprites: function(){
		var spr
			, msq = function(q){return makeSpriteQuery('sprites', q);}
			
		;
		//T:4() - B:12() - H:8
		spr = {
			noise: msq('1')
		};
		
		this.sprites = spr;
	},
	
	initDrawBG: function(){
		var bg1 = SCROLL.bg1
			, bg2 = SCROLL.bg2
			, scr = SCROLL.screen
			;
		bg1.clear(COLOR_BLACK);
		bg1.rasterVolatile = false;
		bg1.x = cellhto(0);
		
//		bg2.clear(COLOR_BLACK);
//		bg2.drawSprite(this.sprites.bgbout, 0, 0);
//		
//		bg2.drawSprite(this.sprites.bg2l, 0, cellhto(22));
//		bg2.rasterVolatile = false;
//		bg2.x = bg1.x + DISPLAY_WIDTH;
		
//		this.word8.setScroll(bg1);
//		this.word8.print('BGOUT', 0, 0);
//		this.word8.print('BG1L', 0, cellhto(21));
//		this.word8.print('BG1R', cellhto(16), cellhto(21));
//		this.word8.setScroll(bg2);
//		this.word8.print('BG2L', 0, cellhto(21));
		// this.word8.print('0', 0, cellhto(22));
	},
	
	drawNoiseBG: function(p){
		var bg = SCROLL.bg1
			, r = bg.getRect()
			, s = this.sprites.noise
			, x, y, w = s.w
			, xlen = r.w / w, ylen = r.h / w
		;
		
		p = p == null ? 5 : p;
		if(p > 0){
			for(y = 0; y < ylen; y++){
				for(x = 0; x < xlen; x++){
					if(x % (p + 8) == 0){
						s.vflip();
					}
					if((x + 4) % (p + 8) == 0){
						s.hflip();
					}
					s.rot();
					bg.drawSprite(s, x * w, y * w);
				}
			}
		}else{
			bg.resetRaster();
			bg.clear(COLOR_BLACK);
			bg.clear([124, 124, 124, 255], makeRect('0 0 5 18 *8'));
			bg.clear([188, 188, 188, 255], makeRect('5 0 5 18 *8'));
			bg.clear([0, 252, 252, 255], makeRect('10 0 5 18 *8'));
			bg.clear([252, 224, 168, 255], makeRect('15 0 5 18 *8'));

			bg.clear([88, 216, 84, 255], makeRect('20 0 5 18 *8'));
			bg.clear([216, 0, 204, 255], makeRect('25 0 5 18 *8'));
			bg.clear([248, 56, 0, 255], makeRect('30 0 5 18 *8'));
			bg.clear([0, 0, 252, 255], makeRect('35 0 5 18 *8'));

			bg.clear([0, 0, 252, 255], makeRect('0 18 5 2 *8'));
			bg.clear([216, 0, 204, 255], makeRect('10 18 5 2 *8'));
			bg.clear([252, 224, 168, 255], makeRect('20 18 5 2 *8'));
			bg.clear([188, 188, 188, 255], makeRect('30 18 5 2 *8'));

			bg.clear([68, 40, 188, 255], makeRect('0 20 7 5 *8'));
			bg.clear(COLOR_WHITE, makeRect('7 20 7 5 *8'));
			bg.clear([0, 64, 88, 255], makeRect('14 20 7 5 *8'));
		}
	},
	
	playNoiseSE: function(key){
		var se = this.soundEffect
			, events =this.soundEffect.eventsetData
			, set = function(type, time, val){
				events[0][type][time] = makeLitroElement(type, time, val);
			}
		;
		this.soundEngine.connectOff();
		this.soundEngine.connectOn();
		se.setSeekPosition(0);
		se.stop();
		se.clearEventsData();
		se.channel[0].resetChannelParams();
		
		key = key == null ? 88 : key;
		
//		set('waveType', 0, 12);
		if(key > 0){
			set('waveType', 0, 12 + (key % 4));
		}else{
			set('waveType', 0, 4);
		}
		set('volumeLevel', 0, 4);
		set('attack', 0, 0);
		set('decay', 0, 3);
		set('sustain', 0, 6);
//		set('decay', 1, 0);
		set('length', 0, 30);
		set('release', 0, 4);
		
//		set('note', 0, 88);
		if(key > 0){
			set('note', 0, 68 + (key % 20));
		}else{
			set('note', 0, 57);
		}
		set('event', 20, litroTuneProp('return').id);
		set('event', 4, litroTuneProp('restart').id);
		set('event', 5, litroTuneProp('noteextend').id);
		this.soundEffect.eventsetData = events;
		se.play();
	},
	
	rasterNoise: function(){
		var bg = SCROLL.bg1
			, r = bg.getRect()
			, c = this.count++, i
			, ry, rx, hw = (r.w / 2) | 0
			, pi = Math.PI
			, b
			, xa, a = 200, by = 1, xabd
			, rh = r.h, rw = r.w, rhrh = rh * rh
			, seed = this.seed
		;
		if(seed == 0){
			return;
		}
//		a = a * seed + (pi + seed);
		a += seed;
		xa = Math.sin((pi / (a * 2)) * c);
		xabd = pi / (30 / xa);
		
		for(i = 0; i < rh; i++){
			b = (Math.sin(xabd * (c + i)) * xa + 1);
			ry = i - ((b * rhrh * seed) + c) % rh;
			rx = ((((seed + b) * hw) % rw) - rw) * by;
			bg.setRasterHorizon(i, rx, ry);
		}
		
	},
	
	setVolume: function(input){
		var max = 0.01;
		if(input == 0){
			this.soundEffect.volume(0);
			return;
		}
		this.soundEffect.volume(max * (input * 0.01));
	},

	
	keyCheck: function()
	{
//		var cont = this.keyControll
//			, state = cont.getState(['up', 'down', 'left', 'right', 'ext'])
//			, trig = cont.getTrig(['select'])
//		;
//		if(state.left){
//			this.bgPos.x -= 1 + this.boost;
//		}
//		if(state.right){
//			this.bgPos.x += 1 + this.boost;
//		}
//		if(state.up){
//			this.bgPos.y += 1 + this.boost;
//		}
//		if(state.down){
//			this.bgPos.y -= 1 + this.boost;
//		}
//		
//		if(state.ext){
//			this.boost = true;
//		}else{
//			this.boost = false;
//		}
//		
//		if(trig.select){
//			this.colorSwap = !this.colorSwap;
//			this.swapBg(this.colorSwap);
//			if(!this.colorSwap){
//				this.reverseEnable = !this.reverseEnable;
//			}
//		}
	},
	main: function (){
		var self = this
		;
		this.rasterNoise();
		drawCanvasStacks();
		this.keyCheck();
		keyStateCheck();
		SCROLL.bg1.rasterto(SCROLL.tmp);
		SCROLL.bg1.rasterto(SCROLL.tmp, SCROLL.bg1.getSize().w);

		screenView(SCROLL.screen, SCROLL.tmp);
		requestAnimationFrame(function(){
			self.main();
		});
	}

};



document.addEventListener('DOMContentLoaded', function(){
	var app = new UntunedTV();
	app.init();
	
	document.querySelector('#volume').oninput = function(e){
//		console.log(e.target.value);
		app.setVolume(e.target.value);
	}
	document.querySelector('#mute').onclick = function(e){
		app.setVolume(0);
		document.querySelector('#volume').value = 0;
	}
	document.querySelector('#ch').onclick = function(e){
		var t = new Date();
		app.seed = t.getTime() % 50;
//		console.log(app.seed);
		app.drawNoiseBG(app.seed);
		app.playNoiseSE(app.seed);
	}
});

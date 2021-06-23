var titleArea = {};
var slots = [];
var questions = [];
var qIndex = 0;
var data = [];

var titleAudio = null;

var debug_ares = false;

var currentCanvas = null;
var currentDrawCanvas = null;
var currentObj = null;

var mouseDown = false;
var stopScratch = false;

//문제 맞췄을 때
function goNextExam(){
	var cha2 = $('#star');

	cha2.addClass('star2').append("<img class='cha2' src='/web/resource/img/flower/fl2/cha2.png' style='position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);'>");

	$(".star2").css("display", "block");
	$('.cha2').css('display','block');

	setTimeout(function(){
		$(".star2").css("display", "none");
		$('.cha2').css('display','none');
	}, 1500);
};

// function _flower_start() {
//   function gen_flowers(){
//     var p = $("#flowers");
//     for (var i=0; i < max_flowers; i ++){
//       var imgIndex = (i%26) + 1;
//       p.append("<img class='other' src='../fl/" + imgIndex +".png' style='position:absolute; display: none;'>");
//     }
//   };

//   $("#flowers").css("display", "block");
// 	var img = $(".other");
//   if (img.length == 0){
//     gen_flowers();
//     img = $(".other");
//   };

// 	img.each(function (index, value) {
//     	var image = $(this);
//     	var x = Math.random() * 101;
//     	var y = Math.random() * 101;
//     	image.css("left", parseInt(1280 * x / 100) + "px");
//     	image.css("top", y + parseInt(800 * y / 100) + "px");
//     	image.css("display", "block");
//     });

// 	fl_timer = setInterval(_flower_timer, 100);
// };

// function _flower_timer() {

// 	var img = $(".other");

// 	img.each(function (index, value) {

//     	var image = $(this);
//     	var x = Math.floor(Math.random() * 4);
//     	var y = 30;
//     	x += parseInt(image.css("left").replace("px",""));
//     	y += parseInt(image.css("top").replace("px",""));
//     	if (x > 1280) x = x - 1280;
//     	if (y > 800) y = y - 800;
//     	image.css("left", x + "px");
//     	image.css("top", y + "px");
//     });
// }

// function _flower_end() {

// 	if (fl_timer != null)
// 		clearInterval(fl_timer);

// 	fl_timer = null;

// 	var img = $(".other");

// 	img.each(function (index, value) {

//     	var image = $(this);
//     	image.css("display", "none");
//   });
//   $("#flowers").css("display", "none");
//   $("#flowers").empty();

// }

// function startShowStar(){
//   $(".star").css("opacity", 0);
//   $("#star").css("display", "block");

//   var i = 1;
//   var ani = setInterval(function(){
//     $(".star").css("opacity", 0);
//     var t = $("#" + "starEffect_" + i);
//     if (t.length){
//       t.css("opacity", 1);
//     }
//     else{
//       clearInterval(ani);
//       ani = null;
//       $(".star").css("opacity", 0);
//       $("#star").css("display", "none");
//     }
//     i++;
//   }, 50);
// }


// function loadStarAnimation(){
//   function pad(n, width) {
//     n = n + '';
//     return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
//   }
//   var div = $("#star");
//   for (var i = 1; i < 32; i++ ){
//     var img = $("<img class='star' style='opacity:0; position:absolute; left:0px; top:0px'>");
//     img.attr("src", "../star/" + i + ".png");
//     img.attr("id", "starEffect_" + i);
//     img.appendTo(div);
//   }
// }


function goNext(){

  var aN = $("#anext");

  aN.on("ended", function(){
    window.location = right_url;
  });
  aN[0].play();

}

function goPage(pageUrl){

  var aN = $("#anext");

  aN.on("ended", function(){
    window.location = pageUrl;
  });
    aN[0].play();
}

/* stop all audio */
function sa() {
  var audios = document.getElementsByTagName("audio");
  for (var i = 0; i < audios.length; i++) {
    var audio = audios[i];
    if (audio.id != "intro") {
      audio.onended = null;
      audio.pause();
      audio.currentTime = 0;
    }
  }
}

function getLocalCoords(elem, ev) {
  var ox = 0;
  var oy = 0;
  var first;
  var pageX, pageY;

      ox += elem.offset().left;
    oy += elem.offset().top;

  if (ev.type.startsWith("touch")) {
    first = ev.touches[0];
    pageX = first.pageX;
    pageY = first.pageY;
  } else {
    pageX = ev.pageX;
    pageY = ev.pageY;
  }

  return {
    'x': pageX - ox,
    'y': pageY - oy
  };
}


function recompositeCanvases(o) {

  var main = $(o["slot"]);
  var temp = o["canTemp"];
  var tempctx = temp.getContext('2d');
  var mainctx = main.find(".scratch")[0].getContext('2d');
  temp.width = temp.width;

  tempctx.drawImage(o["canDraw"], 0, 0);
  tempctx.globalCompositeOperation = 'source-atop';
  tempctx.drawImage(o["imgBack"], 0, 0);
  mainctx.drawImage(o["imgOver"], 0, 0);
  mainctx.drawImage(o["canTemp"], 0, 0);
}

function recompositeCanvasesWithoutDraw(o){
  var main = $(o["slot"]);
  var mainctx = main.find(".scratch")[0].getContext('2d');
  mainctx.drawImage(o["imgBack"], 0, 0);
}


function scratchLine(can, x, y, fresh) {
  var ctx = can.getContext('2d');
  ctx.lineWidth = 70;
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(255, 255, 255, 255)';
  if (fresh) {
    ctx.beginPath();
    ctx.moveTo(x + 0.01, y);
  }
  ctx.lineTo(x, y);
  ctx.stroke();
}


function setupCanvases(q) {

  q.options.forEach(function(o){
      var img = o["imgOver"];
      var slot = $(o["slot"]);
      var mCan = $(o["canvas"])[0];

      slot.css("width", img.width);
      slot.css("height", img.height);
      o["canTemp"].width = img.width;
      o["canTemp"].height = img.height;
      o["canDraw"].width = img.width;
      o["canDraw"].height = img.height;
      mCan.width = img.width;
      mCan.height = img.height;

      slot.on("mousedown touchstart", function(e){
        if (stopScratch == true)
          return;
        currentCanvas = $(o["slot"]);
        var local = getLocalCoords( currentCanvas, e);
        mouseDown = true;
        currentDrawCanvas = o["canDraw"];
        scratchLine(currentDrawCanvas, local.x, local.y, true);
        currentObj = o;
        recompositeCanvases(currentObj);
      });
      recompositeCanvases(o);
  });

}
function getFilledInPixels(canvas) {
  var stride = 4;

  var pixels   = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height),
      pdata    = pixels.data,
      l        = pdata.length,
      total    = (l / stride),
      count    = total;
  for(var i = 0; i < l; i += stride) {
    if (parseInt(pdata[i]) === 0) {
      count--;
    }
  }

  return Math.round((count / total) * 100);
}

function loadImages(q) {
  var loadCount = 0;
  var loadTotal = 0;
  var loadingIndicator;

  function imageLoaded(e) {
    loadCount++;

    if (loadCount >= loadTotal) {
      setupCanvases(q);
    }
  }

  q.options.forEach(function(opt){

    var slot = $(opt["slot"]);
    slot.css("left", opt["left"]);
    slot.css("top", opt["top"]);
    if (debug_area == true){
      slot.css("border", "2px solid red");
    }

    if (opt["imgBack"] != null){
      opt["imgBack"].remove();
    }
    var back  = document.createElement('img');
    back.addEventListener('load', imageLoaded, false);
    back.src = opt["img"];
    opt["imgBack"] = back;
    loadTotal++;

    if (opt["imgOver"] != null){
      opt["imgOver"].remove();
    }
    var over = document.createElement('img');
    over.addEventListener('load', imageLoaded, false);
    over.src = opt["over"];
    opt["imgOver"] = over;
    loadTotal++;
    if (opt["canTemp"] == null)
      opt["canTemp"] = document.createElement('canvas');
    if (opt["canDraw"] == null)
      opt["canDraw"] = document.createElement('canvas');
  });
}

function _playTitleAudio(){

  titleAudio.onended = function(){
    console.log("D");
  };
  titleAudio.play();


}

function initQuestion(){

  if (questions.length <= qIndex){
      return;
  }

  var q = questions[qIndex];
  loadImages(q);
//  $("#question").attr("src", q["q"]);
  stopScratch = false;
}

function init(){
  $("#click_pop").css("display","block");
  qIndex = 0;


  $(window).on("mousemove touchmove", function(ev){
    if (mouseDown == false) {
      return ;
    }
    var local = getLocalCoords( currentCanvas, ev);
    scratchLine(currentDrawCanvas, local.x, local.y, false);
    recompositeCanvases(currentObj);

  });

  $(window).on("mouseup touchend", function(ev){
    function success(){
      recompositeCanvasesWithoutDraw(currentObj);
      stopScratch = true;
      setTimeout(function(){
        qIndex ++;
        initQuestion();
      }, 1000);
    }

    function fail(){
      currentDrawCanvas.width = currentDrawCanvas.width;
      recompositeCanvases(currentObj);
    }

    if (mouseDown) {
      var pro = getFilledInPixels(currentDrawCanvas);
      if (pro > 40){
        var q = questions[qIndex];
        var sol = q["sol"] - 1;
        var index = q["options"].indexOf(currentObj);
        if (sol == index){
          _iclick('a_correct');
          $("#ans1").css("opacity","1");
          success();
            $("#star").css("z-index","100") ;
            // startShowStar();
            goNextExam();
            setTimeout(function(){
              $("#next").css("display","block");
              $("#next_arrow").css("display","block");
              //$("#prev").css("display","block") ;
              _blink("next_arrow",500);
            },2000) ;
        }
        else{
          _iclick('a_incorrect');
          initQuestion();
          //fail();
        }
      }
      else{
      //  fail();
        _iclick('a_incorrect');
        initQuestion();
      }
      mouseDown = false;
      currentObj = null;
      currentCanvas = null;
      currentDrawCanvas = null;
    }
  });

  initQuestion();
}

function _iclick(idx){
 sa();
 var ae = document.getElementById(idx);
 ae.play();
}

var jj = 1 ;
function _blink(bid,ae) {
    var my_timer = ae ;
    img_blink = setInterval(function(){

    if(jj++ % 2 == 0){
        $("#"+bid).css("opacity","0");
    } else {
        $("#"+bid).css("opacity", "1");
    }
  }, my_timer);
}

function popClose(){

  $(".popup").css("opacity","0");
  $("#popup, #play_popup").css("z-index","-100");
  $("#popClose").css("display","none");
  sa();
  _play(cur_index);
}

function popUp(){
  sa();
  $("#popup").css("opacity","1");
  $("#popup").css("z-index","1001");
  $("#play_popup").css("z-index","1001");
  $("#popClose, #play_popup").css("display","block");
  
  var audio = document.getElementById("a_popup");
  audio.play();

}

function _play_audio(file_name){
  sa();
  var ae = document.getElementById(file_name);
  ae.play();
 }

$(window).on("load", function(){

  var intro = document.getElementById('a_intro');
  intro.onended = function(){
    init();
    $("#click_pop,.click,#play_audio").css("display","block");
  }
  intro.play();
  // loadStarAnimation() ;
});
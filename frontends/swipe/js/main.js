/**
 * jTinder initialization
 */

// global variables
var currentPaneStyle = 5;
var labels = {};

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

function getLabelDef(){
    $.getJSON("./labels", function (json, status){
        labels = json;
    });
}

function addToStack(){
    var cardId = uuidv4();
    $("#tinderslide > ul").prepend("<li class=\"pane"+currentPaneStyle+"\" id=\""+cardId+"\"><div class=\"img\"><img /></div><div class=\"subtitle\">...</div><div class=\"like\"></div><div class=\"dislike\"></div></li>");
    $.getJSON("./sample", function (json, status){
              $("#"+cardId + " > .img > img").attr("src", json.data);
              $("#"+cardId + " > .img > img").css({"max-width": "100%", "max-height": "100%"});
              $("#"+cardId + " > .subtitle").html(json.name);

            });

    currentPaneStyle--;
    if(currentPaneStyle<1)
    {
         currentPaneStyle=5;
    }
}

function submitCard(item, swipe_dir)
{
    console.log(toType(item));
    var label = labels.labels.find(function(elem){
        return (elem.swipe_dir == swipe_dir);
    });
    var name = $(item).find(".subtitle").html();
    // todo: fill submit data and attributes
    $.post("/submit", { data: label.value, name: name, track: 1, gid: 0 });
    console.log(label.value + ": " + label.shortname);
}

for (var i=0; i<8; i++)
{
    addToStack();
}


$(document).ready(function(){

    // get label definition
    getLabelDef();

$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
        // set the status text
        submitCard(item, "left");
        $('#status').html('Dislike image ' + (item.index()+1));
    },
	// like callback
    onLike: function (item) {
        // set the status text
        submitCard(item, "right");
        $('#status').html('Like image ' + (item.index()+1));
    },
    onBeforeNext: function (item) {
        addToStack();
        $("#tinderslide").jTinder('startOver');
        item.remove();
    },
	animationRevertSpeed: 200,
	animationSpeed: 400,
	threshold: 1,
	likeSelector: '.like',
	dislikeSelector: '.dislike'
});

$(document).keypress(function(event) {
    if ( event.keyCode == 37 ) {
        event.preventDefault();
        $("#tinderslide").jTinder('dislike');
    }
    else if ( event.keyCode == 39 ) {
        event.preventDefault();
        $("#tinderslide").jTinder('like');
    }
});

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').click(function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});

});

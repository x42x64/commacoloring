/* Main page dispatcher.
*/

data = [];
color = [];
$.getJSON("/labels/description", function(a){
   data=a;
});

$.getJSON("/labels/color", function(a){
   color=a["colors"];
});


requirejs(['app/edit',
           'helper/colormap',
           'helper/util'],
function(editPage, colormap, util) {
  var params = util.getQueryParams();

  // Create a colormap for display. The following is an example.
  function createColormap(label, labels) {
    return (label) ?
      colormap.create("single", {
        size: labels.length,
        index: labels.indexOf(label)
      }) :
      [[255, 255, 255],
       [226, 196, 196],
       [64, 32, 32]].concat(colormap.create("hsv", {
        size: labels.length - 3
      }));
  }

  data.colormap = createColormap(params.label, data.labels);
  editPage(data, params);
});


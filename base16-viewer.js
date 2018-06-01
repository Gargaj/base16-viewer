var code_index = 0;
var css_index = 0;
var code_files;
var css_files;

function loadNextCodeFile() {
  if (code_index < code_files.length - 1) code_index++;
  else code_index = 0;
  
  loadCodeFile();
}

function loadPreviousCodeFile() {
  if (code_index > 0) code_index --;
  else code_index = code_files.length - 1;
  
  loadCodeFile();
}

function loadNextCssFile() {
  if (css_index < css_files.length - 1) css_index++;
  else css_index = 0;

  loadCssFile();
}

function loadPreviousCssFile() {
  if (css_index > 0) css_index --;
  else css_index = css_files.length - 1;
  
  loadCssFile();
}

function loadCodeFileName(name) {
  
    // Find index by name of css file minux extension
    for (var i=0; i < code_files.length; i++) {
      if (code_files[i].name.split('.')[0] === name) {
        code_index = i;
      }
    }
  
    loadCodeFile();
  }

function loadCssFileName(name) {

  // Find index by name of css file minux extension
  for (var i=0; i < css_files.length; i++) {
    if (css_files[i].name.split('.')[0] === name) {
      css_index = i;
    }
  }

  loadCssFile();
}

function loadCodeFile(url) {

  // Load new code file
  var code_call = new XMLHttpRequest();
  code_call.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('base16-viewer-code').innerHTML = this.responseText;
    }
  };
  code_call.open('GET', code_files[code_index].download_url, true);
  code_call.send();

  document.getElementById('base16-viewer-language-text').selectedIndex = code_index;
}

function loadCssFile() {

  // Load new css file
  document.getElementById('base16-viewer-css').href = css_files[css_index].download_url.replace("raw.githubusercontent.com", "cdn.rawgit.com");
  document.getElementById('base16-viewer-scheme-text').selectedIndex = css_index;

  // Update scheme index
  document.getElementById('base16-viewer-scheme-index').selectedIndex = css_index + 1;
}

// Handle key presses
document.onkeypress = function (e) {
e = e || window.event;
keyCode = e.keyCode || e.which;

// console.log(e.keyCode);
if (keyCode == 108) {
  loadNextCodeFile();
} 
else if (keyCode == 104) {
  loadPreviousCodeFile();
} 
else if (keyCode == 106) {
  loadNextCssFile();
} 
else if (keyCode == 107) {
  loadPreviousCssFile();
} 
};

// Add viewer HTML to page where script is called
document.write('\
<link id="base16-viewer-css" type="text/css" rel="stylesheet" href="" /> \
\
<style type="text/css" media="screen">\
  #base16-viewer pre { font-family: "menlo", "consolas", monospace; font-size: 14px; padding: 30px 40px; margin: 0; }\
  #base16-viewer-info { font-size: 14px; font-family: sans; padding: 20px 25px; }\
</style>\
\
<div id="base16-viewer">\
  <pre id="base16-viewer-code" class="base00-background base05"></pre>\
  \
  <div id="base16-viewer-info" class="base03 base01-background">\
    <div id="base16-viewer-scheme">Scheme <span id="base16-viewer-scheme-index">1</span> of <span id="base16-viewer-scheme-count">1</span>: <select id="base16-viewer-scheme-text" class="base04"></select></div>\
    <div id="base16-viewer-language">Language: <select id="base16-viewer-language-text" class="base04"></select></div>\
  </div>\
</div>');

// Load code file list and initial code file
var code_call = new XMLHttpRequest();
code_call.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    code_files = JSON.parse(this.responseText);
    var select = document.getElementById('base16-viewer-language-text');
    select.onchange = function(){
      code_index = select.selectedIndex;
      loadCodeFile();
    }
    for (var i=0; i < code_files.length; i++) {
      var opt = document.createElement('option');
      opt.value = code_files[i].name;
      opt.innerHTML = code_files[i].name.split('.')[0];
      select.appendChild(opt);
    }
    loadCodeFileName('ruby');
  }
};
code_call.open('GET', 'https://api.github.com/repos/chriskempson/base16-language-examples/contents/html', true);
code_call.send();

// Load css file list and initial css file
var css_call = new XMLHttpRequest();
css_call.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    css_files = JSON.parse(this.responseText);
    var select = document.getElementById('base16-viewer-scheme-text');
    select.onchange = function(){
      css_index = select.selectedIndex;
      loadCssFile();
    }
    for (var i=0; i < css_files.length; i++) {
      var opt = document.createElement('option');
      opt.value = css_files[i].name;
      opt.innerHTML = css_files[i].name.split('.')[0];
      select.appendChild(opt);
    }
    loadCssFileName('base16-default-dark');
    document.getElementById('base16-viewer-scheme-count').innerHTML = css_files.length;
  }
};
css_call.open('GET', 'https://api.github.com/repos/chriskempson/base16-html-previews/contents/css', true);
css_call.send();

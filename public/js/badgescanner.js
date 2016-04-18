var gCtx = null;
var gCanvas = null;
var stype = 0;
var gUM=false
var webkit = false;
var moz = false;
var v = null;

var initCanvas = function (w,h)
{
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
};

var success = function(stream) {
  v.src = window.URL.createObjectURL(stream);
  gUM=true;
};
	
var error = function(e) {
  gUM=false;
  return;
};

var captureToCanvas = function() {
  if(stype!=1)
      return;
  if(gUM)
  {
    try{
      gCtx.drawImage(v,0,0);
      try{
        qrcode.decode();
      }
      catch(e){       
        console.log(e);
      };
    }
    catch(e){       
      console.log(e);
    };
  }
}


initCanvas(500,500);

document.getElementById("result").innerHTML="";
var n=navigator;
document.getElementById("outdiv").innerHTML = '<video id="v" autoplay></video>';
v=document.getElementById("v");

if (n.getUserMedia) {
  n.getUserMedia({video: true, audio: false}, success, error);
} else if (n.mediaDevices.getUserMedia) {
  n.mediaDevices.getUserMedia({video: { facingMode: "environment"} , audio: false})
      .then(success)
      .catch(error);
} else if (n.webkitGetUserMedia) {
  webkit=true;
  n.webkitGetUserMedia({video:true, audio: false}, success, error);
} else if (n.mozGetUserMedia) {
  moz=true;
  n.mozGetUserMedia({video: true, audio: false}, success, error);
}
stype=1;

var interval = setInterval(captureToCanvas, 500);

var simplify = function(x) {
  if (!x) {
    return null;
  }
  var y = [];
  for(var i in x) {
    if (x[i].value) {
      y.push(x[i].value);
    }
  }
  return y.join(",");
}

var db = new PouchDB("badgescanner");
var ddoc = {
  _id: '_design/query',
  views: {
    byts: {
      map: function (doc) {
        if (typeof doc.ts != "number") {
          doc.ts = 0;
        }
        emit(doc.ts,null);      
      }.toString()
    }
  }
};
db.put(ddoc).catch(function (err) {
  // ignore if doc already exists
})

var renderTable = function() {
  var fn = function(doc) {
    if (typeof doc.ts == "number") {
      emit(doc.ts,null);      
    }
  };
  db.query("query/byts", {descending:true, include_docs:true} ).then(function (result) {
    console.log("query", result);
    var html = '<table class="primary">';
    html += '<thead><tr>';
    html += '<th>fn</th>';
    html += '<th>title</th>';
    html += '<th>org</th>';
    html += '<th>tel</th>';
    html += '<th>email</th>';
    html += '<th>adr</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    console.log(result);
    for(var i in result.rows) {
      var d = result.rows[i].doc;
      if (d) {
        console.log(d);
        html += '<tr>';
        html += '<td>' + d.fn + '</td>';
        html += '<td>' + d.title + '</td>';
        html += '<td>' + d.org + '</td>';
        html += '<td>' + d.tel + '</td>';
        html += '<td>' + d.email + '</td>';
        html += '<td>' + d.adr + '</td>';
        html += '</tr>';
      }
    }    
    html += '</tbody></table>';
    document.getElementById("thetable").innerHTML=html;
    // handle result
  }).catch(function (err) {
    console.log("query error",err);
  });  
};


qrcode.callback = function(data) {
//  clearInterval(interval);
  var myAudio = document.getElementById("myAudio"); 
  myAudio.play();
  var vcard = vcardParse(data);
  vcard.tel = simplify(vcard.tel);
  vcard.email = simplify(vcard.email);
  vcard.adr = simplify(vcard.adr);
  var d = new Date();
  vcard.ts = d.getTime();
  vcard.date = d.toISOString();
  console.log(vcard);
  db.post(vcard).then(function (response) {
    // handle response
    renderTable();
  }).catch(function (err) {
    console.log(err);
  });
};

renderTable();

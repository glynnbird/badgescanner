var gCtx = null;
var gCanvas = null;
var stype = 0;
var gUM=false
var webkit = false;
var moz = false;
var v = null;
var n = null;
var interval = null;

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
};

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
    if(result.rows.length>0) {
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
      for(var i in result.rows) {
        var d = result.rows[i].doc;
        if (d) {
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
    } else {
      html = "";
    }
    document.getElementById("thetable").innerHTML=html;
    // handle result
  }).catch(function (err) {
    console.log("query error",err);
  });  
};


var replicate = function() {
  document.getElementById("replicationstatus").innerHTML="";
  var url = document.getElementById("url").value;
  if(url) {
    var remoteDB = new PouchDB(url);
    db.replicate.to(remoteDB)
      .on("change", function(info) { 
        document.getElementById("replicationstatus").innerHTML = "IN PROGRESS - " + info.docs_written; 
      })
      .on("complete", function(info) { 
        document.getElementById("replicationstatus").innerHTML = "COMPLETE - " + info.docs_written;
      })
      .on("error",  function(err) { 
        document.getElementById("replicationstatus").innerHTML = "ERROR - " + JSON.strinfify(err);
      });
  }
};

qrcode.callback = function(data) {
  clearInterval(interval);
  var myAudio = document.getElementById("myAudio"); 
  myAudio.play();
  var vcard = vcardParse(data);
  vcard.tel = simplify(vcard.tel);
  vcard.email = simplify(vcard.email);
  vcard.adr = simplify(vcard.adr);
  var d = new Date();
  vcard.ts = d.getTime();
  vcard.date = d.toISOString();
  db.post(vcard).then(function (response) {
    // handle response
    renderTable();
    
    // prevent same one getting scanned twice.
    setTimeout(function() {
      interval = setInterval(captureToCanvas, 500);      
    },1500);
    
  }).catch(function (err) {
    console.log(err);
  });
};



window.addEventListener("DOMContentLoaded", function() {

  initCanvas(500,500);

  document.getElementById("result").innerHTML="";
  n=navigator;
  document.getElementById("outdiv").innerHTML = '<video id="v" autoplay></video>';
  v=document.getElementById("v");


  if (n.getUserMedia) {
    n.getUserMedia({video: true, audio: false}, success, error);
  } else if (n.mediaDevices && n.mediaDevices.getUserMedia) {
    n.mediaDevices.getUserMedia({video: { facingMode: "environment"} , audio: false})
        .then(success)
        .catch(error);
  } else if (n.webkitGetUserMedia) {
    webkit=true;
   // document.getElementById("extras").innerHTML = x[1 % L];
    n.webkitGetUserMedia({video:true, audio: false}, success, error);
  } else if (n.mozGetUserMedia) {
    moz=true;
    n.mozGetUserMedia({video: true, audio: false}, success, error);
  }
  stype=1;
  interval= setInterval(captureToCanvas, 500);

  renderTable();

});
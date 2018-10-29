

function GetSMFContent(){
 var c;
 var comp;

  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
	var pair = vars[i].split("=");
	if (pair[0] == "c"){
		if (pair[1] !=""){
			c = pair[1];
		}
	}
	if (pair[0] == "comp"){
		if (pair[1] !=""){
			comp = pair[1];
		}
	}
  }

  var xmlhttp = getR();
  if (xmlhttp){
	  var link = "http://www.smu.lv/WebShowCompProfile.hal?c=" + c + "&comp=" + comp;
         //alert(link);
	  xmlhttp.onreadystatechange = function(){
                //alert("" + xmlhttp.readyState + ";" + xmlhttp.status);

		  if (xmlhttp.readyState == 4 && xmlhttp.status ==200){
			alert(xmlhttp.responseText);
			 document.getElementById("proftext").innerHTML = xmlhttp.responseText;
		  }
	  }
	  xmlhttp.open('GET',link,true);
	  xmlhttp.send(null);
//document.getElementById("proftext").innerHTML = "test";


  }
}



function getR(){


	var xmlhttp;  // The variable that makes Ajax possible!
	try{
		xmlhttp = new XMLHttpRequest();
	} catch (e){
		try{
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				xmlhttp =  null;
			}
		}
	}


	return xmlhttp;
}
 


GetSMFContent();
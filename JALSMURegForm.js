function insertAfter(newElement, targetElement)
{
	var parent = targetElement.parentNode;
	
	if(parent.lastChild == targetElement)
	{
		parent.appendChild(newElement);
	}
	else
	{
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}



function showschoolarform(count) {
   
  try{
    if (document.getElementById("error").innerHTML == ""){
      document.getElementById("error").innerHTML = document.getElementById("error").innerHTML + "aizpildi tak";
      
    }
  } catch(e)
  {   
	  
      
	  
     document.getElementById('schoolar' + count).style.visibility = "Visible"; 
	
     document.getElementById('schoolarname' + count).setAttribute("value","");
     document.getElementById('schoolarsurname' + count).setAttribute("value","");
     document.getElementById('schoolaremail' + count).setAttribute("value","");
      count = count + 1;    
      var schoolar = document.createElement("div");
	  schoolar.setAttribute('class',"smallinput");
      schoolar.setAttribute('id',"schoolar" + count);
      var name = document.createElement("input");
      name.setAttribute('id','schoolarname' + count);
      name.setAttribute('type',"text");
      name.setAttribute('name',"schoolarname" + count);
      name.setAttribute('value',"");
      var surname = document.createElement("input");
      surname.setAttribute('id','schoolarsurname' + count);
      surname.setAttribute('type',"text");   
      surname.setAttribute('name',"schoolarsurname" + count);
      surname.setAttribute('value',"");
      var email = document.createElement("input");
      email.setAttribute('id','schoolaremail' + count);
      email.setAttribute('type',"text");
      email.setAttribute('name',"schoolaremail" + count);  
      email.setAttribute('onchange',"testemail(this.value);return false;");
      email.setAttribute('value',"");  
      
      
      
      var txtdiv = document.getElementById("addschoolar");  
      var navtag = document.getElementById("add");
      txtdiv.setAttribute('id','removeschoolar');
	  var textdiv = txtdiv.innerHTML;
      txtdiv.innerHTML = "-";  
      navtag.setAttribute('id','remove' + (count-1)); 
      navtag.setAttribute('onclick',"removeschoolarfromform(" + (count-1) + ");return false;");  
	  navtag.style.display="inline-block";
	  navtag.style.backgroundColor="lightblue";
	  navtag.setAttribute("style", navtag.getAttribute("style") + "; float:left; ");
	  navtag.style.marginLeft="-17px";
	  navtag.style.textAlign="center";
	  navtag.style.marginTop="3px";
	  navtag.style.marginRight="5px";
	  navtag.style.width="20px";
	  navtag.style.textDecoration="none";

      
      var atag = document.createElement("a");  
      atag.setAttribute('href',"#");
      atag.setAttribute('id',"add");     
      atag.setAttribute('onclick',"showschoolarform(" + (count) + ");return false;");  
      
      var adiv = document.createElement("div");
      adiv.setAttribute('id','addschoolar');  
      adiv.innerHTML = textdiv;    
	  
      atag.appendChild(adiv);    
	  if ((count)>4)
      { 
        atag.style.visibility="hidden";   
	  }
       
      insertAfter(schoolar, document.getElementById('schoolar' + (count - 1)));     
          schoolar.appendChild(name);
      schoolar.appendChild(surname);     
      schoolar.appendChild(email); 
      
	  
      schoolar.parentNode.insertBefore(atag,schoolar);  
    
      document.getElementById("schoolar" + count).style.visibility = "hidden";  
	  
	  
	  
	  document.getElementById("mainbox").style.height="";
	
  }
}



function removeschoolarfromform(count){
  
  var sdiv = document.getElementById("schoolar" + count);
  var pardiv = sdiv.parentNode;
  pardiv.removeChild(sdiv);

  sdiv = document.getElementById("remove" + count); 
  pardiv = sdiv.parentNode;
  pardiv.removeChild(sdiv);

  var i=count+1;
  var TrHs = true;
  var name;

  while (TrHs==true){
	  try{
		  sdiv = document.getElementById("schoolar" + i);  
      sdiv.setAttribute('id','schoolar' + (i-1));
      name = document.getElementById("schoolarname" + i);
      name.setAttribute('name',"schoolarname" + (i-1));
      name.setAttribute('id',"schoolarname" + (i-1));
      name = document.getElementById("schoolarsurname" + i);
      name.setAttribute('name',"schoolarsurname" + (i-1));
      name.setAttribute('id',"schoolarsurname" + (i-1));
      name = document.getElementById("schoolaremail" + i);
      name.setAttribute('name',"schoolaremail" + (i-1));  
      name.setAttribute('id',"schoolaremail" + (i-1));
      try{
        name = document.getElementById("remove" + (i));     
        name.setAttribute('id',"remove" + (i-1));   
        name.setAttribute('onclick',"removeschoolarfromform(" + (i-1) + ");return false;");   
      }
      
      catch (e2){
        name = document.getElementById("add");  
        name.setAttribute('onclick',"showschoolarform(" + (i-1) + ");return false;");  
		name.style.visibility="visible";    
      }
      i = i + 1;
	  }
	  catch (e){
    
        TrHs = false;
      
	  }
  }    
}



function TestEmail2(text){
  var error = document.getElementById("esameemail");
  error.style.visibility = "hidden";
  //var x = document.getElementById("errormsg");
  error.innerHTML = text;
 
  if (document.getElementById("samemailmsg").innerHTML=="")
  {

  }else {
  error.style.visibility="visible";
  }

}


function testeventfields(forma,err1,err2,err3,err4,err5){
  var TrHs;

  document.getElementById("ename").innerHTML = "";
  document.getElementById("eemail").innerHTML = "";
  document.getElementById("eschool").innerHTML = "";
  document.getElementById("edistrict").innerHTML = "";
  document.getElementById("ereg").innerHTML = "";
  TrHs = true;

  if (forma.name.value == "")
  {
      document.getElementById("ename").innerHTML = err1;  
	  TrHs = false;    
  }
  if (forma.email.value == "")
  {
      document.getElementById("eemail").innerHTML = err2;  
	  TrHs = false;    
  }

  if (document.getElementById("samemailmsg").innerHTML!="")
  {
	  TrHs = false;
  }
  if (forma.district.value =="-1")
  {
      document.getElementById("edistrict").innerHTML = err4;    
	  TrHs = false;   
  }
  if (forma.reg.value =="-1")
  {
      document.getElementById("ereg").innerHTML = err3;    
	  TrHs = false;   
  }
  if (forma.school.value =="-1")
  {
      document.getElementById("eschool").innerHTML = err5;    
	  TrHs = false;   
  }


  return TrHs;
}
/*
$(document).ready(function(){
  if ($("#recaptcha_form").length>0){
    AddRecaptchaField();
  }
})
*/

function AddRecaptchaField(){
  grecaptcha.ready(function() {
    grecaptcha.execute('6LdCi9oZAAAAAEgKHYwpPm-6EVPXHhSVcv-_3N9O', {action: 'create_comment'}).then(function(token) {
      $("#recaptcha_form").prepend("<input type='hidden' name='g-recaptcha-response' value='" + token  + "'>");
      $("#recaptcha_form").submit();
    });
   });  
}


function CheckSameEmailString(num,mail){
  var res = false;

  for (i = 0;i < num ;i++ ){
    email = document.getElementById("schoolaremail" + i); 
    if (email.value == mail){
      res = true;
    }
  }

   return res;
}


function TestEmail2(text){
  var error = document.getElementById("esameemail");
  error.style.display = "none";
  //var x = document.getElementById("errormsg");
  error.innerHTML = text;
  if (document.getElementById("samemailmsg").innerHTML=="")
  {
		 $("#schoolaremail0").removeClass("invalid");
  }else {
    error.style.display="block";
		$("#schoolaremail0").addClass("invalid");
  }

}

function TestSMU(text){
  var error = document.getElementById("esameSMUname");
  error.style.display = "none";
  //var x = document.getElementById("errormsg");
  error.innerHTML = text;
  if (document.getElementById("esameSMUmsg")){
    if (document.getElementById("esameSMUmsg").innerHTML=="")
    {

    }else {
    error.style.display="block";
    }
}

}

function compemails(err1,testf){
	//alert("hhh");
	var x = document.getElementById("regemail").value;
	var y = document.getElementById("regemail2").value;
	
    document.getElementById("ecompare").innerHTML="";

	if (testf==1){
		if (y == ""){
		}else {
			if (y!=x){
				document.getElementById("ecompare").innerHTML=err1;
			}
		}
	} else {
		if (y!=x){
			document.getElementById("ecompare").innerHTML=err1;
		}
	}
}

function compemails2(err1,testf,id){
	//alert("hhh");
	var x = document.getElementById(id).value;
	var y = document.getElementById(id + "2").value;
	
    document.getElementById("ecompare").innerHTML="";

	if (testf==1){
		if (y == ""){
		}else {
			if (y!=x){
				document.getElementById("ecompare").innerHTML=err1;
			}
		}
	} else {
		if (y!=x){
			document.getElementById("ecompare").innerHTML=err1;
		}
	}
}


function TestFieldsForSMU(forma,err1,err2,err3,err4,err5,err6,err7,err8,err9,err10){  
  var testf = true;
  var TrHs = true;
  var email;
  var name;
  var surname;
  forma = $("#recaptcha_form").get(0);
  
  document.getElementById("ename").innerHTML = "";
  document.getElementById("esurname").innerHTML = "";
  document.getElementById("eemail").innerHTML = "";
  document.getElementById("esmuname").innerHTML = "";
  document.getElementById("eschool").innerHTML = "";
  document.getElementById("eteacher").innerHTML = "";
  document.getElementById("epassword").innerHTML = "";
  document.getElementById("edistrict").innerHTML = "";
  document.getElementById("ereg").innerHTML = "";
  document.getElementById("eclass").innerHTML = "";


  if (forma.reg.value == "-1")
  {
	  TrHs = false;
	  document.getElementById("ereg").innerHTML = err9;
  }

  if (forma.school.value == "-1")  
  {
	  TrHs = false;
	  document.getElementById("eschool").innerHTML = err5;
  }
  
  if (forma.teacher.value == "-1")  
  {   
	  TrHs = false;
	  document.getElementById("eteacher").innerHTML = err6;
  }

  // if (forma.smuname.value == "")
  // {
  //     document.getElementById("esmuname").innerHTML = err1;
	//   TrHs = false;
  // } else {
	//   if (document.getElementById("esameSMUmsg").innerHTML != ""){
	// 	  TrHs = false;
	//   }
  // }

  if (forma.classnum.value == ""){
      document.getElementById("eclass").innerHTML = err10;      
	  TrHs = false;    
  }

  var tstr = forma.password1.value;
  if (tstr.length < 4)
  {
      TrHs = false;
	  document.getElementById("epassword").innerHTML = err7;
  }
  if (forma.password1.value != forma.password2.value)
  {  
      TrHs = false;
	  document.getElementById("epassword").innerHTML = err7;
  }
  if (forma.district.value =="-1")
  {  
      document.getElementById("edistrict").innerHTML = err8;    
	  TrHs = false;   
  }


  

 

      // email = document.getElementById("parentemail");
	  // name =  document.getElementById("parentname");
	  // surname =  document.getElementById("parentsurname");
      //
	  // if (name.value ==""){
		//   document.getElementById("ename").innerHTML = err2;
		//   TrHs = false;
	  // }
	  // if (surname.value == ""){
		// document.getElementById("esurname").innerHTML = err3;
		// TrHs = false;
	  // } 
      //
	  // if (email.value ==""){
		//   document.getElementById("eemail").innerHTML = err4;
		// 	TrHs = false;
	  // } else {
		//   try
		//   {
		 	if (document.getElementById("samemailmsg").innerHTML=="")
		 	{
		 	} else {
		 		TrHs=false;
		 		document.getElementById("schoolaremail0").setCustomValidity(document.getElementById("samemailmsg").innerHTML);
		 	}
		//   }
		//   catch (e)
		//   {
		//   }
	  // }


  //parbaude par darbinieku laukiem
  var i = 1;
  while (testf == true)    
  {    
    try
    {
 
      email = document.getElementById("schoolaremail" + i);     
	  name =  document.getElementById("schoolarname" + i); 
	  surname =  document.getElementById("schoolarsurname" + i);
      var test = 0;
	  if (name.value ==""){
		   
		  test = test + 1;
	  }
	  if (surname.value == ""){  
		
		test = test + 1; 
	  } 

	  if (email.value ==""){
		 
		  test = test + 1;
	  } else {
		  if (CheckSameEmailString(i,email.value)){
			 
			  test = test + 1;
		  }

	  }
      
	  if ((test < 3) && (test >0)){
		  
		  TrHs = false;
		  testf = false;
		  if (name.value ==""){
		  document.getElementById("ename").innerHTML = err2;  
		  }
		  if (surname.value == ""){  
			document.getElementById("esurname").innerHTML = err3;
		  } 

		  if (email.value =="" || (CheckSameEmailString(i,email.value))){
			  document.getElementById("eemail").innerHTML = err4;
		  }
	  }
	  if (test == 3){
		  
		  testf = false;
	  }
	  
      
        
      i = i + 1;    

    }
    catch (e)      
    {     
      testf = false;      
    }  
     
  }
   document.getElementById("mainbox").style.height="";     

   if (TrHs) {
    AddRecaptchaField();
   }
}

function TestFieldsForSMU2(forma,err1,err2,err3,err4,err5,err6,err7,err8,err9,err10){  
  var testf = true;
  var TrHs = true;
  var email;
  var name;
  var surname;
  
  document.getElementById("eschool").innerHTML = "";
  document.getElementById("eteacher").innerHTML = "";
  document.getElementById("edistrict").innerHTML = "";
  document.getElementById("ereg").innerHTML = "";


  if (forma.reg.value == "-1")
  {
	  TrHs = false;
	  document.getElementById("ereg").innerHTML = err9;
  }

  if (forma.school.value == "-1")  
  {
	  TrHs = false;
	  document.getElementById("eschool").innerHTML = err5;
  }
  
  if (forma.teacher.value == "-1")  
  {   
	  TrHs = false;
	  document.getElementById("eteacher").innerHTML = err6;
  }

  if (forma.district.value =="-1")
  {  
      document.getElementById("edistrict").innerHTML = err8;    
	  TrHs = false;   
  }


   document.getElementById("mainbox").style.height="";     

   return TrHs;
}


function TestFieldsForSTU(forma,err1,err2,err3,err4,err5,err6,err7,err8,err9,err10){  
  var testf = true;
  var TrHs = true;
  var email;
  var name;
  var surname;
  
  document.getElementById("ename").innerHTML = "";
  document.getElementById("esurname").innerHTML = "";
  document.getElementById("eemail").innerHTML = "";
  document.getElementById("esmuname").innerHTML = "";
  document.getElementById("eschool").innerHTML = "";
  document.getElementById("eteacher").innerHTML = "";
  document.getElementById("epassword").innerHTML = "";



  if (forma.school.value == "")  
  {
	  TrHs = false;
	  document.getElementById("eschool").innerHTML = err5;
  }
  
  if (forma.teacher.value == "")  
  {   
	  TrHs = false;
	  document.getElementById("eteacher").innerHTML = err6;
  }

  if (forma.smuname.value == "")   
  {
      document.getElementById("esmuname").innerHTML = err1;      
	  TrHs = false;    
  } else {
	  if (document.getElementById("esameSMUmsg").innerHTML != ""){
		  TrHs = false;
	  }
  }

  var tstr = forma.password1.value;
  if (tstr.length < 4)
  {
      TrHs = false;
	  document.getElementById("epassword").innerHTML = err7;
  }
  if (forma.password1.value != forma.password2.value)
  {  
      TrHs = false;
	  document.getElementById("epassword").innerHTML = err7;
  }
  if (document.getElementById("ecompare").innerHTML!="")
  {
	  TrHs = false;
  }


  

 

      email = document.getElementById("schoolaremail0");     
	  name =  document.getElementById("schoolarname0"); 
	  surname =  document.getElementById("schoolarsurname0");

	  if (name.value ==""){
		  document.getElementById("ename").innerHTML = err2;  
		  TrHs = false;
	  }
	  if (surname.value == ""){  
		document.getElementById("esurname").innerHTML = err3;
		TrHs = false;  
	  } 

	  if (email.value ==""){
		  document.getElementById("eemail").innerHTML = err4;
			TrHs = false;
	  } else {
		  try
		  {
			if (document.getElementById("samemailmsg").innerHTML=="")
			{
			}else {
				TrHs=false;
			}
		  }
		  catch (e)
		  {
		  }
	  }

   document.getElementById("mainbox").style.height="";     

   return TrHs;


}


function TestFieldsForTeacher(forma,err1,err2,err3,err4,err5,err6,err7,err8,err9,err10,err11,err12){
  var testf = true;
  var TrHs = true;
  var email;
  var name;
  var surname;

  forma = $("#recaptcha_form").get(0);
  
  document.getElementById("ename").innerHTML = "";
  document.getElementById("epk").innerHTML = "";
  document.getElementById("etel").innerHTML = "";
  document.getElementById("eemail").innerHTML = "";
  document.getElementById("ecode").innerHTML = "";
  document.getElementById("eschool").innerHTML = "";
  document.getElementById("esubject").innerHTML = "";
  document.getElementById("epassword").innerHTML = "";
  document.getElementById("edistrict").innerHTML = "";
  document.getElementById("ereg").innerHTML = "";
  document.getElementById("econtract").innerHTML = "";
  //document.getElementById("ecompare").innerHTML = ""; 

  if (forma.name.value == "")
  {
      document.getElementById("ename").innerHTML = err1;  
	  TrHs = false;    
  }
  if (forma.contract.value == "")
  {
      document.getElementById("econtract").innerHTML = err12;  
	  TrHs = false;    
  }
  if (forma.school.value == "-1")
  {
	  TrHs = false;
	  document.getElementById("eschool").innerHTML = err7;
  }
  if (forma.reg.value == "-1")
  {
	  TrHs = false;
	  document.getElementById("ereg").innerHTML = err11;
  }
  if (forma.subject.value == "-1")
  {
	  TrHs = false;
	  document.getElementById("esubject").innerHTML = err8;
  }
  if (forma.district.value =="-1")
  {
      document.getElementById("edistrict").innerHTML = err10;    
	  TrHs = false;   
  }
  var tstr = forma.password1.value;
  if (tstr.length < 4)
  {
      TrHs = false;
	  document.getElementById("epassword").innerHTML = err9;
  }
  if (forma.password1.value != forma.password2.value)
  {  
      TrHs = false;
	  document.getElementById("epassword").innerHTML = err9;
  }
  if (forma.tel.value == "")
  {
      document.getElementById("etel").innerHTML = err3;  
	  TrHs = false;    
  }
  if (forma.email.value == "")
  {
      document.getElementById("eemail").innerHTML = err4;  
	  TrHs = false;    
  }

  if (document.getElementById("ecompare").innerHTML!="")
  {
	  TrHs = false;
  }
  if (document.getElementById("samemailmsg").innerHTML!="")
  {
	  TrHs = false;
  }
  if (document.getElementById("regemail2").value=="")
  {  
	  document.getElementById("ecompare").innerHTML = err6;  
	  TrHs = false;
  }

  var test = forma.name.value;  

  var name1 = test.substring(0,test.indexOf(" "));
  var name2 = test.substring(test.indexOf(" ")+1);

  document.getElementById("mainbox").style.height="";

  if (TrHs) {
    AddRecaptchaField();
  }
 

}
 
function TestFieldsForMentor(forma,err1,err2,err3,err4,err5,err7,err8,err9,err10,err11){
  var testf = true;
  var TrHs = true;
  var email;
  var name;
  var surname;
  
  document.getElementById("ename").innerHTML = "";
  document.getElementById("ecomp").innerHTML = "";
  document.getElementById("eemail").innerHTML = "";
  document.getElementById("etel").innerHTML = "";
  document.getElementById("ejob").innerHTML = "";
  
  document.getElementById("ecode").innerHTML = "";
  document.getElementById("epassword").innerHTML = "";
  document.getElementById("edistrict").innerHTML = "";
  document.getElementById("ereg").innerHTML = "";


  if (forma.name.value == "")
  {
      document.getElementById("ename").innerHTML = err1;    
	  TrHs = false;    
  }

  if (forma.district.value =="-1")
  {
      document.getElementById("edistrict").innerHTML = err10;    
	  TrHs = false;   
  }
  if (forma.reg.value == "-1")
  {
	  TrHs = false;
	  document.getElementById("ereg").innerHTML = err11;
  }

  if (forma.comp.value == "")
  {
      document.getElementById("ecomp").innerHTML = err2;  
	  TrHs = false;    
  }
  if (forma.tel.value == "")
  {
      document.getElementById("etel").innerHTML = err4;
		  //amats err3;  
	  TrHs = false;    
  }
  var tstr = forma.password1.value;
  if (tstr.length < 4)
  {
      TrHs = false;
	  document.getElementById("epassword").innerHTML = err9;
  }
  if (forma.password1.value != forma.password2.value)
  {  
      TrHs = false;
	  document.getElementById("epassword").innerHTML = err9;
  }

  if (forma.email.value == "")
  {
      document.getElementById("eemail").innerHTML = err5;  
	  TrHs = false;    
  }
  
  if (forma.job.value == "")
  {
      document.getElementById("ejob").innerHTML = err3;
		  // pilseta err6;  
	  TrHs = false;    
  }

  if (document.getElementById("ecompare").innerHTML!="")
  {
	  TrHs = false;
  }
  if (document.getElementById("samemailmsg").innerHTML!="")
  {
	  TrHs = false;
  }
  if (document.getElementById("regemail2").value=="")
  {  
	  document.getElementById("ecompare").innerHTML = err8;  
	  TrHs = false;
  }

  var test = forma.name.value;  

  var name1 = test.substring(0,test.indexOf(" "));
  var name2 = test.substring(test.indexOf(" ")+1);

  if ((name1.charAt(0)+name2.charAt(0) + name2.charAt(name2.length-1))==forma.spam.value)
  {  
	  //Trhs=false
  } else {
	  TrHs = false;   
      document.getElementById("ecode").innerHTML = err7;
		 // alert("Nav pareizs kods, ja gribi ko mainiit Gati- fails - testfields.js");   
	  }
 
   document.getElementById("mainbox").style.height="";    
   
   return TrHs;   


}

$(document).ready(function(){
  $("input").filter("[required]").on("change invalid",function(){
    this.setCustomValidity("");
    if (!this.validity.valid)
      this.setCustomValidity(jal_str["Reg_FillIn"]);
  });
  $("input[name='tel']").on("change invalid",function(){
    this.setCustomValidity("");
    if (!this.validity.valid)
      this.setCustomValidity(jal_str["Reg_Phone"]);
  });
  $("input[name='classchar']").on("change invalid",function(){
    this.setCustomValidity("");
    if (!this.validity.valid)
      this.setCustomValidity(jal_str["Reg_Class"]);
  });
});
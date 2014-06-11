function getIp()
{
	return "http://localhost:3000";
}
	
function checkLogin(type)
{
	
	var id=document.getElementById("user").value;
	var password=document.getElementById("password").value;
		
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
		
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var res = JSON.parse(xmlhttp.responseText);
			console.log(res.status);
			if(res.status=="true")
			{
				if(res.type=="lecturer")
				{
					localStorage.setItem("lecturer_id",res.id);
					window.location=getIp()+"/lecturerindex";
				}
				
				else if(res.type=="student")
				{
					localStorage.setItem("student_id",res.id);
					window.location=getIp()+"/studentindex";
				}
			}
				
			else if(res.status=="false")
			{
				alert("incorrect username or password");
			}
		}
	}
	xmlhttp.open("POST",getIp()+"/"+type+"loginreq",true); //lecturerloginreq or studentloginreq
	xmlhttp.setRequestHeader("Content-type","application/json");

	xmlhttp.send(JSON.stringify({'user':id, 'pass':password}));
}

function register()
{
	var string = "";
	var has_started_string_construction=false;
	
	var id=trim(document.getElementById("user").value);
	var title=trim(document.getElementById("title").value);
	var fname=trim(document.getElementById("fname").value);
	var lname=trim(document.getElementById("lname").value);
	var email=trim(document.getElementById("email").value);
	var pass=trim(document.getElementById("password").value);
	
	var check_email=validEmail(email);
	
	
	if(id=="" || id==null)
	{
		has_started_string_construction=true;
		string+="Please enter a Personnel ID";
	}
	
	if(title=="" || fname==null)
	{
		if(!has_started_string_construction)
		{
			has_started_string_construction=true;
			string+="Please enter a valid title";
		}
		
		else
		{
			string+=", title";
		}
	}
	
	if(fname=="" || fname==null)
	{
		if(!has_started_string_construction)
		{
			has_started_string_construction=true;
			string+="Please enter a valid name";
		}
		
		else
		{
			string+=", name";
		}
	}
	
	if(lname=="" || fname==null)
	{
		if(!has_started_string_construction)
		{
			has_started_string_construction=true;
			string+="Please enter a valid surname";
		}
		
		else
		{
			string+=", surname";
		}
	
	}
	
	if(email=="" || email==null || !check_email)
	{
		if(!has_started_string_construction)
		{
			has_started_string_construction=true;
			string+="Please enter a valid email";
		}
		
		else
		{
			string+=", email";
		}
	
	}
	
	if(pass=="")
	{
		if(!has_started_string_construction)
		{
			has_started_string_construction=true;
			string+="Please enter a valid password";
		}
		
		else
		{
			string+=", password";
		}
	
	}
	
	if(has_started_string_construction){
		document.getElementById("error").innerHTML=string;
	}
	
	else{
		document.getElementById("error").innerHTML=""
		
		var xmlhttp;
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
			
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				var res = JSON.parse(xmlhttp.responseText);
				console.log(res.status);
				if(res.status=="true")
				{
					alert("Registration successful. You will now be redirected to the login page");
					window.location=getIp()+"/lecturer";
					
				}
					
				else if(res.status=="false")
				{
					alert(res.error);
				}
			}
		}
		xmlhttp.open("POST",getIp()+"/registerlecturer",true); //lecturerloginreq or studentloginreq
		xmlhttp.setRequestHeader("Content-type","application/json");

		xmlhttp.send(JSON.stringify({'id':id, 'pass':pass, 'title':title, 'fname':fname, 'lname':lname, 'email':email}));
	}

}

function trim (str)
{
	//returns string without leading or trailing spaces
	return str.replace (/^\s+|\s+$/g, '');
}

function validEmail(email)
{
	var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=email.length) {
        return false;
    }
	
	else{
		return true;
	}
}
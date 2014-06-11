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
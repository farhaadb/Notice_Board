function send(receiver_ids, type, title, body)
{
	var gcm = require("node-gcm");
	var message = new gcm.Message();
	var sender = new gcm.Sender('AIzaSyBzHYvdf6Dy8_JQZi9BPSePEwb8AVsycuM');
	
	var ids=[];
	
	for(var i=0; i<receiver_ids.length; ++i)
	{
		ids.push(receiver_ids[i].device_id);
	}

	message.addDataWithKeyValue('title', title);
	message.addDataWithKeyValue('message',body);
	message.addDataWithKeyValue('type',type);
	//message.addData('msgcnt','4'); // Shows up in the notification in the status bar


	sender.send(message, ids, 4, function (result) { 
		console.log(result); 
	});
	

	
}

exports.send = send;
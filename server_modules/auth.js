module.exports = function() {
 return function checkAuth(req, res, next) {
		
		if((req.url).indexOf("/studentindex")!=-1)
		{
			console.log(req.session.student_id);
			if (!req.session.student_id) {
				res.send('You are not authorized to view this page');
			} else {
			next();
			}
		}
		
		else if((req.url).indexOf("/lecturerindex")!=-1)
		{
			if (!req.session.lecturer_id) {
				res.send('You are not authorized to view this page');
			} else {
			next();
			}
		}
	}
};
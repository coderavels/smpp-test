var smpp = require("smpp")

function checkAsyncUserPass(id, password, callback) {
	console.log("Authenticated")
	callback(null)
}

var server = smpp.createServer(function(session) {
	session.on('bind_transceiver', function(pdu) {
		// we pause the session to prevent further incoming pdu events,
		// untill we authorize the session with some async operation.
		session.pause();
		checkAsyncUserPass(pdu.system_id, pdu.password, function(err) {
			if (err) {
				session.send(pdu.response({
					command_status: smpp.ESME_RBINDFAIL
				}));
				session.close();
				return;
			}
			session.send(pdu.response());
			session.resume();
		});
	});
	session.on('submit_sm', function(pdu) {
		console.log(pdu)
	})
});
server.listen(2775);
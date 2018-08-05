const admin = require('firebase-admin');

module.exports = function(RED) {
	function FirestoreUpdateNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;

		this.status({
			fill : "red",
			shape : "ring",
			text : "disconnected"
		});

		admin.initializeApp({
      credential: admin.credential.cert(config.key)
    });
    
    let db = admin.firestore();

    let doc = db.collection(config.collection).doc(config.document);

    let observer = doc.onSnapshot(docSnapshot => {
      node.send({
				payload : docSnapshot
			});
    }, err => {
      node.send({
        error: err,
        payload: null
      });
    });

		this.status({
			fill : "green",
			shape : "dot",
			text : "connected"
		});
	}
	RED.nodes.registerType("firestore-update", FirestoreUpdateNode);
}
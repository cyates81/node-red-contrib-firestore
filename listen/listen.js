const admin = require('firebase-admin');

module.exports = function(RED) {
	function FirestoreListenNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;

		this.status({
			fill : "red",
			shape : "ring",
			text : "disconnected"
    });

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(config.key)
      });
    }		
    
    let db = admin.firestore();

    let doc = db.collection(config.collection).doc(config.document);

    let observer = doc.onSnapshot(docSnapshot => {
      if (this.status.text == "disconnected") {
        this.status({
          fill : "green",
          shape : "dot",
          text : "connected"
        });
      }
      node.send({
				payload : docSnapshot.data()
			});
    }, err => {
      node.send({
        error: err,
        payload: null
      });
    });
	}
	RED.nodes.registerType("firestore-listen", FirestoreListenNode);
}
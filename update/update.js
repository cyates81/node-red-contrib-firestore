const admin = require('firebase-admin');

module.exports = function(RED) {
	function FirestoreUpdateNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(config.key)
      });
    }
    
    let db = admin.firestore();
    let doc = db.collection(config.collection).doc(config.document);
    
    this.on('input', function(msg) {
      /* 
        There's some weird bug with Firestore where it returns 
        Error: Argument "data" is not a valid Document. Input is not a plain JavaScript object.
        Current fix is just to use Object.assign({}...
      */
      let data = Object.assign({}, msg.payload);  
      doc.set(data, {merge: config.merge});
    });
	}
	RED.nodes.registerType("firestore-update", FirestoreUpdateNode);
}
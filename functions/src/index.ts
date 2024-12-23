import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import algoliasearch from "algoliasearch";

// Initialisez Firebase
admin.initializeApp();

// Initialisez Algolia
const ALGOLIA_APP_ID = "BO8XNC7ZUR";
const ALGOLIA_ADMIN_KEY = "5e25dcb50f2dacc622abacfb4a0bc360";
const ALGOLIA_INDEX_NAME = "ref";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

// Fonction pour ajouter un document Firestore à Algolia
exports.onRefCreated = functions.firestore.document("ref/{refId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const objectID = snap.id;

    await index.saveObject({...data, objectID});
  });

// Fonction pour mettre à jour un document Firestore dans Algolia
exports.onRefUpdated = functions.firestore.document("ref/{refId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const objectID = change.after.id;

    await index.saveObject({...newData, objectID});
  });

// Fonction pour supprimer un document Firestore d'Algolia
exports.onRefDeleted = functions.firestore.document("ref/{refId}")
  .onDelete(async (snap, context) => {
    const objectID = snap.id;

    await index.deleteObject(objectID);
  });


// Fonction Cloud pour resynchroniser tous les documents
exports.syncAllDataToAlgolia = functions.https.onRequest(async (req, res) => {
  try {
    const firestore = admin.firestore();
    const batchSize = 1000;
    const collectionRef = firestore.collection("ref");
    let lastDocument = null;

    let hasMoreDocuments = true;
    while (hasMoreDocuments) {
      let query = collectionRef.orderBy("__name__").limit(batchSize);
      if (lastDocument) {
        query = query.startAfter(lastDocument);
      }

      const snapshot = await query.get();

      if (snapshot.empty) {
        hasMoreDocuments = false;
        break;
      }

      const objectsToIndex = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          objectID: doc.id,
          ...data,
        };
      });

      await index.saveObjects(objectsToIndex);

      lastDocument = snapshot.docs[snapshot.docs.length - 1];
    }

    res.status(200).send("Synchronisation réussie");
  } catch (error) {
    console.error("Erreur lors de la synchronisation :", error);
    res.status(500).send("Erreur lors de la synchronisation");
  }
});

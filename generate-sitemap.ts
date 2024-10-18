const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Remplace par le chemin vers ta clé Firebase JSON téléchargée depuis Firebase Console
const serviceAccount = require("./firebase-key.json");

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://boite-a-ref.firebaseio.com",
});

// Accéder à Firestore
const db = admin.firestore();

// Fonction pour générer le sitemap
async function generateSitemap() {
  try {
    // Récupérer toutes les données depuis une collection (remplace 'your-collection' par ta collection)
    const collectionRef = db.collection("ref");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    // Stocker les données dans un tableau
    const data: { slug: string, updatedAt?: string }[] = [];
    snapshot.forEach((doc: any) => {
      const docData = doc.data();
      data.push({
        slug: doc.id || "", // Remplace 'slug' par le champ qui correspond à l'URL
        updatedAt: docData['updatedAt'] || new Date().toISOString().split("T")[0], // Champ pour la date de mise à jour
      });

      console.log(doc.id);
    });

    // Générer le sitemap XML
    const baseUrl = "https://jai-la-ref.com"; // Remplace par ton domaine
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${data.map((item) => `
    <url>
      <loc>${baseUrl}/refs/${item.slug}</loc>
      <lastmod>${item.updatedAt}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join("")}
</urlset>
`;

    // Sauvegarder le fichier sitemap.xml
    const filePath = path.join(__dirname, "src", "assets", "sitemap.xml");
    fs.writeFileSync(filePath, sitemap);
    console.log("Sitemap generated successfully at", filePath);
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap", error);
  }
}

// Appeler la fonction pour générer le sitemap
generateSitemap();

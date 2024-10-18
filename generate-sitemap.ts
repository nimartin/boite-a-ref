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
    // Récupérer toutes les données depuis une collection (remplace 'ref' par ta collection)
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
        slug: doc.id || "", // Utilise doc.id comme partie dynamique de l'URL
        updatedAt: docData['updatedAt'] || new Date().toISOString().split("T")[0], // Date de mise à jour
      });
    });

    // Routes statiques à ajouter en haut du sitemap
    const staticUrls = [
      {
        loc: "/", // Page d'accueil
        lastmod: new Date().toISOString().split("T")[0], // Date actuelle pour le 'lastmod'
        changefreq: "daily",
        priority: 1.0,
      },
      {
        loc: "/refs", // Infinite scroll
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: 0.8,
      },
      {
        loc: "/dashboard/refs", // Refs tendances
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: 0.8,
      },
    ];

    // Générer le sitemap XML
    const baseUrl = "https://jai-la-ref.com"; // Remplace par ton domaine
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls.map(url => `
    <url>
      <loc>${baseUrl}${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>
  `).join('')}
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

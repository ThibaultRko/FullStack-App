const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3001;



const db = new sqlite3.Database('database.db');

// Utilisez CORS comme middleware
app.use(cors());

// Création de la table "items" et insertion de données initiales au démarrage du serveur
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');

  // Insérer des données initiales si la table est vide
  db.get('SELECT COUNT(*) as count FROM items', (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row.count === 0) {
      // La table est vide, insérez des données initiales
      const initialData = [
        { name: 'Premier élément' },
        { name: 'Deuxième élément' },
        { name: 'Troisième élément' },
      ];

      const insertStatement = db.prepare('INSERT INTO items (name) VALUES (?)');

      initialData.forEach((item) => {
        insertStatement.run(item.name);
      });

      insertStatement.finalize(); // Finalisez la transaction d'insertion
    }
  });
});




app.use(express.json());

app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Le champ "name" est requis.' });
    return;
  }
  db.run('INSERT INTO items (name) VALUES (?)', [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name });
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});


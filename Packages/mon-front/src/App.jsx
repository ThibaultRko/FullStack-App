import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState(null); // Nouvel état pour gérer les erreurs

  useEffect(() => {
    fetch('http://localhost:3001/api/items')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Réponse HTTP non OK');
        }
        return response.json();
      })
      .then((data) => setItems(data))
      .catch((error) => {
        setError('Erreur lors de la récupération des données');
        console.error('Erreur lors de la récupération des données', error);
      });
  }, []);

  const addItem = () => {
    fetch('http://localhost:3001/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newItem }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Réponse HTTP non OK');
        }
        return response.json();
      })
      .then((data) => {
        setItems([...items, data]);
        setNewItem('');
      })
      .catch((error) => {
        setError('Erreur lors de l\'ajout d\'un élément');
        console.error('Erreur lors de l\'ajout d\'un élément', error);
      });
  };

  return (
    <div>
      <h1>Liste d'éléments</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Afficher l'erreur */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <h2>Ajouter un élément</h2>
      <input
        type="text"
        placeholder="Nom de l'élément"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={addItem}>Ajouter</button>
    </div>
  );
}

export default App;





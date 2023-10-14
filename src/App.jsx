import React, { useState } from 'react';
import './App.css';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
const API_URL = 'https://api.thecatapi.com/v1/images/search';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewCatImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'x-api-key': ACCESS_KEY,
        },
        credentials: 'omit',
      });

      if (response.ok) {
        const data = await response.json();
        const newImage = data[0];

        // Filter out banned attributes
        if (newImage.breeds && newImage.breeds[0]) {
          newImage.breeds[0] = {
            ...newImage.breeds[0],
            name: bannedAttributes.includes(newImage.breeds[0].name) ? '' : newImage.breeds[0].name,
            temperament: bannedAttributes.includes(newImage.breeds[0].temperament) ? '' : newImage.breeds[0].temperament,
            origin: bannedAttributes.includes(newImage.breeds[0].origin) ? '' : newImage.breeds[0].origin,
            life_span: bannedAttributes.includes(newImage.breeds[0].life_span) ? '' : newImage.breeds[0].life_span,
            weight: {
              imperial: bannedAttributes.includes(newImage.breeds[0].weight.imperial) ? '' : newImage.breeds[0].weight.imperial,
            },
          };
        }

        setPrevImages([...prevImages, currentImage]);
        setCurrentImage(newImage);
      } else {
        console.error('Failed to fetch cat image');
      }
    } catch (error) {
      console.error('Error fetching cat image:', error);
      alert('Failed to fetch cat image. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const banAttribute = (attribute) => {
    setBannedAttributes([...bannedAttributes, attribute]);
  };

  return (
    <div className="entirePage">
      <h1>Cool Cats</h1>
      <h2>Discover Cats From Around The World!</h2>

      {currentImage && currentImage.breeds && currentImage.breeds[0] && (
        <div>
          <img src={currentImage.url} alt="Random Cat" width={200} height={200} />
          <div>
            <h3>Breed Information</h3>
            {currentImage.breeds[0].name && (
              <button onClick={() => banAttribute(currentImage.breeds[0].name)}>
                Name: {currentImage.breeds[0].name}
              </button>
            )}
            {currentImage.breeds[0].temperament && (
              <button onClick={() => banAttribute(currentImage.breeds[0].temperament)}>
                Temperament: {currentImage.breeds[0].temperament}
              </button>
            )}
            {currentImage.breeds[0].origin && (
              <button onClick={() => banAttribute(currentImage.breeds[0].origin)}>
                Origin: {currentImage.breeds[0].origin}
              </button>
            )}
            {currentImage.breeds[0].life_span && (
              <button onClick={() => banAttribute(currentImage.breeds[0].life_span)}>
                Life Span: {currentImage.breeds[0].life_span}
              </button>
            )}
            {currentImage.breeds[0].weight.imperial && (
              <button onClick={() => banAttribute(currentImage.breeds[0].weight.imperial)}>
                Weight: {currentImage.breeds[0].weight.imperial}
              </button>
            )}
          </div>
        </div>
      )}

      <div>
        <h3>Banned Attributes</h3>
        <ul>
          {bannedAttributes.map((attribute, index) => (
            <li key={index}>{attribute}</li>
          ))}
        </ul>
      </div>

      <button onClick={fetchNewCatImage} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Fetch a New Cat'}
      </button>
    </div>
  );
}

export default App;

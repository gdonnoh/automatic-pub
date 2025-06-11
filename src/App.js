import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [pageAccessToken, setPageAccessToken] = useState('');
  const [postText, setPostText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      setAccessToken(response.accessToken);
      setIsLoggedIn(true);
      setMessage('Login effettuato con successo!');
      // Recupera le pagine gestite
      try {
        const res = await axios.get(
          `https://graph.facebook.com/v18.0/me/accounts?fields=name,id,access_token&access_token=${response.accessToken}`
        );
        console.log('Pagine ricevute:', res.data);
        setPages(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedPage(res.data.data[0].id);
          setPageAccessToken(res.data.data[0].access_token);
        }
      } catch (err) {
        setMessage('Errore nel recupero delle pagine: ' + err.message);
      }
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handlePageChange = (e) => {
    const pageId = e.target.value;
    setSelectedPage(pageId);
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      setPageAccessToken(page.access_token);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!selectedPage || !pageAccessToken) {
      setMessage('Seleziona una pagina valida.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('message', postText);
      if (selectedImage) {
        formData.append('source', selectedImage);
      }

      // Pubblica il post sulla pagina
      const postResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${selectedPage}/photos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${pageAccessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Se abbiamo un commento, lo pubblichiamo
      if (commentText && postResponse.data.id) {
        await axios.post(
          `https://graph.facebook.com/v18.0/${postResponse.data.id}/comments`,
          {
            message: commentText,
          },
          {
            headers: {
              Authorization: `Bearer ${pageAccessToken}`,
            },
          }
        );
      }

      setMessage('Post pubblicato con successo!');
      setPostText('');
      setCommentText('');
      setSelectedImage(null);
    } catch (error) {
      setMessage('Errore durante la pubblicazione: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Facebook Publisher</h1>
        {!isLoggedIn ? (
          <FacebookLogin
            appId="683283957808938"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            textButton="Accedi con Facebook"
            scope="public_profile,email,pages_manage_posts,pages_read_engagement,pages_show_list,pages_manage_engagement"
          />
        ) : (
          <form onSubmit={handleSubmit} className="post-form">
            {pages.length > 0 && (
              <div className="form-group">
                <label>Seleziona Pagina:</label>
                <select value={selectedPage} onChange={handlePageChange} required>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>{page.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Scrivi il tuo post..."
                required
              />
            </div>
            <div className="form-group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="form-group">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Scrivi il primo commento..."
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Pubblicazione...' : 'Pubblica'}
            </button>
          </form>
        )}
        {message && <div className="message">{message}</div>}
      </header>
    </div>
  );
}

export default App; 
# Facebook Publisher Web App

Questa è un'applicazione web che permette di pubblicare post su Facebook con testo, foto e commenti iniziali.

## Requisiti

- Node.js (versione 14 o superiore)
- Un account Facebook Developer
- Un'applicazione Facebook configurata

## Configurazione

1. Crea un'applicazione Facebook su [Facebook Developers](https://developers.facebook.com)
2. Ottieni l'App ID dalla tua applicazione Facebook
3. Sostituisci `YOUR_FACEBOOK_APP_ID` nel file `src/App.js` con il tuo App ID
4. Configura le impostazioni OAuth nella tua applicazione Facebook:
   - Aggiungi `http://localhost:3000` come URL di reindirizzamento OAuth
   - Abilita le seguenti autorizzazioni:
     - `publish_actions`
     - `user_photos`
     - `user_posts`

## Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia l'applicazione:
   ```bash
   npm start
   ```

## Utilizzo

1. Accedi con il tuo account Facebook
2. Scrivi il testo del post
3. Carica un'immagine (opzionale)
4. Scrivi il primo commento (opzionale)
5. Clicca su "Pubblica"

## Funzionalità

- Login con Facebook
- Pubblicazione di post con testo
- Caricamento di immagini
- Aggiunta di commenti iniziali
- Interfaccia utente responsive
- Feedback visivo durante la pubblicazione

## Note sulla sicurezza

- L'applicazione utilizza il flusso di autenticazione OAuth di Facebook
- I token di accesso vengono gestiti solo lato client
- Non vengono memorizzati dati sensibili 
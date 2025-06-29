# Configurazione EmailJS per NORD EDIL S.R.L.

## 🚀 Setup Rapido EmailJS

### 1. Registrazione e Setup Account
1. Vai su [EmailJS.com](https://www.emailjs.com/)
2. Crea un account gratuito
3. Verifica la tua email

### 2. Configurazione Servizio Email
1. Nel dashboard, vai su **"Email Services"**
2. Clicca **"Add New Service"**
3. Seleziona **"Gmail"** (raccomandato per `infonordedilsrl@gmail.com`)
4. Inserisci le credenziali:
   - **Email**: `infonordedilsrl@gmail.com`
   - **Password**: [Password dell'account Gmail]
5. Salva il servizio e annota il **SERVICE_ID** (es. `service_abc123`)

### 3. Creazione Template Email
1. Vai su **"Email Templates"**
2. Clicca **"Create New Template"**
3. Configura il template:

**Subject**: `Nuova richiesta di contatto da {{from_name}}`

**Content**:
```
Ciao NORD EDIL S.R.L.,

Hai ricevuto una nuova richiesta di contatto dal sito web:

👤 Nome: {{from_name}}
📧 Email: {{from_email}}
📞 Telefono: {{phone}}
🔧 Servizio richiesto: {{service}}

💬 Messaggio:
{{message}}

---
Inviato automaticamente dal modulo di contatto del sito web
Data: {{current_date}}
```

4. Salva il template e annota il **TEMPLATE_ID** (es. `template_xyz789`)

### 4. Ottenere la Public Key
1. Vai su **"Account"** → **"General"**
2. Copia la **Public Key** (es. `user_abcdefghijk123`)

### 5. Aggiornamento Codice
Sostituisci nel file `index.html` alle righe indicate:

```javascript
// Riga ~60
emailjs.init("TUA_PUBLIC_KEY_QUI"); // Sostituire con la tua Public Key

// Riga ~4005
emailjs.send('TUO_SERVICE_ID_QUI', 'TUO_TEMPLATE_ID_QUI', templateParams)
```

**Esempio completo**:
```javascript
// Inizializzazione
emailjs.init("user_abcdefghijk123");

// Invio email
emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

### 6. Test del Sistema
1. Apri il sito web
2. Compila il modulo di contatto
3. Verifica che l'email arrivi a `infonordedilsrl@gmail.com`
4. Controlla la console del browser per eventuali errori

## 📊 Limiti Piano Gratuito
- **200 email/mese** (più che sufficienti per un sito aziendale)
- Nessun limite sui template
- Supporto per tutti i principali provider email

## 🔧 Troubleshooting

### Errore "Public Key not found"
- Verifica che la Public Key sia corretta
- Assicurati che sia tra virgolette

### Errore "Service not found"
- Controlla che il SERVICE_ID sia corretto
- Verifica che il servizio email sia attivo

### Errore "Template not found"
- Verifica che il TEMPLATE_ID sia corretto
- Assicurati che il template sia pubblicato

### Email non arrivano
- Controlla la cartella spam
- Verifica le credenziali Gmail
- Assicurati che l'autenticazione a 2 fattori sia configurata correttamente

## 🔒 Sicurezza
- La Public Key può essere esposta nel codice frontend
- Le credenziali email sono gestite in modo sicuro da EmailJS
- Nessuna informazione sensibile nel codice sorgente

## 📈 Vantaggi vs Sistema Precedente
✅ **Invio automatico** (no apertura client email)  
✅ **Affidabilità** (99.9% uptime)  
✅ **Tracking** (statistiche invii)  
✅ **Mobile-friendly** (funziona su tutti i dispositivi)  
✅ **Professionale** (email formattate)  
✅ **Gratuito** (200 email/mese)  

---

**🎯 Risultato**: Sistema di contatto professionale e affidabile per NORD EDIL S.R.L. che garantisce la ricezione di tutte le richieste clienti.
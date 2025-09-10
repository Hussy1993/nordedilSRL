# 🚀 CONFIGURAZIONE FINALE EMAILJS - NORD EDIL S.R.L.

## ✅ STATO ATTUALE
- ✅ Account EmailJS creato
- ✅ Servizio Gmail configurato: `service_p31ldlc`
- ✅ Email collegata: `infonordedilsrl@gmail.com`
- ✅ Codice integrato nel sito

## 🔧 PASSI MANCANTI (5 minuti)

### 1. OTTIENI LA PUBLIC KEY
1. Vai su: https://dashboard.emailjs.com/admin/account
2. Nella sezione **"General"** trovi la **"Public Key"**
3. Copia la chiave (formato: `user_xxxxxxxxx` o simile)
4. Sostituisci `YOUR_PUBLIC_KEY_HERE` nel file `index.html` riga ~62

### 2. CREA IL TEMPLATE EMAIL
1. Vai su: https://dashboard.emailjs.com/admin/templates
2. Clicca **"Create New Template"**
3. Imposta:
   - **Subject**: `Nuova richiesta di contatto da {{from_name}}`
   - **Content**:
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
   Inviato automaticamente dal modulo di contatto
   ```
4. Salva il template
5. Copia il **Template ID** (formato: `template_xxxxxxx`)
6. Sostituisci `YOUR_TEMPLATE_ID_HERE` nel file `index.html` riga ~4007

### 3. TEST FINALE
1. Apri il sito web
2. Compila il modulo di contatto
3. Verifica che l'email arrivi a `infonordedilsrl@gmail.com`

## 📝 MODIFICHE DA FARE NEL CODICE

**File: `index.html`**

**Riga ~62** - Sostituisci:
```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE");
```
Con:
```javascript
emailjs.init("TUA_PUBLIC_KEY_COPIATA");
```

**Riga ~4007** - Sostituisci:
```javascript
emailjs.send('service_p31ldlc', 'YOUR_TEMPLATE_ID_HERE', templateParams)
```
Con:
```javascript
emailjs.send('service_p31ldlc', 'TUO_TEMPLATE_ID_COPIATO', templateParams)
```

## 🎯 RISULTATO FINALE
Dopo questi 2 semplici cambi, il modulo di contatto invierà automaticamente le email a `infonordedilsrl@gmail.com` senza aprire client email esterni.

## 📞 SUPPORTO
Se hai problemi:
1. Controlla la console del browser (F12)
2. Verifica che Public Key e Template ID siano corretti
3. Assicurati che il template sia salvato e attivo

**Il sistema è al 95% completo - mancano solo questi 2 ID!**
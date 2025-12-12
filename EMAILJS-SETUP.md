# Configurazione EmailJS per NORD EDIL S.R.L.

Questo documento spiega come configurare EmailJS per l'invio automatico delle email dal modulo di contatto.

## Passaggi per la configurazione:

### 1. Registrazione su EmailJS
1. Vai su [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea un account gratuito
3. Verifica la tua email

### 2. Configurazione del servizio email
1. Nel dashboard di EmailJS, vai su "Email Services"
2. Clicca "Add New Service"
3. Scegli il provider email (Gmail consigliato per infonordedilsrl@gmail.com)
4. Segui le istruzioni per collegare l'account Gmail
5. Annota il **Service ID** (es. `service_nordedil`)

### 3. Creazione del template email
1. Vai su "Email Templates"
2. Clicca "Create New Template"
3. Usa questo template:

```
Oggetto: Nuovo messaggio dal sito NORD EDIL - {{from_name}}

Corpo del messaggio:
Hai ricevuto un nuovo messaggio dal sito web di NORD EDIL S.R.L.

Dettagli del contatto:
- Nome: {{from_name}}
- Email: {{from_email}}
- Telefono: {{phone}}
- Servizio di interesse: {{service}}

Messaggio:
{{message}}

---
Questo messaggio è stato inviato automaticamente dal modulo di contatto del sito web.
```

4. Annota il **Template ID** (es. `template_nordedil`)

### 4. Ottenere la chiave pubblica
1. Vai su "Account" > "General"
2. Copia la **Public Key**

### 5. Aggiornare il codice
Nel file `index.html`, sostituisci:
```javascript
publicKey: 'YOUR_PUBLIC_KEY'
```
con la tua chiave pubblica reale.

E verifica che i nomi del servizio e template corrispondano:
```javascript
emailjs.send('service_nordedil', 'template_nordedil', {
```

## Test
1. Apri il sito web
2. Compila il modulo di contatto
3. Verifica che l'email arrivi a infonordedilsrl@gmail.com

## Limiti del piano gratuito
- 200 email al mese
- Per volumi maggiori, considera l'upgrade a un piano a pagamento

## Troubleshooting
- Verifica che la chiave pubblica sia corretta
- Controlla la console del browser per errori
- Assicurati che il servizio Gmail sia correttamente collegato
- Verifica che i nomi del servizio e template siano esatti

## Sicurezza
- La chiave pubblica può essere esposta nel codice frontend
- EmailJS gestisce l'autenticazione lato server
- Non è necessario nascondere la chiave pubblica
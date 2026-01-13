# Streso dienoraštis

Pilotinio tyrimo „Organizacinio streso matavimas naudojant biosensorius" duomenų rinkimo aplikacija.

## Kaip deploy'inti į Netlify (rekomenduojama)

### Būdas 1: Netlify Drop (greičiausias)

1. Eikite į https://app.netlify.com/drop
2. Nutempkite šį aplanką į naršyklę
3. Palaukite kol įsikels
4. Gausite nuorodą!

**Pastaba:** Šis būdas veikia tik su jau sukompiliuotu `build` aplanku.

### Būdas 2: Per GitHub (rekomenduojama ilgalaikiam naudojimui)

1. Sukurkite GitHub repository
2. Įkelkite šiuos failus į repository
3. Eikite į https://app.netlify.com
4. "Add new site" → "Import an existing project"
5. Pasirinkite GitHub ir savo repository
6. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Spauskite "Deploy"

### Būdas 3: Per Vercel

1. Eikite į https://vercel.com
2. "Import Project" → Pasirinkite GitHub repository
3. Framework: Create React App
4. Deploy!

## Lokali plėtra

```bash
npm install
npm start
```

Atsidarys http://localhost:3000

## Sukurti production build

```bash
npm run build
```

Sukurs `build` aplanką, kurį galite deploy'inti.

---

Kauno kolegija • Verslo fakultetas • Multimodalinių tyrimų laboratorija

# WaterWise Enterprise Website

Professional website for WaterWise Enterprise, Big Island Hawaii's trusted water catchment service company.

## 🌴 About

WaterWise provides catchment installation, consultation, maintenance, and repair services across East Hawaii including Hawaiian Paradise Park, Pahoa, Keaau, Mountain View, Volcano, and Hilo.

## 🚀 Deploy

### Vercel (Recommended)
1. Push this repo to GitHub
2. Import in [Vercel](https://vercel.com)
3. Deploy — zero configuration needed

### Netlify
1. Push to GitHub  
2. Import in [Netlify](https://netlify.com)
3. Publish directory: `/`

## 📥 Lead capture setup (do this once)

Form + quiz submissions are saved to a Google Sheet via a free Google Apps Script Web App. Set it up once and leads flow in automatically.

1. Create a new Google Sheet (any name). Open **Extensions → Apps Script**.
2. Delete the sample code, paste the contents of `google-apps-script.gs`, and **Save**.
3. Click **Deploy → New deployment**. For "Select type" (gear icon) choose **Web app**.
4. Set **Execute as: Me** and **Who has access: Anyone**, then **Deploy** and authorize.
5. Copy the **Web app URL**, open `index.html`, and replace
   `const LEAD_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';`
   with that URL. Commit and redeploy the site.

The script auto-creates a **Leads** tab with a frozen header row. The last four columns (Status, Qualified?, Notes, Followed Up On) are yours to edit — the script only ever appends new rows and never overwrites them.

## 📁 Files

```
├── index.html             # Main website
├── google-apps-script.gs  # Lead-capture Web App (deploy to Google Sheets)
├── robots.txt             # Search crawler directives
├── sitemap.xml            # Sitemap for search engines
├── logo.png               # WaterWise logo
├── hero.jpg               # Hero image (Rainbow Falls)
├── tank.jpg               # About section tank image
├── tank-before.jpg        # Before image for slider
├── tank-after.jpg         # After image for slider
├── work-metal-roof.jpg    # Metal roof build
├── work-2.jpg             # Tank installation
├── roof-wash.jpg          # Roof washing
├── originals-backup/      # Uncompressed source images (not deployed)
├── marketing/             # Social media strategy, templates, captions
├── vercel.json            # Vercel config
└── README.md
```

## 🔍 SEO Features

- Full Schema.org LocalBusiness markup
- FAQ structured data for Google rich results
- Geo-targeted meta tags for Big Island
- Keywords optimized for Hawaii catchment searches
- Interactive quiz for engagement and AEO

## 📞 Contact

- **Phone:** 808-765-7234
- **Email:** waterwise.ent@gmail.com  
- **Location:** Hawaiian Paradise Park, Hawaii

© 2025 WaterWise Enterprise

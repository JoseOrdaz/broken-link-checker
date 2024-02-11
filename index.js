const blc = require('broken-link-checker');
const express = require('express');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/check", async (req, res) => {

   
    const { url } = req.body;
    const siteUrl = url;

    const options = {
        filterLevel: 1,
        excludeExternalLinks: true,
        excludeInternalLinks: false,
        userAgent: 'Your User Agent',
        acceptedSchemes: ['http', 'https'],
        excludedKeywords: [],
    };

    let brokenLinks = [];

    const siteChecker = new blc.SiteChecker(options, {
        link: (result) => {

            if (result.broken) {
                
                brokenLinks.push({
                    url: result.url.resolved,
                    status: result.brokenReason,
                });
            }
        },
        end: () => {

            console.log('PROCESO FINALIZADO'); // Mostrar "OK" cuando el proceso ha finalizado
            res.json(brokenLinks); // Enviar los enlaces rotos como JSON
            app.set('brokenLinks', brokenLinks);
        },
    });

    siteChecker.enqueue(siteUrl);
    
});

app.get("/datos", (req, res) => {
    const brokenLinks = app.get('brokenLinks');
    res.json(brokenLinks || []);
});




app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

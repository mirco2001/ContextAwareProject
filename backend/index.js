// backend/index.js
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const {spawn} = require('child_process')
const fs = require('fs').promises;
const path = require('path');

const app = express()

app.use(cors())
app.use(express.json())


app.get("/get", async (req,res)=>{
    try {
      const pal = 5;
      const farm = 2;
      const cin = 4;
     
      const areabologna = await pool.query(`SELECT ST_AsText(wkb_geometry) AS wkb_geometry FROM areebologna WHERE ogc_fid=1`);
      const geometry = areabologna.rows[0].wkb_geometry;
      
      // const edificiQuery = await pool.query(`
      //   SELECT ogc_fid, wkb_geometry 
      //   FROM edifici 
      //   WHERE ST_WITHIN(edifici.wkb_geometry, ST_GeomFromText('${geometry}', 4326))
      // `);
      
      // const edifici = edificiQuery.rows; // Ottieni i risultati effettivi della query
      
      const cinemaQuery = await pool.query(`
       SELECT e.ogc_fid AS id_casa,
       COUNT(c.*) AS numCinema
        FROM (
            SELECT ogc_fid, wkb_geometry
            FROM edifici
            WHERE ST_WITHIN(edifici.wkb_geometry, (
                  SELECT wkb_geometry
                  FROM areebologna
                  WHERE ogc_fid = 1
              ))
        ) e
        JOIN cinema c ON ST_DWithin(
                            ST_Transform(c.wkb_geometry, 32633), 
                            ST_Transform(e.wkb_geometry, 32633),
                            100  
                        )
        GROUP BY e.ogc_fid
        LIMIT 10`
      );
      
      const numCinema = cinemaQuery.rows;



      // const farmacie = await pool.query(`SELECT COUNT(*) as numfarmacie FROM farmacie WHERE ST_DWITHIN(farmacie.wkb_geometry, ST_GeomFromText('${geometry}', 4326),150)`);
      // conslestre = await pool.query(`SELECT COUNT(*) as numpalestre FROM palestre WHERE ST_DWITHIN(palestre.wkb_geometry, ST_GeomFromText('${geometry}', 4326),150)`);
      // const numPalestre = palestre.rows[0].numpalestre;
      //const query = await pool.query(`SELECT Count(*) FROM cinema WHERE ogc_fid=${cinema}`);
      
      // In questo esempio, ST_AsText converte la geometria in una rappresentazione WKT (Well-Known Text), che è una stringa facilmente utilizzabile in SQL. Poi usi ST_GeomFromText nella seconda query per convertire la stringa WKT di nuovo in una geometria.
      // Assicurati che il SRID (Spatial Reference System Identifier) sia corretto nella funzione ST_GeomFromText. In questo esempio ho usato 4326, che è il SRID per il sistema di coordinate WGS 84, ma dovresti sostituirlo con il SRID corretto per le tue geometrie.
      const results = {
        numCinema: numCinema,
        // numPalestre: numPalestre,
        // numFarmacie: numFarmacie
      };
      res.json(results);
    } catch (err) {
      console.error(err.message);
      res.status(500).send();
    }
});

app.post('/mapsearch', (req, res) => {
  const { geom, formData } = req.body;
  console.log('Received geom:', geom);
  console.log('Received formData:', formData);

  res.json({ message: 'Dati ricevuti con successo!', geom, formData });
});

app.post('/get', (req, res) => {
  const data = req.body;
  
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      console.log(`Chiave: ${key}, Valore: ${data[key]}`);
    }
  }
  res.send('Dati ricevuti con successo!');
});

const executePython = async (script) => {
  const py = spawn("python", [script]);

  const result = await new Promise((resolve,reject)=>{
    let output;

    py.stdout.on('data',(data)=>{ //prende output da script python
      output = JSON.parse(data);
    });

    py.stderr.on("data",(data)=>{
      console.error(`[python] Error occured: ${data}`);
      reject(`Error occured in ${script}`);
    });

    py.on("exit",(code)=>{
      console.log(`Child process exited with code ${code}`);
      resolve(output);
    });

  })
  return result;
}

app.get("/getZone", async (req, res) => {

  try {
    const areabologna = await pool.query(`SELECT * FROM public.zone`);
    res.json(areabologna);
  } catch (error) {
    console.error(err.message);
    res.status(500).send();
  }


});

app.get('/', async (req, res) => {

    try {
      const result = await executePython('python/Ml4.py');
      res.json({result: result});
    } catch (error) {
      res.status(500).json({error: error});
    }

  });


  app.get('/moranIndex', async (req, res) => {

    try {
    
      const jsonFilePath = path.join(__dirname, 'python', 'moranI.json');
      
      const jsonData = await fs.readFile(jsonFilePath, 'utf8');
      
      const jsonContent = JSON.parse(jsonData);
      
      res.json(jsonContent);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      res.status(500).json({ error: 'Failed to read JSON file' });
    }

  });

  app.get('/moranData', async (req, res) => {

    try {
    
      const jsonFilePath = path.join(__dirname, 'python', 'outputMoran.json');
      
      const jsonData = await fs.readFile(jsonFilePath, 'utf8');
      
      const jsonContent = JSON.parse(jsonData);
      
      res.json(jsonContent);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      res.status(500).json({ error: 'Failed to read JSON file' });
    }

  });


app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})


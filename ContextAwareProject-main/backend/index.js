// backend/index.js
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const {spawn} = require('child_process')
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const app = express()

app.use(cors())
app.use(express.json())

let cinema = 0;
let picnic = 0;
let sport = 0;
let banche = 0;
let biblio = 0;
let dpscuola = 0;
let bus = 0;
let treno = 0;
let intrattenimento = 0;
let musei = 0;
let ospedali = 0;
let parcheggi = 0;
let colonnine = 0;
let parchi = 0;
let areegiochi = 0;
let ristorante  = 0;
let scuole = 0;
let supermercati = 0;
let farm = 0;
let pal = 0;
let coordinates;

app.get("/Poi", async (req,res) => {
  try{
      const coordinatesS = [];
      const coordinatesB = [];
      const coordinatesC = [];
      const coordinatesBB = [];
      const coordinatesCl = [];
      const coordinatesDP = [];
      const coordinatesF = [];
      const coordinatesGB = [];
      const coordinatesM = [];
      const coordinatesE = [];
      const coordinatesT = [];
      const coordinatesSC = [];
      const coordinatesR = [];
      const coordinatesPC = [];
      const coordinatesP = [];
      const coordinatesPL = [];
      const coordinatesO = [];
      const coordinatesI = [];
      const coordinatesFB = [];
      const coordinatesCS = [];
      const queryS = await pool.query(`SELECT * FROM supermercati`);
      const queryJSONS = JSON.stringify(queryS);
      const jsonObjectS = JSON.parse(queryJSONS);
      const queryB = await pool.query(`SELECT * FROM banche`);
      const queryJSONB = JSON.stringify(queryB);
      const jsonObjectB = JSON.parse(queryJSONB);
      const queryBB = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM biblioteche`);
      const queryJSONBB = JSON.stringify(queryBB);
      const jsonObjectBB = JSON.parse(queryJSONBB);
      const queryC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM cinema`);
      const queryJSONC = JSON.stringify(queryC);
      const jsonObjectC = JSON.parse(queryJSONC);
      const queryCl = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM colonnine`);
      const queryJSONCl = JSON.stringify(queryCl);
      const jsonObjectCl = JSON.parse(queryJSONCl);
      const queryDP = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM doposcuola`);
      const queryJSONDP = JSON.stringify(queryDP);
      const jsonObjectDP = JSON.parse(queryJSONDP);
      const queryF = await pool.query(`SELECT * FROM farmacie`);
      const queryJSONF = JSON.stringify(queryF);
      const jsonObjectF = JSON.parse(queryJSONF);
      const queryGB = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM giochibimbi`);
      const queryJSONGB = JSON.stringify(queryGB);
      const jsonObjectGB = JSON.parse(queryJSONGB);
      const queryM = await pool.query(`SELECT * FROM musei`);
      const queryJSONM = JSON.stringify(queryM);
      const jsonObjectM = JSON.parse(queryJSONM);
      const queryE = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine FROM eventi`);
      const queryJSONE = JSON.stringify(queryE);
      const jsonObjectE = JSON.parse(queryJSONE);
      const queryT = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine FROM stazioniferroviarie`);
      const queryJSONT = JSON.stringify(queryT);
      const jsonObjectT = JSON.parse(queryJSONT);
      const querySC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM scuole`);
      const queryJSONSC = JSON.stringify(querySC);
      const jsonObjectSC = JSON.parse(queryJSONSC);
      const queryR = await pool.query(`SELECT * FROM ristoranti`);
      const queryJSONR = JSON.stringify(queryR);
      const jsonObjectR = JSON.parse(queryJSONR);
      const queryPC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM parchi`);
      const queryJSONPC = JSON.stringify(queryPC);
      const jsonObjectPC = JSON.parse(queryJSONPC);
      const queryP = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM parcheggi`);
      const queryJSONP = JSON.stringify(queryP);
      const jsonObjectP = JSON.parse(queryJSONP);
      const queryPL = await pool.query(`SELECT * FROM palestre`);
      const queryJSONPL = JSON.stringify(queryPL);
      const jsonObjectPL = JSON.parse(queryJSONPL);
      const queryO = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine FROM ospedali`);
      const queryJSONO = JSON.stringify(queryO);
      const jsonObjectO = JSON.parse(queryJSONO);
      const queryI = await pool.query(`SELECT  ST_X(geom) AS Longitudine, ST_Y(geom) AS Latitudine FROM impianti_sportivi`);
      const queryJSONI = JSON.stringify(queryI);
      const jsonObjectI = JSON.parse(queryJSONI);
      const queryFB = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine FROM fermatebus`);
      const queryJSONFB = JSON.stringify(queryFB);
      const jsonObjectFB = JSON.parse(queryJSONFB);
      

      

      // Iterare attraverso l'array rows nel JSON
      jsonObjectS.rows.forEach(item => {
          const name = "Supermercati"
          const longitude = item.Longitudine;
          const latitude = item.Latitudine;
          
          // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
          coordinatesS.push({name, longitude, latitude });
      });
      jsonObjectB.rows.forEach(item => {
        const  name ="Banche"
        const longitude = item.Longitudine;
        const latitude = item.Latitudine;
        
        // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
        coordinatesB.push({name, longitude, latitude });
    });
    jsonObjectBB.rows.forEach(item => {
      const name = "Biblioteche"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);
      
      // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
      coordinatesBB.push({name, longitude, latitude });
  });
  jsonObjectC.rows.forEach(item => {
    const name = "Cinema"
    const longitude = parseFloat(item.longitudine);
    const latitude = parseFloat(item.latitudine);
    
    // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
    coordinatesC.push({name, longitude, latitude });
});
jsonObjectCl.rows.forEach(item => {
  const name = "Colonnine"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesCl.push({name,longitude, latitude });
});
jsonObjectDP.rows.forEach(item => {
  const name = "Dopo Scuola"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesDP.push({name,longitude, latitude });
});
jsonObjectF.rows.forEach(item => {
  const name = "Farmacie"
  const longitude = parseFloat(item.xcoord);
  const latitude = parseFloat(item.ycoord);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesF.push({name,longitude, latitude });
});
jsonObjectGB.rows.forEach(item => {
  const name = "Giochi Bimbi"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesGB.push({name, longitude, latitude });
});
jsonObjectM.rows.forEach(item => {
  const name = "Musei"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesM.push({name, longitude, latitude });
});
jsonObjectE.rows.forEach(item => {
  const name = "Eventi"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesE.push({name, longitude, latitude });
});
jsonObjectT.rows.forEach(item => {
  const name = "Stazioni Treno"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesT.push({name, longitude, latitude });
});
jsonObjectSC.rows.forEach(item => {
  const name = "Scuole"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesSC.push({name,longitude, latitude });
});
jsonObjectR.rows.forEach(item => {
  const name = "Ristoranti"
  const longitude =item.Longitudine;
  const latitude = item.Latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesR.push({name,longitude, latitude });
});
jsonObjectPC.rows.forEach(item => {
  const name = "Parchi"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesPC.push({name,longitude, latitude });
});
jsonObjectP.rows.forEach(item => {
  const name = "Parcheggi"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesP.push({name,longitude, latitude });
});
jsonObjectPL.rows.forEach(item => {
  const name = "Palestre"
  const longitude =item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesPL.push({name,longitude, latitude });
});
jsonObjectO.rows.forEach(item => {
  const name = "Ospedali"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesO.push({name, longitude, latitude });
});
jsonObjectI.rows.forEach(item => {
  const name = "Impianti Sportivi"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesI.push({name, longitude, latitude });
});
jsonObjectFB.rows.forEach(item => {
  const name = "Fermate Bus"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesFB.push({name, longitude, latitude });
});
    
  const QueryCase = await pool.query(`
    WITH
    cinema_agg AS (
        SELECT id_casa, COUNT(*) AS numCinema
        FROM cinema_vicini
        GROUP BY id_casa
    ),
    farmacie_agg AS (
        SELECT id_casa, COUNT(*) AS numFarmacie
        FROM farmacie_vicine
        GROUP BY id_casa
    ),
    supermercati_agg AS (
        SELECT id_casa, COUNT(*) AS numSupermercati
        FROM supermercati_vicini
        GROUP BY id_casa
    ),
    ristoranti_agg AS (
        SELECT id_casa, COUNT(*) AS numRistoranti
        FROM ristoranti_vicini
        GROUP BY id_casa
    ),
    scuole_agg AS (
        SELECT id_casa, COUNT(*) AS numScuole
        FROM scuole_vicine
        GROUP BY id_casa
    ),
    sport_agg AS (
        SELECT id_casa, COUNT(*) AS numSport
        FROM sport_vicini
        GROUP BY id_casa
    ),
    picnic_agg AS (
        SELECT id_casa, COUNT(*) AS numPicnic
        FROM picnic_vicini
        GROUP BY id_casa
    ),
    giochi_agg AS (
        SELECT id_casa, COUNT(*) AS numGiochi
        FROM giochi_vicini
        GROUP BY id_casa
    ),
    parchi_agg AS (
        SELECT id_casa, COUNT(*) AS numParchi
        FROM parchi_vicini
        GROUP BY id_casa
    ),
    palestre_agg AS (
        SELECT id_casa, COUNT(*) AS numPalestre
        FROM palestre_vicine
        GROUP BY id_casa
    ),
    doposcuola_agg AS (
        SELECT id_casa, COUNT(*) AS numDoposcuola
        FROM doposcuola_vicini
        GROUP BY id_casa
    ),
    fermatebus_agg AS (
        SELECT id_casa, COUNT(*) AS numFermateBus
        FROM fermatebus_vicine
        GROUP BY id_casa
    ),
    stazioniferroviarie_agg AS (
        SELECT id_casa, COUNT(*) AS numStazioniFerroviarie
        FROM stazioniferroviarie_vicine
        GROUP BY id_casa
    ),
    parcheggi_agg AS (
        SELECT id_casa, COUNT(*) AS numParcheggi
        FROM parcheggi_vicini
        GROUP BY id_casa
    ),
    colonnine_agg AS (
        SELECT id_casa, COUNT(*) AS numColonnine
        FROM colonnine_vicine
        GROUP BY id_casa
    ),
    ospedali_agg AS (
        SELECT id_casa, COUNT(*) AS numOspedali
        FROM ospedali_vicini
        GROUP BY id_casa
    ),
    banche_agg AS (
        SELECT id_casa, COUNT(*) AS numBanche
        FROM banche_vicine
        GROUP BY id_casa
    ),
    eventi_agg AS (
        SELECT id_casa, COUNT(*) AS numEventi
        FROM eventi_vicini
        GROUP BY id_casa
    ),
    biblioteche_agg AS (
        SELECT id_casa, COUNT(*) AS numBiblioteche
        FROM biblioteche_vicine
        GROUP BY id_casa
    ),
    musei_agg AS (
        SELECT id_casa, COUNT(*) AS numMusei
        FROM musei_vicini
        GROUP BY id_casa
    )
    SELECT
    e.ogc_fid AS id_casa,
    e.geo_point_2d->>'lon' as Longitudine, e.geo_point_2d->>'lat' as Latitudine,
    (COALESCE(cin.numCinema, 0) * ${cinema}) +
    (COALESCE(farm.numFarmacie, 0)*${farm}) +
    (COALESCE(spm.numSupermercati, 0) * ${supermercati}) +
    (COALESCE(ris.numRistoranti, 0) * ${ristorante}) +
    (COALESCE(sc.numScuole, 0) * ${scuole}) +
    (COALESCE(sport.numSport, 0) * ${sport}) +
    (COALESCE(pic.numPicnic, 0) * ${picnic}) +
    (COALESCE(gio.numGiochi, 0) * ${areegiochi}) +
    (COALESCE(par.numParchi, 0) * ${parchi}) +
    (COALESCE(pal.numPalestre, 0) * ${pal}) +
    (COALESCE(dps.numDoposcuola, 0) * ${dpscuola}) +
    (COALESCE(fb.numFermateBus, 0) * ${bus}) +
    (COALESCE(ft.numStazioniFerroviarie, 0) * ${treno}) +
    (COALESCE(pg.numParcheggi, 0) * ${parcheggi}) +
    (COALESCE(cn.numColonnine, 0) * ${colonnine}) +
    (COALESCE(osp.numOspedali, 0) * ${ospedali}) +
    (COALESCE(ban.numBanche, 0) * ${banche}) +
    (COALESCE(evt.numEventi, 0) * ${intrattenimento}) +
    (COALESCE(bib.numBiblioteche, 0) * ${biblio}) +
    (COALESCE(mus.numMusei, 0) * ${musei}) AS punteggio
    FROM
        Ed e
    LEFT JOIN cinema_agg cin ON e.ogc_fid = cin.id_casa
    LEFT JOIN farmacie_agg farm ON e.ogc_fid = farm.id_casa
    LEFT JOIN supermercati_agg spm ON e.ogc_fid = spm.id_casa
    LEFT JOIN ristoranti_agg ris ON e.ogc_fid = ris.id_casa
    LEFT JOIN scuole_agg sc ON e.ogc_fid = sc.id_casa
    LEFT JOIN sport_agg sport ON e.ogc_fid = sport.id_casa
    LEFT JOIN picnic_agg pic ON e.ogc_fid = pic.id_casa
    LEFT JOIN giochi_agg gio ON e.ogc_fid = gio.id_casa
    LEFT JOIN parchi_agg par ON e.ogc_fid = par.id_casa
    LEFT JOIN palestre_agg pal ON e.ogc_fid = pal.id_casa
    LEFT JOIN doposcuola_agg dps ON e.ogc_fid = dps.id_casa
    LEFT JOIN fermatebus_agg fb ON e.ogc_fid = fb.id_casa
    LEFT JOIN stazioniferroviarie_agg ft ON e.ogc_fid = ft.id_casa
    LEFT JOIN parcheggi_agg pg ON e.ogc_fid = pg.id_casa
    LEFT JOIN colonnine_agg cn ON e.ogc_fid = cn.id_casa
    LEFT JOIN ospedali_agg osp ON e.ogc_fid = osp.id_casa
    LEFT JOIN banche_agg ban ON e.ogc_fid = ban.id_casa
    LEFT JOIN eventi_agg evt ON e.ogc_fid = evt.id_casa
    LEFT JOIN biblioteche_agg bib ON e.ogc_fid = bib.id_casa
    LEFT JOIN musei_agg mus ON e.ogc_fid = mus.id_casa
    ORDER BY punteggio DESC
    LIMIT 10; `);

      const queryJSONCS = JSON.stringify(QueryCase);
      const jsonObjectCS = JSON.parse(queryJSONCS);
      jsonObjectCS.rows.forEach(item => {
        const name = "Case Selezionate"
        const longitude = parseFloat(item.longitudine);
        const latitude = parseFloat(item.latitudine);
        
        // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
        coordinatesCS.push({name, longitude, latitude });
      });
      const cordinateArray = [coordinatesCS,coordinatesFB,coordinatesB,coordinatesS,coordinatesBB,coordinatesC,coordinatesCl,coordinatesDP, coordinatesF,  coordinatesGB,  coordinatesM,coordinatesE, coordinatesT, coordinatesSC,coordinatesR,coordinatesPC,coordinatesP,coordinatesPL,coordinatesO,coordinatesI]
    res.json(cordinateArray);
  }catch(err){
      console.error(err.message);
  }
});



app.post('/prova', (req, res) => {
 
  // Ricevi i dati inviati dal client
  const {geom,formData} = req.body;
  picnic = formData.vicinanza_areePicnic;
  sport = formData.vicinanza_areeSport;
  banche = formData.vicinanza_banche;
  biblio = formData.vicinanza_biblioteche;
  cinema = formData.vicinanza_cinema;
  dpscuola = formData.vicinanza_dopoScuola;
  bus = formData.vicinanza_fermateBus;
  treno = formData.vicinanza_fermateTreno;
  intrattenimento = formData.vicinanza_intrattenimentoNotturno;
  musei = formData.vicinanza_museiGallerieArte;
  ospedali = formData.vicinanza_ospedali;
  parcheggi = formData.vicinanza_parcheggi;
  colonnine = formData.vicinanza_parcheggiColonnine;
  parchi = formData.vicinanza_parchi;
  areegiochi = formData.vicinanza_parchiGiochi;
  ristorante = formData.vicinanza_ristoranti;
  scuole = formData.vicinanza_scuole;
  supermercati = formData.vicinanza_supermercati;
  farm = formData.vicinanza_farmacie;
  pal = formData.vicinanza_palestre;
  console.log(geom)

});


app.get('/prova', async(req,res)=>{
  try {
    // const wktCoordinates = coordinates.map(coord => `${coord[0]} ${coord[1]}`).join(', ');
    // console.log(wktCoordinates);
    // const query = `SELECT ST_SetSRID(ST_GeomFromText('POLYGON((${wktCoordinates}))'), 4326) AS geom`;
    // console.log(query);
    // const result = await pool.query(query);
    // console.log(result.rows[0].geom); // Visualizza la geometria nel sistema di riferimento 4326
    
    // var i;
    // const dropq = await pool.query(`DROP MATERIALIZED VIEW IF EXISTS Ed_old CASCADE`);
    // var dati = ["\\x0103000020E6100000010000008D000000CC05AACA55B22640365B38382B3F464097B2CE709AB22640D7040F5F243F4640053FE1BBD4B22640A1F43B7A1E3F4640CE851130F4B226404889B5761B3F4640560E1BE237B32640A36E4819153F464080F20641B2B326406992A60D0A3F4640864E8C08C2B32640AFC5F39D083F464055DD981EE2B32640428A73A1053F4640BA1B9A840AB426402ADAB92D023F4640D0FCA87C3FB42640A1887122FD3E4640911CCBE494B426403801C8C9F43E464072F92CF01DB5264091A9B7CDE63E46401102FDE738B52640D36C813BE43E46403AED660640B52640AFFD118EE33E46407019E85D42B526409A82F154E33E464022D3A63852B526406D7E00FAE13E464054AFA5E494B526400A8E46A2DB3E46403CED2E7CCFB526406E9AFD52D63E46403A88E86B1DB62640D70975BACE3E46407CBB39503BB62640CFC3A8D0CB3E464093F4A25D3FB626405F155163CB3E46406DC5C8ECACB626407B2D74C2C03E4640FF772296C8B62640D3880483BE3E46402835DD22D4B6264032350D2CBF3E4640AC6D462DFEB6264052DE735BBE3E464032057FB80CB7264070CB6E95BE3E46408C0B68F310B7264006DB4485B53E464047077F2210B72640DCBDA95EAF3E46408900A64917B726404C4A81BA9B3E46403931D31722B72640D0E6F9FA873E4640C288B03934B726407F5EBF66623E4640436D530947B7264091AF8E1B3A3E46400F7590EC48B72640E3F062A8373E464094F705984BB7264057EBE211353E46406C54769B4DB72640F8C48551303E464056D9CAFB4DB72640FB99D1A22E3E4640B88156724CB72640C1E024232D3E4640ABBCE29849B7264041A88A872B3E4640334849A244B72640E4B821042A3E4640FB8C5A1F3EB7264029EAE993283E464058DCDA10A5B6264046AF6F760E3E464083371C5AA0B62640E0CCEC4E0D3E464043A2ED579DB62640CA2F95720C3E4640AA1DA25F9BB626402B656ABF0B3E464097D5673696B62640DF14BF4E093E46409989EAEF85B626405B859AD7053E46408C8D986676B626401CC9964C033E4640088CC9E16CB6264003C63185023E4640EE4C355E64B62640BD6802E3013E46406B7ACB7159B6264093590B17013E464028DAE01651B6264074B0AAF1003E464037E2DBFF48B62640DDCAA40A013E4640BD994FB53FB62640AF08A36C013E4640DC354EA633B62640A3976B0B023E46403AE98C7425B62640027174F4023E4640444FC9D74EB52640093A956B093E4640FC9FA248E1B42640585577260D3E46400E978E295AB32640818FE9E3183E4640C7CDF18DD0B2264022929E101D3E46406C684265AFB22640AA5153121E3E4640068DDF0B39B2264016E911AA213E4640E2E548620AB226408D010826233E4640C1D1CC72E5B126407ACACA74243E4640B310E500CDB1264055923136243E46407878D2D445B12640D09EEC59283E464062B7047058B0264091A015AF2F3E46401A240D1B75AF2640A62E2488363E4640A8BA0FAEE7AE2640C67A93973A3E464001BFE8FB37AE264094727C24403E4640F54F64A0EEAD2640C90E3970423E464006638FA8D9AD2640AF32A00E433E464022A6B8CDDAAD2640B6DFFD76453E464044A68947DFAD2640430CFEDD493E464067764083E0AD2640E18A6E6C4C3E46407160791AE2AD2640592B1625533E4640883A39D3E3AD2640100D37E75D3E464077BD65D3E6AD264009B612A4673E46405D1E713CEFAD2640174DB45C7B3E464016AA02AEF3AD264033486AE2813E4640BB4A21C8FBAD264064879C72873E4640FB0B966005AE2640F5516D3E8C3E46404A7781D21BAE2640433B72878E3E46409D793B6F28AE26400CD13B16903E4640A91FD7AA2FAE264037D59A81913E4640033B806F34AE2640F8C6A6F9923E4640888DB4E93BAE264015EC4047953E464027EED65E6EAE26402DCD9924A73E46406250AE367BAE264011F19D6DAB3E464089E65D1A82AE2640AAF52FEBAD3E4640724DAA5E9FAE264049A75642B83E46403DB9A65CB0AE2640089B12EFBF3E4640260950ACC6AE2640E342F5F0C93E4640AFC9924DD6AE264034C7542FD03E46403DD18B48DAAE26407B200CE1D13E4640F94277B4E9AE2640A9DB2AC0D83E464012768DA0F6AE2640E5AEC2BDE03E4640F9E48C31FAAE26405E5EB0B5E33E4640EF2CAA0504AF26402B23F741F73E464092DAE9D708AF2640E625898EFD3E4640F8FC30A20BAF2640294D00D3003F4640B178C9BC0DAF2640E2566C61023F4640BFEF2D7614AF2640FC2D8956083F46406ECB826C1BAF2640FD310FDA0D3F464057E6524224AF26402A529B56173F464058C37F0825AF2640A8B0BD4F183F4640DA0DBC052DAF2640802F79721E3F46400B4E2E8A33AF2640B70D5878223F4640E90EA2943EAF2640063383EE2A3F464073014B0F45AF2640150D6A052E3F4640A59DE90C45AF26402E2DBA032E3F4640C65091D365AF264086BF8BBB2E3F46406BA3E5F074AF2640D19533653B3F4640AA7C94B261AF264067A4B4C13E3F4640AFA8DCE85FAF26409EDEB150443F4640504B7AF662AF264040ECE438493F464021170A7967AF264004FE9E25593F4640037EFCDD6CAF2640014B76BB583F4640ED57906E73AF2640D69BF0E7573F46406E4B56267BAF26403961F333573F4640C2557AEF84AF264057C56B8B563F464043C0CF1094AF2640E8E7C0CD553F464020321BF8EDAF264075FC6D4E523F46408F20F2CB19B026403FA1819F503F46403C1BE0562AB0264030BFE4F74F3F46401C5B00DA79B0264034D58CF14C3F4640298CB62ED9B026400000D03F493F4640077796E21AB12640DB8BFF7A463F46404FDEED5C3FB126400A7D2D3A453F4640B4BA2DFB55B126409FFB3149443F464037816F0A5FB12640CDEE63EB433F46407C274D2269B12640FD0A3CB3413F464000305BA670B12640D3D58656403F46408D3618F678B12640B7275A7C3F3F464020E4181793B12640C64C6B4F3D3F46406DF027FCDBB1264065F2DF96363F464028F091BFFCB126404213A262333F464019D4F1B406B22640F4DB5986323F46408BD36DEC20B226403AA3A541303F46401BE871682BB22640F888D1462F3F4640D0F3A1862EB22640F669A0FD2E3F4640CC05AACA55B22640365B38382B3F4640"]
    // // const alterq = await pool.query(`ALTER MATERIALIZED VIEW Ed RENAME TO Ed_old`);
    // console.log(dati)
    // for (i=0; i <dati.length; i++){
    //   newq = await pool.query(`CREATE MATERIALIZED VIEW Ed AS
    //     SELECT ogc_fid, wkb_geometry, geo_point_2d
    //     FROM edifici
    //     WHERE ST_WITHIN(wkb_geometry,   ST_GeomFromWKB(E'${dati[i]}', 4326));`);
    //   console.log(newq);
    // }
    
    // const area = await pool.query(`SELECT ST_Area(ST_GeomFromText('${wkt}')) AS area`);
    // const areaq = area.rows;
    // const areaqq = areaq[0].area;
    // console.log(areaqq)
    // const rv = await pool.query(`
    // CREATE OR REPLACE MATERIALIZED VIEW Ed AS
    // SELECT ogc_fid, wkb_geometry, geo_point_2d
    // FROM edifici
    // WHERE ST_Within(wkb_geometry, ${d});`);
    const Query = await pool.query(`
      WITH
      cinema_agg AS (
          SELECT id_casa, COUNT(*) AS numCinema
          FROM cinema_vicini
          GROUP BY id_casa
      ),
      farmacie_agg AS (
          SELECT id_casa, COUNT(*) AS numFarmacie
          FROM farmacie_vicine
          GROUP BY id_casa
      ),
      supermercati_agg AS (
          SELECT id_casa, COUNT(*) AS numSupermercati
          FROM supermercati_vicini
          GROUP BY id_casa
      ),
      ristoranti_agg AS (
          SELECT id_casa, COUNT(*) AS numRistoranti
          FROM ristoranti_vicini
          GROUP BY id_casa
      ),
      scuole_agg AS (
          SELECT id_casa, COUNT(*) AS numScuole
          FROM scuole_vicine
          GROUP BY id_casa
      ),
      sport_agg AS (
          SELECT id_casa, COUNT(*) AS numSport
          FROM sport_vicini
          GROUP BY id_casa
      ),
      picnic_agg AS (
          SELECT id_casa, COUNT(*) AS numPicnic
          FROM picnic_vicini
          GROUP BY id_casa
      ),
      giochi_agg AS (
          SELECT id_casa, COUNT(*) AS numGiochi
          FROM giochi_vicini
          GROUP BY id_casa
      ),
      parchi_agg AS (
          SELECT id_casa, COUNT(*) AS numParchi
          FROM parchi_vicini
          GROUP BY id_casa
      ),
      palestre_agg AS (
          SELECT id_casa, COUNT(*) AS numPalestre
          FROM palestre_vicine
          GROUP BY id_casa
      ),
      doposcuola_agg AS (
          SELECT id_casa, COUNT(*) AS numDoposcuola
          FROM doposcuola_vicini
          GROUP BY id_casa
      ),
      fermatebus_agg AS (
          SELECT id_casa, COUNT(*) AS numFermateBus
          FROM fermatebus_vicine
          GROUP BY id_casa
      ),
      stazioniferroviarie_agg AS (
          SELECT id_casa, COUNT(*) AS numStazioniFerroviarie
          FROM stazioniferroviarie_vicine
          GROUP BY id_casa
      ),
      parcheggi_agg AS (
          SELECT id_casa, COUNT(*) AS numParcheggi
          FROM parcheggi_vicini
          GROUP BY id_casa
      ),
      colonnine_agg AS (
          SELECT id_casa, COUNT(*) AS numColonnine
          FROM colonnine_vicine
          GROUP BY id_casa
      ),
      ospedali_agg AS (
          SELECT id_casa, COUNT(*) AS numOspedali
          FROM ospedali_vicini
          GROUP BY id_casa
      ),
      banche_agg AS (
          SELECT id_casa, COUNT(*) AS numBanche
          FROM banche_vicine
          GROUP BY id_casa
      ),
      eventi_agg AS (
          SELECT id_casa, COUNT(*) AS numEventi
          FROM eventi_vicini
          GROUP BY id_casa
      ),
      biblioteche_agg AS (
          SELECT id_casa, COUNT(*) AS numBiblioteche
          FROM biblioteche_vicine
          GROUP BY id_casa
      ),
      musei_agg AS (
          SELECT id_casa, COUNT(*) AS numMusei
          FROM musei_vicini
          GROUP BY id_casa
      )
  SELECT
      e.ogc_fid AS id_casa,
      e.geo_point_2d->>'lon' as Longitudine, e.geo_point_2d->>'lat' as Latitudine,
      (COALESCE(cin.numCinema, 0) * ${cinema}) +
      (COALESCE(farm.numFarmacie, 0)*${farm}) +
      (COALESCE(spm.numSupermercati, 0) * ${supermercati}) +
      (COALESCE(ris.numRistoranti, 0) * ${ristorante}) +
      (COALESCE(sc.numScuole, 0) * ${scuole}) +
      (COALESCE(sport.numSport, 0) * ${sport}) +
      (COALESCE(pic.numPicnic, 0) * ${picnic}) +
      (COALESCE(gio.numGiochi, 0) * ${areegiochi}) +
      (COALESCE(par.numParchi, 0) * ${parchi}) +
      (COALESCE(pal.numPalestre, 0) * ${pal}) +
      (COALESCE(dps.numDoposcuola, 0) * ${dpscuola}) +
      (COALESCE(fb.numFermateBus, 0) * ${bus}) +
      (COALESCE(ft.numStazioniFerroviarie, 0) * ${treno}) +
      (COALESCE(pg.numParcheggi, 0) * ${parcheggi}) +
      (COALESCE(cn.numColonnine, 0) * ${colonnine}) +
      (COALESCE(osp.numOspedali, 0) * ${ospedali}) +
      (COALESCE(ban.numBanche, 0) * ${banche}) +
      (COALESCE(evt.numEventi, 0) * ${intrattenimento}) +
      (COALESCE(bib.numBiblioteche, 0) * ${biblio}) +
      (COALESCE(mus.numMusei, 0) * ${musei}) AS punteggio,
      COALESCE(cin.numCinema, 0) AS numCinema,
      COALESCE(farm.numFarmacie, 0) AS numFarmacie,
      COALESCE(spm.numSupermercati, 0) AS numSupermercati,
      COALESCE(ris.numRistoranti, 0) AS numRistoranti,
      COALESCE(sc.numScuole, 0) AS numScuole,
      COALESCE(sport.numSport, 0) AS numSport,
      COALESCE(pic.numPicnic, 0) AS numPicnic,
      COALESCE(gio.numGiochi, 0) AS numGiochi,
      COALESCE(par.numParchi, 0) AS numParchi,
      COALESCE(pal.numPalestre, 0) AS numPalestre,
      COALESCE(dps.numDoposcuola, 0) AS numDoposcuola,
      COALESCE(fb.numFermateBus, 0) AS numFermateBus,
      COALESCE(ft.numStazioniFerroviarie, 0) AS numStazioniFerroviarie,
      COALESCE(pg.numParcheggi, 0) AS numParcheggi,
      COALESCE(cn.numColonnine, 0) AS numColonnine,
      COALESCE(osp.numOspedali, 0) AS numOspedali,
      COALESCE(ban.numBanche, 0) AS numBanche,
      COALESCE(evt.numEventi, 0) AS numEventi,
      COALESCE(bib.numBiblioteche, 0) AS numBiblioteche,
      COALESCE(mus.numMusei, 0) AS numMusei
  FROM
      Ed e
  LEFT JOIN cinema_agg cin ON e.ogc_fid = cin.id_casa
  LEFT JOIN farmacie_agg farm ON e.ogc_fid = farm.id_casa
  LEFT JOIN supermercati_agg spm ON e.ogc_fid = spm.id_casa
  LEFT JOIN ristoranti_agg ris ON e.ogc_fid = ris.id_casa
  LEFT JOIN scuole_agg sc ON e.ogc_fid = sc.id_casa
  LEFT JOIN sport_agg sport ON e.ogc_fid = sport.id_casa
  LEFT JOIN picnic_agg pic ON e.ogc_fid = pic.id_casa
  LEFT JOIN giochi_agg gio ON e.ogc_fid = gio.id_casa
  LEFT JOIN parchi_agg par ON e.ogc_fid = par.id_casa
  LEFT JOIN palestre_agg pal ON e.ogc_fid = pal.id_casa
  LEFT JOIN doposcuola_agg dps ON e.ogc_fid = dps.id_casa
  LEFT JOIN fermatebus_agg fb ON e.ogc_fid = fb.id_casa
  LEFT JOIN stazioniferroviarie_agg ft ON e.ogc_fid = ft.id_casa
  LEFT JOIN parcheggi_agg pg ON e.ogc_fid = pg.id_casa
  LEFT JOIN colonnine_agg cn ON e.ogc_fid = cn.id_casa
  LEFT JOIN ospedali_agg osp ON e.ogc_fid = osp.id_casa
  LEFT JOIN banche_agg ban ON e.ogc_fid = ban.id_casa
  LEFT JOIN eventi_agg evt ON e.ogc_fid = evt.id_casa
  LEFT JOIN biblioteche_agg bib ON e.ogc_fid = bib.id_casa
  LEFT JOIN musei_agg mus ON e.ogc_fid = mus.id_casa
  ORDER BY punteggio DESC
  LIMIT 10;
  
  
          `);
        
        const numQuery = Query.rows;
        res.json(numQuery);
    
  }catch (err){
    console.error(err.message);
    res.status(500).send();
  }

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

app.get('/predizione', async (req, res) => {

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


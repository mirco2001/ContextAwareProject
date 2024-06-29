DROP MATERIALIZED VIEW IF EXISTS cinema_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS farmacie_vicine CASCADE;
DROP MATERIALIZED VIEW IF EXISTS supermercati_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS ristoranti_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS scuole_vicine CASCADE;
DROP MATERIALIZED VIEW IF EXISTS sport_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS picnic_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS giochi_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS parchi_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS palestre_vicine CASCADE;
DROP MATERIALIZED VIEW IF EXISTS doposcuola_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS fermatebus_vicine CASCADE;
DROP MATERIALIZED VIEW IF EXISTS stazioniferroviarie_vicine CASCADE;
DROP MATERIALIZED VIEW IF EXISTS parcheggi_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS colonnine_vicine CASCADE;
DROP MATERIALIZED VIEW IF EXISTS ospedali_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS banche_vicine CASCADE;
DROP MATERIALIZED VIEW IF EXISTS eventi_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS biblioteche_vicine CASCADE;
DROP MATERIALIZED VIEW IF EXISTS musei_vicini CASCADE;
DROP MATERIALIZED VIEW IF EXISTS Ed  CASCADE;
DROP MATERIALIZED VIEW IF EXISTS Ed_old CASCADE

CREATE MATERIALIZED VIEW Ed  AS
SELECT ogc_fid, wkb_geometry, geo_point_2d
FROM edifici
WHERE ST_WITHIN(
    wkb_geometry,
    ST_GeomFromWKB(E'\\x0103000020E6100000010000006D0100007814BB0228B52640CBD8012490404640747B45B314B5264008F61FBF85404640DF454FCC0BB526405BEBF794864046409F25E94508B52640EA7767C186404640321CA63FE2B42640A46FEA9B8A40464011109F4AC3B4264075753A828D404640B7B8A0F6AEB426400A8DA05A8F404640EF2D33FE90B42640E2B3B0D491404640C2D0D3A87AB42640D420DC9C9340464054D7B06E63B42640C9FAC1459540464027C123374FB42640086E07A89640464074C4A0E235B426403289F263984046400AD337900FB426409BE62EEB9A404640245B693AF6B326401238892F9C4046405F338A29E1B326408219C1239D404640480A3805CEB32640E610D6F59D404640EEAE1230B9B3264030D8E6D39E404640E98B2945A1B32640BAAA20AF9F40464051C2E55384B32640C5F77BB2A04046403BE7257C6BB326406DC38B9DA14046404B36C4374CB3264064989F99A240464038F4AB9847B326409225F1BEA2404640BA154E98F0B2264063254253A740464066CCF7E7B1B2264060F62380AA404640D625E1F253B226402CE15912AF4046408D0358AA31B226408CF054A7B04046405FC1A95B0DB22640B9FF3B54B24046400602CC59DDB12640F9B7866CB4404640DD140ADAD1B1264050A24BE5B4404640C3A6C29CA2B12640D9135BD8B6404640C71716EC77B126407DD9D1AEB8404640191DBC8648B1264031734695BA404640D9014C0B23B12640D7EE8619BC40464020E59CAD19B12640AC4CFC81BC40464010FD9E3705B12640A157E270BD404640378E705BF0B026406BA0700BBE4046406E0CCFB0DDB02640C0DF82DBBE40464076B2FFD4CFB0264041CE521DBF404640259055EDB5B0264045F1FDB8BF404640272C623B94B0264034608B97C040464074EF7E9164B026406AD4122AC2404640721A6DBFCFAF2640A410A922C74046407E485C5406AF2640E43162DECD404640B7E7B36451AE264048F453CED3404640659F1C2CFEAD2640A586BA9AD640464087E3D79A70AD26402FD75758DB4046403F217BB535AD2640E5530B51DD4046409EF78EF915AD2640DFC70564DE40464086BF60A9F8AC2640FF42E157DF4046407C5974DBE5AC264029C0E1EADF4046406CB92ECB65AC26402C30F05AE3404640733DE603BAAB264087B75D88E840464063CCDA6A84AB264055B565FDE94046408C81551066AB26404D9654A9EA40464031D7BF071DAB2640C78D3A99EC4046408981A41CC9AA264056E8B5EFEE4046401AF0E99199AA2640B789435BF04046409F196FF258AA2640A0C58B82F24046402630EB853EAA26402118AD7A004146400349AE6A3AAA2640A8BFAA6402414640881006C92CAA26405F131EC405414640ECC27E921DAA264039A2F6FD09414640423737F510AA26409ECFBC5B0E414640E0CF790009AA2640C6B91551124146407E09B8A806AA26405D33CD52154146401BB4BEFD06AA2640E1C49F8C18414640C1D7D9C305AA264022B3D8A01B414640E8C82C6408AA264034E22CDB1D41464069423FA90BAA26401F33BB4820414640F910FB6012AA2640BA9B3E042241464003BBE1C61FAA264015BF09492D4146404A5CCE6B20AA26406C6C41622F4146409974D52821AA2640FDBA306D314146405C5199E81EAA2640CA74B4C1344146403CA4939F17AA2640C21CFB7A37414640821145160AAA2640C081F38A3A4146405A853642F8A926409388A4763E4146404BD26497DBA9264010991BD94341464078350811C1A92640557A14C848414640D0BD8F8EABA92640FF94404E4E4146408514AE4C99A92640694C502A544146409F49EA1E8EA926409FFCEB2B5841464001D8833F86A9264092E0A9375B4146405B45395985A92640D290DCD45E4146402412BB007DA92640095E1E0B62414640B053C78E69A92640CEDBC30F664146406D3C64B75FA926407358F12D68414640359A802959A92640BE9621486A414640DFBC2CD653A926401B3E85756F41464003743E0154A92640FA8E250E72414640CCB6115462A9264026CC758A784146409AA105986EA92640B95B92EC7C4146402ED0D6E17CA926402113C51B80414640B92697CB8EA92640FA62CFE082414640CC8D56DAA4A9264031C8146885414640B095CDAEBEA926401CEAA4718841464019644C6FCDA92640FACDBEE8894146407223D18BE4A92640BDEB50DF8C4146408FC176EEEFA92640C20D47B98E414640AFD5949DFBA926405E77BA1C91414640E7D7143C05AA2640DBA8EFA59341464017B8B7E00EAA2640C5EC5CB497414640B087A0A316AA2640366E62859D41464001F840B51AAA26404DEA6210A1414640E4E1C6D521AA2640683A3839A54146402AA40E952BAA26407000A130AB414640E93615DC35AA2640F2108173AF414640A5740AFA4AAA264099A63369B8414640F492DD2257AA2640FB4F53A4BE414640A69667D368AA2640D9E980BDC64146408D2BBD1977AA26400FE2F3EACC414640D16D39078CAA2640ADDC6DC5D7414640EFEB46F29EAA264072761D4ADF41464082033598A4AA2640CA583E4CE241464008FB57EEAAAA2640314399FEE4414640ABB948A1B8AA2640EBAA5EBAED414640B8533F21BDAA264082BC3877F44146407641EAD2BDAA2640279302C8FE41464095C6FF22BDAA2640DACCBDC00642464060135684B7AA2640AACC803D1342464042571ECAB4AA2640D360DDD11D42464004FEA3C5B3AA2640817D53622B42464029E5278BB7AA2640B9E1A42F2F4246408DDE9F4BB6AA2640A63128C53642464013D604E0BEAA2640440566523C424640E42A6345CBAA2640A187551C404246408D962581DDAA264003AC452745424640191924C2E5AA2640B817703D47424640CE7B9E12F3AA26407412B4E44A424640D58F1225F9AA26402E08736A4D4246402826D708FEAA264072A0E66250424640C8B409CB00AB2640ECC022CF55424640C54C36C201AB2640DE181DB158424640FD39308E04AB2640769D62FE5B424640EB25FE6607AB26402E15A93061424640280FB38C10AB2640C4D6FB1A6742464015778F9A18AB2640DC4674916C4246409934C7E020AB2640928BE367734246401ECB88AF25AB26407C04D5FE7A42464050179F682BAB26406C21F7D881424640D7B1E8B92DAB264026C3283C864246405788CA8833AB26408B4594CB934246404B06342B3FAB2640FD02029896424640A28310775EAB26403B247161A2424640C1CC3FFE67AB264031D87FFDA542464026F86E0C6DAB264049DA3A9FA7424640118EC6EC6FAB2640993BA59BA94246403F06BCDB70AB26409C0BB76EAB4246404C3AE8CF74AB2640862DF327AE424640D032EE4E78AB2640F9514606B0424640586C148F80AB26402074FDA3B3424640451FC12B88AB2640BB908842B7424640A9C9307691AB2640E5559062BB42464042097B8898AB2640AC7096A2BD42464030AF2EF29BAB264014F44BFDBE42464050ADBD7CA4AB264096A7B06EC24246400FE92414A9AB264002790F27C5424640EE74230FADAB2640FE53200CC8424640963FC715B6AB264056824584CC424640F2ED1B6FBBAB26408D33DDF9CF424640D64CB0A9BFAB26406ECBB669D44246409FABB7A1C6AB264057D3C8FADB42464041299745CCAB264061911144DF4246404249F621D2AB2640ADA845ECE34246408B018A01D9AB26402B72EDEAE84246403E9413B1DEAB264081824C7DEC424640ADEC836CE5AB2640A6A072A0EE42464089ECFCF0ECAB2640A5DDADACF14246405D3F8304F6AB264062ED4C7CF44246400D6CE322FEAB264012F0314DF742464082876DF408AC2640541F9F04FB42464014689F3F12AC2640F032F632FD4246405308367E1AAC264033145AD0FE42464056F913462EAC264002E2AFA702434640AB7904774EAC26404563173408434640359449165EAC264049A348020C43464076AEA0C16AAC264038B9D05011434640ACEE44ED6EAC2640FE8BC36815434640C54D030A72AC2640941328E1184346400A946E1276AC26406744CC1D1C43464061E09BF978AC26407C810D462043464029F3687E7DAC2640A8DE868926434640C0C2FDC781AC2640086E635F29434640037860E386AC264008D0AD582B434640B8EF95DB8BAC2640EAD1AB762C434640DC15AA2493AC26400B1441152E43464003EBB1EE9BAC264060FC7F1F2F434640A6A177F4A6AC2640F885C326304346407DAB7405BBAC26401C0081D13143464009657C8ECAAC2640CD60DF1B33434640C2DD99DFD6AC2640A1B8A63E344346407B82A0BEDFAC26403C0473CC3543464064D416D9E3AC2640FDF4E27D3743464016E3F0F5E4AC26408583207538434640C9639550E4AC2640D4A371673A43464088FB2A7BE1AC2640B17ED9A53C434640E1982ACFDDAC2640E64394A33F434640505F7DB1DAAC2640B22FE41C42434640BCD80909D9AC26403940C8B843434640DB8F7E4EDBAC2640510E5AF0454346400FAF89D7DDAC264008B4C5CF474346401631C500E3AC2640C2A3B9204A43464091E7482CE8AC264044254A804C4346403000D1B6ECAC2640FE3454EF4E434640DD8E6C6EF5AC264093E1BA8453434640CBBFCA1FFCAC264026FF446D57434640BFD5671901AD26401D391E9A5A43464019FB8CD105AD2640322E26BD5D434640DE83857C0DAD2640E42CFACE6143464057057EFD12AD2640752B6350644346406617C2141BAD26404DCBD20867434640D9B5C53B22AD26409D1845A468434640F6E455762CAD26405F490C536A43464086D5D0C837AD2640BD99B5A86B4346409FA20F5643AD264048BD25D56C434640B2DB731852AD2640455C981A6E434640177FF0BD5DAD2640BAD64D126F4346405D132B9A73AD264014A0D8D47043464052E4CE9185AD26403BF5493372434640254B107896AD26402ABEBA137443464036EA341BA1AD264043F3DDEA75434640B123C09EA8AD26402FA8542F78434640AC3D634DA7AD2640DB5E3A1D7B434640151E02C9A6AD2640703ECBDE7B4346400886472A9EAD2640A78D873A80434640208811FB95AD26406C1102148443464030AFFEB78FAD2640C90637308743464016DD3B4B8FAD2640E2DBC04989434640F53A770B90AD2640514C25C48A434640F442793196AD2640A4DE0B3E8D43464000C196C2A2AD2640928E12B690434640A01CA5E5AFAD26405375A88A9443464086863A55BFAD26405736612899434640CCF40AF6C9AD2640599FF2799C4346406208BCE2D4AD2640FE1B450BA043464065D4FDD4DEAD2640B9FAA017A3434640C82F10E6EBAD2640FCAE8943A7434640D4A9370EF7AD26402E90C677AB43464048EFD7DA01AE2640CCDA1655AF4346405D2645E011AE2640DA8D9066B4434640B5E3918B1BAE2640FDFED9C8B74346406FA71C4E27AE26405C496890BB434640CE9F6AEA30AE2640D9D32196BE434640404BF4513CAE2640DC4718BCC1434640C239B68444AE2640875246DCC3434640B29316F74BAE264093BF0709C643464092549B8255AE2640AD0499A6C84346400D25341563AE26405C4EF5C7CB4346402E30FD7C72AE2640750DFB24CF4346405F6ECE6B81AE2640EE4982A4D24346401C178F6D94AE2640CB6C4DD3D6434640FD6B1BEDA6AE2640143814ECDA4346403E1873AFB1AE2640E3F6ED1DDD43464068E55B36BEAE26406CF3D785DF434640C6AAFE5FC6AE2640347801FBE04346408B878296CEAE2640C20C04FCE14346405B388951D2AE2640C80FDEB2E24346403056DF9DD4AE264021F20664E3434640457DD4BFF1AE26402F5B4390E9434640C31B9C37A6AF2640B7019D46E1434640B91FD49A35B02640F56D4FA0DA43464085C7E294D7B0264087F16BE7D24346406D561E5D2EB12640BBB8F785CE434640F45B14526CB126403FDABADACA4346408E554E277CB12640CECA77EEC94346404B3176848CB12640107822EDC84346405E9CE8CBA0B12640020E57A7C7434640C9BB6DC5B3B126406AFF8070C64346409BF21B41C7B1264054E6C02CC5434640082D3437D8B126401A16F916C44346400213C80B28B226401F086C97BE434640228F3AE069B226403975FD9DB94346401C0FB71C9CB226401380DAAAB5434640DE786CC3F1B2264091BC1AFBAE434640427C10A84CB32640C70FC67EA7434640D83863DAA3B32640C399388DA04346409B08FA18B0B3264017CB9B939F434640F1C10302B4B32640DA64A4449F434640E61A92EDF3B4264022076FBA8543464087F8FA454CB52640145C33707E434640E30946E557B526407980958D7D434640ABB3D21A6FB52640E84F4C837B43464069901D077BB52640998241937A4346407A5FEF7F8BB52640859A8E1A79434640DF98F35FA0B52640AFA89937774346408C85BE86AEB52640D9F7AEE1754346406566827BBCB5264070D9CC8F7443464033FB8530CBB526408496983173434640061DAD7CDBB52640962305AA714346405D9A11D2EBB52640AF37400D7043464070E04C3902B6264054E0EED26D434640EA9838B918B6264062DBB5946B43464007BED8972AB62640862616C769434640CE3A74E344B62640C4F812EF66434640163341BF5DB626402B34F762644346407C57A97B72B62640B89C112762434640D80197B58AB626401DDF4C785F4346408BD9EA719FB62640AE5BF8215D434640DA5CD71CB3B62640706756D25A434640C7ABF7DCCAB626404B22F827584346409F4EEE7AD6B626405B740CC3564346408AA08A92DFB62640A9CB22A85543464059FF4946F7B6264026C4A9E55243464039093C440CB72640EC9F8D4F50434640E5CE3F6523B72640327BE0934D434640246A13EB36B72640F01F784A4B43464044BC15604AB72640A4CC78E748434640ED2255C45EB7264043D4AF7B4643464098CF38C175B72640776947CC43434640F6DCD8FB7CB72640D1789AEE424346409D01AE0987B72640D5714FBA41434640AC02E0ED88B7264031854F8041434640379EBFA0B0B826407180442F1E43464014A074A2BCB82640372D26BD1C434640FF9E7013D5B826403FB879DE19434640B83CF054DAB826407101EE38194346407512381770B92640863BF2420743464006EB67DBCEB9264004E51AEBFB424640DC5731BA3ABA26401233D418EF424640AFC59D5651BA264037F5D124EC424640281C3E034CBA2640BCCB5446EA424640D5698A8144BA26403EE0DFC7E7424640820C587243BA2640A7DA9A6CE7424640FF0FA07719BA2640B8E6E44BD942464056503DFFEFB92640D63D0C00CC424640EFEE51B8B4B926400D5D8C1EB942464082BB91D165B926407CBEAE54A0424640B97916DD3BB926404B41DE82904246401418FBBF12B92640563B2BA38042464011B054EFEFB82640DDEB100C6F4246404C8CE91BD2B826404740BD7E5E424640B0C3FBD8BFB82640C87CADE05442464072D8B071BCB82640FB16076153424640F98D7443BBB8264072D5EFDB52424640EC391FDBB8B82640E6B189CC5142464014851138B7B82640B125051451424640DB586C0FACB82640E3D6212A4C424640F311541F82B82640ABD9D8023B424640A36E6F5031B826402C57BF2B1C424640E50244E82AB826400169CC67194246402924433E21B82640A385B9EC144246407B463E1C11B82640964516D00C42464027CE90A2B7B72640FA8A3DB3DE41464046657FD53DB7264064D9B786A0414640C949F34B33B72640EE7C71279B414640BBCC4A96EFB62640DEFC14B178414640E47FA41AC4B626406646C58F624146406954CFFBB8B6264057E9EF615C414640BFE063D7AFB626401BA40368584146401B76586C86B62640BB19D52A43414640BAEDD0F77BB62640BED1AF273E414640BBDE708C3AB6264025DEE2B41C414640861013F002B6264042A6DB3EFF404640657BCBB8FFB5264021BE4F03FD404640F1FD93EBDDB5264066769568EC40464062A73C98D1B52640DE38E28CE6404640A5CDE9D8BBB526405F655645DB40464099FD66B0A9B526402121EC33D2404640F8A2F8B3A6B526403CC827B6D040464085FC22F1A4B52640A962FFD4CF40464041FB3E9878B526407A1D16CCB8404640BEC50F5777B52640F9DE3E25B840464022CB8DC950B5264041E293B4A440464003E127AD4AB52640A14CA79FA14046407814BB0228B52640CBD8012490404640', 4326)
);



CREATE MATERIALIZED VIEW cinema_vicini AS
SELECT e.ogc_fid AS id_casa, c.*
FROM Ed  e
LEFT JOIN cinema c ON ST_DWithin(ST_Transform(c.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW farmacie_vicine AS
SELECT e.ogc_fid AS id_casa, f.*
FROM Ed  e
LEFT JOIN farmacie f ON ST_DWithin(ST_Transform(f.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW supermercati_vicini AS
SELECT e.ogc_fid AS id_casa, spm.*
FROM Ed  e
LEFT JOIN supermercati spm ON ST_DWithin(ST_Transform(ST_SetSRID(ST_MakePoint(spm."Longitudine", spm."Latitudine"), 4326), 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW ristoranti_vicini AS
SELECT e.ogc_fid AS id_casa, r.*
FROM Ed  e
LEFT JOIN ristoranti r ON ST_DWithin(ST_Transform(ST_SetSRID(ST_MakePoint(r."Longitudine", r."Latitudine"), 4326), 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW scuole_vicine AS
SELECT e.ogc_fid AS id_casa, sc.*
FROM Ed  e
LEFT JOIN scuole sc ON ST_DWithin(ST_Transform(sc.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW sport_vicini AS
SELECT e.ogc_fid AS id_casa, s.*
FROM Ed  e
LEFT JOIN impianti_sportivi s ON ST_DWithin(ST_Transform(s.geom, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW picnic_vicini AS
SELECT e.ogc_fid AS id_casa, pc.*
FROM Ed  e
LEFT JOIN parchi pc ON ST_DWithin(ST_Transform(pc.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW giochi_vicini AS
SELECT e.ogc_fid AS id_casa, pgh.*
FROM Ed  e
LEFT JOIN parchi pgh ON ST_DWithin(ST_Transform(pgh.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW parchi_vicini AS
SELECT e.ogc_fid AS id_casa, ph.*
FROM Ed  e
LEFT JOIN parchi ph ON ST_DWithin(ST_Transform(ph.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW palestre_vicine AS
SELECT e.ogc_fid AS id_casa, p.*
FROM Ed  e
LEFT JOIN palestre p ON ST_DWithin(ST_Transform(p.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 400);

CREATE MATERIALIZED VIEW doposcuola_vicini AS
SELECT e.ogc_fid AS id_casa, dps.*
FROM Ed  e
LEFT JOIN doposcuola dps ON ST_DWithin(ST_Transform(dps.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 300);

CREATE MATERIALIZED VIEW fermatebus_vicine AS
SELECT e.ogc_fid AS id_casa, fb.*
FROM Ed e
LEFT JOIN fermatebus fb ON ST_DWithin(ST_Transform(fb.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW stazioniferroviarie_vicine AS
SELECT e.ogc_fid AS id_casa, ft.*
FROM Ed  e
LEFT JOIN stazioniferroviarie ft ON ST_DWithin(ST_Transform(ft.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW parcheggi_vicini AS
SELECT e.ogc_fid AS id_casa, pg.*
FROM Ed  e
LEFT JOIN parcheggi pg ON ST_DWithin(ST_Transform(pg.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 100);

CREATE MATERIALIZED VIEW colonnine_vicine AS
SELECT e.ogc_fid AS id_casa, cn.*
FROM Ed  e
LEFT JOIN colonnine cn ON ST_DWithin(ST_Transform(cn.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW ospedali_vicini AS
SELECT e.ogc_fid AS id_casa, o.*
FROM Ed e
LEFT JOIN ospedali o ON ST_DWithin(ST_Transform(o.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW banche_vicine AS
SELECT e.ogc_fid AS id_casa, b.*
FROM Ed e
LEFT JOIN banche b ON ST_DWithin(ST_Transform(ST_SetSRID(ST_MakePoint(b."Longitudine", b."Latitudine"), 4326), 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW eventi_vicini AS
SELECT e.ogc_fid AS id_casa, i.*
FROM Ed e
LEFT JOIN eventi i ON ST_DWithin(ST_Transform(i.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW biblioteche_vicine AS
SELECT e.ogc_fid AS id_casa, bb.*
FROM Ed e
LEFT JOIN biblioteche bb ON ST_DWithin(ST_Transform(bb.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);

CREATE MATERIALIZED VIEW musei_vicini AS
SELECT e.ogc_fid AS id_casa, m.*
FROM Ed e
LEFT JOIN musei m ON ST_DWithin(ST_Transform(m.wkb_geometry, 32633), ST_Transform(e.wkb_geometry, 32633), 500);
// Hz. Ayşe Kız AİHL — Sabit Öğrenci Listesi
// PDF'den alınan veriler

function toTitleCase(str) {
  const map = { 'İ':'İ','I':'I','Ş':'Ş','Ğ':'Ğ','Ü':'Ü','Ö':'Ö','Ç':'Ç' };
  return str.split(' ').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      .replace(/i/g,'i').replace(/ı/g,'ı')
  ).join(' ');
}

// Sınıf adından grade çıkar
function gradeFrom(sinif) {
  if (sinif.startsWith('9')) return '9';
  if (sinif.startsWith('10')) return '10';
  if (sinif.startsWith('11')) return '11';
  if (sinif.startsWith('12')) return '12';
  if (sinif.toLowerCase().startsWith('hazır')) return '11';
  return '9';
}

const RAW = [
  // 9/A
  ['9a','17','ŞEYDA NUR HÜNER'],['9a','18','HAYRUNNİSA GENÇ'],['9a','69','MAMAGÜL GÖZÜKÜÇÜK'],
  ['9a','76','SÜMEYYE İÇLİ'],['9a','91','GÜLDANE YILANOĞLU'],['9a','141','ŞEYDA ÇELİK'],
  ['9a','193','ESMA KÜÇÜK'],['9a','217','KEVSER GÜLLÜ'],['9a','232','MELEK AKBAL'],
  ['9a','256','EMİNE NUR CENGİZ'],['9a','277','YASEMİN KORKMAZ'],['9a','279','RABİA NALBANT'],
  ['9a','293','ESMA YETEK'],['9a','329','SİHAM AKYÜREK'],['9a','351','SENİYYE ASLI ŞİNİKOĞLU'],
  ['9a','361','ESMANUR ÇETİN'],['9a','366','MELEK SU EREMLİ'],['9a','388','KEVSER FİDAN'],
  ['9a','401','SABAHAT YAZAR'],['9a','404','YAĞMUR SEVER'],['9a','422','SELİME KAPLAN'],
  ['9a','425','GİZEM KÜÇÜKBEYAZİT'],['9a','434','NESİBE TERLEMEZ'],['9a','462','NAZLI GÜLER'],
  ['9a','528','ZÜLEYHA KILIÇ'],['9a','529','YURDAGÜL ÖZDEMİR'],['9a','575','SONGÜL GÜRBÜZ'],
  ['9a','756','MERYEM EL BAB'],['9a','761','ELİF BUSE TAKA'],['9a','775','AYA AL SYOUFI'],
  ['9a','945','MERYEM ERKAN'],['9a','964','İCLAL DOĞRU'],
  // 9/B
  ['9b','41','NİMET NİSA ATEŞ'],['9b','138','ELİF MÜLAYİM'],['9b','189','İLKNUR KARATAŞ'],
  ['9b','190','MELİS DELİOĞULLARINDAN'],['9b','209','ESRA GÖK'],['9b','246','MERVE CENĞİZ'],
  ['9b','287','MERVE KOLMAN'],['9b','295','EKİN GÜLER'],['9b','296','MEDİNE OĞUZ'],
  ['9b','297','İPEK İÇLİ'],['9b','328','YAĞMUR YÜKSEK'],['9b','347','RABİA ÇELİK'],
  ['9b','354','ESMA NUR ZÜMRE'],['9b','395','FİDAN DOĞAN'],['9b','413','ESMA ODUNCU'],
  ['9b','452','NAZLI NUR ARIKOĞLU'],['9b','477','SİNEM SÜMER'],['9b','515','GÜLBEYAZ AĞCA'],
  ['9b','550','ŞEYMA NUR ASLAN'],['9b','553','ECRİN ÇÖRTÜK'],['9b','566','ECE ÇÖRTÜK'],
  ['9b','591','AYŞE YANMAZ'],['9b','598','HÜMEYRA DAVŞAN'],['9b','636','MEVLÜDE BETÜL BULUT'],
  ['9b','688','BETÜL KONCAGÜL'],['9b','737','ZEKİYE NİSA DELİOĞLU'],['9b','741','ZÜBEYDE TIRAŞLI'],
  ['9b','807','PERİHAN AKDENİZ'],['9b','851','MERYEM KOYUN'],
  // 9/C
  ['9c','46','HATİCE NİSA KARABAY'],['9c','53','SEVDE BETÜL YADIRĞA'],['9c','59','FAHRİYE SUDE ANDİÇ'],
  ['9c','164','FEYZA NUR GÜLER'],['9c','173','NURSENA GÖÇMEN'],['9c','198','CEYDA NUR OĞUL'],
  ['9c','352','HATİCE ZÜMRA BALÇIK'],['9c','353','NİSANUR MERT'],['9c','363','GÖKÇENUR GÖRÜR'],
  ['9c','389','ZEHRA ATIEH'],['9c','391','FERİHA KÖSEOĞLU'],['9c','392','ZEKİYE NUR SAHYANOĞLU'],
  ['9c','412','SONGÜL KALKAN'],['9c','450','ZEYNEP ECRİN ÇOLAK'],['9c','453','ECRİN DURAN'],
  ['9c','487','ZÜBEYDE HÜNER'],['9c','518','İREM ELMACIOĞLU'],['9c','548','FATMAGÜL OKUYUCU'],
  ['9c','574','MERYEM AVCI'],['9c','592','ELİF EROL'],['9c','599','ELİF ZENGİN'],
  ['9c','633','RESİME KAYNAR'],['9c','728','ZEYNEP TUBA ERGİN'],['9c','731','HİLAL EROL'],
  ['9c','738','AYŞE KAHRAMAN'],['9c','909','ECRİN YAREN ELDE'],
  // 9/D
  ['9d','2','HATUN ARSLAN'],['9d','4','SİNEM GÖKÇE'],['9d','24','AYŞEGÜL TAYLAN'],
  ['9d','825','SÜMEYYE YALÇIN'],['9d','826','SAADET YILDIZ'],['9d','831','MELEK KONU'],
  ['9d','833','MERYEM DURAN'],['9d','836','SEHER ÖNAL'],['9d','838','SUAD NUR KIZILAY'],
  ['9d','840','FATMA NUR BAYRAKDAR'],['9d','845','SABAHAT AYTULUN'],['9d','848','HATİCE KÜBRA BOLAT'],
  ['9d','852','ZİYNET NUR YÜKSEK'],['9d','853','ESMA GÜLERYÜZ'],['9d','855','HATİCE NUH'],
  ['9d','856','NUR SİMA KOŞAR'],['9d','859','EBRAR REYYAN ÇELİKEL'],['9d','861','NAZİFENUR YALÇIN'],
  ['9d','864','SÜMEYYE KIRDAR'],['9d','865','ZEYNEP YILMAZ'],
  // 9/H
  ['9h','77','ZEHRA ATIM'],['9h','185','MELİKE ATIM'],['9h','284','CENNET SARI'],
  ['9h','346','SENEM DEMİR'],['9h','387','EBRAR ALİBEY'],['9h','429','AZRANUR GÜNGÖR'],
  ['9h','454','HATİCE NAZ TECİMEN'],['9h','491','MERVE BİNGÜL'],['9h','915','SÜMEYYE SAHYANOĞLU'],
  ['9h','3','BÜŞRA ALBAYRAK'],['9h','35','SAADET BİLGİN'],['9h','39','İLAYDA YÜZER'],
  ['9h','51','HATİCE GÜLER'],['9h','785','BERRANUR KILIÇ'],['9h','844','BERRA BAYIR'],
  ['9h','857','RÜVEYDA AKÇAY'],['9h','858','ASLI DURAN'],['9h','867','NURAN HÜDA BAYRAKDAR'],
  ['9h','868','ELİF ALMA'],['9h','871','ŞEYMA ÇETİN'],['9h','872','HATİCE KÜBRA AVCI'],
  ['9h','875','BEDRİYE NİSA GÜÇ'],['9h','878','HATİCE GÖKÇE'],['9h','880','NURAN BAYRAKDAR'],
  ['9h','884','ZEYNEP GENÇ'],['9h','885','MEDİNE ÇERKEZ'],['9h','886','SÜVEYBE DURAN'],
  ['9h','890','SÜMEYYE GÖK'],['9h','891','HATİCE VEYSİ'],['9h','893','VECİHE TÜL'],
  ['9h','894','ŞEYMA SÖNER'],['9h','896','MERVE BİLGİN'],['9h','897','SULTAN SALİMOĞLU'],
  // 10/A
  ['10a','9','SEVİM ŞEN'],['10a','10','BETÜL YAVUZ'],['10a','20','EBRAR UYSAL'],
  ['10a','22','BÜŞRA SABUNCU'],['10a','23','HACER NUR YAR'],['10a','25','MERYEM ALTINÖZ'],
  ['10a','28','ELİF DOĞRU'],['10a','30','AYŞEGÜL YILMAZ'],['10a','32','SUATNUR ALTUĞ'],
  ['10a','34','MADEEHA ABDUL MONAM'],['10a','36','İLKNUR YOLDAŞ'],['10a','42','YÜKSEL GÜMÜŞBAŞ'],
  ['10a','70','MERVE YİĞİT'],['10a','81','RAHAF ALOSMAN'],['10a','90','FATMA KARABİBER'],
  ['10a','92','BUSE BULUT'],['10a','97','ELİF CİHANOĞLU'],['10a','127','ELİF MENDİL'],
  ['10a','168','RUMEYSA SIDIKA ATICI'],['10a','178','ŞERİFE ALBAYRAK'],['10a','210','MELİKE GEZİCİ'],
  ['10a','216','DERYA ELMAS'],['10a','925','MENEKŞE ŞEYMA KARAKUŞ'],
  // 10/B
  ['10b','29','MEDİNE BÜŞRA KÖSE'],['10b','58','VESİLE KÜRDÜ'],['10b','257','YASEMİN NUR GÜNGÖR'],
  ['10b','268','KÜBRA BAYRAKTAR'],['10b','292','HATİCE KÜBRA KABA'],['10b','414','MEDİNE NUR GÜVERÇİN'],
  ['10b','470','FATMA NUR ŞAHAN'],['10b','699','EMİNA İBRAHİM'],['10b','722','RUKİYE TEKGÖZ'],
  ['10b','747','ZEYNEP ELA KARABİBER'],['10b','755','AYSU SARP'],['10b','757','AYŞE KEVSER TUFAN'],
  ['10b','759','BÜŞRA NAZ KIRAÇ'],['10b','762','ENİSE MÜBERRA DURMAZ'],['10b','763','PINAR BAYRAKTAR'],
  ['10b','764','KARDELEN ÇAĞ'],['10b','765','HAYRUNİSA HOŞBU'],['10b','767','FATMA ZEHRA YİĞİT'],
  ['10b','768','FEYZANUR SÖKMEN'],['10b','772','DERYA TIBIK'],['10b','774','HAYRUNNİSA YILMAZ'],
  ['10b','776','IRMAK SÖKMEN'],['10b','837','RABİA CENĞİZ'],['10b','843','SABAHAT KODALAK'],
  ['10b','899','LAMİA ASLANOĞLU'],['10b','903','ELİF ELMACIOĞLU'],['10b','912','DİLARA BELGE'],
  // 10/C
  ['10c','778','ZEYNEP VURAL'],['10c','784','RÜMEYSA GÜLPINAR'],['10c','789','RUKİYE BARDAKCI'],
  ['10c','790','ELİF ÇAKMAK'],['10c','791','BETÜL ÇAKIR'],['10c','794','EBRU ÇEKİÇ'],
  ['10c','795','AZİME GÜL KONU'],['10c','796','ELİFNAZ UZUN'],['10c','797','FATIMA BETÜL UZUN'],
  ['10c','798','SÜMEYYE ÖZ'],['10c','800','HATİCE YILMAZ'],['10c','801','MERYEM NİSA POLAT'],
  ['10c','802','ESMA MONLA'],['10c','803','FATMA KOÇAK'],['10c','804','SİNEM SAHYANOĞLU'],
  ['10c','805','REYYAN ONUR'],['10c','808','NİLAY BOZOĞLAN'],['10c','809','ELİF NUR ALTINÖZ'],
  ['10c','810','LEYLA İNAL'],['10c','811','DİLARA DEMİR'],['10c','812','RUBA ALASAAD'],
  ['10c','814','TESNİM ELMAHMUD'],['10c','815','AYŞE NUR ARSLAN'],['10c','818','RAMA BASHİR'],
  ['10c','820','ZEHRA KAHRAMAN'],['10c','821','HACER YÖNEY'],['10c','822','AYŞENUR KESER'],
  ['10c','823','NURSİMA SERT'],['10c','824','ELVAN ÖLÇEK'],['10c','830','TAJ ALHAKBEH'],
  // 10/D
  ['10d','5','ELİF NUR BAŞARAN'],['10d','21','EBRAR ZİŞAN KURŞUN'],['10d','37','CEVAHİR ERDOĞAN'],
  ['10d','45','MERYEM ÇATAL'],['10d','49','KERİME NUR DOĞU'],['10d','63','FİLİZ GÜNAY'],
  ['10d','67','MERYEM GÜLER'],['10d','73','İREM SARIATEŞ'],['10d','75','EBRAR GÜNGÖR'],
  ['10d','78','ASİYE SUDE ÇELİK'],['10d','83','ÖZNUR UÇKAN'],['10d','85','EMİNE NUR TECİMEN'],
  ['10d','86','ŞENGÜL TUNALI'],['10d','110','MEDİNE GÜLERYÜZ'],['10d','850','ŞEYMA ABDULLAH'],
  ['10d','862','MERYEM ALAHMAD'],['10d','863','ĞİNA HACOSMAN'],['10d','972','ELİF DAĞDELEN'],
  // 11/A
  ['11a','8','FATMA SÜMEYYE ÇİTO'],['11a','11','HAYRİYE İREM KADİRSOY'],['11a','54','TUBA ERDOĞAN'],
  ['11a','151','MELİKE NUR YILDIZER'],['11a','163','EDA NUR YILDIRIM'],['11a','183','MERVE NUR YILDIZER'],
  ['11a','253','ZEMZEM NALBANT'],['11a','262','FATMA NUR YANMAZ'],['11a','264','HAYRUNNİSA NUR'],
  ['11a','265','CENNET KARA'],['11a','272','FİDAN BİTER'],['11a','281','HAVVA HANELÇİ'],
  ['11a','303','EMİNE ÖNCAN'],['11a','306','NURSİMA DAĞLI'],['11a','310','CUDE ARRAC'],
  ['11a','312','ELİF SENA KURT'],['11a','313','ZEYNEP GÜL KAFFAR'],['11a','314','HAVVA NUR KONU'],
  ['11a','323','HAYRİYE ŞEYMA BAYRAKTAR'],['11a','324','HİLAL DOĞRU'],['11a','327','BEDRİYE NUR ÇAYLI'],
  ['11a','333','SUNA GÖKÇE ALAGÖZ'],['11a','907','RÜMEYSA ÇAKIR'],
  // 11/B
  ['11b','95','FİRDEVS KOYUN'],['11b','171','ZEYNEP UZUN'],['11b','175','YAREN ODUNCU'],
  ['11b','176','ELİF MERT'],['11b','181','FATMANUR GENÇ'],['11b','188','MERVE CİHANGİROĞLU'],
  ['11b','195','ZÜLEYHA ECRİN GÖÇMEN'],['11b','202','ZEYNEP CANSU GÖKÇE'],['11b','203','İNES EBU SUF'],
  ['11b','215','EMİNE YETİŞKİN'],['11b','221','AYSİMA KEL'],['11b','224','WARDA IBRAHIM'],
  ['11b','226','İREM NİDA CEVİZCİ'],['11b','227','SEVDE ÇETİL'],['11b','228','MELEK KADDUR'],
  ['11b','237','AYLİN YILDIRIM'],['11b','248','FATMAGÜL SÜMER'],['11b','380','HATİCE GÜL İŞLEK'],
  ['11b','754','REYYAN AVCI'],
  // 11/C
  ['11c','13','RAVZA NUR AVAZ'],['11c','180','LAMİA ALKAN'],['11c','186','MELİSA KİBAR'],
  ['11c','191','HİLAL TESKİ'],['11c','199','SABAHAT KILINÇ'],['11c','222','REYYAN İNCECİK'],
  ['11c','230','SUAY ŞEN'],['11c','231','SAADET AY'],['11c','236','DUDU NİSA TAPAN'],
  ['11c','241','MEHLİKA BOZKURT'],['11c','252','MERYEM ARACI'],['11c','261','MERYEM YİĞİT'],
  ['11c','263','RABİA GÜNDÜZOĞLU'],['11c','270','CANSU YILMAZ'],['11c','288','ELANUR GÖKÇEN'],
  ['11c','305','ZEKİYE NUR KUYUCU'],['11c','309','ZEYNEB TEMİR'],['11c','315','GANİMENUR EREMLİ'],
  ['11c','336','ELİF AZRA KANMAZ'],['11c','870','MERYEM TEMİR'],
  // 11/D
  ['11d','96','ZELİHA İREM KILIÇ'],['11d','103','AYŞEGÜL BAYRAKTAR'],['11d','111','FATMA ELİF YILMAZ'],
  ['11d','116','HADRA NUR ERGÜÇ'],['11d','121','RÜMEYSA ÖZDEMİR'],['11d','134','FATMA MEDİNE KÖSELİ'],
  ['11d','142','MERVE ALBAYRAK'],['11d','143','ELİF YILMAZ'],['11d','159','AYŞEGÜL TOPAL'],
  ['11d','166','HASİBE NUR BİŞKENER'],['11d','172','ZEHRANUR SUBAŞI'],['11d','174','GAMZE BAYRAK'],
  ['11d','207','ELİF NAZ İNCE'],['11d','218','ELİF KÖR'],['11d','244','HAYRİYE DÖŞ'],
  ['11d','340','FATMA KÜÇÜKBEYAZİT'],['11d','725','HACER SENA YORULMAZ'],
  // 11/E
  ['11e','184','FATMA GÜL KARABİBER'],['11e','900','HAYRÜNİSA DOĞAN'],['11e','901','MEDİNE BULUT'],
  ['11e','905','BERRNUR KIRDAR'],['11e','906','SUEDA GÜLİSTAN'],['11e','912','ELİF CEREN AKKAN'],
  ['11e','916','CANSU TÜL'],['11e','919','MENEKŞE DÖŞ'],['11e','922','ÖZLEM ARACI'],
  ['11e','933','ZEYNEP NUR ÇELİK'],['11e','941','SEVİM AYBÜKE ÇEKİÇ'],['11e','946','FATMA KÜBRA YİĞİT'],
  ['11e','968','MELİKE KİLİC'],['11e','974','GÜLSÜM BİLGİN'],['11e','976','GÜLBAHAR GÜLER'],
  ['11e','983','GÜLAY NUR UÇAR'],
  // 12/A
  ['12a','14','MELİKE İREM EKER'],['12a','126','İREM SEVİM'],['12a','247','ŞEKER NAZ İPEK'],
  ['12a','260','NEZAHAT NUR HOŞBU'],['12a','278','ESMAHAN KESİCİ'],['12a','485','İREM DAMLA KAHİYE'],
  ['12a','584','FEYZANUR KAFAS'],['12a','602','NURSEN TÜRKMEN'],['12a','611','EMİNE HATUN NİNO'],
  ['12a','641','ELİF ÖLÇEK'],['12a','666','MERVE ŞEKER'],['12a','682','ŞEVVAL GÜZEY'],
  ['12a','700','ELİF REYHAN GÜNDÜZOĞLU'],['12a','707','MERYEM CENGİZ'],['12a','708','MÜNİRE ZEYTİNELİ'],
  ['12a','709','SUDE KOÇ'],['12a','716','MELEKNUR BİŞKENER'],['12a','718','SUPHİYE COŞKUN'],
  ['12a','732','İSRA MONLA'],['12a','740','EMİNE OCAK'],['12a','742','ESRA İŞLEK'],
  ['12a','745','EYLÜL GÖK'],['12a','881','ASLI KOYUNOĞLU'],
  // 12/B
  ['12b','345','NİSA AYDIN'],['12b','350','GÜLDEN GÜVEN'],['12b','405','SÜMEYYA ZEYNEP GÜNDÜZ'],
  ['12b','489','HATİCE ELİF VURAL'],['12b','492','SABAHAT SUDE ŞEKER'],['12b','494','MEDİNE YAR'],
  ['12b','497','RABİA KAPLAN'],['12b','645','HATİCE İREM TERZİ'],['12b','670','NİSANUR HANCI'],
  ['12b','692','HATİCE YILMAZ'],['12b','701','TUĞBA İNCECİK'],['12b','703','ZEYNEP SARI'],
  ['12b','704','RÜMEYSA KESER'],['12b','706','ENAS SAYOU'],['12b','715','ASUMAN TÜTÜNCÜ'],
  ['12b','766','GAMZE ŞENSES'],['12b','934','HATİCE ATİLA'],
  // 12/C
  ['12c','150','GÜLCENUR KILIÇ'],['12c','170','KÜBRA KOŞAR'],['12c','341','YÜKSEL AKKAN'],
  ['12c','467','FATMA NUR ÇAĞTAY'],['12c','479','AYŞENUR TUTAN'],['12c','536','REYYAN SİDRA YILDIZ'],
  ['12c','559','FAHRİYE NUR SARIOĞLU'],['12c','626','ELİF BETÜL AKYILDIZ'],['12c','643','ASUDE KALAYAZ'],
  ['12c','646','MERYEM ARACI'],['12c','693','NURSİMA ŞİŞMAN'],['12c','694','SAKİNE ÖZTAŞ'],
  ['12c','696','FATMA KIZILDAĞ'],['12c','710','ZEYNEP KIZILDAĞ'],['12c','712','AYŞEGÜL ASLAN'],
  ['12c','713','ZEYNEP KİRADİ'],['12c','720','EBRAR HATİCE UYSAL'],['12c','723','YAĞMUR YANMAZ'],
  ['12c','727','BÜŞRA ZENGİN'],['12c','729','ZEHRA SOLAK'],['12c','819','HAYRUN NİSA AÇIKGÖZ'],
  // 12/D
  ['12d','16','NURDAN KÖR'],['12d','714','FATMANUR ASLAN'],['12d','719','SUEDA GONCA'],
  ['12d','724','MÜBERRA ANDİÇ'],['12d','730','ZAHİDE ÇAĞTAY'],['12d','733','SİNEM ÇOLAK'],
  ['12d','743','YURDAGÜL ATICI'],['12d','744','FEVZİYE KILIÇ'],['12d','746','İREMSU KURT'],
  ['12d','749','MELAHAT SENA KURŞUN'],['12d','750','SÜMEYYE GÜLER'],['12d','751','MEDİNE BÖVELEK'],
  ['12d','832','FATMA ZEHRA ATICI'],['12d','956','FATMA EĞİLMEZOĞLU'],['12d','959','HATİCE YALÇIN'],
  ['12d','960','SÜMEYRA KESER'],
  // 12/H
  ['12h','144','AYNUR NİSA UĞRAŞ'],['12h','147','MERYEM HÜNER'],['12h','459','UMRİYE BİNGÜL'],
  ['12h','726','NEZEHAT GÜLCÜ'],['12h','734','SEMA NUR KAYA'],['12h','735','SÜMEYYE AKTAŞ'],
  ['12h','781','AYŞE RÜVEYDA KAÇMAZ'],['12h','799','BETÜL KAHRAMAN'],['12h','914','AYŞE KEVSER YÜCE'],
];

export const DEFAULT_STUDENTS = RAW.map(([sinif, no, adSoyad]) => ({
  no,
  adSoyad: adSoyad.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
  sinif: sinif.toUpperCase(),
  grade: gradeFrom(sinif),
  isExempt: false,
}));
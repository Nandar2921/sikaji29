async function checkAPI() {
  console.log('Mengecek struktur API...\n');
  
  const response = await fetch('https://api.alquran.cloud/v1/surah/1/id.indonesian');
  const data = await response.json();
  
  console.log('Struktur data:', Object.keys(data));
  console.log('Data code:', data.code);
  console.log('Data status:', data.status);
  
  if (data.data) {
    console.log('Data keys:', Object.keys(data.data));
    console.log('Surah name:', data.data.name);
    
    if (data.data.ayahs && data.data.ayahs[0]) {
      console.log('Contoh ayat pertama:', Object.keys(data.data.ayahs[0]));
      console.log('Ayat:', data.data.ayahs[0]);
    }
  }
}

checkAPI();
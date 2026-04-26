import fs from 'fs';
import path from 'path';

async function listModels() {
  let apiKey = '';
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/NEXT_GOOGLE_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
  } catch (e) {
    console.error('BŁĄD: Nie można odczytać pliku .env');
    return;
  }

  if (!apiKey) {
    console.error('BŁĄD: Brak klucza API w pliku .env!');
    return;
  }

  console.log(`Sprawdzam klucz: ${apiKey.substring(0, 10)}...`);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('BŁĄD API:', data.error.message);
      console.error('Status:', data.error.status);
      return;
    }

    if (!data.models) {
      console.log('API odpowiedziało, ale nie zwróciło żadnych modeli. Dziwne.');
      console.log('Odpowiedź:', JSON.stringify(data));
      return;
    }

    console.log('\nDOSTĘPNE MODELE DLA TWOJEGO KLUCZA:');
    data.models.forEach(m => {
      console.log(`- ${m.name} (${m.displayName})`);
    });

  } catch (err) {
    console.error('Wystąpił błąd podczas sprawdzania:', err.message);
  }
}

listModels();

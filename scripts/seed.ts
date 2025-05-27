import fs from 'fs/promises';
import {db} from "@/db";


async function seed() {
    try {
        // 1. Wczytaj plik seed.sql
        const sqlFile = await fs.readFile('./scripts/0001_seed.sql', 'utf-8');

        // 2. Rozdziel plik na pojedyncze zapytania po średniku
        const queries = sqlFile
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        // 3. Wykonaj każde zapytanie po kolei
        for (const query of queries) {
            await db.execute(query);
        }

        console.log('Seedowanie zakończone pomyślnie.');
    } catch (error) {
        console.error('Błąd seedowania:', error);
    }
}

seed();

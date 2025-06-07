import fs from 'fs/promises';
import {db} from "@/db";


async function seed() {
    try {
        const sqlFile = await fs.readFile('./scripts/0001_seed.sql', 'utf-8');

        const queries = sqlFile
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        for (const query of queries) {
            await db.execute(query);
        }

        console.log('Seedowanie zakończone pomyślnie.');
    } catch (error) {
        console.error('Błąd seedowania:', error);
    }
}

seed();

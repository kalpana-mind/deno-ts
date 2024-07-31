import {
  MongoClient,
  Database,
} from 'https://deno.land/x/mongo@v0.29.2/mod.ts';

let db: Database;

export async function connect() {
  const client = new MongoClient();
  await client.connect(
    'mongodb+srv://kalpanareadwrite:Sd5z6gsdbzGs8rSF@cluster0.zxyvbda.mongodb.net/?authMechanism=SCRAM-SHA-1'
  );
  console.log('Database connection was successful!');
  db = client.database('denoTodos');
}

export function getDb() {
  return db;
}

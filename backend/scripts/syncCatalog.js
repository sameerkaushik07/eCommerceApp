import "dotenv/config";
import connectDB from "../config/mongodb.js";
import syncCatalog from "../services/catalogSync.js";

await connectDB();
const count = await syncCatalog();
console.log(`Catalog synchronized: ${count} products`);
process.exit(0);

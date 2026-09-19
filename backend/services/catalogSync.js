import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import productModel from "../models/productModel.js";
import deletedProductModel from "../models/deletedProductModel.js";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const catalogFile = path.resolve(backendDirectory, "../../frontend/src/assets/assets.js");

const readCatalog = async () => {
    const source = await fs.readFile(catalogFile, "utf8");
    const productsSource = source.split("export const products = [")[1]?.split("];")[0];

    if (!productsSource) {
        throw new Error("The frontend product catalog could not be found");
    }

    const products = [];
    const productBlocks = productsSource.match(/\{[\s\S]*?\n    \},?/g) || [];

    for (const block of productBlocks) {
        const get = (field) => block.match(new RegExp(`${field}:\\s*["']([^"']+)["']`))?.[1];
        const getNumber = (field) => Number(block.match(new RegExp(`${field}:\\s*(\\d+)`))?.[1]);
        const imageSource = block.match(/image:\s*\[([^\]]+)\]/)?.[1] || "";
        const images = imageSource.match(/p_img[\w_]+/g) || [];
        const sizes = [...(block.match(/sizes:\s*\[([^\]]+)\]/)?.[1] || "").matchAll(/["']([^"']+)["']/g)]
            .map((match) => match[1]);

        const product = {
            _id: get("_id"),
            name: get("name"),
            description: get("description"),
            price: getNumber("price"),
            image: images.map((image) => `/assets/${image}.png`),
            category: get("category"),
            subCategory: get("subCategory"),
            sizes,
            bestseller: block.match(/bestseller:\s*true/) !== null,
            date: getNumber("date"),
        };

        if (product._id && product.name && product.image.length > 0) {
            products.push(product);
        }
    }

    if (products.length === 0) {
        throw new Error("No products were parsed from the frontend catalog");
    }

    return products;
};

const syncCatalog = async () => {
    const products = await readCatalog();
    const deletedProducts = await deletedProductModel
        .find({ _id: { $in: products.map((product) => product._id) } })
        .select("_id")
        .lean();
    const deletedProductIds = new Set(deletedProducts.map((product) => product._id));
    const activeProducts = products.filter((product) => !deletedProductIds.has(product._id));

    await productModel.bulkWrite(activeProducts.map((product) => ({
        updateOne: {
            filter: { _id: product._id },
            update: { $set: product },
            upsert: true,
        },
    })));
    return activeProducts.length;
};

export { readCatalog };
export default syncCatalog;

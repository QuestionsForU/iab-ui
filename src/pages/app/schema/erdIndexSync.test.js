import fs from "fs";
import path from "path";

const root = path.resolve(__dirname, "../../../..");
const erd = JSON.parse(fs.readFileSync(path.join(root, "src/pages/app/schema/erd-schema.json"), "utf8"));
const indexes = JSON.parse(fs.readFileSync(path.join(root, "firestore.indexes.json"), "utf8"));

const listIndex = (collectionGroup) => indexes.indexes.some(index =>
    index.collectionGroup === collectionGroup &&
    index.queryScope === "COLLECTION" &&
    index.fields.some(field => field.fieldPath === "application" && field.order === "ASCENDING") &&
    index.fields.some(field => field.fieldPath === "dateCreated")
);

describe("ERD and Firestore indexes", () => {
    const collections = Object.keys(erd["x-firestore"].collections);
    const indexed = [...new Set(indexes.indexes.map(index => index.collectionGroup))];

    it("names the same collections in both files", () => {
        expect(indexed.slice().sort()).toEqual(collections.slice().sort());
    });

    it("gives every collection the application and dateCreated list index", () => {
        expect(collections.filter(collection => !listIndex(collection))).toEqual([]);
    });

    it("points every collection at a declared definition", () => {
        collections.forEach(collection => {
            const ref = erd["x-firestore"].collections[collection].$ref;
            const name = ref.replace("#/$defs/", "");
            expect(erd.$defs[name]).toBeDefined();
        });
    });
});

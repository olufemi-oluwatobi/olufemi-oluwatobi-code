var assert = require("assert");
var expect = require("chai").expect;
var should = require("chai").should();
const sinon = require("sinon");
const fs = require("fs");
const path = require("path");
const rdfJson = require("./test.json");
const {
  readFile,
  extractBookMetaData,
  parseRdf,
  performDbOperations,
} = require("./helpers/utils");
const {
  author: Author,
  book: Book,
  subject: Subject,
  bookAuthors: BookAuthors,
  bookSubjects: BookSubject,
} = require("./db/models");
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");
const bookValue = {
  id: 1,
  title: "title",
  language: "language",
};
const result = {
  id: "12816",
  title: "The Devil's Pool",
  licenseRights: "Public domain in the USA.",
  language: "en",
  subjects: [{ title: "Pastoral fiction, French" }, { title: "PQ" }],
  authors: [{ firstname: " George", lastname: "Sand" }],
  publicationDate: "2004-07-04",
};
const data = JSON.parse(JSON.stringify(rdfJson));
const meta = extractBookMetaData(data);

it("check to see if folder is there", () => {
  assert.ok(fs.existsSync("rdf-files"));
});

describe("test book models", () => {
  const book = new Book(sequelize, dataTypes);
  it("should add a new book to the data base", () => {
    const stub = sinon.stub(Book, "createBook").returns(bookValue);
    expect(stub.calledOnce).to.be.true;
  });

  context("properties", () => {
    [
      "id",
      "publicationDate",
      "publisher",
      "title",
      "language",
      "licenseRights",
      "createdAt",
      "updatedAt",
    ].forEach(checkPropertyExists(book));
  });
});

describe("book metadata", () => {
  it("should not be undefined", () => {
    expect(meta).to.not.be.undefined;
  });

  it("to have property id ", () => {
    expect(meta).to.have.own.property("id");
  });
  const withOutRdfKey = extractBookMetaData({ id: [] });
  it("should return an empty object", () => {
    expect(withOutRdfKey).to.deep.equal({});
  });
  it("should have all keys", () => {
    expect(meta).to.have.all.keys(
      "id",
      "publicationDate",
      "title",
      "language",
      "subjects",
      "licenseRights",
      "authors"
    );
  });
});

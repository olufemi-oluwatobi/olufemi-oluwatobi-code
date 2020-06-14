const {
  author: Author,
  book: Book,
  subject: Subject,
  bookAuthors: BookAuthors,
  bookSubjects: BookSubject,
} = require(".././db/models");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const uuid = require("uuid");

// recieves the metadata object and extracts the needed information
// i decide to be verboose about this function for readability sake
const extractBookMetaData = (data) => {
  let dataObj = {};
  let ebookData,
    about,
    ebookTitle,
    ebookSubject,
    ebookRights,
    ebookPublicationDate,
    ebookAuthor,
    ebookLanguage;

  const rdf = data["rdf:RDF"];
  if (rdf) {
    const ebook = rdf["pgterms:ebook"];
    if (ebook) {
      ebookData = ebook[0];
      about = ebookData["$"] && ebookData["$"]["rdf:about"];
      ebookTitle = ebookData["dcterms:title"];
      ebookRights = ebookData["dcterms:rights"];
      ebookLanguage = ebookData["dcterms:language"];
      ebookSubject = ebookData["dcterms:subject"];
      ebookAuthor = ebookData["dcterms:creator"];
      ebookPublicationDate = ebookData["dcterms:issued"];

      if (about) {
        dataObj.id = about.split("/")[1];
      }
      if (ebookTitle) {
        dataObj.title =
          // remove new line indicatiors
          typeof ebookTitle === "object" && Array.isArray(ebookTitle)
            ? ebookTitle[0].replace(/(\r\n|\n|\r)/gm, "")
            : ebookTitle.replace(/(\r\n|\n|\r)/gm, "");
      }
      dataObj.licenseRights = Array.isArray(ebookRights) && ebookRights[0];
      if (ebookLanguage) {
        const languageObj = ebookLanguage[0];
        if (languageObj) {
          const description = languageObj["rdf:Description"];
          if (description) {
            dataObj.language = description[0]["rdf:value"][0]["_"];
          }
        }
      }
      if (ebookSubject) {
        if (Array.isArray(ebookSubject)) {
          dataObj.subjects = ebookSubject.map((subject) => {
            const subjectDescription = subject["rdf:Description"];
            if (subjectDescription) {
              return {
                id: uuid.v4(),
                title: subjectDescription[0]["rdf:value"][0],
              };
            }
          });
        }
      }
      if (ebookAuthor) {
        if (Array.isArray(ebookAuthor)) {
          dataObj.authors = ebookAuthor[0]["pgterms:agent"].map((subject) => {
            const name = subject["pgterms:name"];
            if (name) {
              const [lastname, firstname] = name[0].split(",");
              return { id: uuid.v4(), firstname, lastname };
            }
          });
        }
      }
      dataObj.publicationDate =
        ebookPublicationDate && ebookPublicationDate[0]["_"];
    }
  }
  return dataObj;
};

// asycnchronously read the file buffer and parse its string to json
const parseRdf = (data) => {
  return new Promise((resolve, reject) => {
    const Parser = new xml2js.Parser();
    Parser.parseString(data, (err, result) => {
      if (err) reject(err);
      const dataObj = JSON.parse(JSON.stringify(result));
      resolve(dataObj);
    });
  });
};
const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const performDbOperations = async (metadata) => {
  try {
    const { subjects, authors, ...book } = metadata;
    // check if book metadata was extracted
    if (book) {
      const newBook = await Book.createBook(book);
      if (newBook) {
        const { id } = newBook;
        if (authors && authors.length) {
          const newAuthors = await Author.createAuthor(authors);
          if (newAuthors && newAuthors.length) {
            const bookAuthors = JSON.parse(
              JSON.stringify(newAuthors)
            ).map((author) => ({ authorId: author.id, bookId: id }));
            await BookAuthors.createBookAuthors(bookAuthors);
          }
        }
        if (subjects.length) {
          const newSubject = await Subject.createSubjects(subjects);
          if (newSubject && newSubject.length) {
            const bookSubject = JSON.parse(
              JSON.stringify(newSubject)
            ).map((subject) => ({ subjectId: subject.id, bookId: id }));
            await BookSubject.createBookSubject(bookSubject);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  extractBookMetaData,
  performDbOperations,
  readFile,
  parseRdf,
};

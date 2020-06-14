const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const uuid = require("uuid");
const readline = require("readline");
const { exec, fork } = require("child_process");
const {
  readFile,
  extractBookMetaData,
  parseRdf,
  performDbOperations,
} = require("./helpers/utils");
const rdfPath = path.join(__dirname, "rdf-files");
const main = () => {
  const hasRdfFolder = fs.existsSync("rdf-files");
  if (!hasRdfFolder) {
    throw new Error(
      "No rdf-files folder, please download the zip file and extract"
    );
  }
  //check the os type
  const platform = process.platform;

  const command =
    platform == "win32" ? "dir/s/b *.rdf" : "find . -type f -name *.rdf";
  const childProcess = exec(command, { cwd: rdfPath });
  // create readline for extracting file reading from stdout
  const rl = readline.createInterface({ input: childProcess.stdout });

  //event emitter for checking when a new line event has been emitted
  //read the new line, extract the rdf data and store in the database
  rl.on("line", async (line) => {
    try {
      const filePath = path.resolve(__dirname, "rdf-files", line);
      const file = await readFile(filePath);
      const data = await parseRdf(file);
      const metadata = await extractBookMetaData(data);
      await performDbOperations(metadata);
    } catch (error) {
      console.log(error);
    }
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on("close", () => {
    console.log("done");
    //kill child process when request is done
    childProcess.kill("SIGINT");
  });
};

main();

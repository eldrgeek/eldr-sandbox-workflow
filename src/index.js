import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import { fetchFiles, finaliseCSB, sendFilesToCSB } from "codesandboxer";
// https://github.com/codesandbox/codesandboxer/tree/master/packages/codesandboxer
const URL =
  "https://github.com/eldrgeek/eldr-openwindows/blob/master/src/Components/SelectList.js";
const [host, account, repository, examplePath] = URL.match(
  /https:\/\/(.*)\.com\/(.*?)\/(.*?)\/.*?\/.*?\/(.*)/
).slice(1);
let [name] = examplePath.match(/.*\/(.*)\..*$/).slice(1);
name += "-component";
console.log(name);
let spec = {
  examplePath,
  name,
  pkgJSON: "package.json",
  gitInfo: {
    account,
    repository,
    host
  }
};
console.log(spec);

const index = `
/**
  This CodeSandbox has been automatically generated using
  "codesandboxer". If you're curious how that happened, you can
  check out our docs here: https://github.com/codesandbox/codesandboxer

  If you experience any struggles with this sandbox, please raise an issue
  on github. :)
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './${examplePath}';

ReactDOM.render(
<div>
  <h1>${name}</h1>
  <App />
</div>,
document.getElementById('root')
);
`;

async function doSandbox() {
  let fetchedInfo = await fetchFiles(spec);

  let newCode = fetchedInfo.files["index.js"].content;
  let matcher = newCode.match(/([\s\S]*import App from )(.*)([\s\S]*$)/m);
  newCode = matcher[1] + "'./" + spec.examplePath + "'" + matcher[3];
  // fetchedInfo.files["index.js"].content = newCode;

  // fetchedInfo.files["foo.js"] = fetchedInfo.files["example.js"];
  //fetchedInfo.files[spec.examplePath] = fetchedInfo.files["example.js"];
  //delete fetchedInfo.files["example.js"]
  let modCode = fetchedInfo.files["example.js"].content;
  console.log(modCode, typeof modCode, typeof "abe1");

  fetchedInfo.files["example.js"] = {
    content: "//moved"
  };
  fetchedInfo.files["index.js"] = {
    content: index
  };
  fetchedInfo.files[spec.examplePath] = {
    content: modCode
  };
  console.log(fetchedInfo);
  console.log(Object.keys(fetchedInfo.files));
  // fetchedInfo = original;
  // This also returns a finalised files and finalised dependencies property, in case you want to introspect those before sending.
  if (1) {
    let finalisedInformation = finaliseCSB(fetchedInfo, { name: spec.name });
    let csbInfo = await sendFilesToCSB(finalisedInformation.parameters);
    console.log("Our sandbox's ID:", csbInfo.sandboxId);
    console.log("Simple sandbox URL:", csbInfo.sandboxUrl);
    window.open(csbInfo.sandboxUrl, "Sandbox");
  }
}
// doSandbox()

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <button onClick={() => doSandbox(spec)}>Click to make a sandbox</button>
      <h2>Start me editing to see some magic happen!</h2>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

import nsoap, { RoutingError } from "nsoap";

const identifierRegex = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

function parseDict(dict) {
  return key => {
    if (Object.prototype.hasOwnProperty.call(dict, key)) {
      const val = dict[key];
      return {
        value:
          typeof val !== "string"
            ? val
            : val === "true" || val === "false"
              ? val === "true"
              : identifierRegex.test(val) ? `${val}` : JSON.parse(val)
      };
    }
  };
}

function parseQuery(query) {
  return parseDict(query);
}

function wrap(_app, key) {
  const app = key ? { [key]: _app[key] } : _app;
  return Object.keys(app).reduce((acc, key) => {
    const handler = app[key];
    acc[key] = () => {
      
    };
    return acc;
  }, {});
}

export default function(app, options = {}) {
  const _urlPrefix = options.urlPrefix || "/";
  const urlPrefix = _urlPrefix.endsWith("/") ? _urlPrefix : `${urlPrefix}/`;

  return req => {
    const { url, path, query } = req;

    if (path.startsWith(urlPrefix)) {
      const strippedPath = path.substring(urlPrefix.length);
      const dicts = [
        options.parseQuery ? options.parseQuery(query) : parseQuery(query)
      ];

      const createContext = options.createContext || (x => x);
      const context = options.appendContext
        ? createContext({ req, res, isContext: () => true })
        : [];

      nsoap(app, strippedPath, dicts, {});
    } else {
      //Do the not found thing...
    }
  };
}

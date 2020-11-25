

declare type JupyterApi$ContentError = {
    reason: String,
    message: String
};

declare type JupyterApi$DirectoryContent = {
    type: "directory",
    mimetype: null,
    content: null | Array<JupyterApi$ContentError>,

    name: String,
    path: String,

    create: Date,
    last_modified: Date,
    format: "json"
};

declare type JupyterApi$NotebookContent = {
    type: "notebook",
    mimetype: null,
    content: null | Object,

    name: String,
    path: String,

    create: Date,
    last_modified: Date,
    writable: Boolean,
    format: "json"
};

declare type JupyterApi$FileContent = {
    type: "file",
    mimetype: null | String,
    content: null | String,

    name: String,
    path: String,

    create: Date,
    last_modified: Date,
    writable: Boolean,
    format: null | "text" | "base64"
};

declare type JupyterApi$Content = 
|   JupyterApi$DirectoryContent
|   JupyterApi$FileContent
|   JupyterApi$NotebookContent;
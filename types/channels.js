
declare type JupyterMessageHeader<MT: String>= {
    msg_id: String,
    username: String,
    date:String,
    msg_type: MT, //could be enum?
    version: String// could also be enum?
};

declare type JupyterMessage<MT, C> = {
    header: JupyterMessageHeader<MT>,
    parent_header: JupyterMessageHeader<*> | {},
    metadata: Object,
    content: C,
    buffers?: Array<any> | null
};

declare type ExecuteMessageContent = {
    code: String,
    silent: Boolean,
    store_history: Boolean,
    user_expressions: Object,
    allow_stdin: Boolean,
    stop_on_error: Boolean
};

declare type ExecuteRequest = JupyterMessage<
"execute_request",
ExecuteMessageContent
>;

declare type Channels = rxjs$Subject<JupyterMessage<*,*>>;
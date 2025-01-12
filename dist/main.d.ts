/// <reference types="ws" />
/// <reference types="node" />
import http from "http";
export declare const clients: Map<any, any>;
export declare const wss: import("ws").Server<typeof import("ws"), typeof http.IncomingMessage>;

// @flow

import { formBinderURL, binder } from "rx-binder";

import { kernels, apiVersion } from "rx-jupyter";

import * as rxJupyter from "rx-jupyter";

import * as operators from "rxjs/operators";

import { tap, map, catchError, filter } from "rxjs/operators";
import { of } from "rxjs/observable/of";

export opaque type BinderKey = string;

type BinderOptions = {
  repo: string,
  ref?: string,
  binderURL?: string
};

type HostStatus = "alive" | "acquiring" | "yes";

export const UP = "updog";
export const GETTING_UP = "isitupdog";
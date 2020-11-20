// @flow

import { formBinderURL, binder } from "rx-binder";

import { kernels, apiVersion } from "rx-jupyter";

import * as rxJupyter from "rx-jupyter";

import * as operators from "rxjs/operators";

import { tap, map, catchError, filter } from "rxjs/operators";
import { of } from "rxjs";

export opaque type BinderKey = string;

type BinderOptions = {
  repo: string,
  ref?: string,
  binderURL?: string
};

type HostStatus = "alive" | "acquiring" | "yes";

export const UP = "up";
export const GETTING_UP = "isitup";

type IsItUpHost = {
    type: "isitup"
};

export type ServerConfig = {
    endpoint: String,
    token: String,
    crossDomain: true,
};

type UpHost = {
    type: "up",
    config: ServerConfig
};

function makeHost({
    endpoint,
    token
}:{
    endpoint: String,
    token: String
}): UpHost {
    return{
        type: UP,
        config: {
            crossDomain: true,
            endpoint,
            token
        }
    };
}

type HostRecord = UpHost | IsItUpHost;

export class LocalForage<K:String, V> {
    set(key: K, value: V){
        localStorage.setItem(key, JSON.stringify(value));
    }

    get(key: K, default_?: ?V = null): ?V {
        return JSON.parse(localStorage.getItem(key)|| JSON.stringify(default_));
    }
}

const prefix = "@BinderKey@";

const myBinderURL = "https://mybinder.org";

function sleep(duration: Number){
    return new Promise(resolve => setTimeout(resolve, duration));
}

export class LocalHostStorage {
    localForage: LocalForage<BinderKey, HostRecord>;

    constructor() {
      this.localForage = new LocalForage();
      window.addEventListener("storage", this.handleStorageEvent);
    }


//call to clean

close() {
    window.removeEventListener("storage", this.handleStorageEvent);
}

 handleStorageEvent(event: {
    key: string,
    oldValue: string,
    newValue: string
  }) {
    const { key, newValue } = event;
    // TODO not implemented

    console.warn(
      "Handling storage updates is not implemented. It would be super fantastic to let subscribers know about changes."
    );

    if (event.key.startsWith(prefix)) {
      const binderOpts = JSON.parse(key.slice(prefix.length));
      console.log(binderOpts);
      console.log(newValue);
    }
  }

 createKey({
    repo = "jupyter/notebook",
    ref = "master",
    binderURL = myBinderURL
  }: BinderOptions): BinderKey {
    return `${prefix}${JSON.stringify({ repo, ref, binderURL })}`;
  }

  async  checkUp(host: HostRecord): Promise<boolean> {
    if (host.type === GETTING_UP) {
      return false;
    }

    return kernels
      .list(host.config)
      .pipe(
        map(xhr => {
          console.log(xhr);
          return true;
        }),
        catchError(err => {
          console.error("error listing kernels on server", err);
          return of(false);
        })
      )
      .toPromise();
  }

  async  allocate(binderOpts: BinderOptions): Promise<ServerConfig> {
    let original = this.get(binderOpts);

    if (!original || !original.config) {
      original = { type: "isitup" };
      this.set(binderOpts, original);
      // Fall through, don't return as we allocate below
    } else if (original.type === UP) {
      // TODO Check if really up
      const isUp = await this.checkUp(original);
      if (isUp) {
        return original.config;
      }
      // if not up, launch new
    } else if (original.type === GETTING_UP) {
      // TODO: wait on prior before new one

      while (!original && original.type !== UP) {
        await sleep(1000);
        original = this.get(binderOpts);
        if (original && original.type === UP) {
          return original.config;
        }
      }
    }

    console.log("getting new host");

    const host = await binder(binderOpts)
      .pipe(
        tap(x => {
          console.log(x);
        }),
        filter(msg => msg.phase === "ready"),
        map(msg => makeHost({ endpoint: msg.url, token: msg.token }))
      )
      .toPromise();

    if (
      !host.config ||
      !host.config.endpoint ||
      !host.config.token ||
      !host.config.crossDomain
    ) {
      console.error("Error", host);
      throw new Error("Bad host created");
    }

    this.set(binderOpts, host);

    console.log("allocated ", host);
    return host.config;
  }

   get(opts: BinderOptions): ?HostRecord {
    const key = this.createKey(opts);
    return this.localForage.get(key);
  }

   set(opts: BinderOptions, host: HostRecord) {
    const key = this.createKey(opts);
    this.localForage.set(key, host);
  }
}



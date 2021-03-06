// @flow
import * as React from "react";

import { UP, LocalHostStorage } from "../lib/hostStorage.js";
import type { ServerConfig } from "../lib/hostStorage";
const { binder } = require("rx-binder");
const { kernels } = require("rx-jupyter");

const { Provider, Consumer } = React.createContext();

export { Consumer };

type HostProps = {
  children?: React.Node,
  repo: String,
  ref?: String,
  binderURL?: String
};


export type HostState = ServerConfig;

class Host extends React.Component<HostProps, HostState> {
  lhs: LocalHostStorage;

  static defaultProps = {
    repo: "nteract/vdom",
    ref: "master",
    binderURL: "https://mybinder.org"
  };

  allocate = () => {
    const binderOpts = {
      repo: this.props.repo,
      ref: this.props.ref,
      binderURL: this.props.binderURL
    };

    this.lhs
      .allocate(binderOpts)
      .then(host => {
        this.setState(host);
      })
      .catch(e => {
        console.error("allocation error", e);
      });
  };

  componentDidMount() {
    this.lhs = new LocalHostStorage();

    this.allocate();
  }

  componentWillUnmount() {
    this.lhs.close();
  }

  render() {
    if (!this.props.children) {
      return null;
    }
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export default Host;
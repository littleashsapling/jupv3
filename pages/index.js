// @flow

import * as React from "react";
import Link from "next/link";
import _JSXStyle from "styled-jsx/style";
import Head from "../components/head";
import Nav from "../components/nav";

import Kernel, { Consumer as KernelConsumer } from "../components/kernel";
import Host, { Consumer as HostConsumer } from "../components/host";

import { RunKernel } from "../components/kernelRunner";

import type { HostState } from "../components/host";

//debug box code
const DebugView = (props: HostState) => {
  const url = `${props.endpoint}nteract/edit/?token=${props.token}`;

  return (
    <>
      <div href={url} className="card">
        <a href={url} target="_blank">
          Open on nteract
        </a>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
      <style jsx>{`
        .card {
          display: block;
          padding: 18px 18px 24px;
          text-align: left;
          text-decoration: none;
          color: #434343;
          border: 1px solid #9b9b9b;
        }
        .card:hover {
          border-color: #067df7;
        }
        .card a {
          margin: 0;
          color: #067df7;
          font-size: 18px;
        }
        .card pre {
          pointer-events: none;
          margin: 0;
          padding: 12px 0 0;
          font-size: 13px;
          color: #333;
        }
      `}</style>
    </>
  );
};

export default () => (
  <div>
    <Head title="Home" />
    <Host repo="nteract/vdom">
      <HostConsumer>
        {host => (host ? <h1>{host.endpoint}</h1> : null)}
      </HostConsumer>
      <HostConsumer>
        {host => {
          if (!host) {
            return null;
          }
          return (
            <Kernel host={host}>
              <KernelConsumer>
                {kernel => {
                  if (!kernel || !kernel.last_activity) {
                    return null;
                  }
                  return (
                    <>
                      {kernel && kernel.channels ? (
                        <>
                          <RunKernel kernel={kernel} />
                        </>
                      ) : null}
                      <pre>Kernel ID: {kernel.id}</pre>
                      <p>Connections: {kernel.connections}</p>
                      <p>Execution State: {kernel.execution_state}</p>
                      <p>Last Activity: {kernel.last_activity.toISOString()}</p>
                    </>
                  );
                }}
              </KernelConsumer>
            </Kernel>
          );
        }}
      </HostConsumer>
      <HostConsumer>
        {host => {
          if (!host) {
            return <div>loading</div>;
          }
          //debug starts
          return (
            <DebugView
              endpoint={host.endpoint}
              token={host.token}
              crossDomain={host.crossDomain}
            />
          );
          //debug ends
        }}
      </HostConsumer>
    </Host>
  </div>
);
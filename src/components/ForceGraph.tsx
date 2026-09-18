"use client";

// Thin client-only wrapper around react-force-graph-2d.
// We pass the imperative handle through a plain `innerRef` prop so we don't
// rely on ref forwarding through next/dynamic.
import ForceGraph2D from "react-force-graph-2d";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ForceGraph({ innerRef, ...props }: any) {
  return <ForceGraph2D ref={innerRef} {...props} />;
}

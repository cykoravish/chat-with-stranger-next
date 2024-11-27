import React from "react";

export default function chat() {
  console.log("env-name1:", process.env.NEXT_PUBLIC_NAME);
  console.log("env-name2:", process.env.NEXT_PUBLIC_NODE_ENV);
  console.log("env-name2:", process.env.NODE_ENV);
  return <div>chat</div>;
}

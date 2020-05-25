import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Confetti from "react-confetti";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TRootState } from "../../../typings/rootstate";
import { Batteries } from "./Batteries";
import { Tests } from "./Tests";

const AppContainer = styled.div`
  width: 100%;
`;

const MapElement = styled.div<{
  status: TRootState["status"];
}>`
  filter: ${({ status }) =>
    status === "failed"
      ? "grayscale(100%) blur(2px) contrast(1.8)"
      : "grayscale(50%)"};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: filter 0.3s;
`;

const Fog = styled.div<{
  status: TRootState["status"];
  runAll: TRootState["runAll"];
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background-color 1s, background-image 1s;
  ${({ status }) =>
    status === "failed"
      ? `background-image: url(${require("../../images/blood.png")});`
      : ""}
  background-size: cover;
  background-position: center;
  background-color: ${({ status, runAll }) =>
    status === "failed"
      ? "#46000060"
      : status === "success" && !runAll
      ? "rgba(0,0,0,0.5)"
      : "rgba(6, 0, 47, 0.23)"};
  z-index: 1;
`;

export function App() {
  const { status, runAll } = useSelector<TRootState, TRootState>(
    state => state
  );

  return (
    <AppContainer>
      <ToastContainer
        position="top-left"
        closeOnClick={true}
        hideProgressBar={true}
      />
      <Fog status={status} runAll={runAll} />
      {status === "success" && !runAll ? (
        <Confetti recycle={false} friction={1} width={window.innerWidth} />
      ) : null}
      <MapElement id="map" status={status} />
      <Batteries />
      <Tests />
    </AppContainer>
  );
}

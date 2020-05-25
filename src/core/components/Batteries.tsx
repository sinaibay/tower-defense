import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { TRootState } from "../../../typings/rootstate";

const MAX_BATTERIES_C0UNT = 20;

const BatteryPannel = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  text-align: right;
  max-width: calc(80vw -40px);
  height: 64px;
  white-space: nowrap;
`;

const BatteryIcon = styled.img<{ used: boolean }>`
  transition: transform 0.2s linear, opacity 0.2s linear;
  ${props =>
    props.used &&
    css`
      opacity: 0;
      transform: scale(2);
    `};
`;

const IMAGE_BATTERY = require("../../images/battery.png");

export const Batteries = () => {
  const count = useSelector<TRootState, number>(
    state => state.currentGame.energy
  );

  return count ? (
    <BatteryPannel>
      {Array.from({ length: MAX_BATTERIES_C0UNT }).map((v, i, list) => (
        <BatteryIcon
          alt="energy"
          key={i.toString()}
          src={IMAGE_BATTERY}
          width="64"
          height="64"
          used={list.length - i > count}
        />
      ))}
    </BatteryPannel>
  ) : null;
};

import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { TRootState } from "../../../typings/rootstate";
import { TGameState } from "../../../typings/game-state";
import { runTestAction, runAllAction, setTimeSpeed } from "../actions";

const TestsNavigation = styled.div`
  z-index: 20;
  position: absolute;
  right: 0;
  top: 0;
  width: 250px;
  padding: 20px 20px 10px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0px 0px 0px 5px;
  backdrop-filter: blur(3px);
`;

const Button = styled.button<{ running: boolean }>`
  display: block;
  width: 100%;
  background-color: ${({ running }) => (running ? "black" : "#23272b")};
  padding: 0.375rem 0.75rem;
  color: white;
  font-weight: 400;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  margin-bottom: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  outline: 0;

  :hover {
    background-color: #63404d;
  }
  :active {
    background-color: #82294a;
  }

  div {
    display: none;
    position: absolute;
    top: 120%;
    right: 50px;
    left: -100%;
    background: #c0c0c0;
    border-radius: 5px;
    padding: 10px;
    color: black;
    text-align: left;
    z-index: 1;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  :hover div {
    display: block;
    outline: 0;
  }
`;

const TestLoading = styled.b`
  color: orange;
`;

const TestFailed = styled.b`
  color: red;
`;

const TestSuccess = styled.b`
  color: #22d622;
`;

const SpeedBlock = styled.div`
  margin-bottom: 20px;
  text-align: right;
  background: #ffed5e;
  border-radius: 5px;
  padding: 5px;
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const SpeedButton = styled.button<{ current: boolean }>`
  background: ${({ current }) => (current ? "black" : "#fefefe")};
  color: ${({ current }) => (current ? "white" : "black")};
  padding: 2px 5px;
  margin-left: 3px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const RunAllBlock = styled.div`
  flex: 1;
`;

export const Tests = () => {
  const dispatch = useDispatch();
  const runTest = (test: TGameState) => () => dispatch(runTestAction(test));
  const runAll = () => dispatch(runAllAction());
  const setSpeed = (speed: number) => () => dispatch(setTimeSpeed(speed));
  const { currentGame, tests, status, timeSpeed } = useSelector<
    TRootState,
    TRootState
  >(state => state);

  return (
    <TestsNavigation>
      <SpeedBlock>
        Vitesse :{" "}
        {[1, 2, 3].map(speed => (
          <SpeedButton
            key={speed}
            onClick={setSpeed(speed)}
            disabled={speed === timeSpeed}
            current={speed === timeSpeed}
          >
            x{speed}
          </SpeedButton>
        ))}
        <RunAllBlock>
          <button onClick={runAll}>Tout lancer</button>
        </RunAllBlock>
      </SpeedBlock>

      {tests
        .filter(test => test.enabled)
        .map((test, i) => (
          <Button
            key={i.toString()}
            onClick={runTest(test)}
            running={i === currentGame.index}
          >
            {i + 1} - {test.name}
            <br />
            {i === currentGame.index ? (
              <>
                {status === "running" ? (
                  <TestLoading>(running...)</TestLoading>
                ) : status === "success" ? (
                  <TestSuccess>(success !)</TestSuccess>
                ) : status === "failed" ? (
                  <TestFailed>(failed !)</TestFailed>
                ) : null}
              </>
            ) : null}
            <div
              dangerouslySetInnerHTML={{
                __html: test.description.replace(/\n/g, "<br/>")
              }}
            ></div>
          </Button>
        ))}
    </TestsNavigation>
  );
};

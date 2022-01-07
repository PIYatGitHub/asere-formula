import moment from "moment";
import React from "react";
import "./App.css";

function App() {
  const XIRR = (values: any[], dates: any[], guess: number) => {
    // Credits: algorithm inspired by Apache OpenOffice

    // Calculates the resulting amount
    var irrResult = function (values: any[], dates: any[], rate: number) {
      var r = rate + 1;
      var result = values[0];
      for (var i = 1; i < values.length; i++) {
        result +=
          values[i] /
          Math.pow(r, moment(dates[i]).diff(moment(dates[0]), "days") / 365);
      }
      return result;
    };
    // Calculates the first derivation
    var irrResultDeriv = function (values: any[], dates: any[], rate: number) {
      var r = rate + 1;
      var result = 0;
      for (var i = 1; i < values.length; i++) {
        var frac = moment(dates[i]).diff(moment(dates[0]), "days") / 365;
        result -= (frac * values[i]) / Math.pow(r, frac + 1);
      }
      return result;
    };
    // Check that values contains at least one positive value and one negative value
    var positive = false;
    var negative = false;
    for (var i = 0; i < values.length; i++) {
      if (values[i] > 0) positive = true;
      if (values[i] < 0) negative = true;
    }

    // Return error if values does not contain at least one positive value and one negative value
    if (!positive || !negative) return "#NUM!";
    // Initialize guess and resultRate
    var initialGuess = typeof guess === "undefined" ? 0.1 : guess;
    var resultRate = initialGuess;

    // Set maximum epsilon for end of iteration
    var epsMax = 1e-10;

    // Set maximum number of iterations
    var iterMax = 50;
    // Implement Newton's method
    var newRate, epsRate, resultValue;
    var iteration = 0;
    var contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate =
        resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
    } while (contLoop && ++iteration < iterMax);
    if (contLoop) return "#NUM!";
    // Return internal rate of return
    return resultRate;
  };
  const result = XIRR([-1, 2, 3], [Date.now()], 0.1);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hey, Asere. This is the output of the formula XIRR for your inputs.
        </p>
        <p>
          {" "}
          Change the inputs on line 65 (const result = XIRR([-1, 2, 3],
          [Date.now()], 0.1);) above and hit save while this is still running to
          see the updated result.
        </p>
        <p>Happy hacking, mate!</p>
        <p>RESULT IS: </p>
        <p>
          {"<<<"}&nbsp;&nbsp;&nbsp;{result}&nbsp;&nbsp;&nbsp;{">>>"}
        </p>
      </header>
    </div>
  );
}

export default App;

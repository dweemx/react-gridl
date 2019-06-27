import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Source: https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
  array_count_occurence(arr) {
      var a = [],
        b = [],
        prev;

      arr.sort();
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
          a.push(arr[i]);
          b.push(1);
        } else {
          b[b.length - 1]++;
        }
        prev = arr[i];
      }

      return [a, b];
  }

  
  // split
  // 
  // Source: https://www.geeksforgeeks.org/split-the-number-into-n-parts-such-that-difference-between-the-smallest-and-the-largest-part-is-minimum/
  split(x, n) {
    // If we cannot split the
    // number into exactly 'N' parts
    let parts = [];

    if (x < n) {
      console.log("error");
    }
    // If x % n == 0 then the minimum
    // difference is 0 and all
    // numbers are x / n
    else if (x % n === 0) {
      for (let i = 0; i < n; i++) {
        parts.push(Math.round(x / n))
      }
    } else {
      // upto n-(x % n) the values
      // will be x / n
      // after that the values
      // will be x / n + 1
      let zp = n - (x % n);
      let pp = Math.round(x / n);
      for (let i = 0; i < n; i++) {
        if (i >= zp) {
          parts.push(pp + 1)
        } else {
          parts.push(pp)
        }
      }
    }
    return parts
  }

  render() {
    // this.split(1234, 5);

    let cellWidth = 5,
      cellHeight = 5;
    let virtualGridWidth = window.innerWidth / cellWidth,
      virtualGridHeight = window.innerHeight / cellHeight;

    let nRows = 100, nColumns = 100;

    let virtualGridHeightMidPoint = nRows / 2,
      virtualGridWidthMidPoint = virtualGridWidth / 2;
    console.log(
      `${virtualGridWidth}, ${virtualGridHeight}, ${virtualGridHeightMidPoint}, ${virtualGridWidthMidPoint}`
    );

    let columnSizes = this.split(window.innerWidth, nColumns)
    console.log(columnSizes)
    console.log(columnSizes.length)
    let frequencyTable = this.array_count_occurence(columnSizes)
    console.log(frequencyTable)
    let gridTemplateColumns = frequencyTable[0].map((currElement, index) => {
      return `repeat(${frequencyTable[1][index]},"${frequencyTable[0][index]}px")`;
    }).join(' ');
    console.log(gridTemplateColumns)
    let rowSizes = this.split(window.innerWidth, nRows)
    console.log(rowSizes)
    console.log(rowSizes.length)
    let rowSizesFrequencyTable = this.array_count_occurence(rowSizes)
    let gridTemplateRows = rowSizesFrequencyTable[0].map((currElement, index) => {
      return `repeat(${rowSizesFrequencyTable[1][index]},"${rowSizesFrequencyTable[0][index]}px")`;
    }).join(' ');
    console.log(gridTemplateRows)

    // let gridTemplateColumns = `repeat(${Math.ceil(virtualGridWidth)}, ${cellWidth}px)`
    // let gridTemplateColumns = `repeat(${Math.ceil(virtualGridHeight)}, ${cellHeight}px)`
    let gridContainerStyle = {
      // width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
      display: "grid",
      gridTemplateColumns: gridTemplateColumns,
      gridTemplateRows: gridTemplateRows,
      gridRowGap: "0px",
      gridColumnGap: "0px",
      backgroundColor: "#2196F3"
    };

    return (
      <div style={gridContainerStyle}>
        <div
          style={{
            backgroundColor: "rgba(50, 255, 255, 0.8)",
            gridColumn: `1 / 50`,
            gridRow: `1 / 100`
          }}
        >
          1
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 0, 255, 0.8)",
            gridColumn: `50 / 100`,
            gridRow: `1 / 50`
          }}
        >
          2
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 50, 0, 0.8)",
            gridColumn: `50 / 100`,
            gridRow: `50 / 100`
          }}
        >
          3
        </div>
      </div>
    );
  }
}

export default App

// ReactDOM.render(<App />, document.getElementById("root"));

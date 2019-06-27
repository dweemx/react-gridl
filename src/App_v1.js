import ReactDOM from "react-dom";
import React, { Component } from "react";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let cellWidth = 10,
      cellHeight = 10;
    let virtualGridWidth = window.innerWidth / cellWidth,
      virtualGridHeight = window.innerHeight / cellHeight;

    let midPoint = virtualGridHeight / 2;
    console.log(`${virtualGridWidth}, ${virtualGridHeight}, ${midPoint}`);

    let gridContainerStyle = {
      height: `${window.innerHeight}px`,
      // height: "stretch",
      display: "grid",
      gridTemplateColumns: `repeat(${Math.ceil(
        virtualGridWidth
      )}, [col-start] ${cellWidth}) [col-start]`,
      // gridTemplateColumns: "repeat(100, auto)",
      gridTemplateRows: `repeat(${Math.ceil(
        virtualGridHeight
      )}, [row-start] ${cellHeight}) [row-start]`,
      // gridTemplateRows: "repeat(100, auto)",
      // gridRowGap: "0px",
      // gridColumnGap: "0px",
      // borderColor: "10px #000 solid",
      backgroundColor: "#2196F3"
      // padding: "0px",
      // margin: "0px"
    };

    let gridStyle = {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      border: "1px solid rgba(0, 0, 0, 0.8)",
      padding: "0px",
      fontSize: "8px",
      textAlign: "center"
      // gridColumn: 0 / 1,
      // gridRow: 1 / 2
    };

    console.log(window.innerWidth);
    console.log(window.innerHeight);

    return (
      <div style={gridContainerStyle}>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            gridColumn: `1 / 14`,
            gridRow: `1 / ${Math.ceil(midPoint)}`
          }}
        >
          1
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 0, 255, 0.8)",
            gridColumn: `14 / ${Math.ceil(virtualGridWidth)}`,
            gridRow: `1 / ${Math.ceil(virtualGridHeight)}`
          }}
        >
          2
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 50, 0, 0.8)",
            gridColumn: `1 / 14`,
            gridRow: `${Math.ceil(midPoint)} / ${Math.ceil(virtualGridHeight)}`
          }}
        >
          3
        </div>
        {/* <div
          style={{
            backgroundColor: "rgba(100, 0, 0, 0.8)",
            gridColumn: `14 / ${Math.ceil(w)}`,
            gridRow: `${Math.ceil(midPoint)} / ${Math.ceil(h)}`
          }}
        >
          4
        </div> */}
        {/* <div style={gridStyle}>3</div>  
        <div style={gridStyle}>4</div> */}
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById("root"));

import React from "react";
import Utils from '../Utils';
import deepmerge from 'deepmerge';

function parseCellLayout(cellLayout) {
  let cellSpanMatcher = /(?<spanLength>[0-9]+)(?<spanOperator>[|-])/; // First find all complete matches

  let match = cellLayout.match(new RegExp(cellSpanMatcher, "g")); // For each match extract the spanLength and spanOperator

  return match.map(element => {
    return element.match(cellSpanMatcher);
  });
}

function Composition(props) {
  const [, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const [numRows] = React.useState(props.numRows);
  let maxNumRows = 24; // Has to be a multiple of props.numRows

  const [numColumns] = React.useState(props.numColumns);
  let maxNumColumns = 20; // Has to be a multiple of props.numColumns

  const [virtualGridLayout] = React.useState(props.layout.split(" "));
  console.log(virtualGridLayout); // console.log(props.children)

  if (virtualGridLayout.length !== props.children.length) throw new Error("Inconsistency between the layout and the number of components of the grid.");
  let virtualGrid = Utils.arrayFilled(props.numRows * props.numColumns, -1);

  function updateGrid(cellCoordinates, cellIndex) {
    let gridCellCoordinates = Utils.getGridCellCoordinatesFromGridRanges(cellCoordinates[0], cellCoordinates[1]);
    let gridCellIndices = gridCellCoordinates.map(element => {
      return Utils.findIndexFrom2DCoordinates(element[0], element[1], numColumns);
    }); // Don't update using the state otherwise going into a infinite rendering

    virtualGrid = virtualGrid.map((element, index) => {
      if (gridCellIndices.includes(index)) return cellIndex;
      return element;
    });
    console.log(virtualGrid);
    return cellCoordinates;
  }

  function getCellCoordinatesFromIndex(index) {
    let cellLayout = virtualGridLayout[index]; // Convert from index to (x,y) coordinates.

    let currentGridCursorPosition = Utils.find2DCoordinatesFromIndex(Utils.virtualGridLayoutArrayFindAnchor(virtualGrid), numColumns);
    console.log("Grid Cursor position: " + Utils.objectToArray(currentGridCursorPosition)); // By default cell dimensions are defined as 1-by-1.

    let defaultCellCoordinates = Object.values(currentGridCursorPosition).map(element => {
      return {
        "begin": element,
        "end": element
      };
    }).reduce((e, v, i) => {
      e[["x", "y"][i]] = v;
      return e;
    }, {}); // Check if it's a no spanning grid cell (aka 1-by-1)

    if (cellLayout === '.') {
      console.log("Type .");
      return updateGrid(Utils.objectToArray(defaultCellCoordinates), index);
    }

    console.log("Type | or -");
    console.log(defaultCellCoordinates);
    return updateGrid(Utils.objectToArray(deepmerge(defaultCellCoordinates, parseCellLayout(cellLayout).map((element, index) => {
      if (element.groups.spanOperator === '-') return {
        'x': {
          "end": defaultCellCoordinates["x"]["begin"] + parseInt(element.groups.spanLength) - 1
        }
      };else if (element.groups.spanOperator === '|') {
        return {
          'y': {
            "end": defaultCellCoordinates["y"]["begin"] + parseInt(element.groups.spanLength) - 1
          }
        };
      } else throw new Error("This grid cell span operator is not defined.");
    }).reduce((obj, item) => item, {}))), index);
  }

  function toVirtualCellCoordinates(cellCoordinates) {
    const xMultiplyFactor = maxNumColumns / numColumns;
    const yMultiplyFactor = maxNumRows / numRows;
    console.log(cellCoordinates);
    return cellCoordinates.map((element, index1) => {
      return element.map((element, index2) => {
        if (index2 === 0 & element === 0) return 1;
        if (index2 === 0) return element * (index1 === 0 ? xMultiplyFactor : yMultiplyFactor);
        if (index2 === 1) return (element + 1) * (index1 === 0 ? xMultiplyFactor : yMultiplyFactor);
        return element;
      });
    });
  }

  let cellWidth = 5,
      cellHeight = 5;
  let virtualGridWidth = window.innerWidth / cellWidth,
      virtualGridHeight = window.innerHeight / cellHeight;
  let virtualGridHeightMidPoint = maxNumRows / 2,
      virtualGridWidthMidPoint = virtualGridWidth / 2;
  console.log(`${virtualGridWidth}, ${virtualGridHeight}, ${virtualGridHeightMidPoint}, ${virtualGridWidthMidPoint}`);
  let columnSizes = Utils.arraySplit(window.innerWidth, maxNumColumns); // console.log(columnSizes)
  // console.log(columnSizes.length)

  let frequencyTable = Utils.arrayFrequencyTable(columnSizes); // console.log(frequencyTable)

  let gridTemplateColumns = frequencyTable[0].map((currElement, index) => {
    return `repeat(${frequencyTable[1][index]},"${frequencyTable[0][index]}px")`;
  }).join(' '); // console.log(gridTemplateColumns)

  let rowSizes = Utils.arraySplit(window.innerWidth, maxNumRows); // console.log(rowSizes)
  // console.log(rowSizes.length)

  let rowSizesFrequencyTable = Utils.arrayFrequencyTable(rowSizes);
  let gridTemplateRows = rowSizesFrequencyTable[0].map((currElement, index) => {
    return `repeat(${rowSizesFrequencyTable[1][index]},"${rowSizesFrequencyTable[0][index]}px")`;
  }).join(' '); // console.log(gridTemplateRows)
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
  }; // Add additional styles (hidden from the user) and that will overwrite user styles

  let hiddenStyles = [{
    fontSize: 100
  }, {
    fontSize: 80
  }, {
    fontSize: 60
  }, {
    fontSize: 40
  }, {
    fontSize: 20
  }];
  React.useEffect(() => {
    const debouncedHandleResize = Utils.debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 100);
    window.addEventListener("resize", debouncedHandleResize);
    return _ => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  console.log(gridContainerStyle);
  return React.createElement("div", {
    style: gridContainerStyle
  }, props.children.map((element, index) => {
    /**
     * Given the index of the component and the properties of the grid (layout, numRows, numColumns), 
     * get the cell coordinates and convert them into virtual coordinates.
     */
    let vcc = toVirtualCellCoordinates(getCellCoordinatesFromIndex(index));
    let coordinates = {
      gridColumn: vcc[0].join(" / "),
      gridRow: vcc[1].join(" / ")
    };
    /** 
     * If a style has been defined by the user for the current component merge them with
     * coordinates and hiddenStyles.
    */

    let style = element.props.style === undefined ? coordinates :
    /**
     * Objects are immutable
     * When Composition is re-rendered because of window resizing one should not merge the current element style props object with the coordinates object
     */
    Object.keys(coordinates).some(r => Object.keys(element.props.style).includes(r)) ? element.props.style : Object.assign(element.props.style, coordinates);
    return React.cloneElement(element, {
      key: index,

      /**
       * Objects are immutable (see above)
       */
      style: Object.keys(hiddenStyles[index]).some(r => Object.keys(style).includes(r)) ? style : Object.assign(style, hiddenStyles[index])
    });
  }));
}

export default Composition; // ReactDOM.render(<App />, document.getElementById("root"));
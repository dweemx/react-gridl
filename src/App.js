import React, { Component } from "react";
import Utils from './Utils'
import deepmerge from 'deepmerge'

class GridLayout extends Component {
  
  constructor(props) {
    super(props);

    let virtualGridLayout = this.props.layout.split(" ");
    if(virtualGridLayout.length !== this.props.children.length) 
      throw new Error("Inconsistency between the layout and the number of components of the grid.")

    this.state = {
      layout: this.props.layout,
      nRows: this.props.nRows,
      nMaxRows: 24, // Has to be a multiple of this.props.nRows
      nColumns: this.props.nColumns,
      nMaxColumns: 20, // Has to be a multiple of this.props.nColumns
      virtualGridLayout: this.props.layout.split(" "),
      virtualGrid: Utils.arrayFilled(this.props.nRows*this.props.nColumns,-1)
    };

  }

  parseCellLayout(cellLayout) {
    let cellSpanMatcher = /(?<spanLength>[0-9]+)(?<spanOperator>[|-])/;
    // First find all complete matches
    let match = cellLayout.match(new RegExp(cellSpanMatcher, "g"))
    // For each match extract the spanLength and spanOperator
    return (
      match.map((element) => {
        return (element.match(cellSpanMatcher))
      })
    )
  }

  updateGrid(cellCoordinates, cellIndex) {
    let gridCellCoordinates = Utils.getGridCellCoordinatesFromGridRanges(cellCoordinates[0], cellCoordinates[1])
    let gridCellIndices = gridCellCoordinates.map((element) => {
      return Utils.findIndexFrom2DCoordinates(element[0], element[1], this.state.nColumns)
    })
    this.state.virtualGrid = this.state.virtualGrid.map((element, index) => {
      if(gridCellIndices.includes(index))
        return cellIndex
      return element
    })
    console.log(this.state.virtualGrid)
    return cellCoordinates
  }

  toVirtualCellCoordinates(cellCoordinates) {
    const xMultiplyFactor = this.state.nMaxColumns / this.state.nColumns;
    const yMultiplyFactor = this.state.nMaxRows / this.state.nRows
    console.log(cellCoordinates)
    return cellCoordinates.map((element, index1) => {
      return element.map((element, index2) => {
        if(index2 === 0 & element === 0)
          return 1;
        if(index2 === 0)
          return ( element ) * ( index1 === 0 ? xMultiplyFactor : yMultiplyFactor )
        if(index2 === 1)
          return ( element + 1 ) * ( index1 === 0 ? xMultiplyFactor : yMultiplyFactor )
        return element
      })
    })
  }

  getCellCoordinatesFromIndex(index) {
    let cellLayout = this.state.virtualGridLayout[index];
    // Convert from index to (x,y) coordinates.
    let currentGridCursorPosition = Utils.find2DCoordinatesFromIndex(Utils.virtualGridLayoutArrayFindAnchor(this.state.virtualGrid), this.state.nColumns)
    console.log("Grid Cursor position: "+ Utils.objectToArray(currentGridCursorPosition))
    // By default cell dimensions are defined as 1-by-1.
    let defaultCellCoordinates = Object.values(currentGridCursorPosition).map((element) => {
      return { "begin": element, "end": element }
    }).reduce((e,v,i) => {
      e[["x","y"][i]] = v
      return e
    }, {})
    // Check if it's a no spanning grid cell (aka 1-by-1)
    if(cellLayout === '.') {
      console.log("Type .")
      return this.updateGrid(Utils.objectToArray(defaultCellCoordinates), index)
    }
    console.log("Type | or -")
    console.log(defaultCellCoordinates)
    return (
      this.updateGrid(
        Utils.objectToArray(
          deepmerge(
            defaultCellCoordinates, 
            this.parseCellLayout(cellLayout).map((element, index) => {
              if(element.groups.spanOperator === '-')
                return { 'x': { "end": defaultCellCoordinates["x"]["begin"] + parseInt(element.groups.spanLength) - 1 } }
              else if(element.groups.spanOperator === '|') {
                return { 'y': { "end": defaultCellCoordinates["y"]["begin"] + parseInt(element.groups.spanLength) - 1 } }
              } else 
                throw new Error("This grid cell span operator is not defined.")
            }).reduce((obj, item) => item, {})
          )
        ),
        index
      )
    )
  }

  render() {
    let cellWidth = 5,
      cellHeight = 5;
    let virtualGridWidth = window.innerWidth / cellWidth,
      virtualGridHeight = window.innerHeight / cellHeight;

    let virtualGridHeightMidPoint = this.state.nMaxRows / 2,
      virtualGridWidthMidPoint = virtualGridWidth / 2;
    console.log(
      `${virtualGridWidth}, ${virtualGridHeight}, ${virtualGridHeightMidPoint}, ${virtualGridWidthMidPoint}`
    );

    let columnSizes = Utils.arraySplit(window.innerWidth, this.state.nMaxColumns)
    // console.log(columnSizes)
    // console.log(columnSizes.length)
    let frequencyTable = Utils.arrayFrequencyTable(columnSizes)
    // console.log(frequencyTable)
    let gridTemplateColumns = frequencyTable[0].map((currElement, index) => {
      return `repeat(${frequencyTable[1][index]},"${frequencyTable[0][index]}px")`;
    }).join(' ');
    // console.log(gridTemplateColumns)
    let rowSizes = Utils.arraySplit(window.innerWidth, this.state.nMaxRows)
    // console.log(rowSizes)
    // console.log(rowSizes.length)
    let rowSizesFrequencyTable = Utils.arrayFrequencyTable(rowSizes)
    let gridTemplateRows = rowSizesFrequencyTable[0].map((currElement, index) => {
      return `repeat(${rowSizesFrequencyTable[1][index]},"${rowSizesFrequencyTable[0][index]}px")`;
    }).join(' ');
    // console.log(gridTemplateRows)

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

    // Add additional styles (hidden from the user) and that will overwrite user styles
    let hiddenStyles = [
      {
        fontSize: 100
      },
      {
        fontSize: 80
      },
      {
        fontSize: 60
      },
      {
        fontSize: 40
      },
      {
        fontSize: 20
      }
    ]

    return (
      <div style={gridContainerStyle}>
        {
          this.props.children.map((element, index) => {
            /**
             * Given the index of the component and the properties of the grid (layout, nRows, nColumns), 
             * get the cell coordinates and convert them into virtual coordinates.
             */
            let vcc = this.toVirtualCellCoordinates(this.getCellCoordinatesFromIndex(index))
            let coordinates = {
              gridColumn: vcc[0].join(" / "),
              gridRow: vcc[1].join(" / ")
            }
            /** 
             * If a style has been defined by the user for the current component merge them with
             * coordinates and hiddenStyles.
            */
            let style = element.props.style === undefined ? coordinates : Object.assign(element.props.style, coordinates)
            return (
              React.cloneElement(
                element, 
                { 
                  key: index, 
                  style: Object.assign(style, hiddenStyles[index]) })
            )
          })
        }
      </div>
    );
  }
}

export default GridLayout

// ReactDOM.render(<App />, document.getElementById("root"));

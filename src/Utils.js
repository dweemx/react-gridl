
export default class Utils {

    /**
     * 
     * @param {Array} arr 
     * @param {Number} index 
     * @param {any} value
     */
    static arrayUpdateByIndex(arr, index, value) {
        return Object.assign([...arr, { [index]: value }])
    }

    /**
     * This function return an array of cell coordinates (x,y) that span the given xRange and yRange.
     * 
     * @param {Array} xRange Array of 2 elements specifying the x axis range. The first element should be start and the second the end of the range.
     * @param {Array} yRange Array of 2 elements specifying the y axis range. The first element should be start and the second the end of the range.
     * @return {Array} Array of cell coordinates (x,y) spanning the given xRange and yRange. 
     * 
     * @example 
     * let tmp = getGridCellCoordinatesFromGridRanges([0,0])
     * console.log(tmp) // [ [0,0] ]
     * 
     * @example
     * getGridCellCoordinatesFromGridRanges([0,0]) == [ [0,0] ])
     * console.log(tmp) // [ [1, 1],  [1, 2],  [2, 1],  [2, 2],  [3, 1],  [3, 2]]
     */
    static getGridCellCoordinatesFromGridRanges(xRange, yRange) {
        var x = Utils.range(xRange[0],xRange[1]);
        var y = Utils.range(yRange[0],yRange[1]);
        // Generate all pairs of combinations between 2 ranges
        // Source: https://stackoverflow.com/questions/38858411/how-to-generate-all-pairwise-combinations-between-two-arrays-of-unequal-length-i
        let pairs = x.reduce( 
            (p, c) => p.concat(
                y.map( v => [c].concat(v))
                ), 
            [])
        return [...new Set(pairs.map((element) => element.join(",")))
            ].map(
                (element) => element.split(",").map(
                    (element) => parseInt(element)
                )
            )
    }

    static virtualGridLayoutArrayFindAnchor(arr) {
        console.log(arr)
        return arr.findIndex((element) => element < 0)
    }


    // findIndexFrom2DCoordinates
    // Source: https://boards.straightdope.com/sdmb/showthread.php?t=359714
    static findIndexFrom2DCoordinates(x, y, numColumns) {
        return (numColumns*y + x)
    }

    // arrayIndexFindXY
    // Source: https://boards.straightdope.com/sdmb/showthread.php?t=359714
    static find2DCoordinatesFromIndex(index, numColumns) {
        let y = Math.floor(index / numColumns)
        return { x: index - (numColumns * y), y: y }
    }

    /**
     * This function performs a deep conversion between any object into an array (object w/o keys).
     * 
     * @param {Object} object The object to convert to an array.
     * 
     * @example
     * let tmp = {x: { a: 1, b: 2 }, y: { a: 1, b: 3 }}
     * console.log(tmp) // [ [1, 2], [1, 3]]
     */
    static objectToArray(object) {
        if(object instanceof Array)
          return object.map((element) => Utils.objectToArray(element))
        if(object instanceof Object)
            return Utils.objectToArray(Object.values(object))
        return object
    }

    // range
    // Source: https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
    static range(start, end) {
        return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
    }

    // arrayFrequencyTable
    // Create a frequency table for the given array arr
    // Source: https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
    static arrayFrequencyTable(arr) {
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


    // arraySplit
    // 
    // Source: https://www.geeksforgeeks.org/split-the-number-into-n-parts-such-that-difference-between-the-smallest-and-the-largest-part-is-minimum/
    static arraySplit(x, n) {
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

    static arrayFilled(n, val) {
        return Array.apply(null, Array(n)).map(Number.prototype.valueOf,val);
    }

    /**
     * This function debounce another function for given number of milliseconds
     * 
     * @param {Function} fn The object to convert to an array.
     * @param {Number} ms The number of milliseconds to wait after running the given fn function.
     *
     */
    static debounce(fn, ms) {
        let timer;
        return _ => {
            clearTimeout(timer);
            timer = setTimeout(_ => {
                timer = null;
                fn.apply(this, arguments);
            }, ms);
        };
    }

}

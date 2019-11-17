
const dataFileName = "https://raw.githubusercontent.com/ignaciogallegossanchez/2019KeepcodingBDVisualD3/master/practica.json"

const FEATURES    = "features"
const PROPERTIES  = "properties"
const AVGBEDROOMS = "avgbedrooms"
const AVGPRICE    = "avgprice"
const NAME        = "name"
const BEDROOMS    = "bedrooms"
const TOTAL       = "total"
const CARTOID     = "cartodb_id"


/**
 * Simple function to load (and return) the source data object
 */
function loadData() {
      return d3.json(dataFileName)
}


/**
 * Given a data object, returns an array of triplet:
 *   [ "NeighbourName", "AveragePrice", "NumberOfProperties"]
 * Where:
 *   - NeighbourName: The name of the Neighbour
 *   - AveragePrice: The neighbour average price
 *   - NumberOfProperties: The calculated total number of properties in this neighbour
 * If the average price is undefined, neighbour is not returned
 * @param {*} data 
 */
function avgPriceVsTotalProperties(data){
      var result = []
      data[FEATURES].forEach(feature => {
            var totalProperties = 0;
            feature[PROPERTIES][AVGBEDROOMS].forEach(avgBedrooms => 
                  totalProperties += avgBedrooms[TOTAL])
            if (typeof feature[PROPERTIES][AVGPRICE] != 'undefined') {
                  result.push([
                        feature[PROPERTIES][NAME],
                        feature[PROPERTIES][AVGPRICE], 
                        totalProperties])
            }
      })
      return result
}


/**
 * Given the full data object and a neighbour index, returns an array of pairs where
 * the first element is the number of bedrooms, and the second element is the 
 * number of properties with these bedrooms. For example:
 *   [3, 233]
 * Means that are 233 properties with 3 bedrooms
 * @param {*} data: The full data object
 * @param {*} index: The index on the features array, for example (3)
 */
function avgbedroomsToArrayByIndex(data, index) {
      var result = []
      data[FEATURES][index][PROPERTIES][AVGBEDROOMS].forEach(element => {
            result.push([element[BEDROOMS], element[TOTAL]]) 
      })
      return result 
}


/**
 * Given the full data object and a CartoID, returns an array of pairs where
 * the first element is the number of bedrooms, and the second element is the 
 * number of properties with these bedrooms. For example:
 *   [3, 233]
 * Means that are 233 properties with 3 bedrooms
 * @param {*} data: The full data object
 * @param {*} cartoid: The cartodb_id of the neighbour to return the information
 */
function avgbedroomsToArrayByCartoID(data, cartoid){
      features = data[FEATURES]
      for (var i=0; i<features.length; i++) {
            if( features[i][PROPERTIES][CARTOID] == cartoid) {
                 return avgbedroomsToArrayByIndex(data, i)
            }
      } 
}


/**
 * Given the full data object and a Neighbour name, returns an array of pairs where
 * the first element is the number of bedrooms, and the second element is the 
 * number of properties with these bedrooms. For example:
 *   [3, 233]
 * Means that are 233 properties with 3 bedrooms 
 * @param {*} data: The full data object
 * @param {*} name : The name of the neighbour, for example "Palacio"
 */
function avgbedroomsToArrayByName(data, name) {
      features = data[FEATURES]
      for (var i=0; i<features.length; i++) {
            if( features[i][PROPERTIES][NAME] == name) {
                return avgbedroomsToArrayByIndex(data, i)
            }
      }
}


/**
 * Function that filters out empty neighbours
 * @param {} data 
 */
function filterEmptyNeighbour(data) {
      var ret = data;
      ret[FEATURES] = data[FEATURES].filter(feature => feature[PROPERTIES][PROPERTIES].length > 0)
      return ret
}

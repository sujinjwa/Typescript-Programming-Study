// Import the multiThreading module
const multiThreading = require('./(06)multiThreading');

// Define the determinant function
function determinant(matrix) {
  // Check if the matrix is square
  if (matrix.length !== matrix[0].length) {
    throw new Error('Matrix must be square');
  }

  // Calculate the determinant using multiThreading
  const result = multiThreading.calculateDeterminant(matrix);

  return result;
}

// Export the determinant function
module.exports = determinant;

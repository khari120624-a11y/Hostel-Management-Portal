const path = require('path');

// Set current working directory to the server directory so dotenv & relative operations work seamlessly
const serverDir = path.join(__dirname, 'hostel-management-system', 'server');
try {
  process.chdir(serverDir);
} catch (err) {
  console.error('Failed to change directory to server:', err);
}

// Delegate execution to the backend server
require(path.join(serverDir, 'server.js'));

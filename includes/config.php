<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'school_website');

// Create connection
$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Set charset to utf8mb4 for proper character support
mysqli_set_charset($conn, "utf8mb4");

// Admin credentials (Change these for security)
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123'); // Change this password immediately

// Site settings
define('SITE_NAME', 'School Name');
define('SITE_EMAIL', '');
define('SITE_PHONE', '');
define('SITE_ADDRESS', '');

// Timezone
date_default_timezone_set('Asia/Kolkata');
?>

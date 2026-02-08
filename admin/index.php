<?php
// Redirect to login page if someone tries to access admin folder directly
header('Location: login.php');
exit();
?>

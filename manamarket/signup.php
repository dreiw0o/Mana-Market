<?php
// removed session_start()
ini_set('display_errors', 1);
error_reporting(E_ALL);

// signing up
$host = "localhost";
$user = "root"; 
$pass = ""; 
$db   = "manamarket";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


echo '<!DOCTYPE html>
<html>
<head>
    <title>Registration Result</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double:wght@100..900&family=Epunda+Slab:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="topnav">
        <a href="index.html">Home</a>
        <a href="store.html">Store</a>
        <a class="active" href="signup.html">Sign Up</a>
        <a href="login.html">Log In</a>
        <a href="contactus.html">Contact</a>
        <span id="userEmailDisplay" class="email-display" style="float: right; padding: 14px 16px; color: #ffafcc; font-weight: bold; display:none;"></span>
        <a href="#" id="logoutBtn" style="float: right; display:none;">Log Out</a>
    </div>';

if (isset($_POST['email'], $_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    


    if ($stmt->execute()) {
        $email_safe = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');

        echo '<script>
                // Save the email to client-side storage
                localStorage.setItem("loggedInUserEmail", "' . $email_safe . '");
                // Redirect to home page
                window.location.href = "index.html";
              </script>';
        
        echo '<div class="container" id="login">
                <h3 class="bitcount-grid-double">Success!</h3>
                <p class="epunda-slab-font" style="color:#023e8a; font-weight:bold; text-align:center; font-size: 1.1em;">
                    Registration successful! Redirecting...
                </p>
              </div>';
    } else {
        $error_message = "Error: Could not register user. " . $stmt->error . " (Code: " . $stmt->errno . ")";
        
        if ($conn->errno == 1062) {
             $error_message = "Error: An account with that email already exists. Please <a href='login.html'>Log In</a>.";
        } 
        
        echo '<div class="container" id="login">
                <h3 class="bitcount-grid-double" style="background-color: #e68e8e !important;">Registration Failed</h3>
                <p class="epunda-slab-font" style="color:red; text-align:center; font-size: 1.1em;">
                    ' . $error_message . '
                </p>
                <div class="small-link"><a href="signup.html" style="font-weight:700; text-decoration:underline;">Try Again</a></div>
              </div>';
    }

    $stmt->close();
} 
else {
    echo '<div class="container" id="login"><h3 class="bitcount-grid-double">Access Denied</h3><p class="epunda-slab-font" style="text-align:center;">Please submit the registration form.</p></div>';
}

$conn->close();

echo '</center><script src="script.js"></script></body></html>';
?>
<?php
echo '<!DOCTYPE html><html><head><title>Success</title><link rel="stylesheet" href="style.css"></head><body>
      <div class="topnav">
        <a href="index.html">Home</a>
        <a href="store.html">Store</a>
        <a class="active" href="signup.html">Sign Up</a>
        <a href="login.html">Log In</a>
        <a href="contactus.html">Contact</a>
      </div>
      <center>';


ini_set('display_errors', 1);
error_reporting(E_ALL);

// logging in
$host = "localhost";
$user = "root"; 
$pass = ""; 
$db   = "manamarket";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT email, password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user['password'])) {
        echo "<div class='container' id='login'>
        <h3 class='bitcount-grid-double'>Welcome Back!</h3>
        <p class='epunda-slab-font' style='color:#023e8a; font-weight:bold; text-align:center; font-size: 1.1em;'>
            Login successful! Welcome, **" . htmlspecialchars($user['email']) . "**
        </p>
        <div class='small-link'><a href='index.html' style='font-weight:700; text-decoration:underline;'>Continue to the Store</a></div>
      </div>";
    } else {
        echo "Incorrect password.";
    }
} else {
    echo "No account found with that email.";
}

$stmt->close();
$conn->close();

echo '</center></body></html>';
?>
<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "buriedcity";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$function = $_GET['function'] ?? '';

switch ($function) {
    case 'getMessage':
        getMessage($conn);
        break;
    case 'sendMessage':
        sendMessage($conn);
        break;
    default:
        echo json_encode(["error" => "Invalid API function"]);
}

$conn->close();

function getMessage($conn) {
    $index = isset($_GET['index']) ? intval($_GET['index']) : 0;

    if ($index === 0) {
        $sql = "SELECT id, username, message, timestamp FROM chat_messages ORDER BY id DESC LIMIT 100";
    } else {
        $sql = "SELECT id, username, message, timestamp FROM chat_messages WHERE id > ? ORDER BY id DESC";
    }

    $stmt = $conn->prepare($sql);
    if ($index !== 0) {
        $stmt->bind_param("i", $index);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode($messages);
}

function sendMessage($conn) {
    $username = sanitizeInput($_GET['username'] ?? '');
    $message = sanitizeInput($_GET['message'] ?? '');

    if (empty($username) || empty($message)) {
        echo json_encode(["success" => false, "error" => "Invalid input"]);
        return;
    }

    $timestamp = date('Y-m-d H:i:s');
    $sql = "INSERT INTO chat_messages (username, message, timestamp) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $username, $message, $timestamp);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }
}

function sanitizeInput($data) {
    return htmlspecialchars(strip_tags($data));
}
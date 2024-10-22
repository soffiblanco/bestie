<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Conexión a la base de datos
$host = "localhost";
$user = "root";
$password = "";
$dbname = "bestie_paws";

$con = new mysqli($host, $user, $password, $dbname);
if ($con->connect_error) {
    echo json_encode(["message" => "Connection failed: " . $con->connect_error]);
    exit;
}

// Consulta SQL para obtener los productos más recientes
$sql = "SELECT p.ID_Product, p.Product, p.Product_Description, p.Product_Image, p.Brand, p.Price, c.Category
        FROM product p
        JOIN product_categories pc ON p.ID_Product = pc.ID_Product
        JOIN category c ON pc.ID_Category = c.ID_Category
        ORDER BY p.created_at DESC
        LIMIT 10";
$result = $con->query($sql);

if ($result->num_rows > 0) {
    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Codificar la imagen en base64 para enviar en la API
        if (isset($row['Product_Image']) && !empty($row['Product_Image'])) {
            $row['Product_Image'] = 'data:image/png;base64,' . base64_encode($row['Product_Image']);
        }
        $products[] = $row;
    }

    echo json_encode(["message" => "Products found.", "data" => $products]);
} else {
    echo json_encode(["message" => "No products found."]);
}

$con->close();
?>

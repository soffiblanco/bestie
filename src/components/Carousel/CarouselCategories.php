<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Configuración de la base de datos
$host = "localhost";
$user = "root";
$password = "";
$dbname = "bestie_paws"; 

// Conexión a la base de datos
$con = new mysqli($host, $user, $password, $dbname);
if ($con->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Connection failed: " . $con->connect_error]);
    exit();
}

// Método GET para obtener los 5 productos más recientes junto con categoría y subcategoría
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT 
                p.ID_Product,
                p.Product AS Product_Name,
                p.Product_Image,
                v.Category,
                v.Subcategory,
                p.created_at
            FROM 
                Product p
            JOIN 
                product_categories_subcategories_view v ON p.ID_Product = v.ID_Product
            WHERE 
                p.Product_State = 'Enabled'
            ORDER BY 
                p.created_at DESC
            LIMIT 5";

    $result = $con->query($sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode(["message" => "Query failed: " . $con->error]);
        exit();
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        // Convertir la imagen a base64 para enviarla en el JSON
        if (isset($row['Product_Image']) && !empty($row['Product_Image'])) {
            $row['Product_Image'] = 'data:image/png;base64,' . base64_encode($row['Product_Image']);
        }
        $data[] = $row;
    }

    if (empty($data)) {
        http_response_code(404);
        echo json_encode(["message" => "No recent products found."]);
        exit();
    }

    echo json_encode([
        "message" => count($data) . " recent product(s) found.",
        "data" => $data
    ]);
}

$con->close();
?>

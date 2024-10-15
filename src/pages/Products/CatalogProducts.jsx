import React from 'react';
import { useParams } from 'react-router-dom';
import Product from './Product';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap para estilos

function CatalogProducts() {
    const { category, subcategory } = useParams(); // Obtiene los parámetros de la URL

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">
                {subcategory 
                    ? `Catálogo de productos: ${category} - ${subcategory}`
                    : `Catálogo de productos: ${category}`}
            </h2>

            <div className="row mb-4">
                <div className="col-md-4">
                    <Product 
                        image="comidaAves"
                        title="Comida Aves"
                        description="Comida para aves"
                        price="Q100"
                    />
                </div>
                <div className="col-md-4">
                    <Product 
                        image="comidaGato"
                        title="Comida Gato"
                        description="Comida para gatos"
                        price="Q100"
                    />
                </div>
                <div className="col-md-4">
                    <Product 
                        image="comidaPerro"
                        title="Comida Perro"
                        description="Comida para perros"
                        price="Q100"
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <Product 
                        image="jugueteAves"
                        title="Juguete Aves"
                        description="Juguete para aves"
                        price="Q80"
                    />
                </div>
                <div className="col-md-4">
                    <Product 
                        image="jugueteGato"
                        title="Juguete Gato"
                        description="Juguete para gatos"
                        price="Q120"
                    />
                </div>
                <div className="col-md-4">
                    <Product 
                        image="juguetePerro"
                        title="Juguete Perro"
                        description="Juguete para perros"
                        price="Q150"
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <Product 
                        image="accesorioAves"
                        title="Accesorio para Aves"
                        description="Accesorio elegante para aves"
                        price="Q60"
                    />
                </div>
                <div className="col-md-4">
                    <Product 
                        image="accesorioGato"
                        title="Accesorio para Gato"
                        description="Accesorio para gatos"
                        price="Q75"
                    />
                </div>
                <div className="col-md-4">
                    <Product 
                        image="accesorioPerro"
                        title="Accesorio para Perro"
                        description="Accesorio útil para perros"
                        price="Q90"
                    />
                </div>
            </div>
        </div>
    );
}

export default CatalogProducts;

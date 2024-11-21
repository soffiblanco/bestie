import React, { useState, useEffect } from "react";
import { baseUrl } from "../../config";
import "./EditFooter.css";
import ecommerce_fetch from "../../services/ecommerce_fetch";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";


const EditFooter = () => {
  const [footerConfig, setFooterConfig] = useState([]);
  const [footerLinks, setFooterLinks] = useState([]);
  const [footerImages, setFooterImages] = useState([]);
  const [forceRender, setForceRender] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFooterData();
  }, []);


  const fetchFooterData = () => {
    ecommerce_fetch(`${baseUrl}/getFooter.php`)
      .then((response) => response.json())
      .then((data) => {
        setFooterConfig(data.footer_config || []);
        setFooterLinks(data.footer_links || []);
        setFooterImages(data.footer_images || []);
        console.log("Datos iniciales de footerConfig:", data.footer_config);
        console.log("Datos iniciales de footerLinks:", data.footer_links);
      })
      .catch((error) => console.error("Error fetching footer data:", error));
  };
  

  const handleSectionVisibility = (sectionId, currentVisibility) => {
    // Actualizar el estado local
    setFooterConfig((prevConfig) =>
      prevConfig.map((section) =>
        section.ID_Footer_Config === sectionId
          ? { ...section, Is_Visible: currentVisibility ? 0 : 1 }
          : section
      )
    );
    setForceRender((prev) => prev + 1); 
    console.log("Estado actualizado de footerConfig:", footerConfig); // Verifica si el estado cambia
  
    // Preparar los datos para el backend
    const data = {
      ID_Footer_Config: sectionId,
      Is_Visible: currentVisibility ? 0 : 1,
    };
  
    // Enviar datos al backend
    ecommerce_fetch(`${baseUrl}/updateSectionVisibility.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar la visibilidad de la sección");
        }
        return response.json();
      })
      .then(() => {
        console.log("Visibilidad de la sección actualizada correctamente");
      })
      .catch((error) => {
        console.error("Error al actualizar la visibilidad de la sección:", error);
      });
  };
  
  
  
  
  const handleSaveSingleLink = (link) => {
    setLoading(true);
  
    const data = {
      ID_Footer_Link: link.ID_Footer_Link,
      Text: link.Text || null, // Asegúrate de enviar null si no hay texto
      Link: link.Link || null, // Asegúrate de enviar null si no hay link
      Is_Visible: link.Is_Visible, // Siempre envía el valor actual de visibilidad
      ID_Menu: link.ID_Menu || null, // Si estás trabajando con ID_Menu
    };
  
    console.log("Datos enviados al backend:", data); // Agrega este log para ver qué estás enviando
  
    ecommerce_fetch(`${baseUrl}/updateSingleLink.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("Estado de la respuesta:", response.status);
        if (!response.ok) {
          console.error("Texto del error:", response.statusText);
          throw new Error("Error al guardar el campo");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta del backend:", data);
        if (data.message) {
          alert("Campo actualizado correctamente");
        } else if (data.error) {
          alert("Error del backend: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error guardando el campo:", error);
        alert("Hubo un error al guardar el campo. Por favor, inténtalo de nuevo.");
      })
      .finally(() => setLoading(false));
  };
  
  
  
    
  

  const handleSectionTitleChange = (id, value) => {
    setFooterConfig(
      footerConfig.map((section) =>
        section.ID_Footer_Config === id
          ? { ...section, Section_Name: value }
          : section
      )
    );
  };

 
  const handleDeleteSection = (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
  
    // Llamar al backend para eliminar la sección y sus elementos
    ecommerce_fetch(`${baseUrl}/updateFooter.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delete_section: sectionId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete section");
        }
        return response.json();
      })
      .then(() => {
        console.log("Section deleted successfully");
        fetchFooterData(); // Recargar los datos
      })
      .catch((error) => console.error("Error deleting section:", error));
  };
  
  

  const handleAddLink = (sectionId) => {
    const orderDisplay = footerLinks.filter((link) => link.ID_Menu === sectionId).length;
  
    const newLink = {
      ID_Footer_Link: null, // ID nulo indica que es un nuevo campo
      Text: "",
      Link: "",
      Is_Visible: 1,
      Order_Display: orderDisplay, // Orden basado en la cantidad actual
      ID_Menu: sectionId, // Asociado a la sección
    };
  
    setFooterLinks([...footerLinks, newLink]);
  };
  
  
  


  const handleLinkChange = (linkId, field, value) => {
    setFooterLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.ID_Footer_Link === linkId ? { ...link, [field]: value } : link
      )
    );
  };
  

  const handleDeleteLink = (linkId) => {
    if (!window.confirm("¿Estás seguro que quieres eliminar este campo?")) {
      return;
    }
  
    // Elimina el campo inmediatamente del estado para que desaparezca del frontend
    setFooterLinks((prevLinks) =>
      prevLinks.filter((link) => link.ID_Footer_Link !== linkId)
    );
  
    // Realiza la solicitud al backend para eliminar el campo
    ecommerce_fetch(`${baseUrl}/updateSingleLink.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID_Footer_Link: linkId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error eliminando el campo");
        }
        return response.json();
      })
      .then(() => {
        console.log("Campo eliminado correctamente en el backend");
      })
      .catch((error) => {
        console.error("Error eliminando el campo:", error);
        // Si hay un error, vuelve a agregar el campo al estado
        fetchFooterData(); // Puedes recargar los datos como último recurso
      });
  };
  
  
  
  const handleLinkVisibility = (linkId, currentVisibility) => {
    // Actualizar el estado local de footerLinks
    setFooterLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.ID_Footer_Link === linkId
          ? { ...link, Is_Visible: currentVisibility ? 0 : 1 }
          : link
      )
    );
  
    // Confirmar el cambio en el estado
    console.log("Estado actualizado de footerLinks:", footerLinks);
  
    // Preparar los datos para enviar al backend
    const data = {
      ID_Footer_Link: linkId,
      Is_Visible: currentVisibility ? 0 : 1, // Alternar entre 1 y 0
    };
  
    // Enviar la solicitud al backend
    ecommerce_fetch(`${baseUrl}/updateSingleLink.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar la visibilidad del link");
        }
        return response.json();
      })
      .then(() => {
        console.log("Visibilidad del link actualizada correctamente");
        // No llamamos a fetchFooterData aquí para evitar sobrescribir los cambios visuales
      })
      .catch((error) => {
        console.error("Error al actualizar la visibilidad del link:", error);
      });
  };
  
    
  
  

  

  const handleAddImage = (sectionId) => {
    const newImage = {
      ID_Image: Date.now(),
      Image: "", // Aquí se almacenará la base64 del archivo
      Alt_Text: "",
      Link: "",
      Is_Visible: 1,
      Order_Display: footerImages.filter((image) => image.ID_Footer_Config === sectionId).length,
      ID_Footer_Config: sectionId,
    };
    setFooterImages([...footerImages, newImage]);
  };
  
  

  const handleFileUpload = (imageId, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFooterImages((prevImages) =>
        prevImages.map((image) =>
          image.ID_Image === imageId ? { ...image, Image: e.target.result } : image
        )
      );
    };
    if (file) reader.readAsDataURL(file);
  };
  

  const handleImageChange = (imageId, field, value) => {
    setFooterImages(
      footerImages.map((image) =>
        image.ID_Image === imageId ? { ...image, [field]: value } : image
      )
    );
  };

  const handleDeleteImage = (imageId) => {
    setFooterImages(footerImages.filter((image) => image.ID_Image !== imageId));
  };

  const handleImageVisibility = (imageId) => {
    setFooterImages(
      footerImages.map((image) =>
        image.ID_Image === imageId
          ? { ...image, Is_Visible: image.Is_Visible ? 0 : 1 }
          : image
      )
    );
  };
  const handleSaveChanges = () => {
    setLoading(true);

    // Prepara los datos para enviar al backend
    const data = {
        new_sections: footerConfig.filter((section) => !section.ID_Footer_Config), // Nuevas secciones
        new_links: footerLinks.filter((link) => !link.ID_Footer_Link), // Nuevos links
        footer_config: footerConfig.map((section) => ({
            ...section,
            Is_Visible: section.Is_Visible, // Usa el valor tal como está en el estado
        })), // Secciones existentes
    };

    console.log("Datos enviados al backend (handleSaveChanges):", data);

    // Enviar datos al backend
    ecommerce_fetch(`${baseUrl}/updateFooter.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al guardar los cambios");
            }
            return response.json();
        })
        .then((result) => {
            console.log("Respuesta del backend:", result);
            if (result.message) {
                alert("Cambios guardados correctamente");
                // Evitar sobrescribir el estado con fetchFooterData
            } else if (result.error) {
                alert("Error del backend: " + result.error);
            }
        })
        .catch((error) => {
            console.error("Error al guardar los cambios:", error);
            alert("Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.");
        })
        .finally(() => setLoading(false));
};

  
  
  
  

  const handleAddSection = () => {
    const newSection = {
      ID_Footer_Config: null, // ID nulo indica que es una nueva sección
      Section_Name: "New Section",
      Is_Visible: 1,
      Order_Display: footerConfig.length, // Orden basado en la cantidad actual
    };
    setFooterConfig([...footerConfig, newSection]);
  };
  
  

  return (
    <div className="edit-footer-container">
      <h1>Edit Footer</h1>

      {footerConfig.map((section) => (
        <div key={section.ID_Footer_Config} className="footer-section-edit">
<div className="section-header">
  <input
    type="text"
    value={section.Section_Name}
    onChange={(e) =>
      handleSectionTitleChange(section.ID_Footer_Config, e.target.value)
    }
    placeholder="Section Title"
    className="section-title-input"
  />
  {/* Checkbox para la visibilidad de la sección */}
  <input
  type="checkbox"
  checked={section.Is_Visible === 1}
  onChange={() =>
    handleSectionVisibility(section.ID_Footer_Config, section.Is_Visible)
  }
/>


  <button
    className="delete-btn"
    onClick={() => handleDeleteSection(section.ID_Footer_Config)}
  >
    <FaTrash />
  </button>
</div> 



          <ul>
<ul>
<ul>
  {footerLinks
    .filter((link) => link.ID_Menu === section.ID_Footer_Config)
    .map((link) => (
      <li key={link.ID_Footer_Link} className="link-item">
        <input
          type="text"
          value={link.Text}
          onChange={(e) =>
            handleLinkChange(link.ID_Footer_Link, "Text", e.target.value)
          }
          placeholder="Link Text"
        />
        <input
          type="text"
          value={link.Link}
          onChange={(e) =>
            handleLinkChange(link.ID_Footer_Link, "Link", e.target.value)
          }
          placeholder="Link URL"
        />
        {/* Checkbox para la visibilidad del link */}
        <input
  type="checkbox"
  checked={link.Is_Visible === 1}
  onChange={() =>
    handleLinkVisibility(link.ID_Footer_Link, link.Is_Visible)
  }
/>


        <div className="actions">
          <button
            onClick={() => handleSaveSingleLink(link)}
            className="save-btn"
          >
            <FaSave />
          </button>
          <button
            onClick={() => handleDeleteLink(link.ID_Footer_Link)}
            className="delete-btn"
          >
            <FaTrash />
          </button>
        </div>
      </li>
    ))}
</ul>
</ul>



          </ul>
          <ul>
          {footerImages
    .filter((image) => image.ID_Footer_Config === section.ID_Footer_Config)
    .map((image) => (
      <li key={image.ID_Image} className="image-item">
        {/* Campo de selección de archivo */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(image.ID_Image, e.target.files[0])}
        />

        {/* Botón para eliminar la imagen */}
        <button
          onClick={() => handleDeleteImage(image.ID_Image)}
          className="delete-btn"
        >
          <FaTrash />
        </button>
      </li>
    ))}
    </ul>
          <div className="add-buttons-container">
          <button onClick={() => handleAddLink(section.ID_Footer_Config)} className="add-field-btn">
            <FaPlus /> Add Link
          </button>
  

</div>
        </div>
      ))}


      <button onClick={handleAddSection} className="btn-add-section">
        Add Section
      </button>
      <button onClick={handleSaveChanges} disabled={loading} className="btn-save">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default EditFooter;






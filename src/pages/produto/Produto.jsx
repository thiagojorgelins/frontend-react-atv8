import { useEffect, useState } from "react";
import "./Produto.css";
import Header from "../../components/Header/Header";

function Produto() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [isCreateModalActive, setIsCreateModalActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  useEffect(() => {
    const fetchData = async (page) => {
      try {
        const response = await fetch(
          `http://localhost:3333/products?_page=${page}&_limit=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar os produtos");
        }
        const totalItems = response.headers.get("X-Total-Count");
        setTotalPages(Math.ceil(totalItems / 10));
        const data = await response.json();
        setData(data);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to fetch data", error);
        setErrorMessage(
          "Erro ao buscar os produtos. Por favor, tente novamente."
        );
      }
    };

    fetchData(page);
  }, [page]);

  const openModal = (product) => {
    console.log("Opening modal for product:", product);
    setSelectedProduct(product);
    setProductFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      image: product.image || null,
    });
    setIsModalActive(true);
    if (product.image) {
      setPreviewUrl(`http://localhost:3333/images/${product.image}`);
      setImageFile(product.image);
    } else {
      setPreviewUrl(null);
      setImageFile(null);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setProductFormData({ name: "", description: "", price: "", image: null });
    setIsModalActive(false);
    setPreviewUrl(null);
    setImageFile(null);
  };

  const openDeleteModal = () => {
    setIsDeleteModalActive(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalActive(false);
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsCreateModalActive(true);
  };

  const closeCreateModal = () => {
    setProductFormData({ name: "", description: "", price: "", image: null });
    setIsCreateModalActive(false);
    setPreviewUrl(null);
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  async function handleSubmit() {
    try {
      const formData = new FormData();
      formData.append("name", productFormData.name);
      formData.append("description", productFormData.description);
      formData.append("price", productFormData.price);

      if (imageFile && imageFile !== selectedProduct?.image) {
        formData.append("image", imageFile);
      }

      console.log("FormData values before submit:", [...formData.entries()]);

      if (
        !productFormData.name ||
        !productFormData.price ||
        !productFormData.description
      ) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      const method = selectedProduct ? "PUT" : "POST";
      const url = selectedProduct
        ? `http://localhost:3333/products/${selectedProduct.id}`
        : "http://localhost:3333/products";
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      const data = await response.json();

      console.log("Response data:", data);

      if (response.ok && !selectedProduct) {
        alert("Produto cadastrado com sucesso");
        closeModal();
        closeCreateModal();
        window.location.reload();
      } else if (response.ok && selectedProduct) {
        alert("Produto atualizado com sucesso");
        closeModal();
        closeCreateModal();
        window.location.reload();
      } else if (response.status === 400) {
        setValidationErrors(data);
      } else {
        alert("Erro ao cadastrar o produto");
      }
    } catch (error) {
      console.error("Falha ao conectar servidor", error);
    }
  }

  function deleteProduct(id) {
    fetch(`http://localhost:3333/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao deletar o produto");
        }
        closeModal();
        closeDeleteModal();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro ao deletar o produto", error);
      });
  }

  return (
    <section className="hero has-background-white is-fullheight has-text-black">
      <Header />
      <div className="container is-align-items-center p-6">
        <div className="columns">
          <div className="column has-text-black has-text-weight-bold is-size-3 is-half is-align-content-center has-text-left">
            Produtos
          </div>
          <div className="column is-half is-align-content-center has-text-right">
            <button
              className="button is-align-content-end"
              onClick={openCreateModal}
            >
              Adicionar produto
            </button>
          </div>
        </div>
        {errorMessage && (
          <div className="notification is-danger">{errorMessage}</div>
        )}
        <div className="columns is-multiline content-wrap">
          {data &&
            data.map((product) => (
              <div
                className="column is-one-third-tablet is-one-quarter-desktop is-one-fifth-fullhd products"
                key={product.id}
                onClick={() => openModal(product)}
              >
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-fullwidth">
                      <img
                        src={`http://localhost:3333/images/${product.image}`}
                        alt={product.name}
                      />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media">
                      <div className="media-content">
                        <p
                          className="title is-4"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "clip",
                            textOverflow: "ellipsis",
                            maxWidth: "75%",
                          }}
                        >
                          {product.name}
                        </p>
                        <p className="subtitle is-6">
                          {product.price !== undefined
                            ? `R$ ${Number(product.price).toFixed(2)}`
                            : "Preço não disponível"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <nav
          className="pagination is-rounded is-medium"
          role="navigation"
          aria-label="pagination"
        >
          <ul className="pagination-list">
            {[...Array(totalPages).keys()].map((num) => (
              <li key={num + 1}>
                <button
                  onClick={() => setPage(num + 1)}
                  className={`pagination-link has-text-black ${
                    page === num + 1 ? "is-current" : ""
                  }`}
                >
                  {num + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isModalActive && (
        <div className={`modal ${isModalActive ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-content">
            <div className="box">
              <h1 className="title">
                {selectedProduct ? "Editar Produto" : "Adicionar Produto"}
              </h1>
              <div className="field">
                <label className="label">Nome</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="name"
                    value={productFormData.name}
                    onChange={handleChange}
                  />
                  <span className="has-text-danger">
                    {validationErrors.name}
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Descrição</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="description"
                    value={productFormData.description}
                    onChange={handleChange}
                  />
                  <span className="has-text-danger">
                    {validationErrors.description}
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Preço</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="price"
                    value={productFormData.price}
                    onChange={handleChange}
                  />
                  <span className="has-text-danger">
                    {validationErrors.price}
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Imagem</label>
                <div className="control has-text-centered">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ maxWidth: "100px", marginBottom: "10px" }}
                    />
                  )}
                  <input
                    className="input"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span className="has-text-danger">
                    {validationErrors.image}
                  </span>
                </div>
              </div>
              <div className="columns">
                <div className="column is-fullwidth">
                  <button
                    className="button is-fullwidth is-warning"
                    onClick={handleSubmit}
                  >
                    {selectedProduct ? "Salvar Alterações" : "Adicionar"}
                  </button>
                </div>
                <div className="column">
                  <button className="button is-fullwidth" onClick={closeModal}>
                    Cancelar
                  </button>
                </div>
                {selectedProduct && (
                  <div className="column is-fullwidth">
                    <button
                      className="button is-fullwidth is-danger"
                      onClick={openDeleteModal}
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeModal}
          ></button>
        </div>
      )}

      {isDeleteModalActive && (
        <div className={`modal ${isDeleteModalActive ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeDeleteModal}></div>
          <div className="modal-content">
            <div className="box">
              <h1 className="title">Confirmar Exclusão</h1>
              <p>Tem certeza de que deseja excluir este produto?</p>
              <button
                className="button is-danger"
                onClick={() => deleteProduct(selectedProduct.id)}
              >
                Confirmar
              </button>
              <button className="button" onClick={closeDeleteModal}>
                Cancelar
              </button>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeDeleteModal}
          ></button>
        </div>
      )}

      {isCreateModalActive && (
        <div className={`modal ${isCreateModalActive ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeCreateModal}></div>
          <div className="modal-content">
            <div className="box">
              <h1 className="title">Adicionar Produto</h1>
              <div className="field">
                <label className="label">Nome</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="name"
                    value={productFormData.name}
                    onChange={handleChange}
                  />
                  <span className="has-text-danger">
                    {validationErrors.name}
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Descrição</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="description"
                    value={productFormData.description}
                    onChange={handleChange}
                  />
                  <span className="has-text-danger">
                    {validationErrors.description}
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Preço</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="price"
                    value={productFormData.price}
                    onChange={handleChange}
                  />
                  <span className="has-text-danger">
                    {validationErrors.price}
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Imagem</label>
                <div className="control">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ maxWidth: "100px", marginBottom: "10px" }}
                    />
                  )}
                  <input
                    className="input"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span className="has-text-danger">
                    {validationErrors.image}
                  </span>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <button
                    className="button is-fullwidth is-primary"
                    onClick={handleSubmit}
                  >
                    Salvar
                  </button>
                </div>
                <div className="column">
                  <button
                    className="button is-fullwidth"
                    onClick={closeCreateModal}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeCreateModal}
          ></button>
        </div>
      )}
    </section>
  );
}

export default Produto;

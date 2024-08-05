import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

function Users() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    image: null,
  });
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"))
  const loggedUserId = loggedUser?.id

  useEffect(() => {
    const fetchData = async (page) => {
      try {
        const response = await fetch(
          `http://localhost:3333/users?_page=${page}&_limit=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar os usuários");
        }
        const totalItems = response.headers.get("X-Total-Count");
        setTotalPages(Math.ceil(totalItems / 10));
        const data = await response.json();
        setData(data);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to fetch data", error);
        setErrorMessage(
          "Erro ao buscar os usuários. Por favor, tente novamente."
        );
      }
    };
    fetchData(page);
  }, [page]);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      image: user.image || null,
    });
    setIsEditModalActive(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setEditFormData({ name: "", email: "", image: null });
    setIsEditModalActive(false);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalActive(true);
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
    setIsDeleteModalActive(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3333/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao editar o usuário");
      }
      const updatedUser = await response.json();
      setData(data.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      closeEditModal();
    } catch (error) {
      console.error("Failed to edit user", error);
      setErrorMessage("Erro ao editar o usuário. Por favor, tente novamente.");
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:3333/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar o usuário");
      }
      setData(data.filter((user) => user.id !== selectedUser.id));
      if (selectedUser.id === loggedUserId) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/")
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete user", error);
      setErrorMessage("Erro ao deletar o usuário. Por favor, tente novamente.");
    }
  };

  return (
    <div className="hero is-fullheight">
      <Header />
      <div className="container is-align-items-center p-6">
        <div className="columns is-mobile">
          <div className="column has-text-black has-text-weight-bold is-size-3 is-half is-align-content-center has-text-left">
            <p>Usuários</p>
          </div>
          <div className="column is-half is-align-content-center has-text-right">
            <button className="button is-align-content-end">
              Adicionar usuário
            </button>
          </div>
        </div>
        {errorMessage && (
          <div className="notification is-danger">{errorMessage}</div>
        )}
        <div className="columns is-flex-direction-column is-multiline">
          {data.map((user) => (
            <div className="column" key={user.id}>
              <div className="card is-flex is-align-items-center p-3">
                <div className="card-image">
                  <figure className="image">
                    {user.image ? (
                      <img src={user.image} alt={user.name} />
                    ) : (
                      <FontAwesomeIcon icon={faUser} size="5x" />
                    )}
                  </figure>
                </div>
                <div className="card-content is-flex-grow-1">
                  <p className="title">{user.name}</p>
                  <p className="subtitle">{user.email}</p>
                </div>
                <div className="buttons">
                  <button
                    className="button is-danger"
                    onClick={() => openDeleteModal(user)}
                  >
                    Excluir
                  </button>
                  <button
                    className="button is-info"
                    onClick={() => openEditModal(user)}
                  >
                    Editar
                  </button>
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
                  aria-label={`Goto page ${num + 1}`}
                >
                  {num + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isEditModalActive && (
        <div className={`modal ${isEditModalActive ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeEditModal}></div>
          <div className="modal-content">
            <div className="box">
              <h1 className="title">Editar Usuário</h1>
              <form onSubmit={handleEditSubmit}>
                <div className="field">
                  <label className="label">Nome</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      className="input"
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Imagem</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="image"
                      value={editFormData.image || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                <div className="buttons">
                  <button className="button is-primary" type="submit">
                    Salvar
                  </button>
                  <button className="button" onClick={closeEditModal}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeEditModal}
          ></button>
        </div>
      )}

      {isDeleteModalActive && (
        <div className={`modal ${isDeleteModalActive ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeDeleteModal}></div>
          <div className="modal-content">
            <div className="box">
              <h1 className="title">Confirmar Exclusão</h1>
              <p>Tem certeza de que deseja excluir este usuário?</p>
              <div className="buttons">
                <button className="button is-danger" onClick={deleteUser}>
                  Confirmar
                </button>
                <button className="button" onClick={closeDeleteModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeDeleteModal}
          ></button>
        </div>
      )}
    </div>
  );
}

export default Users;

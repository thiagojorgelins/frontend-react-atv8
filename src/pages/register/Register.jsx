import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handlerSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3333/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/products');
      } else {
        setErrorMessage(data || "Erro ao cadastrar usuário. Por favor, tente novamente.");
      }
    } catch (error) {
      setErrorMessage("Erro ao conectar-se ao servidor. Por favor, tente novamente.");
      console.error("Erro ao cadastrar usuário", error);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className="loginPage">
      <div className="div-left">
        <img src="/labelimage.png" alt="" className="loginImage" />
      </div>
      <div className="div-right">
        <div>
          <h1 className="title has-text-centered has-text-black is-size-1">Cadastro</h1>
        </div>
        <form className="columns is-flex-direction-column" onSubmit={handlerSubmit}>
          <div className="column">
            <label className="label has-text-black is-size-4">Nome</label>
            <div className="control has-icons-left">
              <input
                className="input has-background-white has-text-black is-size-4"
                type="text"
                placeholder="Digite seu nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <span className="icon is-left is-size-4">
                <FontAwesomeIcon icon={faUser} size="2x" />
              </span>
            </div>
          </div>
          <div className="column">
            <label className="label has-text-black is-size-4">Email</label>
            <div className="control has-icons-left">
              <input
                className="input has-background-white has-text-black is-size-4"
                type="email"
                placeholder="Digite seu email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <span className="icon is-left is-size-4">
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
              </span>
            </div>
          </div>
          <div className="column">
            <label className="label has-text-black is-size-4">Senha</label>
            <div className="control has-icons-left">
              <input
                className="input has-background-white has-text-black is-size-4"
                type="password"
                placeholder="Digite sua senha"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="icon is-left is-size-4">
                <FontAwesomeIcon icon={faLock} size="2x" />
              </span>
            </div>
          </div>
          <div className="column">
            <label className="label has-text-black is-size-4">Tipo de usuário</label>
            <div className="control has-icons-left">
              <div className="select is-size-4 is-fullwidth">
                <select
                  className="has-background-white has-text-black"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="" disabled>Selecione tipo do usuário</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="EMPLOYER">Funcionário</option>
                </select>
              </div>
              <span className="icon is-left is-size-4">
                <FontAwesomeIcon icon={faUserTie} size="2x" />
              </span>
            </div>
          </div>
          {errorMessage && (
            <div className="column">
              <div className="notification is-danger has-text-centered">{errorMessage}</div>
            </div>
          )}
          <div className="column">
            <div className="control">
              <button className="button is-large is-fullwidth" type="submit">Cadastrar</button>
            </div>
            <p className="has-text-centered">
              <Link to="/">Já possui conta? Faça o login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

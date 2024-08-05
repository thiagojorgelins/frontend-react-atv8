import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/products");
      } else {
        setErrorMessage(
          data || "Erro ao fazer login. Por favor, tente novamente."
        );
      }
    } catch (error) {
      setErrorMessage(
        "Erro ao conectar-se ao servidor. Por favor, tente novamente."
      );
      console.error("Erro ao fazer login", error);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="loginPage">
      <div className="div-left">
        <img src="/labelimage.png" alt="" className="loginImage" />
      </div>
      <div className="div-right">
        <div>
          <h1 className="title has-text-centered has-text-black is-size-1">
            Login
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label has-text-black is-size-4">Email</label>
            <div className="control has-icons-left has-icons-right">
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
          <div className="field">
            <label className="label has-text-black is-size-4">Senha</label>
            <div className="control has-icons-left has-icons-right">
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
            {errorMessage && (
              <div className="help is-danger is-size-6 has-text-centered">
                {errorMessage}
              </div>
            )}
          </div>
          <div className="control">
            <button className="button is-large is-fullwidth" type="submit">
              Entrar
            </button>
            <p className="has-text-centered">
              <Link to="/register">Não tem uma conta? Cadastre-se</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

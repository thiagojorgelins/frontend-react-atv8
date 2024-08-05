import React from "react";
import Header from "../../components/Header/Header";

function About() {
  return (
    <section className="hero is-fullheight">
      <Header />
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title has-text-black">Sobre o Projeto</h1>
          <div className="columns is-vcentered">
            <div className="column is-half has-text-black">
              <p className="is-size-3">
                Atividade da disciplina de Desenvolvimento Web III
              </p>
              <p className="is-size-5">
                Criação de um frontend em React para consumir uma fake API
                utilizando o JSON Server
              </p>
              <div className="content has-text-black">
                <p className="is-size-5">
                  Este projeto tem como objetivo proporcionar uma experiência
                  prática no desenvolvimento de aplicações frontend utilizando
                  React, integrando com uma fake API criada com JSON Server.
                </p>
                <p className="is-size-3">Principais Tecnologias Utilizadas:</p>

                <div className="columns is-justify-content-space-around">
                  <a
                    href="https://react.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="column has-background-info has-text-white has-text-weight-bold	"
                  >
                    React
                  </a>
                  <a
                    href="https://bulma.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="column has-background-success has-text-white has-text-weight-bold	"
                  >
                    Bulma.io
                  </a>
                  <a
                    href="https://www.npmjs.com/package/json-server"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="column has-background-danger has-text-white has-text-weight-bold"
                  >
                    JSON Server
                  </a>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <figure>
                <img src="/logo512.png" alt="Logo do react" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

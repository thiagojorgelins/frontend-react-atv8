import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer style={footerStyle}>
            <p>
                Desenvolvido por Thiago Jorge Lins da Hora
            </p>
            <div>
                <a
                    href="https://github.com/thiagojorgelins"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={iconStyle}
                >
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
                <a
                    href="https://www.linkedin.com/in/thiago-lins-ab9ab325a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={iconStyle}
                >
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                </a>
            </div>
        </footer>
    );
}

const footerStyle = {
    backgroundColor: '#282c34',
    color: 'white',
    padding: '1em',
    textAlign: 'center',
    bottom: '0',
    width: '100%'
};

const iconStyle = {
    color: 'white',
    margin: '0 10px',
};

export default Footer;

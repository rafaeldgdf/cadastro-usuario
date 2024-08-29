import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CadastroUsuario.css';

const CadastroUsuario = () => {
  const [usuario, setUsuario] = useState({
    nome: '',
    enderecos: [{ cep: '', logradouro: '', numero: '', complemento: '', bairro: '', localidade: '', uf: '' }]
  });

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newEnderecos = usuario.enderecos.map((endereco, idx) => {
      if (idx === index) {
        return { ...endereco, [name]: value };
      }
      return endereco;
    });
    setUsuario({ ...usuario, enderecos: newEnderecos });

    // Se o campo atualizado for o CEP, faça a consulta ao backend
    if (name === "cep" && value.length === 8) {
      axios.get(`http://localhost:8080/enderecos/consulta-cep/${value}`)
        .then(response => {
          const data = response.data;
          const enderecoPreenchido = {
            ...newEnderecos[index],
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            localidade: data.localidade || '',
            uf: data.uf || ''
          };
          const enderecosAtualizados = usuario.enderecos.map((endereco, idx) => idx === index ? enderecoPreenchido : endereco);
          setUsuario({ ...usuario, enderecos: enderecosAtualizados });
        })
        .catch(() => {
          alert('CEP inválido ou não encontrado');
        });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepara os dados para enviar ao backend
    const usuarioDTO = {
      nome: usuario.nome,
      enderecos: usuario.enderecos
    };

    axios.post('http://localhost:8080/usuarios', usuarioDTO)
      .then(() => alert('Usuário cadastrado com sucesso!'))
      .catch(() => alert('Erro ao cadastrar usuário.'));
  };

  const adicionarEndereco = () => {
    if (usuario.enderecos.length < 3) {
      setUsuario({
        ...usuario,
        enderecos: [...usuario.enderecos, { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', localidade: '', uf: '' }]
      });
    } else {
      alert("Você só pode adicionar até 3 endereços.");
    }
  };

  return (
    <div className="container">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="inputGroup">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={usuario.nome}
            onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
            required
          />
        </div>

        {usuario.enderecos.map((endereco, index) => (
          <div key={index} className="enderecoContainer">
            <h3>Endereço {index + 1}</h3>
            <div className="inputGroup">
              <label>CEP:</label>
              <input
                type="text"
                name="cep"
                value={endereco.cep}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
            <div className="inputGroup">
              <label>Logradouro:</label>
              <input
                type="text"
                name="logradouro"
                value={endereco.logradouro}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
            <div className="inputGroup">
              <label>Número:</label>
              <input
                type="text"
                name="numero"
                value={endereco.numero}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
            <div className="inputGroup">
              <label>Complemento:</label>
              <input
                type="text"
                name="complemento"
                value={endereco.complemento}
                onChange={(e) => handleInputChange(index, e)}
              />
            </div>
            <div className="inputGroup">
              <label>Bairro:</label>
              <input
                type="text"
                name="bairro"
                value={endereco.bairro}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
            <div className="inputGroup">
              <label>Localidade:</label>
              <input
                type="text"
                name="localidade"
                value={endereco.localidade} 
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
            <div className="inputGroup">
              <label>UF:</label>
              <input
                type="text"
                name="uf"
                value={endereco.uf}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
          </div>
        ))}

        {usuario.enderecos.length < 3 && (
          <button type="button" onClick={adicionarEndereco} className="addEnderecoButton">
            Adicionar Outro Endereço
          </button>
        )}

        <button type="submit" className="submitButton">Cadastrar Usuário</button>
      </form>
    </div>
  );
};

export default CadastroUsuario;

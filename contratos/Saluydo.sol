// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Saludo - Permite almacenar y modificar un mensaje en la blockchain.
contract Saludo {
    // Variable de estado que almacena el mensaje
    string public mensaje;

    /// @notice Constructor: Inicializa el mensaje con un saludo por defecto.
    constructor() {
        mensaje = "Hola Mundo Blockchain desde el Contrato!";
    }

    /// @notice Obtiene el mensaje actual almacenado en el contrato.
    /// @return El mensaje actual como string.
    function getMensaje() public view returns (string memory) {
        return mensaje;
    }

    /// @notice Permite modificar el mensaje almacenado.
    /// @param _nuevoMensaje El nuevo mensaje a almacenar.
    function setMensaje(string memory _nuevoMensaje) public {
        mensaje = _nuevoMensaje;
    }
}

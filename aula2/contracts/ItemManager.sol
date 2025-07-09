// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ItemManager {
    struct Item {
        uint256 id;
        string nome;
        string descricao;
        address owner;
    }
    
    mapping(uint256 => Item) public items;
    uint256 public nextItemId = 1;
    
    event ItemCreated(uint256 indexed id, string nome, address owner);
    event ItemDeleted(uint256 indexed id);
    
    function criarItem(string memory _nome, string memory _descricao) public {
        items[nextItemId] = Item(nextItemId, _nome, _descricao, msg.sender);
        emit ItemCreated(nextItemId, _nome, msg.sender);
        nextItemId++;
    }
    
    function deletarItem(uint256 _id) public {
        require(items[_id].owner == msg.sender, "Nao eh o dono");
        delete items[_id];
        emit ItemDeleted(_id);
    }
    
    function obterItem(uint256 _id) public view returns (Item memory) {
        return items[_id];
    }
}
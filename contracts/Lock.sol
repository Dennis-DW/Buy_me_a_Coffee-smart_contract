//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


// Switch this to your own contract address once deployed, for bookkeeping!
// Example Contract Address on Goerli: 0x677e908016166F86Cad18CA932B11EaE6ADcDF7c

contract BuyMeACoffee {
    // Event to emit when a Text is created.
    event NewText(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    
    // Text struct.
    struct Text {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable Dennis;

    // List of all Text Messsages received from coffee purchases.
    Text[] Texts;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        Dennis = payable(msg.sender);
    }

    /*fetches all stored memos*/
    function getTexts() public view returns (Text[] memory) {
        return Texts;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a Text)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the Text to storage!
        Texts.push(Text(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a NewText event with details about the Text.
        emit NewText(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /*send the entire balance stored in this contract to the owner(Dennis)*/
    function withdrawTips() public {
        require(Dennis.send(address(this).balance));
    }
}

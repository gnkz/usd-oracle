pragma solidity 0.5.0;


contract USDOracle {
    address public owner;
    uint256 public currentRate;
    uint256 public updatedAt;

    event RateUpdated(uint256 indexed _rate, uint256 indexed _updatedAt);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    function updateRate(uint256 _rate) public onlyOwner returns (uint256) {
        if (currentRate != _rate) {
            currentRate = _rate;
            updatedAt = now;

            emit RateUpdated(currentRate, updatedAt);
        }

        return currentRate;
    }
}

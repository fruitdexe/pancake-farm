const { assert } = require("chai");

const MilkToken = artifacts.require('MilkToken');

contract('MilkToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.milk = await MilkToken.new(dev, { from: minter });
    });

    it('mints 2500 tokens to the treasury on creation', async () => {
        assert.equal((await this.milk.balanceOf(dev)).toString(), '2500000000000000000000');
    })

    it('mint', async () => {
        await this.milk.mint(alice, 1000, { from: minter });
        assert.equal((await this.milk.balanceOf(alice)).toString(), '1000');
    })
});

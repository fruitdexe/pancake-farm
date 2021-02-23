const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { assert } = require('chai');
const MilkToken = artifacts.require('MilkToken');
const FoamBar = artifacts.require('FoamBar');

contract('FoamBar', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.milk = await MilkToken.new(dev, { from: minter });
    this.foam = await FoamBar.new(this.milk.address, { from: minter });
  });

  it('mint', async () => {
    await this.foam.mint(alice, 1000, { from: minter });
    assert.equal((await this.foam.balanceOf(alice)).toString(), '1000');
  });

  it('burn', async () => {
    await advanceBlockTo('650');
    await this.foam.mint(alice, 1000, { from: minter });
    await this.foam.mint(bob, 1000, { from: minter });
    assert.equal((await this.foam.totalSupply()).toString(), '2000');
    await this.foam.burn(alice, 200, { from: minter });

    assert.equal((await this.foam.balanceOf(alice)).toString(), '800');
    assert.equal((await this.foam.totalSupply()).toString(), '1800');
  });

  it('safeMilkTransfer', async () => {
    assert.equal(
      (await this.milk.balanceOf(this.foam.address)).toString(),
      '0'
    );
    await this.milk.mint(this.foam.address, 1000, { from: minter });
    await this.foam.safeMilkTransfer(bob, 200, { from: minter });
    assert.equal((await this.milk.balanceOf(bob)).toString(), '200');
    assert.equal(
      (await this.milk.balanceOf(this.foam.address)).toString(),
      '800'
    );
    await this.foam.safeMilkTransfer(bob, 2000, { from: minter });
    assert.equal((await this.milk.balanceOf(bob)).toString(), '1000');
  });
});


import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'

describe('TUB', () => {
  async function setup() {
    let sai = await setupContract('sai', 'new', `Sai`, `SAI`)
    let sin = await setupContract('sin', 'new', `Sin`, `SIN`)
    let skr = await setupContract('skr', 'new', `Skr`, `SKR`)
    let gem = await setupContract('gem', 'new', `Gem`, `GEM`)
    let gov = await setupContract('gov', 'new', `Gov`, `GOV`)
    let pip = await setupContract('my_oracle', 'new', `1`)
    let pep = await setupContract('my_oracle', 'new', `2`)
    let vox = await setupContract('vox', 'new', `1000000000000000000000000000`)
    let tub = await setupContract('tub', 'new', sai.contract.address, sin.contract.address, skr.contract.address, gem.contract.address, gov.contract.address, pip.contract.address, pep.contract.address, vox.contract.address, vox.contract.address)

    await skr.tx.grantRole(2788977878, tub.contract.address)//tub role

    await tub.tx.grantRole(615566988, sai.defaultSigner.address)//top  role assigne to alice 
    await tub.tx.turn(vox.contract.address)//pit role assign to vox

    return { tub, sai, sin, skr, gem, pip, vox, alice: sai.defaultSigner }

  }
  /*
    it('Test Pie', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
  
  
      const amount = "75000000000000000000";
      const amount_to_join = "72000000000000000000"
      expect((await tub.query.pie()).output).to.eq(0)
      expect((await tub.query.getOff()).output).to.eq(false)
  
      await expect(gem.tx.mint(alice.address, amount)).to.eventually.be.fulfilled
      expect((await gem.query.balanceOf(alice.address)).output).to.eq(amount)
      expect((await gem.query.totalSupply()).output).to.eq(amount)
  
  
      await expect(fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, amount)).to.eventually.be.fulfilled
  
      expect((await tub.query.pie()).output).to.eq(0)
      expect((await tub.query.ask(amount_to_join)).output).to.not.eq(0)
      expect((await tub.query.getOff()).output).to.eq(false)
  
      await expect(fromSigner(tub.contract, alice.address).tx.join(amount_to_join)).to.eventually.be.fulfilled
  
      expect((await tub.query.pie()).output).to.eq(amount_to_join)
      expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(amount_to_join)
    })
  
    it('Test Per', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
  
  
      const amount = "5000000000000000000";
      const per = '1000000000000000000000000000'
  
      await expect(gem.tx.mint(alice.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(tub.contract, alice.address).tx.join(amount)).to.eventually.be.fulfilled
  
      expect((await skr.query.totalSupply()).output).to.eq(amount)
      expect((await tub.query.per()).output).to.eq(per)
    })
  
    it('Test Tag', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
      const rate = '1000000000000000000'
      await expect(pip.tx.set(rate)).to.eventually.be.fulfilled
      expect((await pip.query.read()).output).to.eq(rate)
      let per = (await tub.query.per()).output
      let expected_tag = (await tub.query.Wmul(per, rate)).output
      expect((await tub.query.tag()).output).to.eq(expected_tag)
      let new_rate = '5000000000000000000'
      await expect(pip.tx.set(new_rate)).to.eventually.be.fulfilled
      expect((await pip.query.read()).output).to.eq(new_rate)
      let new_per = (await tub.query.per()).output
      let new_expected_tag = (await tub.query.Wmul(new_per, new_rate)).output
      expect((await tub.query.tag()).output).to.eq(new_expected_tag)
    })
  
  
    it('Test Per', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
  
  
      const amount = "5000000000000000000";
      const per = '1000000000000000000000000000'
  
      await expect(gem.tx.mint(alice.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(tub.contract, alice.address).tx.join(amount)).to.eventually.be.fulfilled
  
      expect((await skr.query.totalSupply()).output).to.eq(amount)
      expect((await tub.query.per()).output).to.eq(per)
    })
  
    it('Test Tag', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
      const ray = '1000000000000000000000000000';
      const wad = '33000000000000000000';
      const amount = '3000000000000000000';
      expect((await tub.query.per()).output).to.eq(ray)
      let gap = (await tub.query.getGap()).output
      let num = (await tub.query.Wmul(ray, gap)).output
      let expected_ask = (await tub.query.Rmul(amount, num)).output
      expect((await tub.query.ask(amount)).output).to.eq(expected_ask)
  
      let new_amount = '33000000000000000000'
      let new_expected_ask = (await tub.query.Rmul(new_amount, num)).output
      expect((await tub.query.ask(new_amount)).output).to.eq(new_expected_ask)
  
    })
  
    it('Test Join', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
  
      const amount = '3000000000000000000'
      await expect(gem.tx.mint(alice.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(tub.contract, alice.address).tx.join(amount)).to.eventually.be.fulfilled
      expect((await skr.query.balanceOf(alice.address)).output).to.eq(amount)
      expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(amount)
      expect((await skr.query.totalSupply()).output).to.eq(amount)
      const one = '1000000000000000000';
      const four = '4000000000000000000';
      await expect(gem.tx.mint(alice.address, one)).to.eventually.be.fulfilled
      await expect(fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, one)).to.eventually.be.fulfilled
      await expect(fromSigner(tub.contract, alice.address).tx.join(one)).to.eventually.be.fulfilled
      expect((await gem.query.balanceOf(alice.address)).output).to.eq('0')
      expect((await skr.query.balanceOf(alice.address)).output).to.eq(four)
      expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(four)
      expect((await skr.query.totalSupply()).output).to.eq(four)
  
    })
  
    it('Test Exit', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
  
      const amount = '10000000000000000000';
      await expect(gem.tx.mint(alice.address, amount)).to.eventually.be.fulfilled
      expect((await gem.query.balanceOf(alice.address)).output).to.eq(amount)
  
      const amount_to_join = '8000000000000000000';
      await expect(fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(tub.contract, alice.address).tx.join(amount_to_join)).to.eventually.be.fulfilled
      expect((await gem.query.balanceOf(alice.address)).output).to.eq('2000000000000000000')
      expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(amount_to_join)
      expect((await skr.query.totalSupply()).output).to.eq(amount_to_join)
  
      const three = '3000000000000000000';
      const five = '5000000000000000000';
      await expect(fromSigner(tub.contract, alice.address).tx.exit(three)).to.eventually.be.fulfilled
      expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(five)
      expect((await gem.query.balanceOf(alice.address)).output).to.eq(five)
      expect((await skr.query.totalSupply()).output).to.eq(five)
  
      const two = '2000000000000000000';
      const seven = '7000000000000000000';
  
      await expect(fromSigner(tub.contract, alice.address).tx.exit(two)).to.eventually.be.fulfilled
      expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(three)
      expect((await gem.query.balanceOf(alice.address)).output).to.eq(seven)
      expect((await skr.query.totalSupply()).output).to.eq(three)
    })
  
    it('Test Cage', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
  
      const amount = '6000000000000000000';
      await expect(gem.tx.mint(alice.address, amount)).to.eventually.be.fulfilled
  
      const five = '5000000000000000000';
      const one = '1000000000000000000';
      await expect(fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(tub.contract, alice.address).tx.join(five)).to.eventually.be.fulfilled
      expect((await gem.query.balanceOf(alice.address)).output).to.eq(one)
      expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(five)
      expect((await skr.query.totalSupply()).output).to.eq(five)
  
      expect((await tub.query.getOff()).output).to.eq(false)
  
  
      let per = (await tub.query.per()).output
      await expect(fromSigner(tub.contract, alice.address).tx.cage(per, five)).to.eventually.be.fulfilled
      expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
      expect((await gem.query.balanceOf(vox.contract.address)).output).to.eq(five)
      expect((await skr.query.totalSupply()).output).to.eq(five)
      expect((await tub.query.getOff()).output).to.eq(true)
  
    })
  
    it('Test Flow', async () => {
      const { tub, sai, sin, skr, gem, pip, vox, alice } = await setup()
  
      const amount = '6000000000000000000';
      await expect(gem.tx.mint(alice.address, amount)).to.eventually.be.fulfilled
  
      const one = '1000000000000000000';
      await expect(fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, amount)).to.eventually.be.fulfilled
      await expect(fromSigner(tub.contract, alice.address).tx.join(one)).to.eventually.be.fulfilled
  
  
      let per = (await tub.query.per()).output
      await expect(fromSigner(tub.contract, alice.address).tx.cage(per, one)).to.eventually.be.fulfilled
      expect((await tub.query.getOff()).output).to.eq(true)
      expect((await tub.query.getOut()).output).to.eq(false)
      await expect(fromSigner(tub.contract, alice.address).tx.flow()).to.eventually.be.fulfilled
  
      expect((await tub.query.getOut()).output).to.eq(true)
  
  
    })
  */
})

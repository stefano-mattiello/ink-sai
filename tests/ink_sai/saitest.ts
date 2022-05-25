import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
const eightynine = '89000000000000000000'
import { wad, ray } from '../constants'
describe('SAI', () => {
  async function setup() {
    let sai = await setupContract('sai', 'new', `Sai`, `SAI`)
    let alice = sai.defaultSigner
    let sin = await setupContract('sin', 'new', `Sin`, `SIN`)
    let skr = await setupContract('skr', 'new', `Skr`, `SKR`)
    let gem = await setupContract('gem', 'new', `Gem`, `GEM`)
    let gov = await setupContract('gov', 'new', `Gov`, `GOV`)
    let pip = await setupContract('my_oracle', 'new', `1000000000000000000`)
    let pep = await setupContract('my_oracle', 'new', `1000000000000000000`)
    let vox = await setupContract('voxtest', 'new', `1000000000000000000000000000`)
    let pit = await setupContract('pit', 'new')
    let tub = await setupContract('tubtest', 'new', sai.contract.address, sin.contract.address, skr.contract.address, gem.contract.address, gov.contract.address, pip.contract.address, pep.contract.address, vox.contract.address, pit.contract.address)
    let tap = await setupContract('tap', 'new', tub.contract.address)
    await tub.tx.turn(tap.contract.address)
    let mom = await setupContract('mom', 'new', tub.contract.address, tap.contract.address, vox.contract.address)
    let top = await setupContract('toptest', 'new', tub.contract.address, tap.contract.address)

    await tap.tx.grantRole(785421448, alice.address)//assign mom role to set parameters
    await fromSigner(tap.contract, alice.address).tx.mold('1000000000000000000')
    await tap.tx.revokeRole(785421448, alice.address)


    await tub.tx.grantRole(785421448, mom.contract.address)
    await tap.tx.grantRole(785421448, mom.contract.address)
    await vox.tx.grantRole(785421448, mom.contract.address)


    await mom.tx.grantRole(1940245101, alice.address)//manager role
    await top.tx.grantRole(1940245101, alice.address)//manager role

    await fromSigner(mom.contract, alice.address).tx.setCap('20000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setAxe('1000000000000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setMat('1000000000000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setTax('1000000000000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setFee('1000000000000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setTubGap('1000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setTapGap('1000000000000000000')

    await sai.tx.grantRole(2788977878, tub.contract.address)//tub or tap
    await sai.tx.grantRole(2788977878, tap.contract.address)//tub or tap
    await skr.tx.grantRole(2788977878, tub.contract.address)//tub or tap
    await skr.tx.grantRole(2788977878, tap.contract.address)//tub or tap
    await sin.tx.grantRole(2549837755, tap.contract.address)
    await sin.tx.grantRole(653678012, tub.contract.address)
    await tap.tx.grantRole(615566988, top.contract.address)
    await tub.tx.grantRole(615566988, top.contract.address)


    await gem.tx.mint(alice.address, wad.hundred)
    await gov.tx.mint(alice.address, wad.hundred)
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.hundred)
    await fromSigner(sai.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.hundred)
    await fromSigner(skr.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.hundred)
    await fromSigner(gov.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.hundred)

    await fromSigner(sai.contract, alice.address).tx.increaseAllowance(tap.contract.address, wad.hundred)
    await fromSigner(skr.contract, alice.address).tx.increaseAllowance(tap.contract.address, wad.hundred)



    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice }
  }

  async function warp(vox, tub, top, age) {
    vox.tx.warp(age)
    tub.tx.warp(age)
    top.tx.warp(age)

    return {}
  }

  async function cageSetup() {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await fromSigner(mom.contract, alice.address).tx.setCap('5000000000000000000')
    await pip.tx.set('1000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setMat('2000000000000000000000000000')

    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.five)

    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup }
  }
  /*
  it('Verify parameters', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    expect((await tub.query.pie()).output).to.eq('0')
    expect((await tub.query.getMat()).output).to.eq('1000000000000000000000000000')
    expect((await tub.query.getAxe()).output).to.eq('1000000000000000000000000000')
    expect((await tub.query.getFee()).output).to.eq('1000000000000000000000000000')
    expect((await tub.query.getTax()).output).to.eq('1000000000000000000000000000')
    expect((await tub.query.getGap()).output).to.eq('1000000000000000000')
    expect((await vox.query.getPar()).output).to.eq('1000000000000000000000000000')
  })
 
  it('Test basic', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
 
    expect((await tub.query.per()).output).to.eq(ray.one)
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
    expect((await tub.query.per()).output).to.eq(ray.one)
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.twenty)
 
    await fromSigner(tub.contract, alice.address).tx.open()
 
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await tub.query.lad(1)).output).to.eq(alice.address)
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
 
    expect((await tub.query.ink(cup)).output).to.eq(wad.ten)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.ten)
 
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.five)).to.eventually.be.fulfilled
 
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
 
    await expect(fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.two)).to.eventually.be.fulfilled
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.three)
 
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    await expect(fromSigner(tub.contract, alice.address).tx.shut(cup)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
  })
 
  it('Test Give', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await fromSigner(tub.contract, alice.address).tx.open()
    expect((await tub.query.lad(1)).output).to.eq(alice.address)
    let cup = 1
    const bob = '0x1234123412341234123412341234123412341234123412341234123412341234'
    await fromSigner(tub.contract, alice.address).tx.give(cup, bob)
    expect((await tub.query.lad(cup)).output).to.eq(bob)
 
  })
 
  it('Test Join Initial', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    expect((await skr.query.totalSupply()).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.ten)
  })
 
  it('Test Join Exit', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.ten)
 
    await expect(fromSigner(tub.contract, alice.address).tx.exit(wad.five)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.five)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.five)
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.two)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.seven)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninetythree)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.seven)
 
    await expect(fromSigner(tub.contract, alice.address).tx.exit(wad.one)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.six)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfour)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.six)
  })
 
  it('Test Fail Over Draw', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await fromSigner(mom.contract, alice.address).tx.setMat('1000000000000000000000000000')
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
 
    //SHOULD FAIL
    //await expect(fromSigner(tub.contract, alice.address).tx.draw(cup,wad.eleven)).to.eventually.be.fulfilled
  })
 
  it('Test Fail Over Draw Excess', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await fromSigner(mom.contract, alice.address).tx.setMat('1000000000000000000000000000')
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.twenty)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
 
    //SHOULD FAIL
    //await expect(fromSigner(tub.contract, alice.address).tx.draw(cup,wad.eleven)).to.eventually.be.fulfilled
  })
 
  it('Test Draw ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
 
    await fromSigner(mom.contract, alice.address).tx.setMat('1000000000000000000000000000')
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.ten)).to.eventually.be.fulfilled
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.ten)
  })
 
  it('Test Wipe ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await fromSigner(mom.contract, alice.address).tx.setMat('1000000000000000000000000000')
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.ten)).to.eventually.be.fulfilled
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.ten)
 
    await expect(fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.five)).to.eventually.be.fulfilled
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
  })
 
  it('Test Unsafe ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.nine)).to.eventually.be.fulfilled
    expect((await tub.query.safe(cup)).output).to.eq(true)
 
    await expect(pip.tx.set(wad.point5)).to.eventually.be.fulfilled
    expect((await tub.query.safe(cup)).output).to.eq(false)
  })
 
 
  it('Test Bite Under Parity ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    expect((await tub.query.getAxe()).output).to.eq(ray.one)
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.five)).to.eventually.be.fulfilled
 
    await expect(pip.tx.set(wad.point25)).to.eventually.be.fulfilled
    expect((await tap.query.fog()).output).to.eq('0')
    expect((await tub.query.safe(cup)).output).to.eq(false)
    await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
    expect((await tap.query.fog()).output).to.eq(wad.ten)
  })
 
 
  it('Test Bite Over Parity ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.two)
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.four)).to.eventually.be.fulfilled
    expect((await tub.query.safe(cup)).output).to.eq(true)
 
    await expect(pip.tx.set(wad.point5)).to.eventually.be.fulfilled
 
    expect((await tub.query.safe(cup)).output).to.eq(false)
    expect((await tub.query.getRum()).output).to.eq(wad.four)
    expect((await tub.query.art(cup)).output).to.eq(wad.four)
    expect((await tap.query.woe()).output).to.eq('0')
    expect((await tap.query.fog()).output).to.eq('0')
 
    await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
    expect((await tub.query.getRum()).output).to.eq('0')
    expect((await tub.query.art(cup)).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(wad.four)
    expect((await tap.query.fog()).output).to.eq(wad.eight)
 
 
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    await expect(fromSigner(tub.contract, alice.address).tx.free(cup, wad.one)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.one)
  })
 
 
  it('Test Lock', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
 
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.ten)
  })
 
  it('Test Free ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.two)
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.four)).to.eventually.be.fulfilled
 
 
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    await expect(fromSigner(tub.contract, alice.address).tx.free(cup, wad.two)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.two)
  })
 
  it('Test Fail Free To Under Collat ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.two)
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.four)).to.eventually.be.fulfilled
    //SHOULD FAIL
    //await expect(fromSigner(tub.contract, alice.address).tx.free(cup,wad.three)).to.eventually.be.fulfilled
  })
 
  it('Test Fail Draw Over Debt Ceiling ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await fromSigner(mom.contract, alice.address).tx.setCap(wad.two)
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
 
    //SHOULD FAIL
    //await expect(fromSigner(tub.contract, alice.address).tx.draw(cup,wad.five)).to.eventually.be.fulfilled
  })
 
 
  it('Test Debt Ceiling ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
 
    await fromSigner(mom.contract, alice.address).tx.setCap(wad.five)
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.two)
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
 
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await expect(fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)).to.eventually.be.fulfilled
    await expect(fromSigner(tub.contract, alice.address).tx.draw(cup, wad.five)).to.eventually.be.fulfilled
    await expect(pip.tx.set(wad.point5)).to.eventually.be.fulfilled
    expect((await tub.query.air()).output).to.eq(wad.ten)
    expect((await tap.query.fog()).output).to.eq('0')
 
    await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
    expect((await tub.query.air()).output).to.eq('0')
    expect((await tap.query.fog()).output).to.eq(wad.ten)
 
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.ten)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
  })
 
  it('Test Cage Unsafe Over Collat ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
 
    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await top.query.fix()).output).to.eq('0')
    expect((await top.query.fit()).output).to.eq('0')
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.twenty)).to.eventually.be.fulfilled
 
    await expect(pip.tx.set(wad.point75)).to.eventually.be.fulfilled
 
    await fromSigner(top.contract, alice.address).tx.cage()
 
    let fix = (await tub.query.Rdiv(wad.one, wad.point75)).output
    expect((await top.query.fix()).output).to.eq(fix)
    expect((await top.query.fit()).output).to.eq(ray.point75)
 
    let mul = (await tub.query.Rdiv(wad.one, wad.point75)).output
    let saved = (await tub.query.Rmul(wad.five, mul)).output
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(saved)
  })
 
  it('Test Cage At Collat ', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
 
    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await top.query.fix()).output).to.eq('0')
    expect((await top.query.fit()).output).to.eq('0')
    await expect(pip.tx.set(wad.point5)).to.eventually.be.fulfilled
    await fromSigner(top.contract, alice.address).tx.cage()
 
    expect((await top.query.fix()).output).to.eq(ray.two)
    expect((await tub.query.per()).output).to.eq('0')
  })
 
  it('Test Cage At Collat Free Skr', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
 
    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await top.query.fix()).output).to.eq('0')
    expect((await top.query.fit()).output).to.eq('0')
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.twenty)).to.eventually.be.fulfilled
    await expect(pip.tx.set(wad.point5)).to.eventually.be.fulfilled
    await fromSigner(top.contract, alice.address).tx.cage()
    expect((await top.query.fix()).output).to.eq(ray.two)
    expect((await top.query.fit()).output).to.eq(ray.point5)
  })
 
 
  it('Test Cage Under Collat', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await top.query.fix()).output).to.eq('0')
    expect((await top.query.fit()).output).to.eq('0')
    await expect(pip.tx.set(wad.point25)).to.eventually.be.fulfilled
 
    await fromSigner(top.contract, alice.address).tx.cage()
 
    expect((await top.query.fix()).output).to.eq(ray.two)
    expect((await tub.query.per()).output).to.eq('0')
  })
 
 
  it('Test Cage Under Collat Free Skr', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await top.query.fix()).output).to.eq('0')
    expect((await top.query.fit()).output).to.eq('0')
    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.twenty)).to.eventually.be.fulfilled
 
    await expect(pip.tx.set(wad.point25)).to.eventually.be.fulfilled
 
    await fromSigner(top.contract, alice.address).tx.cage()
 
    expect((await top.query.fix()).output).to.eq(ray.four)
 
    expect((await sai.query.totalSupply()).output).to.eq(wad.five)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.twenty)
  })
 
  it('Test Cage No Sai', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
 
    await expect(fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.five)).to.eventually.be.fulfilled
    expect((await sai.query.totalSupply()).output).to.eq('0')
    await fromSigner(top.contract, alice.address).tx.cage()
    expect((await top.query.fix()).output).to.eq(ray.one)
  })
 
  it('Test Mock', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await fromSigner(top.contract, alice.address).tx.cage()
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tap.contract.address, wad.twenty)
    await expect(fromSigner(tap.contract, alice.address).tx.mock(wad.twenty)).to.eventually.be.fulfilled
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.twentyfive)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.twentyfive)
  })
 
  it('Test Mock No Sai', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.five)
    expect((await sai.query.totalSupply()).output).to.eq('0')
    await fromSigner(top.contract, alice.address).tx.cage()
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tap.contract.address, wad.twenty)
    await expect(fromSigner(tap.contract, alice.address).tx.mock(wad.twenty)).to.eventually.be.fulfilled
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.twenty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
  })
 
  it('Test Cash Safe Over Collat', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await pip.tx.set(wad.one)
    await fromSigner(top.contract, alice.address).tx.cage()
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.five)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.five)
    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await expect(fromSigner(tap.contract, alice.address).tx.cash(sai_balance)).to.eventually.be.fulfilled
 
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.five)
 
    expect((await tub.query.ink(cup)).output).to.eq(wad.ten)
    await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
    expect((await tub.query.ink(cup)).output).to.eq(wad.five)
    await expect(fromSigner(tub.contract, alice.address).tx.free(cup, wad.five)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.five)
    await expect(fromSigner(tap.contract, alice.address).tx.vent()).to.eventually.be.fulfilled
    await expect(fromSigner(top.contract, alice.address).tx.flow()).to.eventually.be.fulfilled
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await expect(fromSigner(tub.contract, alice.address).tx.exit(skr_balance)).to.eventually.be.fulfilled
 
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
 
    expect((await skr.query.totalSupply()).output).to.eq('0')
  })
 
 
  it('Test Cash Safe Over Collat With FreeSkr', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
    await pip.tx.set(wad.one)
    await fromSigner(top.contract, alice.address).tx.cage()
 
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.seventy)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.twentyfive)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.five)
 
 
    await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
    let ink = (await tub.query.ink(cup)).output
    await expect(fromSigner(tub.contract, alice.address).tx.free(cup, ink)).to.eventually.be.fulfilled
    await expect(fromSigner(tap.contract, alice.address).tx.vent()).to.eventually.be.fulfilled
    await expect(fromSigner(top.contract, alice.address).tx.flow()).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twentyfive)
    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await expect(fromSigner(tap.contract, alice.address).tx.cash(sai_balance)).to.eventually.be.fulfilled
 
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await expect(fromSigner(tub.contract, alice.address).tx.exit(skr_balance)).to.eventually.be.fulfilled
 
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
 
    await expect(fromSigner(tap.contract, alice.address).tx.vent()).to.eventually.be.fulfilled
 
    expect((await sai.query.totalSupply()).output).to.eq('0')
    expect((await skr.query.totalSupply()).output).to.eq('0')
  })
 
  it('Test Fail Cash Safe Over Collat With Free Skr Exit Before Bail', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
 
    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
    await pip.tx.set(wad.one)
    await fromSigner(top.contract, alice.address).tx.cage()
 
    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await expect(fromSigner(tap.contract, alice.address).tx.cash(sai_balance)).to.eventually.be.fulfilled
 
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    // SHOULD FAIL
    //await expect(fromSigner(tub.contract, alice.address).tx.exit(wad.twenty)).to.eventually.be.fulfilled
  })
 
  it('Test Cash Unsafe Over Collat', async () => {
 
    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
    await pip.tx.set(wad.point75)
    await fromSigner(top.contract, alice.address).tx.cage()
 
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.seventy)
 
    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await expect(fromSigner(tap.contract, alice.address).tx.cash(sai_balance)).to.eventually.be.fulfilled
 
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq('76666666666666666667')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('23333333333333333333')
 
    await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
    let ink = (await tub.query.ink(cup)).output
    await expect(fromSigner(tub.contract, alice.address).tx.free(cup, ink)).to.eventually.be.fulfilled
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')
    await expect(fromSigner(tap.contract, alice.address).tx.vent()).to.eventually.be.fulfilled
    await expect(fromSigner(top.contract, alice.address).tx.flow()).to.eventually.be.fulfilled
 
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await expect(fromSigner(tub.contract, alice.address).tx.exit(skr_balance)).to.eventually.be.fulfilled
 
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
 
    await expect(fromSigner(tap.contract, alice.address).tx.vent()).to.eventually.be.fulfilled
 
    expect((await sai.query.totalSupply()).output).to.eq('0')
    expect((await skr.query.totalSupply()).output).to.eq('0')
  })

it('Test Cash At Collat', async () => {

  const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
  await pip.tx.set(wad.point5)
  await fromSigner(top.contract, alice.address).tx.cage()

  expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
  expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninety)

  let sai_balance = (await sai.query.balanceOf(alice.address)).output
  await expect(fromSigner(tap.contract, alice.address).tx.cash(sai_balance)).to.eventually.be.fulfilled

  expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
  expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
  expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')

  await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
  let ink = (await tub.query.ink(cup)).output
  await expect(fromSigner(tub.contract, alice.address).tx.free(cup, ink)).to.eventually.be.fulfilled
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
  expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')

  await expect(fromSigner(tap.contract, alice.address).tx.vent()).to.eventually.be.fulfilled
  expect((await sai.query.totalSupply()).output).to.eq('0')
  expect((await skr.query.totalSupply()).output).to.eq('0')
})

it('Test Cash Unsafe Over Collat Free Skr', async () => {

  const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
  await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
  await pip.tx.set(wad.point5)
  await fromSigner(top.contract, alice.address).tx.cage()

  expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
  expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.seventy)

  let sai_balance = (await sai.query.balanceOf(alice.address)).output
  await expect(fromSigner(tap.contract, alice.address).tx.cash(sai_balance)).to.eventually.be.fulfilled
  expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')

  await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
  let ink = (await tub.query.ink(cup)).output
  await expect(fromSigner(tub.contract, alice.address).tx.free(cup, ink)).to.eventually.be.fulfilled
  await expect(fromSigner(tap.contract, alice.address).tx.vent()).to.eventually.be.fulfilled
  await expect(fromSigner(top.contract, alice.address).tx.flow()).to.eventually.be.fulfilled

  let skr_balance = (await skr.query.balanceOf(alice.address)).output
  await expect(fromSigner(tub.contract, alice.address).tx.exit(skr_balance)).to.eventually.be.fulfilled

  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
  expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')

  expect((await skr.query.totalSupply()).output).to.eq('0')
})

it('Test Fail Cash At Collat Free Skr Before Bail', async () => {

  const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
  await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
  await pip.tx.set(wad.point75)
  await fromSigner(top.contract, alice.address).tx.cage()

  expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
  expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.seventy)

  let sai_balance = (await sai.query.balanceOf(alice.address)).output
  await expect(fromSigner(tap.contract, alice.address).tx.cash(sai_balance)).to.eventually.be.fulfilled
  expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
  let skr_balance = (await skr.query.balanceOf(alice.address)).output
  //SHOULD FAIL
  //await expect(fromSigner(tub.contract, alice.address).tx.exit(skr_balance)).to.eventually.be.fulfilled
})

it('Test Cash Under Collat Free Skr', async () => {

  const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
  await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
  await pip.tx.set(wad.point25)
  await fromSigner(top.contract, alice.address).tx.cage()

  expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.seventy)

  let sai_balance = (await sai.query.balanceOf(alice.address)).output
  await expect(fromSigner(tap.contract, alice.address).tx.cash(sai_balance)).to.eventually.be.fulfilled

  expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
  expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninety)

  await expect(fromSigner(tub.contract, alice.address).tx.bite(cup)).to.eventually.be.fulfilled
  let ink = (await tub.query.ink(cup)).output
  await expect(fromSigner(tub.contract, alice.address).tx.free(cup, ink)).to.eventually.be.fulfilled

  await expect(fromSigner(tap.contract, alice.address).tx.vent()).to.eventually.be.fulfilled
  await expect(fromSigner(top.contract, alice.address).tx.flow()).to.eventually.be.fulfilled
  let skr_balance = (await skr.query.balanceOf(alice.address)).output
  await expect(fromSigner(tub.contract, alice.address).tx.exit(skr_balance)).to.eventually.be.fulfilled

  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
  expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
  expect((await sai.query.totalSupply()).output).to.eq('0')
  expect((await skr.query.totalSupply()).output).to.eq('0')
})

it('Test Cash Safe Over Collat And Mock', async () => {

  const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
  await pip.tx.set(wad.one)
  await fromSigner(top.contract, alice.address).tx.cage()
  let sai_balance = (await sai.query.balanceOf(alice.address)).output
  await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)

  await fromSigner(tub.contract, alice.address).tx.bite(cup)
  await fromSigner(tub.contract, alice.address).tx.free(cup, wad.five)
  await fromSigner(tap.contract, alice.address).tx.vent()
  await fromSigner(top.contract, alice.address).tx.flow()
  let skr_balance = (await skr.query.balanceOf(alice.address)).output
  await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)

  await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tap.contract.address, wad.hundred)
  await expect(fromSigner(tap.contract, alice.address).tx.mock(wad.five)).to.eventually.be.fulfilled
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
  expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.five)
  expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
})

it('Test Cash Safe Over Collat With FreeSkr and Mock', async () => {

  const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
  await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
  await pip.tx.set(wad.one)
  await fromSigner(top.contract, alice.address).tx.cage()
  await fromSigner(tub.contract, alice.address).tx.bite(cup)
  let ink = (await tub.query.ink(cup)).output
  await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
  await fromSigner(tap.contract, alice.address).tx.vent()
  await fromSigner(top.contract, alice.address).tx.flow()
  let sai_balance = (await sai.query.balanceOf(alice.address)).output
  await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
  let skr_balance = (await skr.query.balanceOf(alice.address)).output
  await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)
  await fromSigner(tap.contract, alice.address).tx.vent()

  await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tap.contract.address, wad.hundred)
  await expect(fromSigner(tap.contract, alice.address).tx.mock(wad.five)).to.eventually.be.fulfilled
  expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
  expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.five)
  expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
})

  it('Test Three Cups Over Collat', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await fromSigner(tub.contract, alice.address).tx.join(wad.ninety)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup2 = 2
    await fromSigner(tub.contract, alice.address).tx.lock(cup2, wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup3 = 3
    await fromSigner(tub.contract, alice.address).tx.lock(cup3, wad.twenty)

    expect((await gem.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.hundred)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.fifty)

    await pip.tx.set(wad.one)
    await fromSigner(top.contract, alice.address).tx.cage()
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.five)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.ninetyfive)


    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fiftyfive)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.fourty)

    await fromSigner(tub.contract, alice.address).tx.bite(cup2)
    let ink2 = (await tub.query.ink(cup2)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup2, ink2)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.seventyfive)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.twenty)

    await fromSigner(tub.contract, alice.address).tx.bite(cup3)
    let ink3 = (await tub.query.ink(cup3)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup3, ink3)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')

    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.five)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')

    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)


    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await skr.query.totalSupply()).output).to.eq('0')
  })

  it('Test Three Cups At Collat', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await fromSigner(tub.contract, alice.address).tx.join(wad.ninety)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup2 = 2
    await fromSigner(tub.contract, alice.address).tx.lock(cup2, wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup3 = 3
    await fromSigner(tub.contract, alice.address).tx.lock(cup3, wad.twenty)

    expect((await gem.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.hundred)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.fifty)

    await pip.tx.set(wad.point5)
    await fromSigner(top.contract, alice.address).tx.cage()
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.ten)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.ninety)


    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.fourty)

    await fromSigner(tub.contract, alice.address).tx.bite(cup2)
    let ink2 = (await tub.query.ink(cup2)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup2, ink2)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.seventy)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.twenty)

    await fromSigner(tub.contract, alice.address).tx.bite(cup3)
    let ink3 = (await tub.query.ink(cup3)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup3, ink3)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')

    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')

    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)


    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await skr.query.totalSupply()).output).to.eq('0')
  })

  it('Test Three Cups Under Collat', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await fromSigner(tub.contract, alice.address).tx.join(wad.ninety)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup2 = 2
    await fromSigner(tub.contract, alice.address).tx.lock(cup2, wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup3 = 3
    await fromSigner(tub.contract, alice.address).tx.lock(cup3, wad.twenty)

    expect((await gem.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.hundred)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.fifty)

    await pip.tx.set(wad.point25)
    await fromSigner(top.contract, alice.address).tx.cage()
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.twenty)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.eighty)


    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.fourty)

    await fromSigner(tub.contract, alice.address).tx.bite(cup2)
    let ink2 = (await tub.query.ink(cup2)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup2, ink2)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.seventy)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.twenty)

    await fromSigner(tub.contract, alice.address).tx.bite(cup3)
    let ink3 = (await tub.query.ink(cup3)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup3, ink3)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')

    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')

    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)


    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await skr.query.totalSupply()).output).to.eq('0')
  })

  it('Test Three Cups Under Collat', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    await fromSigner(tub.contract, alice.address).tx.join(wad.ninety)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup2 = 2
    await fromSigner(tub.contract, alice.address).tx.lock(cup2, wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup3 = 3
    await fromSigner(tub.contract, alice.address).tx.lock(cup3, wad.twenty)

    expect((await gem.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.hundred)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.fifty)

    await pip.tx.set(wad.point05)
    await fromSigner(top.contract, alice.address).tx.cage()
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')


    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.fourty)

    await fromSigner(tub.contract, alice.address).tx.bite(cup2)
    let ink2 = (await tub.query.ink(cup2)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup2, ink2)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.seventy)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.twenty)

    await fromSigner(tub.contract, alice.address).tx.bite(cup3)
    let ink3 = (await tub.query.ink(cup3)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup3, ink3)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')

    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')

    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)


    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await skr.query.totalSupply()).output).to.eq('0')
  })

  it('test Periodic Fix Value', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()

    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.ten)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.ten)

    const signers = await getSigners()
    const bob = signers[2]
    await fromSigner(sai.contract, alice.address).tx.transfer(bob.address, wad.twopoint5, '')
    let price = (await tub.query.Rdiv(wad.nine, wad.eight)).output
    await pip.tx.set(price)
    await fromSigner(top.contract, alice.address).tx.cage()
    let fix = (await top.query.fix()).output
    let expected_tap = (await tub.query.Rmul(wad.five, fix)).output
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(expected_tap)
    let expected_tub = (await tub.query.Sub(wad.ten, expected_tap)).output
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(expected_tub)

    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(bob.address)).output).to.eq(wad.twopoint5)
    let num = (await tub.query.Rmul(wad.twopoint5, fix)).output
    let expected_gem = (await tub.query.Add(wad.ninety, num)).output
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(expected_gem)
    sai_balance = (await sai.query.balanceOf(bob.address)).output
    await expect(fromSigner(tap.contract, bob.address).tx.cash(sai_balance)).to.eventually.be.fulfilled
  })*/

  it('Test Shut empy cup', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    expect((await tub.query.lad(cup)).output).to.eq(alice.address)
    await expect(fromSigner(tub.contract, alice.address).tx.shut(cup)).to.eventually.be.fulfilled
    expect((await tub.query.lad(cup)).output).to.not.eq(alice.address)
  })




})

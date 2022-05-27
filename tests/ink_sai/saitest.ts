import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
import { wad, ray, time } from '../constants'
describe('SAI', () => {
  async function setup() {
    //instantiate contracts
    let sai = await setupContract('sai', 'new', `Sai`, `SAI`)
    //get an account
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
    //give to tub the address of the tap contract
    await tub.tx.turn(tap.contract.address)
    //instantiate the last contracts
    let mom = await setupContract('mom', 'new', tub.contract.address, tap.contract.address, vox.contract.address)
    let top = await setupContract('toptest', 'new', tub.contract.address, tap.contract.address)

    //the numbers used to assign roles are the result of ink_lang::seletor_id!("ROLE")
    //i.e. 785421448=seletor_id!("MOM")
    await tap.tx.grantRole(785421448, alice.address)//assign mom role to alice to set parameters
    await fromSigner(tap.contract, alice.address).tx.mold('1000000000000000000')//set parameter 
    await tap.tx.revokeRole(785421448, alice.address)//revoke role

    //assign mom role in tub, tap and vox to mom contract
    await tub.tx.grantRole(785421448, mom.contract.address)
    await tap.tx.grantRole(785421448, mom.contract.address)
    await vox.tx.grantRole(785421448, mom.contract.address)


    await mom.tx.grantRole(1940245101, alice.address)//manager role assigned to alice
    await top.tx.grantRole(1940245101, alice.address)//manager role assigned to alice

    //alice (manager) call the mom contract to set the parameters
    await fromSigner(mom.contract, alice.address).tx.setCap('20000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setAxe('1000000000000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setMat('1000000000000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setTax('1000000000000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setFee('1000000000000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setTubGap('1000000000000000000')
    await fromSigner(mom.contract, alice.address).tx.setTapGap('1000000000000000000')

    //assign role in token contracts to corresponding contract
    await sai.tx.grantRole(2788977878, tub.contract.address)//tub or tap role
    await sai.tx.grantRole(2788977878, tap.contract.address)//tub or tap role
    await skr.tx.grantRole(2788977878, tub.contract.address)//tub or tap role
    await skr.tx.grantRole(2788977878, tap.contract.address)//tub or tap role
    await sin.tx.grantRole(2549837755, tap.contract.address)//tap role
    await sin.tx.grantRole(653678012, tub.contract.address)//tub role

    //assign top role in tap and tub
    await tap.tx.grantRole(615566988, top.contract.address)
    await tub.tx.grantRole(615566988, top.contract.address)

    //mint some gem and gov to alice to make tests
    await gem.tx.mint(alice.address, wad.hundred)
    await gov.tx.mint(alice.address, wad.hundred)

    //allow tub and tap to transfer token from alice account so we don't have to make it every time 
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)
    await fromSigner(sai.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)
    await fromSigner(skr.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)
    await fromSigner(gov.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)

    await fromSigner(sai.contract, alice.address).tx.increaseAllowance(tap.contract.address, wad.thousand)
    await fromSigner(skr.contract, alice.address).tx.increaseAllowance(tap.contract.address, wad.thousand)

    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice }
  }

  async function taxSetup() {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await pip.tx.set(wad.ten)
    await gem.tx.mint(alice.address, wad.thousand)
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)

    await fromSigner(mom.contract, alice.address).tx.setCap(wad.thousand)
    await fromSigner(mom.contract, alice.address).tx.setTax('1000000564701133626865910626')  // 5% / day

    await expect(fromSigner(tub.contract, alice.address).tx.join(wad.hundred)).to.eventually.be.fulfilled
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.hundred)

    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup }
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

  async function waySetup() {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await pip.tx.set(wad.ten)
    await gem.tx.mint(alice.address, wad.thousand)
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)

    await fromSigner(mom.contract, alice.address).tx.setCap(wad.thousand)

    await fromSigner(tub.contract, alice.address).tx.join(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.hundred)

    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup }
  }

  async function gapSetup() {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()


    await gem.tx.mint(alice.address, wad.fivehundred)
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)

    await fromSigner(tub.contract, alice.address).tx.join(wad.fivehundred)
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.fivehundred)
    await fromSigner(sin.contract, alice.address).tx.mint(alice.address, wad.fivehundred)
    await pip.tx.set(wad.two)
    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice }
  }

  async function feeSetup() {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await pip.tx.set(wad.ten)
    await pep.tx.set(wad.point5)

    await gem.tx.mint(alice.address, wad.thousand)
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)

    await fromSigner(mom.contract, alice.address).tx.setCap(wad.thousand)
    await fromSigner(mom.contract, alice.address).tx.setFee('1000000564701133626865910626')  // 5% / day

    await fromSigner(tub.contract, alice.address).tx.join(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.hundred)

    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup }
  }

  async function feeSetup2() {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await pip.tx.set(wad.ten)
    await pep.tx.set(wad.point5)

    await gem.tx.mint(alice.address, wad.thousand)
    await fromSigner(gem.contract, alice.address).tx.increaseAllowance(tub.contract.address, wad.thousand)

    await fromSigner(mom.contract, alice.address).tx.setCap(wad.thousand)
    await fromSigner(mom.contract, alice.address).tx.setFee('1000000564701133626865910626')  // 5% / day
    await fromSigner(mom.contract, alice.address).tx.setTax('1000000564701133626865910626')  // 5% / day

    await fromSigner(tub.contract, alice.address).tx.join(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.hundred)

    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup }
  }

  async function axeSetup() {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await pip.tx.set(wad.one)
    await fromSigner(mom.contract, alice.address).tx.setCap(wad.thousand)
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.two)  // require 200% collat

    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.ten)

    return { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup }
  }



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

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    expect((await tub.query.per()).output).to.eq(ray.one)

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.twenty)

    await fromSigner(tub.contract, alice.address).tx.open()

    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await tub.query.lad(1)).output).to.eq(alice.address)
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)

    expect((await tub.query.ink(cup)).output).to.eq(wad.ten)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.ten)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.five)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)

    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.two)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.three)

    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    await fromSigner(tub.contract, alice.address).tx.shut(cup)
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
    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    //SHOULD FAIL
    //await expect(fromSigner(tub.contract, alice.address).tx.draw(cup,wad.eleven)).to.eventually.be.fulfilled
  })

  it('Test Draw ', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()


    await fromSigner(mom.contract, alice.address).tx.setMat('1000000000000000000000000000')
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.ten)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.ten)
  })

  it('Test Wipe ', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(mom.contract, alice.address).tx.setMat('1000000000000000000000000000')
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.ten)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.five)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
  })

  it('Test Unsafe ', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.nine)
    expect((await tub.query.safe(cup)).output).to.eq(true)

    await pip.tx.set(wad.point5)
    expect((await tub.query.safe(cup)).output).to.eq(false)
  })


  it('Test Bite Under Parity ', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    expect((await tub.query.getAxe()).output).to.eq(ray.one)
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.five)

    await pip.tx.set(wad.point25)
    expect((await tap.query.fog()).output).to.eq('0')
    expect((await tub.query.safe(cup)).output).to.eq(false)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tap.query.fog()).output).to.eq(wad.ten)
  })


  it('Test Bite Over Parity ', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(mom.contract, alice.address).tx.setMat(ray.two)

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.four)
    expect((await tub.query.safe(cup)).output).to.eq(true)

    await expect(pip.tx.set(wad.point5)).to.eventually.be.fulfilled

    expect((await tub.query.safe(cup)).output).to.eq(false)
    expect((await tub.query.getRum()).output).to.eq(wad.four)
    expect((await tub.query.art(cup)).output).to.eq(wad.four)
    expect((await tap.query.woe()).output).to.eq('0')
    expect((await tap.query.fog()).output).to.eq('0')

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.getRum()).output).to.eq('0')
    expect((await tub.query.art(cup)).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(wad.four)
    expect((await tap.query.fog()).output).to.eq(wad.eight)


    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    await fromSigner(tub.contract, alice.address).tx.free(cup, wad.one)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.one)
  })


  it('Test Lock', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1

    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.ten)
  })

  it('Test Free ', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(mom.contract, alice.address).tx.setMat(ray.two)

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.four)


    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    await fromSigner(tub.contract, alice.address).tx.free(cup, wad.two)
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
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.five)
    await pip.tx.set(wad.point5)
    expect((await tub.query.air()).output).to.eq(wad.ten)
    expect((await tap.query.fog()).output).to.eq('0')

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.air()).output).to.eq('0')
    expect((await tap.query.fog()).output).to.eq(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
  })

  it('Test Cage Unsafe Over Collat ', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()

    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await top.query.fix()).output).to.eq('0')
    expect((await top.query.fit()).output).to.eq('0')
    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)

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
    await pip.tx.set(wad.point5)
    await fromSigner(top.contract, alice.address).tx.cage()

    expect((await top.query.fix()).output).to.eq(ray.two)
    expect((await tub.query.per()).output).to.eq('0')
  })

  it('Test Cage At Collat Free Skr', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()

    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await top.query.fix()).output).to.eq('0')
    expect((await top.query.fit()).output).to.eq('0')
    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
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
    await pip.tx.set(wad.point25)

    await fromSigner(top.contract, alice.address).tx.cage()

    expect((await top.query.fix()).output).to.eq(ray.two)
    expect((await tub.query.per()).output).to.eq('0')
  })


  it('Test Cage Under Collat Free Skr', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()
    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await top.query.fix()).output).to.eq('0')
    expect((await top.query.fit()).output).to.eq('0')
    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)

    await expect(pip.tx.set(wad.point25)).to.eventually.be.fulfilled

    await fromSigner(top.contract, alice.address).tx.cage()

    expect((await top.query.fix()).output).to.eq(ray.four)

    expect((await sai.query.totalSupply()).output).to.eq(wad.five)
    expect((await gem.query.balanceOf(tap.contract.address)).output).to.eq(wad.twenty)
  })

  it('Test Cage No Sai', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()

    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.five)
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
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq(wad.five)

    expect((await tub.query.ink(cup)).output).to.eq(wad.ten)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.ink(cup)).output).to.eq(wad.five)
    await fromSigner(tub.contract, alice.address).tx.free(cup, wad.five)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.five)
    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)

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


    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twentyfive)
    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)

    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)

    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')

    await fromSigner(tap.contract, alice.address).tx.vent()

    expect((await sai.query.totalSupply()).output).to.eq('0')
    expect((await skr.query.totalSupply()).output).to.eq('0')
  })

  it('Test Fail Cash Safe Over Collat With Free Skr Exit Before Bail', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await cageSetup()

    await fromSigner(tub.contract, alice.address).tx.join(wad.twenty)
    await pip.tx.set(wad.one)
    await fromSigner(top.contract, alice.address).tx.cage()

    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)

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
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq('76666666666666666667')
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('23333333333333333333')

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')
    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()

    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)

    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')

    await fromSigner(tap.contract, alice.address).tx.vent()

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
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(tub.contract.address)).output).to.eq('0')

    await fromSigner(tap.contract, alice.address).tx.vent()
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
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()

    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)

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
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
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
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninety)

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)

    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    let skr_balance = (await skr.query.balanceOf(alice.address)).output
    await fromSigner(tub.contract, alice.address).tx.exit(skr_balance)

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
  })

  it('Test Shut empy cup', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    expect((await tub.query.lad(cup)).output).to.eq(alice.address)
    await expect(fromSigner(tub.contract, alice.address).tx.shut(cup)).to.eventually.be.fulfilled
    expect((await tub.query.lad(cup)).output).to.not.eq(alice.address)
  })
  it('Test Liq', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(mom.contract, alice.address).tx.setCap(wad.hundred)
    await pip.tx.set(wad.two)
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.ten)

    //liquidation price calc:
    //let ink = ((await tub.query.ink(cup)).output
    //let per = (await tub.query.per()).output
    //let jam = (await tub.query.Rmul(ink, per)).output
    //let tab = (await tub.query.tab(cup)).output
    //let par = (await vox.query.getPar()).output
    //let con = (await tub.query.Rmul(tab, par)).output
    //let mat = (await tub.query.getMat()).output
    //let min = (await tub.query.Rmul(con, mat)).output
    //let liquidation_price: number = await tub.query.Wdiv(min,jam).output


    await fromSigner(mom.contract, alice.address).tx.setMat(ray.one)
    let liquidation_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output), ((await tub.query.getMat()).output))).output), ((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.per()).output))).output))).output
    expect(liquidation_price).to.eq(wad.one)

    await fromSigner(mom.contract, alice.address).tx.setMat(ray.onepoint5)
    liquidation_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output), ((await tub.query.getMat()).output))).output), ((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.per()).output))).output))).output
    expect(liquidation_price).to.eq(wad.onepoint5)

    await pip.tx.set(wad.six)
    liquidation_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output), ((await tub.query.getMat()).output))).output), ((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.per()).output))).output))).output
    expect(liquidation_price).to.eq(wad.onepoint5)

    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.thirty)
    liquidation_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output), ((await tub.query.getMat()).output))).output), ((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.per()).output))).output))).output
    expect(liquidation_price).to.eq(wad.six)

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    liquidation_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output), ((await tub.query.getMat()).output))).output), ((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.per()).output))).output))).output
    expect(liquidation_price).to.eq(wad.six)

    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    liquidation_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output), ((await tub.query.getMat()).output))).output), ((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.per()).output))).output))).output
    expect(liquidation_price).to.eq(wad.three)
  })

  it('Test Collat', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(mom.contract, alice.address).tx.setCap(wad.hundred)
    await pip.tx.set(wad.two)
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.ten)

    //compute the collateralised fraction of a cup
    //let ink = (await tub.query.ink(cup)).output
    //let tag = (await tub.query.tag()).output
    //let pro = (await tub.query.Rmul(ink, tag)).output
    //let tab = (await tub.query.tab(cup)).output
    //let par = (await vox.query.getPar()).output
    //let con = (await tub.query.Rmul(tab, par)).output
    //let collat_price: number = await tub.query.Wdiv(pro,con).output



    let collat_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.tag()).output))).output), ((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output))).output
    expect(collat_price).to.eq(wad.two)

    await pip.tx.set(wad.four)
    collat_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.tag()).output))).output), ((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output))).output
    expect(collat_price).to.eq(wad.four)

    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.fifteen)
    collat_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.tag()).output))).output), ((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output))).output
    expect(collat_price).to.eq('1600000000000000000')

    await pip.tx.set(wad.five)
    await fromSigner(tub.contract, alice.address).tx.free(cup, wad.five)
    collat_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.tag()).output))).output), ((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output))).output
    expect(collat_price).to.eq(wad.one)

    await pip.tx.set(wad.four)
    collat_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.tag()).output))).output), ((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output))).output
    expect(collat_price).to.eq('800000000000000000')

    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.nine)
    collat_price = (await tub.query.Wdiv(((await tub.query.Rmul(((await tub.query.ink(cup)).output), ((await tub.query.tag()).output))).output), ((await tub.query.Rmul(((await tub.query.tab(cup)).output), ((await vox.query.getPar()).output))).output))).output
    expect(collat_price).to.eq('1250000000000000000')
  })

  it('Test Bust Mint', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(mom.contract, alice.address).tx.setCap(wad.hundred)
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.onepoint5)
    await pip.tx.set(wad.two)
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)

    await pip.tx.set(wad.three)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.sixteen)
    await pip.tx.set(wad.two)
    expect((await tub.query.safe(cup)).output).to.eq(false)

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tap.query.fog()).output).to.eq(wad.eight)
    expect((await tub.query.per()).output).to.eq(ray.one)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.sixteen)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    await fromSigner(tap.contract, alice.address).tx.bust(wad.two)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.twelve)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.two)
    await pip.tx.set(wad.one)

    await fromSigner(tap.contract, alice.address).tx.bust(wad.six)
    expect((await tap.query.fog()).output).to.eq('0')
    expect((await skr.query.totalSupply()).output).to.eq(wad.ten)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.two)
    expect((await skr.query.totalSupply()).output).to.eq(wad.twelve)
  })

  it('Test Bust No Mint', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(mom.contract, alice.address).tx.setCap(wad.thousand)
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.two)
    await fromSigner(mom.contract, alice.address).tx.setAxe(ray.onepoint5)
    await pip.tx.set(wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    await fromSigner(tub.contract, alice.address).tx.open()
    let cup = 1
    await fromSigner(tub.contract, alice.address).tx.lock(cup, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.hundred)
    await pip.tx.set(wad.fifteen)

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.tab(cup)).output).to.eq('0')
    expect((await tub.query.ink(cup)).output).to.eq('0')
    expect((await tap.query.fog()).output).to.eq(wad.ten)
    expect((await tap.query.woe()).output).to.eq(wad.hundred)

    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    await fromSigner(tub.contract, alice.address).tx.open()
    let mug = 2
    await fromSigner(tub.contract, alice.address).tx.lock(mug, wad.ten)
    await fromSigner(tub.contract, alice.address).tx.draw(mug, wad.fifty)

    await fromSigner(tap.contract, alice.address).tx.bust(wad.ten)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    expect((await tap.query.fog()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq('0')
    expect((await tap.query.joy()).output).to.eq(wad.fifty)

    expect((await tap.query.bid(wad.one)).output).to.eq(wad.fifteen)
    await fromSigner(tap.contract, alice.address).tx.boom(wad.two)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.thirty)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.eight)
    expect((await tap.query.fog()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq('0')
    expect((await tap.query.joy()).output).to.eq(wad.twenty)
  })

  it('Test Tap Setup', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()


    expect((await sai.query.balanceOf(tap.contract.address)).output).to.eq(((await tap.query.joy()).output))
    expect((await sin.query.balanceOf(tap.contract.address)).output).to.eq(((await tap.query.woe()).output))
    expect((await skr.query.balanceOf(tap.contract.address)).output).to.eq(((await tap.query.fog()).output))

    expect((await tap.query.fog()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq('0')
    expect((await tap.query.joy()).output).to.eq('0')

    await sai.tx.grantRole(2788977878, alice.address)
    await skr.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.one)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.two)
    await fromSigner(skr.contract, alice.address).tx.mint(tap.contract.address, wad.three)

    expect((await tap.query.joy()).output).to.eq(wad.one)
    expect((await tap.query.woe()).output).to.eq(wad.two)
    expect((await tap.query.fog()).output).to.eq(wad.three)
  })

  it('Test Tap Boom', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.sixty)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.sixty)

    await fromSigner(tap.contract, alice.address).tx.boom(wad.fifty)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ten)
    expect((await tap.query.joy()).output).to.eq('0')
  })

  it('Test Fail Tap Boom Over Joy', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.sixty)
    //SHOULD FAIL
    //await fromSigner(tap.contract, alice.address).tx.boom(wad.fiftyfive)
  })

  it('Test Tap Boom Heals', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.sixty)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)

    await fromSigner(tap.contract, alice.address).tx.boom('0')
    expect((await tap.query.joy()).output).to.eq(wad.ten)
  })

  it('Test Fail Tap Boom Net Woe', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.sixty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.ten)
    //SHOULD FAIL
    //await fromSigner(tap.contract, alice.address).tx.boom(wad.one)
  })

  it('Test Tap Boom Burn Skr', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.sixty)
    expect((await skr.query.totalSupply()).output).to.eq(wad.sixty)

    await fromSigner(tap.contract, alice.address).tx.boom(wad.twenty)
    expect((await skr.query.totalSupply()).output).to.eq(wad.fourty)
  })

  it('Test Tap Boom Increase Per', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.sixty)
    expect((await tub.query.per()).output).to.eq(ray.one)

    await fromSigner(tap.contract, alice.address).tx.boom(wad.thirty)
    expect((await tub.query.per()).output).to.eq(ray.two)
  })

  it('Test Tap Boom Mark Dep', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await pip.tx.set(wad.two)

    await fromSigner(tap.contract, alice.address).tx.boom(wad.ten)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
    expect((await sai.query.balanceOf(tap.contract.address)).output).to.eq(wad.thirty)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fourty)
  })

  it('Test Tap Boom Per Dep', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await skr.tx.grantRole(2788977878, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)

    expect((await tub.query.per()).output).to.eq(ray.one)
    await fromSigner(skr.contract, alice.address).tx.mint(alice.address, wad.fifty)
    expect((await tub.query.per()).output).to.eq(ray.point5)

    await fromSigner(tap.contract, alice.address).tx.boom(wad.ten)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.five)
    expect((await sai.query.balanceOf(tap.contract.address)).output).to.eq(wad.fourtyfive)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
  })

  it('Test Tap Bust Flip', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(skr.contract, alice.address).tx.transfer(tap.contract.address, wad.fifty, '')
    expect((await tap.query.fog()).output).to.eq(wad.fifty)

    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.thirty)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.thirty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.twenty)
  })

  it('Test Fail Tap Bust Flip Over Fog', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.fifty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(skr.contract, alice.address).tx.transfer(tap.contract.address, wad.fifty, '')
    //SHOULD FAIL
    //await fromSigner(tap.contract, alice.address).tx.bust(wad.fiftyfive)
  })

  it('Test Tap Bust Flip Heals Net Joy', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.ten)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(skr.contract, alice.address).tx.transfer(tap.contract.address, wad.fifty, '')

    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.fifteen)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.fifteen)
    expect((await tap.query.joy()).output).to.eq(wad.five)
    expect((await tap.query.woe()).output).to.eq('0')
  })

  it('Test Tap Bust Flip Heals Net Woe', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.ten)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(skr.contract, alice.address).tx.transfer(tap.contract.address, wad.fifty, '')

    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.five)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.five)
    expect((await tap.query.joy()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(wad.five)
  })

  it('Test Tap Bust Flop', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.hundred)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    expect((await tap.query.woe()).output).to.eq(wad.fifty)

    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.fifty)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.seventyfive)
  })

  it('Test Fail Tap Bust Flop Net Joy', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.hundred)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)
    await fromSigner(sai.contract, alice.address).tx.mint(tap.contract.address, wad.hundred)
    //SHOULD FAIL
    //await fromSigner(tap.contract, alice.address).tx.bust(wad.one)
  })

  it('Test Tap Bust Flop Mints Skr', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.hundred)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)

    expect((await skr.query.totalSupply()).output).to.eq(wad.fifty)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.twenty)
    expect((await skr.query.totalSupply()).output).to.eq(wad.seventy)
  })

  it('Test Tap Bust Flop Decrease Per', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.hundred)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.fifty)

    expect((await tub.query.per()).output).to.eq(ray.one)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.fifty)
    expect((await tub.query.per()).output).to.eq(ray.point5)
  })

  it('Test Tap Bust Ask', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await skr.tx.grantRole(2788977878, alice.address)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    expect((await tap.query.ask(wad.fifty)).output).to.eq(wad.fifty)

    await fromSigner(skr.contract, alice.address).tx.mint(alice.address, wad.fifty)
    expect((await tap.query.ask(wad.fifty)).output).to.eq(wad.twentyfive)

    await fromSigner(skr.contract, alice.address).tx.mint(alice.address, wad.hundred)
    expect((await tap.query.ask(wad.fifty)).output).to.eq(wad.twelvepoint5)

    await fromSigner(skr.contract, alice.address).tx.burn(alice.address, wad.hundredseventyfive)
    expect((await tap.query.ask(wad.fifty)).output).to.eq(wad.hundred)

    await fromSigner(skr.contract, alice.address).tx.mint(alice.address, wad.twentyfive)
    expect((await tap.query.ask(wad.fifty)).output).to.eq(wad.fifty)

    await fromSigner(skr.contract, alice.address).tx.mint(alice.address, wad.ten)
    expect((await tap.query.ask(wad.sixty)).output).to.eq(wad.fifty)

    await fromSigner(skr.contract, alice.address).tx.mint(alice.address, wad.thirty)
    expect((await tap.query.ask(wad.ninety)).output).to.eq(wad.fifty)

    await fromSigner(skr.contract, alice.address).tx.mint(alice.address, wad.ten)
    expect((await tap.query.ask(wad.hundred)).output).to.eq(wad.fifty)
  })

  it('Test Tap Bust Flip Flop Rounding', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.hundred)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.hundred)
    await fromSigner(skr.contract, alice.address).tx.transfer(tap.contract.address, wad.fifty, '')
    expect((await tap.query.joy()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(wad.hundred)
    expect((await tap.query.fog()).output).to.eq(wad.fifty)

    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await skr.query.totalSupply()).output).to.eq(wad.fifty)

    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await tap.query.s2s()).output).to.eq(ray.one)
    expect((await tub.query.tag()).output).to.eq(ray.one)
    expect((await tap.query.ask(wad.sixty)).output).to.eq(wad.sixty)

    await fromSigner(tap.contract, alice.address).tx.bust(wad.sixty)
    expect((await tub.query.per()).output).to.eq(((await tub.query.Rdiv('5', '6')).output))
    expect((await tap.query.s2s()).output).to.eq(((await tub.query.Rdiv('5', '6')).output))
    expect((await tub.query.tag()).output).to.eq(((await tub.query.Rdiv('5', '6')).output))
    expect((await tap.query.ask(wad.sixty)).output).to.eq(wad.fifty)
    expect((await skr.query.totalSupply()).output).to.eq(wad.sixty)
    expect((await tap.query.fog()).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.sixty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
  })

  it('Test Tap Bust Flip Flop', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    await sai.tx.grantRole(2788977878, alice.address)
    await sin.tx.grantRole(653678012, alice.address)
    await fromSigner(tub.contract, alice.address).tx.join(wad.fifty)
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.hundred)
    await fromSigner(sin.contract, alice.address).tx.mint(tap.contract.address, wad.hundred)
    await fromSigner(skr.contract, alice.address).tx.transfer(tap.contract.address, wad.fifty, '')
    expect((await tap.query.joy()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(wad.hundred)
    expect((await tap.query.fog()).output).to.eq(wad.fifty)

    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await skr.query.totalSupply()).output).to.eq(wad.fifty)

    expect((await tub.query.per()).output).to.eq(ray.one)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.eighty)
    expect((await tub.query.per()).output).to.eq(((await tub.query.Rdiv('5', '8')).output))
    expect((await skr.query.totalSupply()).output).to.eq(wad.eighty)
    expect((await tap.query.fog()).output).to.eq('0')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.eighty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.fifty)
  })

  it('Test Tax Era', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.tab(cup)).output).to.eq('110250000000000000000')
  })

  it('Test Tax Rum', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    expect((await tub.query.getRum()).output).to.eq(wad.hundred)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    expect((await tub.query.getRum()).output).to.eq(wad.hundred)
  })

  it('Test Tax Din', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    expect((await tub.query.din()).output).to.eq(wad.hundred)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    expect((await tub.query.din()).output).to.eq(wad.hundredfive)
  })

  it('Test Tax Joy', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tap.query.joy()).output).to.eq('0')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()//This should be execute during din() but since I call din() only a query, so I manually run drip()
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    expect((await tub.query.din()).output).to.eq(wad.hundredfive)
    expect((await tap.query.joy()).output).to.eq(wad.five)
  })

  it('Test Tax Joy2', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tap.query.joy()).output).to.eq('0')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()//This should be execute during din() but since I call din() only a query, so I manually run drip()
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    expect((await tub.query.din()).output).to.eq(wad.hundredfive)
    expect((await tap.query.joy()).output).to.eq(wad.five)

    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.five)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tap.query.joy()).output).to.eq(wad.five)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    expect((await tub.query.din()).output).to.eq(wad.hundredfive)
    expect((await tap.query.joy()).output).to.eq(wad.ten)
  })

  it('Test Tax Joy3', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tap.query.joy()).output).to.eq('0')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()//This should be execute during din() but since I call din() only a query, so I manually run drip()
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    expect((await tub.query.din()).output).to.eq(wad.hundredfive)
    expect((await tap.query.joy()).output).to.eq(wad.five)

    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.five)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tap.query.joy()).output).to.eq(wad.five)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    expect((await tub.query.din()).output).to.eq(wad.hundredfive)
    expect((await tap.query.joy()).output).to.eq(wad.ten)

    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.five)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tap.query.joy()).output).to.eq(wad.ten)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    expect((await tub.query.din()).output).to.eq(wad.hundredfive)
    expect((await tap.query.joy()).output).to.eq(wad.fifteen)
  })

  it('Test Tax Draw', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)

    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.hundred)
    expect((await tub.query.tab(cup)).output).to.eq(wad.twohundredfive)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.tab(cup)).output).to.eq('215250000000000000000')
  })

  it('Test Tax Wipe', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)

    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.fifty)
    expect((await tub.query.tab(cup)).output).to.eq(wad.fiftyfive)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.tab(cup)).output).to.eq('57750000000000000000')
  })

  it('Test Tax Boom', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)

    await fromSigner(tub.contract, alice.address).tx.join(wad.point5)
    expect((await skr.query.totalSupply()).output).to.eq('100500000000000000000')
    expect((await sai.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await sin.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    await tub.tx.drip()
    expect((await sai.query.balanceOf(tap.contract.address)).output).to.eq(wad.five)

    await fromSigner(tap.contract, alice.address).tx.boom(wad.point5)
    expect((await skr.query.totalSupply()).output).to.eq(wad.hundred)
    expect((await sai.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await sin.query.balanceOf(tap.contract.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.hundredfive)
  })

  it('Test Tax Safe', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    await pip.tx.set(wad.one)
    expect((await tub.query.safe(cup)).output).to.eq(true)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.safe(cup)).output).to.eq(false)
  })

  it('Test Tax Bite', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    await pip.tx.set(wad.one)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.tab(cup)).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(wad.hundredfive)
  })

  it('Test Tax Bite Rounding', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    await pip.tx.set(wad.one)
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.onepoint5)
    await fromSigner(mom.contract, alice.address).tx.setAxe(ray.onepoint4)
    await fromSigner(mom.contract, alice.address).tx.setTax('1000000001547126000000000000')
    await vox.tx.warp('510')
    await tub.tx.warp('510')
    await top.tx.warp('510')
    let tax = (await tub.query.getTax()).output
    let debt = (await tub.query.Rmul(wad.hundred, (await tub.query.Rpow(tax, '510')).output)).output
    expect((await tub.query.tab(cup)).output).to.eq(debt)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.tab(cup)).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(debt)
  })
  it('Test Tax Bail', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    await pip.tx.set(wad.ten)
    await fromSigner(top.contract, alice.address).tx.cage()
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()


    expect((await skr.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    let ink = (await tub.query.ink(cup)).output
    await fromSigner(tub.contract, alice.address).tx.free(cup, ink)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq('89500000000000000000')
    expect((await skr.query.balanceOf(tub.contract.address)).output).to.eq('0')

    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.thousand)
    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await gem.query.balanceOf(alice.address)).output).to.eq('1010000000000000000000')
  })

  it('Test Tax Cage', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await taxSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await pip.tx.set(wad.ten)
    expect((await tap.query.joy()).output).to.eq('0')
    await fromSigner(top.contract, alice.address).tx.cage()
    expect((await tap.query.joy()).output).to.eq(wad.five)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    expect((await tap.query.joy()).output).to.eq(wad.five)

    let owe = (await tub.query.tab(cup)).output
    expect(owe).to.eq(wad.hundredfive)
    expect((await tub.query.din()).output).to.eq(owe)
    expect((await tap.query.woe()).output).to.eq('0')

    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.din()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(owe)
    expect((await tap.query.joy()).output).to.eq(wad.five)
  })

  it('Test Way Par', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()

    await fromSigner(mom.contract, alice.address).tx.setWay('999999406327787478619865402')
    expect((await vox.query.getPar()).output).to.eq(ray.one)

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    let par = (await tub.query.Wdiv(((await vox.query.getPar()).output), ray.one)).output
    expect(par).to.eq(wad.point95)
  })

  it('Test Way Decreasing Principal', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await waySetup()

    await pip.tx.set('980000000000000000')
    expect((await tub.query.safe(cup)).output).to.eq(false)
    await fromSigner(mom.contract, alice.address).tx.setWay('999999406327787478619865402')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.safe(cup)).output).to.eq(true)
  })

  it('Test Way Cage', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await waySetup()

    await fromSigner(mom.contract, alice.address).tx.setWay('1000000021979553151239153027')
    await vox.tx.warp(time.year)
    await tub.tx.warp(time.year)
    await top.tx.warp(time.year)
    await fromSigner(top.contract, alice.address).tx.cage()

    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.thousand)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    expect((await sai.query.balanceOf(tap.contract.address)).output).to.eq('0')
    let sai_balance = (await sai.query.balanceOf(alice.address)).output
    await fromSigner(tap.contract, alice.address).tx.cash(sai_balance)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq('1020000000000000000000')
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('0')
    expect((await sai.query.balanceOf(tap.contract.address)).output).to.eq('0')
  })

  it('Test Way Bust', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await waySetup()

    await pip.tx.set(wad.point5)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tap.query.joy()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(wad.hundred)
    expect((await tap.query.fog()).output).to.eq(wad.hundred)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.hundred)

    await fromSigner(tap.contract, alice.address).tx.bust(wad.fifty)
    expect((await tap.query.fog()).output).to.eq(wad.fifty)
    expect((await tap.query.woe()).output).to.eq(wad.seventyfive)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.seventyfive)

    await fromSigner(mom.contract, alice.address).tx.setWay('999999978020447331861593082')
    await vox.tx.warp(time.year)
    await tub.tx.warp(time.year)
    await top.tx.warp(time.year)
    let par = (await tub.query.Wdiv(((await vox.query.getPar()).output), ray.one)).output
    expect(par).to.eq(wad.point5)

    await fromSigner(tap.contract, alice.address).tx.bust(wad.fifty)
    expect((await tap.query.fog()).output).to.eq('0')
    expect((await tap.query.woe()).output).to.eq(wad.twentyfive)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.twentyfive)
  })

  it('Test Gap Sai Tap Bid', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()

    await pip.tx.set(wad.one)
    await fromSigner(mom.contract, alice.address).tx.setTapGap(wad.onepoint01)
    expect((await tap.query.bid(wad.one)).output).to.eq('990000000000000000')
    await pip.tx.set(wad.two)
    expect((await tap.query.bid(wad.one)).output).to.eq('1980000000000000000')
  })

  it('Test Gap Sai Tap Ask', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()

    await pip.tx.set(wad.one)
    await fromSigner(mom.contract, alice.address).tx.setTapGap(wad.onepoint01)
    expect((await tap.query.ask(wad.one)).output).to.eq(wad.onepoint01)
    await pip.tx.set(wad.two)
    expect((await tap.query.ask(wad.one)).output).to.eq('2020000000000000000')
  })

  it('Test Gap Boom', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()

    await fromSigner(sai.contract, alice.address).tx.transfer(tap.contract.address, wad.hundredninetyeight, '')
    expect((await tap.query.joy()).output).to.eq(wad.hundredninetyeight)
    await fromSigner(mom.contract, alice.address).tx.setTapGap(wad.onepoint01)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.threehundredtwo)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fivehundred)
    await fromSigner(tap.contract, alice.address).tx.boom(wad.fifty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.fourhundredone)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fourhundredfifty)
  })

  it('Test Gap Bust', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()

    await fromSigner(skr.contract, alice.address).tx.transfer(tap.contract.address, wad.hundred, '')
    await fromSigner(sin.contract, alice.address).tx.transfer(tap.contract.address, wad.twohundred, '')
    expect((await tap.query.fog()).output).to.eq(wad.hundred)
    expect((await tap.query.woe()).output).to.eq(wad.twohundred)
    await fromSigner(mom.contract, alice.address).tx.setTapGap(wad.onepoint01)

    expect((await sai.query.balanceOf(alice.address)).output).to.eq(wad.fivehundred)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fourhundred)
    await fromSigner(tap.contract, alice.address).tx.bust(wad.fifty)
    expect((await sai.query.balanceOf(alice.address)).output).to.eq('399000000000000000000')
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fourhundredfifty)
  })

  it('Test Gap Limit', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()
    await fromSigner(mom.contract, alice.address).tx.setTapGap(wad.onepoint04)
    //SHOULD FAIL
    //await fromSigner(mom.contract, alice.address).tx.setTapGap(wad.onepoint06)
  })

  it('Test Gap Jar Bid Ask', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()

    expect((await tub.query.per()).output).to.eq(ray.one)
    expect((await tub.query.bid(wad.one)).output).to.eq(wad.one)
    expect((await tub.query.ask(wad.one)).output).to.eq(wad.one)

    await fromSigner(mom.contract, alice.address).tx.setTubGap(wad.onepoint01)
    expect((await tub.query.bid(wad.one)).output).to.eq('990000000000000000')
    expect((await tub.query.ask(wad.one)).output).to.eq(wad.onepoint01)

    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fivehundred)
    expect((await skr.query.totalSupply()).output).to.eq(wad.fivehundred)
    await skr.tx.grantRole(2788977878, alice.address)
    await fromSigner(skr.contract, alice.address).tx.burn(alice.address, wad.twohundredfifty)

    expect((await tub.query.per()).output).to.eq(ray.two)
    expect((await tub.query.bid(wad.one)).output).to.eq('1980000000000000000')
    expect((await tub.query.ask(wad.one)).output).to.eq('2020000000000000000')
  })

  it('Test Gap Join', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()

    await gem.tx.mint(alice.address, wad.hundred)

    await fromSigner(mom.contract, alice.address).tx.setTubGap(wad.onepoint05)

    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fivehundred)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.twohundred)
    await fromSigner(tub.contract, alice.address).tx.join(wad.hundred)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.sixhundred)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
  })

  it('Test Gap Exit', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()

    await gem.tx.mint(alice.address, wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.join(wad.hundred)

    await fromSigner(mom.contract, alice.address).tx.setTubGap(wad.onepoint05)

    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.sixhundred)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.exit(wad.hundred)
    expect((await skr.query.balanceOf(alice.address)).output).to.eq(wad.fivehundred)
    expect((await gem.query.balanceOf(alice.address)).output).to.eq('195000000000000000000')
  })

  it('Test Gap Exit', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await gapSetup()
    expect((await tub.query.getFee()).output).to.eq(ray.one)
    await fromSigner(mom.contract, alice.address).tx.setFee('1000000001000000000000000000')
    expect((await tub.query.getFee()).output).to.eq('1000000001000000000000000000')
  })

  it('Test Set Fee', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice } = await setup()
    expect((await tub.query.getFee()).output).to.eq(ray.one)
    await fromSigner(mom.contract, alice.address).tx.setFee('1000000001000000000000000000')
    expect((await tub.query.getFee()).output).to.eq('1000000001000000000000000000')
  })

  it('Test Fee Setup', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()
    expect((await tub.query.getRhi()).output).to.eq(ray.one)
    expect((await tub.query.getChi()).output).to.eq(ray.one)
  })

  it('Test Fee Drip', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    expect((await tub.query.chiNoUpdate()).output).to.eq(ray.one)
    // get 1050000000000000000000016038 instead of 1050000000000000000000000000
    //but we are interested in the first 18 digits only
    //expect((await tub.query.rhiNoUpdate()).output).to.eq('1050000000000000000000000000')
  })

  it('Test Fee Ice', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.rap(cup)).output).to.eq('0')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.rap(cup)).output).to.eq(wad.five)
  })

  it('Test Fee Draw', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.rap(cup)).output).to.eq(wad.five)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.hundred)
    expect((await tub.query.rap(cup)).output).to.eq(wad.five)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.rap(cup)).output).to.eq('15250000000000000000')
  })

  it('Test Fee Wipe', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.rap(cup)).output).to.eq(wad.five)
    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.fifty)
    expect((await tub.query.rap(cup)).output).to.eq(wad.twopoint5)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.rap(cup)).output).to.eq('5125000000000000000')
  })

  it('Test Fee Calc From Rap', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.rap(cup)).output).to.eq('0')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.rap(cup)).output).to.eq(wad.five)
  })

  it('Test Fee Wipe Pays', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.rap(cup)).output).to.eq(wad.five)
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.fifty)
    expect((await tub.query.tab(cup)).output).to.eq(wad.fifty)
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
  })

  it('Test Fee Wipe Moves', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await gov.query.balanceOf(pit.contract.address)).output).to.eq('0')
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.fifty)
    expect((await gov.query.balanceOf(pit.contract.address)).output).to.eq(wad.five)
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.ninetyfive)
  })

  it('Test Fee Wipe All', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    let tab = (await tub.query.tab(cup)).output
    let owe = (await tub.query.rap(cup)).output
    expect(tab).to.eq(wad.hundred)
    expect(owe).to.eq(wad.five)
    let art = (await tub.query.art(cup)).output
    let ire = (await tub.query.ire(cup)).output
    expect(art).to.eq(wad.hundred)
    expect(ire).to.eq(wad.hundred)

    await tub.tx.drip()
    expect((await tub.query.Rdiv(tab, ((await tub.query.chiNoUpdate()).output))).output).to.eq(art)
    expect((await tub.query.Rdiv(wad.hundredfive, ((await tub.query.rhiNoUpdate()).output))).output).to.eq(ire)

    expect((await tub.query.rap(cup)).output).to.eq(wad.five)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.hundred)
    expect((await tub.query.rap(cup)).output).to.eq('0')
    expect((await tub.query.tab(cup)).output).to.eq('0')
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.ninety)
  })

  it('Test Fee Wipe No Feed', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await pep.tx.set('0')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.rap(cup)).output).to.eq(wad.five)
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.fifty)
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.hundred)

    expect((await tub.query.rap(cup)).output).to.eq(wad.twopoint5)
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.rap(cup)).output).to.eq('5125000000000000000')
  })

  it('Test Fee Wipe Shut', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await expect(fromSigner(tub.contract, alice.address).tx.shut(cup)).to.eventually.be.fulfilled
  })

  it('Test Fee Wipe Shut Empty', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup()

    await fromSigner(tub.contract, alice.address).tx.open()
    let mug = 2
    await fromSigner(tub.contract, alice.address).tx.join(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.lock(mug, wad.hundred)

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await expect(fromSigner(tub.contract, alice.address).tx.shut(mug)).to.eventually.be.fulfilled
  })


  it('Test Fee Tax Drip', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup2()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    // get 1050000000000000000000016038 instead of 1050000000000000000000000000
    //but we are interested in the first 18 digits only
    //expect((await tub.query.chiNoUpdate()).output).to.eq(ray.onepoint05)

    // get 1102500000000000000000033680 instead of 1102500000000000000000000000
    //but we are interested in the first 18 digits only
    //expect((await tub.query.rhiNoUpdate()).output).to.eq('1102500000000000000000000000')
  })

  it('Test Fee Tax Ice', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup2()

    expect((await tub.query.din()).output).to.eq(wad.hundred)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.rap(cup)).output).to.eq('0')
    expect((await tap.query.joy()).output).to.eq('0')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    await tub.tx.drip()
    expect((await tub.query.din()).output).to.eq(wad.hundredfive)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    expect((await tub.query.rap(cup)).output).to.eq(wad.fivepoint25)
    expect((await tap.query.joy()).output).to.eq(wad.five)
  })

  it('Test Fee Tax Draw', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup2()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    await fromSigner(tub.contract, alice.address).tx.draw(cup, wad.hundred)
    expect((await tub.query.tab(cup)).output).to.eq(wad.twohundredfive)
  })

  it('Test Fee Tax Calc From Rap', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup2()

    expect((await tub.query.tab(cup)).output).to.eq(wad.hundred)
    expect((await tub.query.rap(cup)).output).to.eq('0')
    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    expect((await tub.query.tab(cup)).output).to.eq(wad.hundredfive)
    expect((await tub.query.rap(cup)).output).to.eq(wad.fivepoint25)
  })

  it('Test Fee Tax Wipe All', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await feeSetup2()

    await vox.tx.warp(time.day)
    await tub.tx.warp(time.day)
    await top.tx.warp(time.day)
    let tab = (await tub.query.tab(cup)).output
    let owe = (await tub.query.rap(cup)).output
    expect(tab).to.eq(wad.hundredfive)
    expect(owe).to.eq(wad.fivepoint25)
    let art = (await tub.query.art(cup)).output
    let ire = (await tub.query.ire(cup)).output
    expect(art).to.eq(wad.hundred)
    expect(ire).to.eq(wad.hundred)

    await tub.tx.drip()
    expect((await tub.query.Rdiv(tab, ((await tub.query.chiNoUpdate()).output))).output).to.eq(art)
    expect((await tub.query.Rdiv(wad.hundredtenpoint25, ((await tub.query.rhiNoUpdate()).output))).output).to.eq(ire)

    await sai.tx.grantRole(2788977878, alice.address)//tub or tap role
    await fromSigner(sai.contract, alice.address).tx.mint(alice.address, wad.five)

    expect((await tub.query.rap(cup)).output).to.eq(wad.fivepoint25)
    expect((await gov.query.balanceOf(alice.address)).output).to.eq(wad.hundred)
    await fromSigner(tub.contract, alice.address).tx.wipe(cup, wad.hundredfive)
    expect((await tub.query.rap(cup)).output).to.eq('0')
    expect((await gov.query.balanceOf(alice.address)).output).to.eq('89500000000000000000')
  })

  it('Test Axe Bite 1', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await axeSetup()

    await fromSigner(mom.contract, alice.address).tx.setAxe(ray.onepoint5)
    await fromSigner(mom.contract, alice.address).tx.setMat(ray.twopoint1)

    expect((await tub.query.ink(cup)).output).to.eq(wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.ink(cup)).output).to.eq(wad.five)
  })

  it('Test Axe Bite 2', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await axeSetup()

    await fromSigner(mom.contract, alice.address).tx.setAxe(ray.onepoint5)
    await pip.tx.set(wad.point8)

    expect((await tub.query.ink(cup)).output).to.eq(wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.ink(cup)).output).to.eq(wad.onepoint25)
  })

  it('Test Axe Bite Parity', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await axeSetup()

    await fromSigner(mom.contract, alice.address).tx.setAxe(ray.onepoint5)
    await pip.tx.set(wad.point5)

    expect((await tub.query.ink(cup)).output).to.eq(wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.ink(cup)).output).to.eq('0')
  })

  it('Test Axe Bite Under', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await axeSetup()

    await fromSigner(mom.contract, alice.address).tx.setAxe(ray.onepoint5)
    await pip.tx.set(wad.point4)

    expect((await tub.query.ink(cup)).output).to.eq(wad.twenty)
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    expect((await tub.query.ink(cup)).output).to.eq('0')
  })

  it('Test Zero Axe Cage', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await axeSetup()

    await fromSigner(mom.contract, alice.address).tx.setAxe(ray.one)

    expect((await tub.query.ink(cup)).output).to.eq(wad.twenty)
    await fromSigner(top.contract, alice.address).tx.cage()
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    expect((await tub.query.ink(cup)).output).to.eq(wad.ten)
  })

  it('Test Axe Cage', async () => {

    const { sai, sin, skr, gem, gov, pip, pep, vox, pit, tub, tap, top, mom, alice, cup } = await axeSetup()

    await fromSigner(mom.contract, alice.address).tx.setAxe(ray.onepoint5)

    expect((await tub.query.ink(cup)).output).to.eq(wad.twenty)
    await fromSigner(top.contract, alice.address).tx.cage()
    await fromSigner(tub.contract, alice.address).tx.bite(cup)
    await fromSigner(tap.contract, alice.address).tx.vent()
    await fromSigner(top.contract, alice.address).tx.flow()
    expect((await tub.query.ink(cup)).output).to.eq(wad.ten)
  })

})

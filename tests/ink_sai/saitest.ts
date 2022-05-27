import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
import { wad, ray, time } from '../constants'
import { setup } from '../helpers'
describe('SAI Basic', () => {

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
})

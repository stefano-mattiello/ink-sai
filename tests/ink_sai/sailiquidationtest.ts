import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
import { wad, ray, time } from '../constants'
import { setup } from '../helpers'
describe('SAI Liquidation', () => {

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
})

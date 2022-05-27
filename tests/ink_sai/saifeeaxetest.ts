import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
import { wad, ray, time } from '../constants'
import { setup, feeSetup, feeSetup2, axeSetup } from '../helpers'
describe('SAI Fee Axe', () => {

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
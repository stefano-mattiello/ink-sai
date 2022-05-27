import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
import { wad, ray, time } from '../constants'
import { taxSetup } from '../helpers'
describe('SAI Tax', () => {

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
})
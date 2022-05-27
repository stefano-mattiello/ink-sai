import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
import { wad, ray, time } from '../constants'
import { setup, waySetup, gapSetup } from '../helpers'
describe('SAI Way Gap', () => {
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
})

import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
import { wad, ray, time } from '../constants'
import { setup } from '../helpers'
describe('SAI Tap', () => {

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
})
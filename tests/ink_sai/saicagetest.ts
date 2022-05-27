import { artifacts, network, patract } from 'redspot'
const { api, getSigners, getAddresses } = network
import { expect, setupContract, fromSigner } from '../helpers'
import BN from 'bn.js'
import { wad, ray, time } from '../constants'
import { setup, cageSetup } from '../helpers'
describe('SAI Cage', () => {

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

    it('Test Three Cups SKR Zero Value', async () => {

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
})

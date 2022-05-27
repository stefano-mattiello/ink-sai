import BN from 'bn.js'
import Contract from '@redspot/patract/contract'
import { artifacts, network, patract } from 'redspot'
import { expect } from './setup/chai'
import { KeyringPair } from '@polkadot/keyring/types'
import { buildTx } from '@redspot/patract/buildTx'
import { Keyring } from '@polkadot/keyring'
import { TransactionParams, TransactionResponse } from "@redspot/patract/types";
import { wad, ray, time } from './constants'

const { getContractFactory, getRandomSigner } = patract
const { api, getSigners, getAddresses } = network


export { expect } from './setup/chai'

const patchContractMethods = (contract: Contract): Contract => {
  patchMethods(contract.query)
  patchMethods(contract.tx)

  for (const prop in contract.tx) {
    const original_tx = contract.tx[prop];
    contract.tx[prop] = async function (...args: TransactionParams): Promise<TransactionResponse> {
      return new Promise<TransactionResponse>(((resolve, reject) => {
        contract.query[prop](...args).then((_ => {
          // TODO: Check output of RPC call when Redspot will process it correct
          resolve(original_tx(...args))
        })).catch((reason => reject(reason)))
      }))
    };
  }

  return contract
}

// It removes prefix from the function and adds only name of method like a function
// PSP22::token_name
// query["PSP22,tokenName"]
// query.tokenName()
const patchMethods = (object) => {
  for (const prop in object) {
    if (prop.includes('::')) {
      const selectors = prop.split('::')
      const method = selectors[selectors.length - 1]
      object[method] = object[prop]
    }
  }
}

export const setupProxy = (contract, proxy): Contract => {
  const proxied_contract = new Contract(proxy.address, contract.abi, contract.api, proxy.signer);
  return patchContractMethods(proxied_contract);
}


export const setupContract = async (name, constructor, ...args) => {
  const one = new BN(10).pow(new BN(api.registry.chainDecimals[0]))
  const signers = await getSigners()
  const defaultSigner = await getRandomSigner(signers[0], one.muln(10))
  const alice = await getRandomSigner(signers[1], one.muln(10))

  const contractFactory = await getContractFactory(name, defaultSigner)
  const contract = await contractFactory.deploy(constructor, ...args)
  const abi = artifacts.readArtifact(name)
  patchContractMethods(contract)

  return {
    defaultSigner,
    alice,
    accounts: [alice, await getRandomSigner(), await getRandomSigner()],
    contractFactory,
    contract,
    abi,
    one,
    query: contract.query,
    tx: contract.tx
  }
}

export const addPairWithAmount = async (pair: KeyringPair): Promise<KeyringPair> => {
  const one = new BN(10).pow(new BN(api.registry.chainDecimals[0]))
  const redspotPair = network.addPair(pair)
  await buildTx(api.registry, api.tx.balances.transfer(redspotPair.address, one.muln(10000)), (await getAddresses())[0])
  return redspotPair
}

export const getSigner = async (account: string) => {
  const signer = await addPairWithAmount(new Keyring().addFromUri(`//${account}`))
  return signer
}

export const fromSigner = (contract: Contract, address: string): Contract => {
  return patchContractMethods(contract.connect(address))
}

export const bnArg = (value: number | string | number[] | Uint8Array | Buffer | BN, len = 32) => {
  return new BN(value, undefined, 'le').toArray('le', len)
}

export const oneDay = () => (24 * 60 * 60 * 1000)

export async function setup() {
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

export async function taxSetup() {

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

export async function cageSetup() {

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

export async function waySetup() {

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

export async function gapSetup() {

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

export async function feeSetup() {

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

export async function feeSetup2() {

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

export async function axeSetup() {

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
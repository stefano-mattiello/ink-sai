[![Built with ink!](https://raw.githubusercontent.com/paritytech/ink/master/.images/badge.svg)](https://github.com/paritytech/ink)
## Ink-sai

ink-sai is an implementation of the sai stablecoin in ink!, adapting the code in [here](https://github.com/makerdao/sai/tree/master/src). In this project there is a massive use of [Openbrush library](https://openbrush.io/), in particular their implementation of the PSP22 standard and various extensions and macros provided by them.

In the following section there is a short extract from the README of the original sai repository to give a general overview of the contracts. However, the structure of this project and the names of the functions are usually the same or very similar to the ones in the original repository, so see the [developer documentation](https://github.com/makerdao/sai/blob/master/DEVELOPING.md) or the original [README](https://github.com/makerdao/sai#readme) for a more detailed decription.

## Overview
<em>Note that this is an extract taken from [here](https://github.com/makerdao/sai#readme)</em>
  
```sai``` is a simple single-collateral stablecoin that is dependent on a trusted oracle address and has a kill-switch.

See the developer documentation for a more technical overview.

There are four tokens in the system:
<ul>
  
  <li> gem: externally valuable token e.g. ETH</li>
  
  <li> gov: governance token e.g. MKR</li>
  
  <li> skr: a claim to locked gems</li>
  
  <li> sai: the stablecoin, a variable claim on some quantity of gems</li>
  
</ul> 

Collateral holders deposit their collateral using ```join``` and receive ```skr``` tokens proportional to their deposit. ```skr``` can be redeemed for collateral with ```exit```. You will get more or less ```gem``` tokens for each ```skr``` depending on whether the system made a profit or loss while you were exposed.

The oracle updates the ```GEM:REF``` and ```GOV:REF``` price feeds. These are the only external real-time input to the system.

```skr``` is used as the direct backing collateral for CDPs (Collateralized Debt Positions). A prospective issuer can ```open``` an empty position, ```lock``` some ```skr``` and then ```draw``` some ```sai```. Debt is covered with ```wipe```. Collateral can be reclaimed with ```free``` as long as the CDP remains "```safe```".

If the value of the collateral backing the CDP falls below the liquidation ratio ```mat```, the CDP is vulnerable to liquidation via ```bite```. On liquidation, the CDP ```skr``` collateral is sold off to cover the ```sai``` debt.

Under-collateralized CDPs can be liquidated with ```bite```. Liquidation is immediate: backing ```skr``` is taken to cover the ```sai``` debt at the time of ```bite```, plus a liquidation fee(```axe```); any excess remains in the CDP.

```skr``` seized from bad CDPs can be purchased with ```bust```, in exchange for ```sai``` at the ```s2s``` price. This ```sai``` pays down the bad CDP debt.

Any remaining Sai surplus (```joy```) can be purchased with ```boom```, in exchange for ```skr``` at the ```s2s``` price. This ```skr``` is burned.

## Some observations
<ul>
  <li>In this project are present some contracts that are meant only for testing i.e. voxtest, tubtest, toptest, gem, gov, my_oracle and pit.
    <ul>
<li>voxtes, tubtest, toptest are equal to their normal version vox, tub and top except for some additional function to simulate the passage of time.</li>
      <li>gem and gov are PSP22 token used respectively as collateral for sai and as governance token. For the sake of simplicity  they are mintable and burnable by everyone.</li>
    <li>my_oracle is the contract use as oracle, it has two public function: set and read.</li>
    <li>pit is a token burner to "burn" gem or gov (our implementation of these token already have a burn function, but others may not have it).</li></ul>
      </li> 
  
<li>One of the main differences between the original sai project and this one concers the dad contracts.
  
  In the original sai project ```dad``` is an authority contract to whom other contracts ask permission to call specific functions. In order to simplify this mechanism we eliminate the dad contract and we use the ```access control``` library by Openbrush.
  
Therefore every contract will be instantiated with an admin (the caller) that have the power to grant and revoke roles to other addresses and we will use a modifier to restrict the access to some functions to specific roles. </li>
  
<li>In this projects (like in the original one) the token are represented as decimal number with 18 digits of precision and other parameters as decimal number with 27 digits of precision (they are respectively called wad and ray).
  
  This choice lead to some problems dealing with multiplication due to the fact that they are stored as ```u128``` variables and this often caused overflows (now to make multiplication the variables are casted to ```U256``` to make operations and then returned as ```u128```).
  
  We choose to keep it this way so that we can run the tests with the same parameters of the tests in the original repository, to make sure that this version works as expected.
  
  However in future it will be possible to use less digit of precision easily since most of (or all) the operation are defined in the ```somemath``` traits, so it will be sufficient modify that (and of course the tests and maybe some constructor).
  </li>

</ul>

## Project Structure

In the ```contracts``` directory are defined the contracts of this project. Every contracts (except for the tokens) has a trait with a default implementation in the directory ```traits``` and ```impls```.

The whole project can be seen as a more complex application of the [example project structure](https://github.com/Supercolony-net/openbrush-contracts/tree/main/example_project_structure) by Openbrush. Please refer to [their documentation](https://docs.openbrush.io/smart-contracts/example/overview) for a more detailed description.

## Compiler Warning/Error

Compiling the project the compiler will throw some warning (or error in the latest version of the compiler) like 

      warning: `#[doc(hidden)]` is ignored on trait impl items
        --> /home/stefano/repos/ink_sai_tests/ink_sai/traits/vox.rs:12:1
         |
      12 | / pub trait VoxTrait: AccessControl {
      13 | |     /// This function initalizes data of a loan and mint token inside it
      14 | |     #[ink(message)]
      15 | |     fn era(&self) -> Timestamp;
      ...  |
      38 | |     fn _prj(&self, x: u128) -> i128;
      39 | | }
         | |_^ help: remove this attribute
         |
         = warning: this was previously accepted by the compiler but is being phased out; it will become a hard error in a future release!
          = note: whether the impl item is `doc(hidden)` or not entirely depends on the corresponding trait item

This is due to the fact that ```ink! codegen``` add ```#[doc(hidden)]``` in the implementation section, however this is already an [issue](https://github.com/paritytech/ink/issues/1269) and it will be fixed soon.

In the meantime use ```rustc 1.62.0-nightly```.

Moreover the project must be compiled in release mode, so remember to add the option ```--release```.

## Run Tests

First of all run

    git clone https://github.com/stefano-mattiello/ink-sai

Most of the functions in this project require cross-contract calls, which are not yet supported in the ink! off-chain environment, so to do most of the tests we will use [Redspot](https://docs.patract.io/en/redspot/intro/installation).

The tests that do not require cross-contract calls are the unit tests for the vox contract (the Target Price Feed) and a couple of test of the tub contract (the CDP Record Engine).

To run these test go to the directory ```voxtest``` or ```tubtest``` and run 

    cargo +nightly test

To run the integration tests you will need a local [substrate-contract-node](https://github.com/paritytech/substrate-contracts-node) running on your machine.

Install npx to use Redspot

    sudo npm install -g npx
    
Run 

    yarn
    
and then 

    npx redspot compile --release
    
This will build the artifact needed by Redspot and it can take some time.
Finally, with your substrate contract node running, you can run

    npx redspot test --no-compile

Unfortunately redspot will throw a warning similar to

     WARN  Unable to find handler for subscription=author_extrinsicUpdate::9n1sDo4k8OkoypJB
     
for every interaction with the node, however the test are working fine.


## Deploy

Currently there is not a script or a contract to deploy all the structure of the project, however the setup function in ```tests/saitest.ts``` can be an example of what should be done.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]
//Testing version of the CDP record engine
//It add some function to the Tub contracts to simulate the passage of time
#[brush::contract]
pub mod tubtest {
    use brush::{contracts::access_control::*, traits::ZERO_ADDRESS};
    use ink_sai::impls::tub::*;
    use ink_sai::traits::somemath::*;
    use ink_storage::traits::SpreadAllocate;

    #[ink(storage)]
    #[derive(Default, SpreadAllocate, AccessControlStorage, TubStorage)]
    pub struct Tubtest {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[TubStorageField]
        tub: TubData,
        era: Timestamp,
    }

    impl AccessControl for Tubtest {}
    impl SomeMath for Tubtest {}
    impl TubTrait for Tubtest {
        //override era function to make tests
        #[ink(message)]
        fn era(&self) -> Timestamp {
            self._era()
        }
    }
    impl Tubtest {
        #[ink(constructor)]
        pub fn new(
            sai_address: AccountId,
            sin_address: AccountId,
            skr_address: AccountId,
            gem_address: AccountId,
            gov_address: AccountId,
            pip_address: AccountId,
            pep_address: AccountId,
            vox_address: AccountId,
            pit: AccountId,
        ) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Tubtest| {
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
                instance.tub.sai_address = sai_address;
                instance.tub.sin_address = sin_address;
                instance.tub.skr_address = skr_address;
                instance.tub.gem_address = gem_address;
                instance.tub.gov_address = gov_address;
                instance.tub.pip_address = pip_address;
                instance.tub.pep_address = pep_address;
                instance.tub.vox_address = vox_address;
                instance.tub.pit = pit;
                instance.tub.tap = ZERO_ADDRESS.into();
                instance.tub.cap = 0;
                instance.tub.axe = instance._ray();
                instance.tub.mat = instance._ray();
                instance.tub.tax = instance._ray();
                instance.tub.fee = instance._ray();
                instance.tub.gap = instance._wad();
                instance.tub.chi = instance._ray();
                instance.tub.rhi = instance._ray();
                instance.tub.rho = instance.era();
                instance.tub.off = false;
                instance.tub.out = false;
                instance.tub.fit = 0;
                instance.tub.rum = 0;
                instance.era = instance.env().block_timestamp();
            })
        }
        fn _era(&self) -> Timestamp {
            if self.era == 0 {
                self.env().block_timestamp()
            } else {
                self.era
            }
        }
        #[ink(message)]
        pub fn warp(&mut self, age: Timestamp) {
            if age == 0 {
                self.era = 0
            } else {
                let era = self.era;
                self.era = era + age;
            }
        }
        #[ink(message)]
        pub fn chi_no_update(&self) -> u128 {
            self.tub.chi
        }
        #[ink(message)]
        pub fn rhi_no_update(&self) -> u128 {
            self.tub.rhi
        }
    }

    #[cfg(test)]
    mod tubtest {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;
        /// Imports `ink_lang` so we can use `#[ink::test]`.
        use ink_lang as ink;
        pub const WAD: u128 = 1000000000000000000;
        fn instance_with_role(account: AccountId) -> Tubtest {
            let mut tubtest = Tubtest::new(
                account, account, account, account, account, account, account, account, account,
            );
            let alice = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>().alice;
            tubtest
                .grant_role(MOM, alice)
                .expect("Should grant the role");
            tubtest
        }
        //verify you can set an address for tap
        #[ink::test]
        fn turn_work() {
            let alice = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>().alice;
            let mut tubtest = instance_with_role(alice);
            assert_eq!(tubtest.turn(alice), Ok(()));
            let bob = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>().bob;
            assert_eq!(tubtest.turn(bob), Err(TubError::InvalidTurn));
        }
        //verify that someone with MOM role can modify gap parameter
        #[ink::test]
        fn mold_gap_work() {
            let alice = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>().alice;
            let mut tubtest = instance_with_role(alice);
            assert_eq!(tubtest.tub.gap, WAD);
            assert_eq!(tubtest.mold(6, 2 * WAD), Ok(()));
            assert_eq!(tubtest.tub.gap, 2 * WAD);
            let new_gap = tubtest._wmul(WAD, 10 * WAD);
            assert_eq!(tubtest.mold(6, new_gap), Ok(()));
            assert_eq!(tubtest.tub.gap, new_gap);
        }
    }
}

#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod toptest {
    use brush::contracts::access_control::*;
    use ink_sai::impls::top::*;
    use ink_sai::traits::somemath::*;
    use ink_sai::traits::tub::TubTraitRef;
    use ink_storage::traits::SpreadAllocate;

    #[ink(storage)]
    #[derive(Default, SpreadAllocate, AccessControlStorage, TopStorage)]
    pub struct Toptest {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[TopStorageField]
        top: TopData,
        era: Timestamp,
    }
    impl AccessControl for Toptest {}
    impl SomeMath for Toptest {}
    impl TopTrait for Toptest {
        #[ink(message)]
        //override era function to make tests
        fn era(&self) -> Timestamp {
            self._era()
        }
    }
    impl Toptest {
        #[ink(constructor)]
        pub fn new(tub_address: AccountId, tap_address: AccountId) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Toptest| {
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
                instance.top.tub_address = tub_address;
                instance.top.tap_address = tap_address;
                instance.top.vox_address = TubTraitRef::get_vox(&tub_address);
                instance.top.sai_address = TubTraitRef::get_sai(&tub_address);
                instance.top.sin_address = TubTraitRef::get_sin(&tub_address);
                instance.top.skr_address = TubTraitRef::get_skr(&tub_address);
                instance.top.gem_address = TubTraitRef::get_gem(&tub_address);
                instance.top.cooldown = 6 * 3600;
                instance.top.fix = 0;
                instance.top.fit = 0;
                instance.top.caged = 0;
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
    }
}

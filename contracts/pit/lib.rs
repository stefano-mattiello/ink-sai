#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]
//A contract where you can send gem and virtually burn it
#[brush::contract]
pub mod pit {
    use ink_sai::traits::pit::*;
    use ink_storage::traits::SpreadAllocate;
    #[ink(storage)]
    #[derive(Default, SpreadAllocate)]
    pub struct Pit {}
    impl PitTrait for Pit {
        #[ink(message)]
        fn burn(&self, _gem_address: AccountId) {}
    }
    impl Pit {
        #[ink(constructor)]
        pub fn new() -> Self {
            ink_lang::codegen::initialize_contract(|_instance: &mut Pit| {})
        }
    }
}

#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

/// This contract will be used to represent the shares of a user
/// and other instance of this contract will be used to represent
/// the amount of borrowed tokens
#[brush::contract]
pub mod pip {

    //use brush::modifiers;

    //use ink_lang::codegen::Env;
    use ink_sai::traits::oracle::*;
    use ink_storage::traits::SpreadAllocate;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate)]
    pub struct Pip {
        value: u128,
    }
    impl OracleTrait for Pip {
        #[ink(message)]
        fn read(&self) -> u128 {
            self._read()
        }
    }
    impl Pip {
        /// constructor with name and symbol
        #[ink(constructor)]
        pub fn new(val: u128) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Pip| {
                instance.value = val;
            })
        }
        #[ink(message)]
        pub fn set(&mut self, val: u128) {
            self.value = val;
        }
        fn _read(&self) -> u128 {
            self.value
        }
    }
}

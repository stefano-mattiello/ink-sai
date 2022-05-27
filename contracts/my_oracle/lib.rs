#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]
//A contracts used as oracle on the tests
//it have two function: set (to store a value) and read (return the value stored)
#[brush::contract]
pub mod pip {
    use ink_sai::traits::oracle::*;
    use ink_storage::traits::SpreadAllocate;

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

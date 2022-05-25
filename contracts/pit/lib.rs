#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]


#[brush::contract]
pub mod pit {
    

   
    use ink_storage::traits::SpreadAllocate;
    use ink_sai::traits::pit::*;
    

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate)]
    pub struct Pit {
    }
    // implement Ownable Trait for our share
    
    impl PitTrait for Pit {
    #[ink(message)]
    fn burn(&self, _gem_address: AccountId){
    }}
    impl Pit {
        /// constructor with name and symbol
        #[ink(constructor)]
        pub fn new() -> Self {
            ink_lang::codegen::initialize_contract(|_instance: &mut Pit| {
            })
        }
    }
}

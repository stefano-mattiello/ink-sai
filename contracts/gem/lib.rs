#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod gem {
    use brush::contracts::psp22::extensions::{burnable::*, metadata::*, mintable::*};


    use ink_prelude::string::String;
    use ink_storage::traits::SpreadAllocate;

 
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, PSP22Storage, PSP22MetadataStorage)]
    pub struct Gem {
        #[PSP22StorageField]
        psp22: PSP22Data,
        #[PSP22MetadataStorageField]
        metadata: PSP22MetadataData,
    }

    // implement PSP22 Trait for our gem
    impl PSP22 for Gem {}

    // implement Metadata Trait for our gem
    impl PSP22Metadata for Gem {
    }

    // implement Burnable Trait for our gem
    impl PSP22Burnable for Gem {}

    // implement Mintable Trait for our gem
    impl PSP22Mintable for Gem {
        #[ink(message)]
        fn mint(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._mint(account, amount)
        }
    }

    impl Gem {
        /// constructor with name and symbol
        #[ink(constructor)]
        pub fn new(name: Option<String>, symbol: Option<String>) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Gem| {
                instance.metadata.name = name;
                instance.metadata.symbol = symbol;
                instance.metadata.decimals = 18;
            })
        }
    }
}

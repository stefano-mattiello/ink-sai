#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod gov {
    use brush::contracts::psp22::extensions::{burnable::*, metadata::*, mintable::*};

    //use ink_lang::codegen::Env;

    use ink_prelude::string::String;
    use ink_storage::traits::SpreadAllocate;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, PSP22Storage, PSP22MetadataStorage)]
    pub struct Gov {
        #[PSP22StorageField]
        psp22: PSP22Data,
        #[PSP22MetadataStorageField]
        metadata: PSP22MetadataData,
    }

    // implement PSP22 Trait for our share
    impl PSP22 for Gov {}

    // implement Ownable Trait for our share

    // implement Metadata Trait for our share
    impl PSP22Metadata for Gov {}

    impl PSP22Burnable for Gov {}

    impl PSP22Mintable for Gov {
        #[ink(message)]
        fn mint(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._mint(account, amount)
        }
    }

    impl Gov {
        /// constructor with name and symbol
        #[ink(constructor)]
        pub fn new(name: Option<String>, symbol: Option<String>) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Gov| {
                instance.metadata.name = name;
                instance.metadata.symbol = symbol;
                instance.metadata.decimals = 18;
            })
        }
    }
}
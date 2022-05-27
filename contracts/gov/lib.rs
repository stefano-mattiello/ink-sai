#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]
//governance token fot the sai stablecoin
#[brush::contract]
pub mod gov {
    use brush::contracts::psp22::extensions::{burnable::*, metadata::*, mintable::*};

    use ink_prelude::string::String;
    use ink_storage::traits::SpreadAllocate;

    #[ink(storage)]
    #[derive(Default, SpreadAllocate, PSP22Storage, PSP22MetadataStorage)]
    pub struct Gov {
        #[PSP22StorageField]
        psp22: PSP22Data,
        #[PSP22MetadataStorageField]
        metadata: PSP22MetadataData,
    }

    // implement PSP22 Trait for gov
    impl PSP22 for Gov {}

    // implement Metadata Trait for gov
    impl PSP22Metadata for Gov {}

    // implement Burnable Trait for gov
    impl PSP22Burnable for Gov {}

    // implement Mintable Trait for gov
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

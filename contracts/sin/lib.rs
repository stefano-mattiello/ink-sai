#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

/// This contract will be used to represent the shares of a user
/// and other instance of this contract will be used to represent
/// the amount of borrowed tokens
#[brush::contract]
pub mod sin {
    use brush::contracts::{
        access_control::*,
        psp22::extensions::{burnable::*, metadata::*, mintable::*},
    };

    use brush::modifiers;

    //use ink_lang::codegen::Env;

    use ink_prelude::string::String;
    use ink_storage::traits::SpreadAllocate;

    use ink_sai::traits::token::*;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, PSP22Storage, AccessControlStorage, PSP22MetadataStorage)]
    pub struct Sin {
        #[PSP22StorageField]
        psp22: PSP22Data,
        #[AccessControlStorageField]
        access: AccessControlData,
        #[PSP22MetadataStorageField]
        metadata: PSP22MetadataData,
    }
    const TAP: RoleType = ink_lang::selector_id!("TAP");
    const TUB: RoleType = ink_lang::selector_id!("TUB");
    // implement PSP22 Trait for our share
    impl PSP22 for Sin {}

    // implement Ownable Trait for our share
    impl AccessControl for Sin {}

    // implement Metadata Trait for our share
    impl PSP22Metadata for Sin {}

    impl PSP22Burnable for Sin {
        #[ink(message)]
        #[modifiers(only_role(TAP))]
        fn burn(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._burn_from(account, amount)
        }
    }

    impl PSP22Mintable for Sin {
        #[ink(message)]
        #[modifiers(only_role(TUB))]
        fn mint(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._mint(account, amount)
        }
    }
    // It forces the compiler to check that you implemented all super traits
    impl Token for Sin {}

    impl Sin {
        /// constructor with name and symbol
        #[ink(constructor)]
        pub fn new(name: Option<String>, symbol: Option<String>) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Sin| {
                instance.metadata.name = name;
                instance.metadata.symbol = symbol;
                instance.metadata.decimals = 18;
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
            })
        }
    }
}

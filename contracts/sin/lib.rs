#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod sin {
    use brush::contracts::{
        access_control::*,
        psp22::extensions::{burnable::*, metadata::*, mintable::*},
    };
    use brush::modifiers;
    use ink_prelude::string::String;
    use ink_storage::traits::SpreadAllocate;

    use ink_sai::traits::token::*;

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
    //define roles to restrict access to mint and burn function
    const TAP: RoleType = ink_lang::selector_id!("TAP");
    const TUB: RoleType = ink_lang::selector_id!("TUB");
    impl PSP22 for Sin {}

    impl AccessControl for Sin {}

    impl PSP22Metadata for Sin {}

    impl PSP22Burnable for Sin {
        //add a access control modifier to the burn function
        #[ink(message)]
        #[modifiers(only_role(TAP))]
        fn burn(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._burn_from(account, amount)
        }
    }

    impl PSP22Mintable for Sin {
        //add a access control modifier to the mint function
        #[ink(message)]
        #[modifiers(only_role(TUB))]
        fn mint(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._mint(account, amount)
        }
    }
    // It forces the compiler to check that you implemented all super traits
    impl Token for Sin {}

    impl Sin {
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

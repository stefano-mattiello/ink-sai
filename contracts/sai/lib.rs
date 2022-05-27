#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod sai {
    use brush::contracts::{
        access_control::*,
        psp22::extensions::{burnable::*, metadata::*, mintable::*},
    };

    use brush::modifiers;
    use ink_prelude::string::String;
    use ink_sai::traits::token::*;
    use ink_storage::traits::SpreadAllocate;

    #[ink(storage)]
    #[derive(Default, SpreadAllocate, PSP22Storage, AccessControlStorage, PSP22MetadataStorage)]
    pub struct Sai {
        #[PSP22StorageField]
        psp22: PSP22Data,
        #[AccessControlStorageField]
        access: AccessControlData,
        #[PSP22MetadataStorageField]
        metadata: PSP22MetadataData,
    }
    const TUB_OR_TAP: RoleType = ink_lang::selector_id!("TUB_OR_TAP");

    impl PSP22 for Sai {}

    impl AccessControl for Sai {}

    impl PSP22Metadata for Sai {}

    impl PSP22Burnable for Sai {
        #[ink(message)]
        #[modifiers(only_role(TUB_OR_TAP))]
        fn burn(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._burn_from(account, amount)
        }
    }

    impl PSP22Mintable for Sai {
        #[ink(message)]
        #[modifiers(only_role(TUB_OR_TAP))]
        fn mint(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._mint(account, amount)
        }
    }
    // It forces the compiler to check that you implemented all super traits
    impl Token for Sai {}

    impl Sai {
        #[ink(constructor)]
        pub fn new(name: Option<String>, symbol: Option<String>) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Sai| {
                instance.metadata.name = name;
                instance.metadata.symbol = symbol;
                instance.metadata.decimals = 18;
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
            })
        }
    }
}

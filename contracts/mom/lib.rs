#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

/// This contract will be used to represent the shares of a user
/// and other instance of this contract will be used to represent
/// the amount of borrowed tokens
#[brush::contract]
pub mod mom {
    use brush::contracts::access_control::*;

    //use brush::modifiers;

    //use ink_lang::codegen::Env;
    use ink_sai::impls::mom::*;
    use ink_sai::traits::somemath::*;
    use ink_storage::traits::SpreadAllocate;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, AccessControlStorage, MomStorage)]
    pub struct Mom {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[MomStorageField]
        mom: MomData,
    }
    // implement Ownable Trait for our share
    impl AccessControl for Mom {}
    impl SomeMath for Mom {}
    impl MomTrait for Mom {}
    impl Mom {
        
        #[ink(constructor)]
        pub fn new(tub_address: AccountId, tap_address: AccountId, vox_address: AccountId) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Mom| {
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
                instance.mom.tub_address = tub_address;
                instance.mom.tap_address = tap_address;
                instance.mom.vox_address = vox_address;
            })
        }
    }
}

#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

/// This contract will be used to represent the shares of a user
/// and other instance of this contract will be used to represent
/// the amount of borrowed tokens
#[brush::contract]
pub mod tap {
    use brush::contracts::{access_control::*, pausable::*};

    //use brush::modifiers;
    use ink_sai::traits::tub::TubTraitRef;
    //use ink_lang::codegen::Env;
    use ink_sai::impls::tap::*;
    use ink_sai::traits::somemath::*;
    use ink_storage::traits::SpreadAllocate;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, AccessControlStorage, TapStorage, PausableStorage)]
    pub struct Tap {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[PausableStorageField]
        pausable: PausableData,
        #[TapStorageField]
        tap: TapData,
    }
    // implement Ownable Trait for our share
    impl AccessControl for Tap {}
    impl Pausable for Tap {}
    impl SomeMath for Tap {}
    impl TapTrait for Tap {}
    impl Tap {
        /// constructor with name and symbol
        #[ink(constructor)]
        pub fn new(tub_address: AccountId) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Tap| {
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
                instance.tap.tub_address = tub_address;
                instance.tap.sai_address = TubTraitRef::get_sai(&tub_address);
                instance.tap.sin_address = TubTraitRef::get_sin(&tub_address);
                instance.tap.skr_address = TubTraitRef::get_skr(&tub_address);
                instance.tap.vox_address = TubTraitRef::get_vox(&tub_address);
                instance.tap.gap = instance._wad();
                instance.tap.fix = 0;
            })
        }
    }
}

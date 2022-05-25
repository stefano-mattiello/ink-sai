#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

/// This contract will be used to represent the shares of a user
/// and other instance of this contract will be used to represent
/// the amount of borrowed tokens
#[brush::contract]
pub mod top {
    use brush::contracts::access_control::*;

    //use brush::modifiers;

    //use ink_lang::codegen::Env;
    use ink_sai::impls::top::*;
    use ink_sai::traits::somemath::*;
    use ink_sai::traits::tub::TubTraitRef;
    use ink_storage::traits::SpreadAllocate;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, AccessControlStorage, TopStorage)]
    pub struct Top {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[TopStorageField]
        top: TopData,
    }
    // implement Ownable Trait for our share
    impl AccessControl for Top {}
    impl SomeMath for Top {}
    impl TopTrait for Top {}
    impl Top {
        /// constructor with name and symbol
        #[ink(constructor)]
        pub fn new(tub_address: AccountId, tap_address: AccountId) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Top| {
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
                instance.top.tub_address = tub_address;
                instance.top.tap_address = tap_address;
                instance.top.vox_address = TubTraitRef::get_vox(&tub_address);
                instance.top.sai_address = TubTraitRef::get_sai(&tub_address);
                instance.top.sin_address = TubTraitRef::get_sin(&tub_address);
                instance.top.skr_address = TubTraitRef::get_skr(&tub_address);
                instance.top.gem_address = TubTraitRef::get_gem(&tub_address);
                instance.top.cooldown = 6 * 3600;
                instance.top.fix = 0;
                instance.top.fit = 0;
                instance.top.caged = 0;
            })
        }
    }
}

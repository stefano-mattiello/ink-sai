#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

/// This contract will be used to represent the shares of a user
/// and other instance of this contract will be used to represent
/// the amount of borrowed tokens
#[brush::contract]
pub mod tub {
    use brush::{contracts::access_control::*, traits::ZERO_ADDRESS};

    //use brush::modifiers;

    //use ink_lang::codegen::Env;
    use ink_storage::traits::SpreadAllocate;

    use ink_sai::impls::tub::*;
    use ink_sai::traits::somemath::*;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, AccessControlStorage, TubStorage)]
    pub struct Tub {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[TubStorageField]
        tub: TubData,
    }
    //const TUB_OR_TAP: RoleType = ink_lang::selector_id!("TUB_OR_TAP");
    // implement PSP22 Trait for our share

    // implement Ownable Trait for our share
    impl AccessControl for Tub {}
    impl SomeMath for Tub {}
    impl TubTrait for Tub {}
    impl Tub {
        /// constructor with name and symbol
        #[ink(constructor)]
        pub fn new(
            sai_address: AccountId,
            sin_address: AccountId,
            skr_address: AccountId,
            gem_address: AccountId,
            gov_address: AccountId,
            pip_address: AccountId,
            pep_address: AccountId,
            vox_address: AccountId,
            pit: AccountId,
        ) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Tub| {
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
                instance.tub.sai_address = sai_address;
                instance.tub.sin_address = sin_address;
                instance.tub.skr_address = skr_address;
                instance.tub.gem_address = gem_address;
                instance.tub.gov_address = gov_address;
                instance.tub.pip_address = pip_address;
                instance.tub.pep_address = pep_address;
                instance.tub.vox_address = vox_address;
                instance.tub.pit = pit;
                instance.tub.tap = ZERO_ADDRESS.into();
                instance.tub.cap = 0;
                instance.tub.axe = instance._ray();
                instance.tub.mat = instance._ray();
                instance.tub.tax = instance._ray();
                instance.tub.fee = instance._ray();
                instance.tub.gap = instance._wad();
                instance.tub.chi = instance._ray();
                instance.tub.rhi = instance._ray();
                instance.tub.rho = instance.era();
                instance.tub.off = false;
                instance.tub.out = false;
                instance.tub.fit = 0;
                instance.tub.rum = 0;
            })
        }
    }
}

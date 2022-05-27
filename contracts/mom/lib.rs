#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod mom {
    use brush::contracts::access_control::*;
    use ink_sai::impls::mom::*;
    use ink_sai::traits::somemath::*;
    use ink_storage::traits::SpreadAllocate;

    #[ink(storage)]
    #[derive(Default, SpreadAllocate, AccessControlStorage, MomStorage)]
    pub struct Mom {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[MomStorageField]
        mom: MomData,
    }
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

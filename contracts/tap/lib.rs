#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]
#[brush::contract]
pub mod tap {
    use brush::contracts::{access_control::*, pausable::*};
    use ink_sai::impls::tap::*;
    use ink_sai::traits::somemath::*;
    use ink_sai::traits::tub::TubTraitRef;
    use ink_storage::traits::SpreadAllocate;

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

    impl AccessControl for Tap {}
    impl Pausable for Tap {}
    impl SomeMath for Tap {}
    impl TapTrait for Tap {}
    impl Tap {
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

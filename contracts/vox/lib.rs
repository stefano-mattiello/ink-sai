#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

/// This contract will be used to represent the shares of a user
/// and other instance of this contract will be used to represent
/// the amount of borrowed tokens
#[brush::contract]
pub mod vox {
    use brush::contracts::access_control::*;

    //use ink_lang::codegen::Env;
    use ink_sai::impls::vox::*;
    use ink_sai::traits::somemath::*;
    use ink_storage::traits::SpreadAllocate;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, VoxStorage, AccessControlStorage)]
    pub struct Vox {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[VoxStorageField]
        vox: VoxData,
    }

    impl AccessControl for Vox {}
    impl SomeMath for Vox {}
    impl VoxTrait for Vox {}
    impl Vox {
        #[ink(constructor)]
        pub fn new(par: u128) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut Vox| {
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
                instance.vox.par = par;
                instance.vox.fix = par;
                instance.vox.way = instance._ray();
                instance.vox.tau = instance.era();
                instance.vox.how = 0;
            })
        }
    }
}

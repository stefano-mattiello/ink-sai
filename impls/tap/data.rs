pub use crate::traits::tap::*;
use brush::{declare_storage_trait, traits::AccountId};
use ink_storage::traits::{SpreadAllocate, SpreadLayout};
// it is public because when you will import the trait you also will import the derive for the trait
pub use ink_sai_derive::TapStorage;

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
/// define the struct with the data that our smart contract will be using
/// this will isolate the logic of our smart contract from its storage
pub struct TapData {
    pub sai_address: AccountId,
    pub sin_address: AccountId,
    pub skr_address: AccountId,
    pub tub_address: AccountId,
    pub vox_address: AccountId,
    pub gap: u128,
    pub fix: u128,
}

declare_storage_trait!(TapStorage, TapData);

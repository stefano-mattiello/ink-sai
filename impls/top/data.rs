pub use crate::traits::top::*;
use brush::{declare_storage_trait, traits::AccountId};
use ink_storage::traits::{SpreadAllocate, SpreadLayout};
// it is public because when you will import the trait you also will import the derive for the trait
pub use ink_sai_derive::TopStorage;

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
/// define the struct with the data that our smart contract will be using
/// this will isolate the logic of our smart contract from its storage
pub struct TopData {
    pub tub_address: AccountId,
    pub tap_address: AccountId,
    pub vox_address: AccountId,
    pub sai_address: AccountId,
    pub sin_address: AccountId,
    pub skr_address: AccountId,
    pub gem_address: AccountId,
    pub fix: u128,
    pub fit: u128,
    pub caged: u64,
    pub cooldown: u64,
}

declare_storage_trait!(TopStorage, TopData);
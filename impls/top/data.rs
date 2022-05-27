pub use crate::traits::top::*;
use brush::{declare_storage_trait, traits::AccountId};
pub use ink_sai_derive::TopStorage;
use ink_storage::traits::{SpreadAllocate, SpreadLayout};

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
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

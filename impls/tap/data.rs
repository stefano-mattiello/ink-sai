pub use crate::traits::tap::*;
use brush::{declare_storage_trait, traits::AccountId};
pub use ink_sai_derive::TapStorage;
use ink_storage::traits::{SpreadAllocate, SpreadLayout};

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
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

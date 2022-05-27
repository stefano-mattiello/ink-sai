pub use crate::traits::vox::*;
use brush::{declare_storage_trait, traits::Timestamp};
pub use ink_sai_derive::VoxStorage;
use ink_storage::traits::{SpreadAllocate, SpreadLayout};

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]

pub struct VoxData {
    pub par: u128,
    pub way: u128,
    pub fix: u128,
    pub how: u128,
    pub tau: Timestamp,
}

declare_storage_trait!(VoxStorage, VoxData);

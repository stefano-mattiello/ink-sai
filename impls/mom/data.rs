pub use crate::traits::mom::*;
use brush::{declare_storage_trait, traits::AccountId};
pub use ink_sai_derive::MomStorage;
use ink_storage::traits::{SpreadAllocate, SpreadLayout};

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub struct MomData {
    pub tub_address: AccountId,
    pub tap_address: AccountId,
    pub vox_address: AccountId,
}

declare_storage_trait!(MomStorage, MomData);

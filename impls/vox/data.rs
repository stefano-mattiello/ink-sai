pub use crate::traits::vox::*;
use brush::{declare_storage_trait, traits::Timestamp};
use ink_storage::traits::{SpreadAllocate, SpreadLayout};
// it is public because when you will import the trait you also will import the derive for the trait
pub use ink_sai_derive::VoxStorage;

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
/// define the struct with the data that our smart contract will be using
/// this will isolate the logic of our smart contract from its storage
pub struct VoxData {
    /// mapping from asset address to lended asset address
    /// when X amount of asset is lended, X amount of asset it is mapped to is minted
    /// so the contract knows how much of asset it has and how much of the asset was lended
    pub par: u128,
    pub way: u128,
    pub fix: u128,
    pub how: u128,
    pub tau: Timestamp,
}

declare_storage_trait!(VoxStorage, VoxData);

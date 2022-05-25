pub use crate::traits::somemath::*;
use brush::declare_storage_trait;
use ink_storage::traits::{SpreadAllocate, SpreadLayout};
// it is public because when you will import the trait you also will import the derive for the trait
pub use ink_sai_derive::SomeMathStorage;

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
/// define the struct with the data that our smart contract will be using
/// this will isolate the logic of our smart contract from its storage
pub struct SomeMathData {
    /// mapping from asset address to lended asset address
    /// when X amount of asset is lended, X amount of asset it is mapped to is minted
    /// so the contract knows how much of asset it has and how much of the asset was lended
    pub const WAD=1000000000000000000,
    pub const RAY=1000000000000000000000000000,
    
}

declare_storage_trait!(SomeMathStorage, SomeMathData);

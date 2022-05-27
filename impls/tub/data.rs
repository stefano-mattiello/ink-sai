pub use crate::traits::tub::*;
use brush::{declare_storage_trait, traits::AccountId};
use ink_storage::{
    traits::{SpreadAllocate, SpreadLayout},
    Mapping,
};

pub use ink_sai_derive::TubStorage;

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadAllocate, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]

pub struct TubData {
    pub sai_address: AccountId,
    pub sin_address: AccountId,
    pub skr_address: AccountId,
    pub gem_address: AccountId,
    pub gov_address: AccountId,
    pub vox_address: AccountId,
    pub pip_address: AccountId,
    pub pep_address: AccountId,
    pub tap: AccountId,
    pub pit: AccountId,
    pub axe: u128,
    pub cap: u128,
    pub mat: u128,
    pub tax: u128,
    pub fee: u128,
    pub gap: u128,
    pub off: bool,
    pub out: bool,
    pub fit: u128,
    pub rho: u64,
    pub chi: u128,
    pub rhi: u128,
    pub rum: u128,
    pub cupi: u128,
    pub cups: Mapping<u128, Cup>,
}

declare_storage_trait!(TubStorage, TubData);
